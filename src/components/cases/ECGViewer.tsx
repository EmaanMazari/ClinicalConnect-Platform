import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Activity, RefreshCw } from 'lucide-react';
import { clinicalAudio } from '../../services/audioService';

interface ECGViewerProps {
  heartRate?: number;
  condition?: string;
  isStemi?: boolean;
}

export const ECGViewer: React.FC<ECGViewerProps> = ({
  heartRate = 75,
  condition = 'Sinus Tachycardia with ST-Elevation',
  isStemi = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const xOffsetRef = useRef(0);
  const lastBeepTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    // Handle responsive resize
    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        width = canvas.width;
        height = canvas.height;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // ECG wave generator function
    const getECGY = (x: number, midY: number) => {
      const cycleLength = 220; // pixels per cardiac cycle
      const phase = (x % cycleLength) / cycleLength;

      // Baseline
      let y = midY;

      // P wave
      if (phase >= 0.12 && phase < 0.20) {
        const pPhase = (phase - 0.12) / 0.08;
        y -= Math.sin(pPhase * Math.PI) * 12;
      }
      // PR segment: flat

      // Q wave
      else if (phase >= 0.28 && phase < 0.31) {
        y += 8;
      }
      // R wave (sharp peak)
      else if (phase >= 0.31 && phase < 0.36) {
        const rPhase = (phase - 0.31) / 0.05;
        if (rPhase < 0.5) {
          y -= (rPhase / 0.5) * 65;
        } else {
          y -= 65 - ((rPhase - 0.5) / 0.5) * 75;
        }
      }
      // S wave
      else if (phase >= 0.36 && phase < 0.40) {
        y += 10;
      }
      // ST Segment & T wave
      else if (phase >= 0.40 && phase < 0.65) {
        const stPhase = (phase - 0.40) / 0.25;
        if (isStemi) {
          // Convex Tombstone ST elevation
          y -= 24 + Math.sin(stPhase * Math.PI) * 22;
        } else {
          // Normal T wave
          y -= Math.sin(stPhase * Math.PI) * 18;
        }
      }

      // Add slight physiological jitter
      const jitter = (Math.sin(x * 0.05) * 1.5);
      return y + jitter;
    };

    const draw = () => {
      // Clear with medical dark telemetry background
      ctx.fillStyle = '#061a14';
      ctx.fillRect(0, 0, width, height);

      // Draw standard ECG millivolt grid (5mm major, 1mm minor)
      ctx.strokeStyle = '#0e382b';
      ctx.lineWidth = 0.5;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = '#14533d';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize * 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG trace
      const midY = height / 2;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10b981'; // Phosphor green
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const waveX = x + xOffsetRef.current;
        const waveY = getECGY(waveX, midY);
        if (x === 0) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Sweep Bar / Scanning Head
      const sweepX = (xOffsetRef.current * 1.5) % width;
      const gradient = ctx.createLinearGradient(sweepX - 30, 0, sweepX, 0);
      gradient.addColorStop(0, 'rgba(6, 26, 20, 0)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(sweepX - 30, 0, 30, height);

      // Sound trigger when R wave hits
      if (soundEnabled) {
        const now = Date.now();
        const cycleInterval = (60 / heartRate) * 1000;
        if (now - lastBeepTimeRef.current > cycleInterval) {
          clinicalAudio.playHeartbeatBeep(isStemi ? 920 : 840);
          lastBeepTimeRef.current = now;
        }
      }

      if (isPlaying) {
        xOffsetRef.current += 3.2;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, soundEnabled, heartRate, isStemi]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-400">TELEMETRY LEAD II / V2</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">25mm/s • 10mm/mV • Filter: 0.05-150Hz</span>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">HR:</span>
            <span className={`text-base font-bold ${heartRate > 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {heartRate} <span className="text-[10px] text-slate-400">BPM</span>
            </span>
          </div>
          {isStemi && (
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-bold uppercase tracking-wider text-[10px] animate-pulse">
              ST-Elevation (+3.5mm)
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full h-44 bg-[#061a14] cursor-crosshair">
        <canvas ref={canvasRef} height={176} className="w-full h-full block" />
        <div className="absolute top-2 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-[11px] font-mono text-emerald-300 border border-emerald-900/60 pointer-events-none">
          Condition: {condition}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Freeze Trace' : 'Resume'}</span>
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
              soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Telemetry Chime: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <span>Full 12-Lead Diagnostic Quality</span>
          <button
            onClick={() => { xOffsetRef.current = 0; }}
            title="Reset telemetry"
            className="p-1 hover:text-slate-300 transition"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
