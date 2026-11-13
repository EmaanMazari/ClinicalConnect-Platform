import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCcw, Contrast, Sun, Maximize2, 
  Ruler, Move, Square, ArrowUpRight, Type, Eye, Columns, 
  Layers, Download, Info, ChevronLeft, ChevronRight
} from 'lucide-react';
import { MOCK_DICOM_STUDIES, DicomImageStudy } from '../../data/mockImaging';

interface AnnotationItem {
  id: string;
  type: 'ruler' | 'rect' | 'arrow' | 'text';
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  label: string;
  measurementMm?: number;
}

export const DicomViewer: React.FC = () => {
  const [studies] = useState<DicomImageStudy[]>(MOCK_DICOM_STUDIES);
  const [selectedStudyIndex, setSelectedStudyIndex] = useState(0);
  const study = studies[selectedStudyIndex];

  // Viewer state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [activeTool, setActiveTool] = useState<'pan' | 'ruler' | 'rect' | 'arrow' | 'text'>('pan');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [showMetadata, setShowMetadata] = useState(true);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDraw, setCurrentDraw] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const secondaryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Initialize annotations from study sample
  useEffect(() => {
    if (study.annotationsSample) {
      setAnnotations(
        study.annotationsSample.map((a, i) => ({
          id: `ann-${i}`,
          type: a.type,
          startX: a.x,
          startY: a.y,
          endX: a.x2,
          endY: a.y2,
          label: a.label,
          measurementMm: a.measurementMm
        }))
      );
    } else {
      setAnnotations([]);
    }
    // Reset view
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
    setInvert(false);
  }, [selectedStudyIndex, study]);

  // Apply Window/Level presets
  const applyPreset = (preset: 'Lung' | 'Bone' | 'SoftTissue' | 'Brain' | 'Standard') => {
    switch (preset) {
      case 'Lung':
        setBrightness(115);
        setContrast(140);
        break;
      case 'Bone':
        setBrightness(85);
        setContrast(180);
        break;
      case 'SoftTissue':
        setBrightness(105);
        setContrast(110);
        break;
      case 'Brain':
        setBrightness(110);
        setContrast(130);
        break;
      case 'Standard':
      default:
        setBrightness(100);
        setContrast(100);
        break;
    }
  };

  // Render main canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#050911';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Apply Pan and Zoom
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Filter string
    let filterString = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (invert) {
      filterString += ' invert(100%)';
    }
    ctx.filter = filterString;

    // Draw medical scan image if loaded
    if (imageRef.current && imageRef.current.complete) {
      // Fit maintain aspect ratio
      const img = imageRef.current;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawH = width / imgAspect;
        drawY = (height - drawH) / 2;
      } else {
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    } else {
      // High-contrast simulated radiologic placeholder
      ctx.fillStyle = '#111827';
      ctx.fillRect(40, 40, width - 80, height - 80);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading High-Resolution DICOM Matrix...', width / 2, height / 2);
    }

    ctx.filter = 'none';

    // Draw Annotations
    ctx.lineWidth = 2 / zoom;
    annotations.forEach(ann => {
      ctx.strokeStyle = '#22d3ee'; // Cyan diagnostic color
      ctx.fillStyle = '#22d3ee';

      if (ann.type === 'ruler' && ann.endX !== undefined && ann.endY !== undefined) {
        ctx.beginPath();
        ctx.moveTo(ann.startX, ann.startY);
        ctx.lineTo(ann.endX, ann.endY);
        ctx.stroke();

        // End ticks
        const angle = Math.atan2(ann.endY - ann.startY, ann.endX - ann.startX);
        const tickLen = 6 / zoom;
        ctx.beginPath();
        ctx.moveTo(ann.startX - Math.sin(angle) * tickLen, ann.startY + Math.cos(angle) * tickLen);
        ctx.lineTo(ann.startX + Math.sin(angle) * tickLen, ann.startY - Math.cos(angle) * tickLen);
        ctx.moveTo(ann.endX - Math.sin(angle) * tickLen, ann.endY + Math.cos(angle) * tickLen);
        ctx.lineTo(ann.endX + Math.sin(angle) * tickLen, ann.endY - Math.cos(angle) * tickLen);
        ctx.stroke();

        // Label
        const midX = (ann.startX + ann.endX) / 2;
        const midY = (ann.startY + ann.endY) / 2;
        ctx.font = `${11 / zoom}px monospace`;
        ctx.fillStyle = '#06b6d4';
        const distText = ann.measurementMm ? `${ann.measurementMm.toFixed(1)} mm` : ann.label;
        ctx.fillText(distText, midX + 8 / zoom, midY - 6 / zoom);
      } else if (ann.type === 'rect' && ann.endX !== undefined && ann.endY !== undefined) {
        ctx.strokeRect(ann.startX, ann.startY, ann.endX - ann.startX, ann.endY - ann.startY);
        ctx.font = `${11 / zoom}px sans-serif`;
        ctx.fillText(ann.label, ann.startX, ann.startY - 5 / zoom);
      } else if (ann.type === 'arrow' && ann.endX !== undefined && ann.endY !== undefined) {
        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(ann.startX, ann.startY);
        ctx.lineTo(ann.endX, ann.endY);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(ann.endY - ann.startY, ann.endX - ann.startX);
        ctx.beginPath();
        ctx.moveTo(ann.endX, ann.endY);
        ctx.lineTo(ann.endX - 10 * Math.cos(angle - Math.PI / 6) / zoom, ann.endY - 10 * Math.sin(angle - Math.PI / 6) / zoom);
        ctx.lineTo(ann.endX - 10 * Math.cos(angle + Math.PI / 6) / zoom, ann.endY - 10 * Math.sin(angle + Math.PI / 6) / zoom);
        ctx.closePath();
        ctx.fill();

        ctx.font = `${11 / zoom}px sans-serif`;
        ctx.fillText(ann.label, ann.startX - 10 / zoom, ann.startY - 8 / zoom);
      } else if (ann.type === 'text') {
        ctx.font = `${12 / zoom}px monospace`;
        ctx.fillText(ann.label, ann.startX, ann.startY);
      }
    });

    // Draw active drawing shape
    if (isDrawing && currentDraw) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2 / zoom;
      ctx.setLineDash([4 / zoom, 4 / zoom]);

      if (activeTool === 'ruler') {
        ctx.beginPath();
        ctx.moveTo(currentDraw.startX, currentDraw.startY);
        ctx.lineTo(currentDraw.endX, currentDraw.endY);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.strokeRect(currentDraw.startX, currentDraw.startY, currentDraw.endX - currentDraw.startX, currentDraw.endY - currentDraw.startY);
      } else if (activeTool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(currentDraw.startX, currentDraw.startY);
        ctx.lineTo(currentDraw.endX, currentDraw.endY);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [pan, zoom, brightness, contrast, invert, annotations, isDrawing, currentDraw, activeTool]);

  // Preload and render image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = study.imageUrl;
    img.onload = () => {
      imageRef.current = img;
      renderCanvas();
    };
  }, [study.imageUrl, renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Secondary canvas for comparison mode
  useEffect(() => {
    if (!isComparisonMode || !secondaryCanvasRef.current) return;
    const canvas = secondaryCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = study.secondaryImageUrl || study.imageUrl;
    img.onload = () => {
      ctx.fillStyle = '#050911';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(100%)' : ''}`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Comparison watermark
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px monospace';
      ctx.fillText('COMPARISON SERIES / PRIOR SCAN', 16, 24);
    };
  }, [isComparisonMode, study, brightness, contrast, invert]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Transform to canvas coordinates accounting for zoom and pan
    const transX = (rawX - (canvas.width / 2 + pan.x)) / zoom + canvas.width / 2;
    const transY = (rawY - (canvas.height / 2 + pan.y)) / zoom + canvas.height / 2;

    if (activeTool === 'pan') {
      setIsDrawing(true);
      setCurrentDraw({ startX: e.clientX - pan.x, startY: e.clientY - pan.y, endX: 0, endY: 0 });
    } else {
      setIsDrawing(true);
      setCurrentDraw({ startX: transX, startY: transY, endX: transX, endY: transY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentDraw) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeTool === 'pan') {
      setPan({
        x: e.clientX - currentDraw.startX,
        y: e.clientY - currentDraw.startY
      });
    } else {
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const transX = (rawX - (canvas.width / 2 + pan.x)) / zoom + canvas.width / 2;
      const transY = (rawY - (canvas.height / 2 + pan.y)) / zoom + canvas.height / 2;

      setCurrentDraw({
        ...currentDraw,
        endX: transX,
        endY: transY
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentDraw) return;

    if (activeTool !== 'pan') {
      const dx = currentDraw.endX - currentDraw.startX;
      const dy = currentDraw.endY - currentDraw.startY;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);

      if (pixelDist > 5) {
        // 1 pixel = ~0.3mm approximation for simulated DICOM
        const measurementMm = pixelDist * 0.32;

        const newAnn: AnnotationItem = {
          id: `ann-${Date.now()}`,
          type: activeTool === 'ruler' ? 'ruler' : activeTool === 'rect' ? 'rect' : 'arrow',
          startX: currentDraw.startX,
          startY: currentDraw.startY,
          endX: currentDraw.endX,
          endY: currentDraw.endY,
          label: activeTool === 'ruler' ? `${measurementMm.toFixed(1)} mm` : 'Finding ROI',
          measurementMm
        };
        setAnnotations(prev => [...prev, newAnn]);
      }
    }

    setIsDrawing(false);
    setCurrentDraw(null);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[760px] text-slate-100">
      {/* Top DICOM Station Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <span>{study.studyDescription}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                  MODALITY: {study.modality}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Study ID: {study.id} • Patient: {study.patientId} (Anonymized) • Matrix: {study.matrix}
              </div>
            </div>
          </div>
        </div>

        {/* Study Selector Carousel */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedStudyIndex(prev => (prev === 0 ? studies.length - 1 : prev - 1))}
            className="p-1 hover:text-cyan-400 text-slate-400 transition"
            title="Previous Series"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-slate-200">
            Series {selectedStudyIndex + 1} of {studies.length}
          </span>
          <button
            onClick={() => setSelectedStudyIndex(prev => (prev === studies.length - 1 ? 0 : prev + 1))}
            className="p-1 hover:text-cyan-400 text-slate-400 transition"
            title="Next Series"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-slate-900/70 border-b border-slate-800 gap-3 text-xs">
        {/* Interaction Tools */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('pan')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTool === 'pan' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pan / Move Viewport"
          >
            <Move className="w-3.5 h-3.5" /> Pan
          </button>
          <button
            onClick={() => setActiveTool('ruler')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTool === 'ruler' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Calipers / Linear Measurement Tool"
          >
            <Ruler className="w-3.5 h-3.5" /> Caliper (mm)
          </button>
          <button
            onClick={() => setActiveTool('arrow')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTool === 'arrow' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Arrow Pointer Annotation"
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Arrow
          </button>
          <button
            onClick={() => setActiveTool('rect')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTool === 'rect' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Rectangle ROI Box"
          >
            <Square className="w-3.5 h-3.5" /> ROI Box
          </button>
        </div>

        {/* Window/Level Presets */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-mono text-[11px] mr-1">W/L Presets:</span>
          {(['Standard', 'Lung', 'Bone', 'SoftTissue', 'Brain'] as const).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition"
            >
              {preset}
            </button>
          ))}
          <button
            onClick={() => setInvert(!invert)}
            className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition ${
              invert ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Invert Grayscale (White-bone / Black-bone)"
          >
            Invert
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
              className="p-1.5 hover:text-cyan-400 text-slate-400 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-300 px-1">
              {(zoom * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(4, prev + 0.2))}
              className="p-1.5 hover:text-cyan-400 text-slate-400 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-1.5 hover:text-cyan-400 text-slate-400 transition"
              title="Reset Zoom & Pan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
              isComparisonMode 
                ? 'bg-cyan-600 text-white border-cyan-500' 
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Split Comparison
          </button>

          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-1.5 rounded-xl border transition ${
              showMetadata ? 'bg-cyan-950 border-cyan-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Toggle DICOM OSD Overlay"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div className="relative flex-1 bg-black flex overflow-hidden">
        {/* Primary Viewport */}
        <div className="relative flex-1 h-full cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={800}
            height={560}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Radiologic Metadata Overlay (OSD) */}
          {showMetadata && (
            <>
              {/* Top-Left: Patient & Institution info (HIPAA sanitized) */}
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-[11px] text-cyan-400/90 leading-relaxed bg-black/40 p-2 rounded backdrop-blur">
                <div className="font-bold text-white">CLINICALCONNECT SECURE PACS</div>
                <div>ID: {study.patientId}</div>
                <div>BODY PART: {study.bodyPart}</div>
                <div>STUDY: {study.studyDescription}</div>
              </div>

              {/* Top-Right: Acquisition parameters */}
              <div className="absolute top-3 right-4 pointer-events-none font-mono text-[11px] text-cyan-400/90 text-right leading-relaxed bg-black/40 p-2 rounded backdrop-blur">
                <div>KV: {study.kvp}</div>
                <div>MA: {study.tubeCurrent}</div>
                <div>THICKNESS: {study.sliceThickness}</div>
                <div>SERIES: {study.seriesNumber}</div>
              </div>

              {/* Bottom-Left: Window / Level & Zoom */}
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[11px] text-cyan-400/90 leading-relaxed bg-black/40 p-2 rounded backdrop-blur">
                <div>W: {study.windowWidth} / L: {study.windowCenter}</div>
                <div>ZOOM: {(zoom * 100).toFixed(0)}%</div>
                <div>INTERACTION: {activeTool.toUpperCase()}</div>
              </div>

              {/* Bottom-Right: Clinical Findings Note */}
              <div className="absolute bottom-3 right-4 max-w-sm pointer-events-none font-sans text-xs text-slate-200 bg-slate-900/80 border border-slate-700/80 p-2.5 rounded-lg shadow-lg backdrop-blur">
                <span className="font-semibold text-cyan-300 block mb-0.5">Radiologist Finding:</span>
                {study.findings}
              </div>
            </>
          )}
        </div>

        {/* Secondary Comparison Viewport (Split Mode) */}
        {isComparisonMode && (
          <div className="relative flex-1 h-full border-l border-slate-800">
            <canvas
              ref={secondaryCanvasRef}
              width={800}
              height={560}
              className="w-full h-full block"
            />
            <div className="absolute top-3 right-4 font-mono text-xs text-amber-300 bg-black/70 px-2 py-1 rounded">
              REFERENCE SCAN / PRIOR
            </div>
          </div>
        )}
      </div>

      {/* Bottom Diagnostics / Annotations Tray */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-mono text-slate-300">
            Active Annotations ({annotations.length}):
          </span>
          {annotations.map((ann, i) => (
            <span
              key={ann.id}
              className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-[11px]"
            >
              #{i + 1} {ann.label}
            </span>
          ))}
          {annotations.length > 0 && (
            <button
              onClick={() => setAnnotations([])}
              className="text-red-400 hover:text-red-300 text-[11px] underline ml-2"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            DICOM Standard Compliance: PS 3.1-2024
          </span>
        </div>
      </div>
    </div>
  );
};
