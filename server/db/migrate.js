import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { pool, checkDatabaseHealth } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('[Migration] Verifying PostgreSQL connection...');
  const health = await checkDatabaseHealth();

  if (!health.healthy) {
    console.error('[Migration Failed] Cannot connect to PostgreSQL server:');
    console.error(`Error details: ${health.error}`);
    console.error('\nPlease verify your database is running and credentials in .env are correct.');
    process.exit(1);
  }

  console.log(`[Migration] Connected to PostgreSQL (${health.database}) in ${health.latencyMs}ms.`);

  const client = await pool.connect();
  try {
    console.log('[Migration] Applying schema definitions from schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    await client.query('BEGIN');
    await client.query(schemaSql);

    // Seed fictional badges if not already populated
    const badgesCountRes = await client.query('SELECT COUNT(*) FROM badges');
    if (parseInt(badgesCountRes.rows[0].count, 10) === 0) {
      console.log('[Migration] Seeding standard professional badges catalog...');
      await client.query(`
        INSERT INTO badges (code, name, tier, description, icon) VALUES
        ('BOARD_CERTIFIED', 'Board Certified', 'verified', 'Verified credentials by accredited state medical licensing board', 'ShieldCheck'),
        ('MASTER_CLINICIAN', 'Master Clinician', 'gold', 'Recognized for 50+ accepted clinical differentials on complex cases', 'Award'),
        ('STAT_RESPONDER', 'STAT Responder', 'silver', 'Demonstrated 15-minute response SLA on emergency consultations', 'Zap'),
        ('CME_EDUCATOR', 'CME Educator', 'bronze', 'Authored peer-reviewed continuing medical education modules', 'BookOpen');
      `);
    }

    // Seed fictional test doctor account if not exists
    const docCheckRes = await client.query('SELECT COUNT(*) FROM doctors');
    if (parseInt(docCheckRes.rows[0].count, 10) === 0) {
      console.log('[Migration] Seeding fictional test doctor account (Dr. Alexander Wright)...');
      const saltRounds = 12;
      const demoPasswordHash = await bcrypt.hash('ClinikSecure2026!', saltRounds);

      const doctorInsert = await client.query(`
        INSERT INTO doctors (email, password_hash, role, account_status)
        VALUES ('a.wright@hopkinsmedicine.org', $1, 'Specialist', 'verified')
        RETURNING id;
      `, [demoPasswordHash]);

      const doctorId = doctorInsert.rows[0].id;

      await client.query(`
        INSERT INTO doctor_profiles (
          doctor_id, full_name, title, specialty, subspecialty,
          hospital_affiliation, department, experience_years,
          reputation_score, accepted_diagnoses_count, helpful_answers_count,
          peer_endorsements_count, areas_of_expertise, research_stats
        ) VALUES (
          $1, 'Dr. Alexander Wright', 'MD, FACC, FSCAI', 'Cardiology',
          'Interventional Cardiology & Hemodynamics', 'Johns Hopkins Medical Center',
          'Division of Cardiology, Catheterization Lab', 16, 3420, 68, 215, 490,
          '["Coronary Artery Disease", "TAVR", "Cardiogenic Shock", "Intravascular Ultrasound"]'::jsonb,
          '{"publicationsCount": 42, "hIndex": 28, "topPaper": "Percutaneous Coronary Intervention in Cardiogenic Shock (Circulation, 2023)"}'::jsonb
        );
      `, [doctorId]);

      await client.query(`
        INSERT INTO verifications (
          doctor_id, license_number, licensing_board, status, submitted_at
        ) VALUES (
          $1, 'MD-948201-US', 'American Board of Internal Medicine / Cardiovascular Disease', 'approved', NOW()
        );
      `, [doctorId]);

      // Link Board Certified badge
      const badgeRes = await client.query("SELECT id FROM badges WHERE code = 'BOARD_CERTIFIED'");
      if (badgeRes.rows.length > 0) {
        await client.query(`
          INSERT INTO doctor_badges (doctor_id, badge_id)
          VALUES ($1, $2);
        `, [doctorId, badgeRes.rows[0].id]);
      }
    }

    await client.query('COMMIT');
    console.log('[Migration Complete] Schema and seed data successfully initialized.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Migration Error]:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
