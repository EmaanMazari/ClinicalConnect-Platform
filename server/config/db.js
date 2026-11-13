import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Construct connection config from DATABASE_URL or individual parameters
const connectionConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'clinicalconnect',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    };

// Connection pool configuration
export const pool = new Pool({
  ...connectionConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected client error', err.message);
});

/**
 * Checks connectivity to PostgreSQL
 * @returns {Promise<{ healthy: boolean, latencyMs?: number, error?: string }>}
 */
export async function checkDatabaseHealth() {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as database');
    const latencyMs = Date.now() - start;
    return {
      healthy: true,
      database: res.rows[0].database,
      serverTime: res.rows[0].now,
      latencyMs,
    };
  } catch (err) {
    return {
      healthy: false,
      error: err.message,
      latencyMs: Date.now() - start,
    };
  }
}
