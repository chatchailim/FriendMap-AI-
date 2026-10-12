import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  PlusCircle,
  Upload,
  Sparkles,
  Info,
  FileSpreadsheet,
  HelpCircle,
  Keyboard,
  Play,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Person, BalloonSettings, PhotoInfo } from '../types/friendmap';
import { getProtectedFaceBox } from '../utils/collisionAvoidance';

interface StageCanvasProps {
  photo: PhotoInfo;
  people: Person[];
  selectedPersonId: string | null;
  mode: 'editor' | 'viewer';
  settings: BalloonSettings;
  onSelectPerson: (id: string) => void;
  onUpdatePerson: (person: Person) => void;
  onAddPersonAt: (x: number, y: number) => void;
  onOpenAttachPhoto?: () => void;
  onOpenAIDetect?: () => void;
  onSimulateDemo?: () => void;
  onOpenBatchImport?: () => void;
  onOpenHelp?: () => void;
  onOpenShortcuts?: () => void;
  onBackToStart?: () => void;
}

export const StageCanvas: React.FC<StageCanvasProps> = ({
  photo,
  people,
  selectedPersonId,
  mode,
  settings,
  onSelectPerson,
  onUpdatePerson,
  onAddPersonAt,
  onOpenAttachPhoto,
  onOpenAIDetect,
  onSimulateDemo,
  onOpenBatchImport,
  onOpenHelp,
  onOpenShortcuts,
  onBackToStart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Zoom & Pan transformation state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add Mode toggle for mobile or touch devices
  const [isAddMode, setIsAddMode] = useState<boolean>(false);

  // Dragging balloon state
  const [dragState, setDragState] = useState<{
    type: 'balloon' | 'head';
    personId: string;
    startX: number;
    startY: number;
    initialDx: number;
    initialDy: number;
    initialHeadX: number;
    initialHeadY: number;
  } | null>(null);

  // Reset viewport to fit
  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Zoom in / out handlers
  const handleZoomIn = () => setZoom((z) => Math.min(3.5, z + 0.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.25));

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(4, Math.max(0.5, prevZoom * zoomFactor));
      return nextZoom;
    });
  };

  // Space key tracking for panning
  const [isSpaceDown, setIsSpaceDown] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        setIsSpaceDown(true);
      }
      if (e.key === 'Escape') {
        setIsAddMode(false);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pan interaction
  const handlePointerDownBackground = (e: React.PointerEvent) => {
    // If user holds Space or uses middle mouse button, start panning
    if (e.button === 1 || isSpaceDown || (e.target as HTMLElement).tagName === 'IMG' || e.target === containerRef.current) {
      if (!isAddMode && !e.shiftKey) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!dragState || !imageRef.current) return;

    const imgRect = imageRef.current.getBoundingClientRect();
    const currentPerson = people.find((p) => p.id === dragState.personId);
    if (!currentPerson) return;

    if (dragState.type === 'balloon') {
      // Calculate normalized delta
      const deltaX = (e.clientX - dragState.startX) / (imgRect.width || 1);
      const deltaY = (e.clientY - dragState.startY) / (imgRect.height || 1);

      const newDx = Number((dragState.initialDx + deltaX).toFixed(4));
      const newDy = Number((dragState.initialDy + deltaY).toFixed(4));

      onUpdatePerson({
        ...currentPerson,
        label: {
          ...currentPerson.label,
          dx: newDx,
          dy: newDy,
        },
      });
    } else if (dragState.type === 'head') {
      // Reposition head dot
      const deltaX = (e.clientX - dragState.startX) / (imgRect.width || 1);
      const deltaY = (e.clientY - dragState.startY) / (imgRect.height || 1);

      const newX = Math.max(0.01, Math.min(0.99, Number((dragState.initialHeadX + deltaX).toFixed(4))));
      const newY = Math.max(0.01, Math.min(0.99, Number((dragState.initialHeadY + deltaY).toFixed(4))));

      onUpdatePerson({
        ...currentPerson,
        head: {
          ...currentPerson.head,
          x: newX,
          y: newY,
        },
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    }
    if (dragState) {
      setDragState(null);
    }
  };

  // Click on photo to add new person (or Shift + Click)
  const handlePhotoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (mode !== 'editor') return;

    if (e.shiftKey || isAddMode) {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Number(((e.clientX - rect.left) / rect.width).toFixed(4));
      const y = Number(((e.clientY - rect.top) / rect.height).toFixed(4));

      onAddPersonAt(x, y);
      if (isAddMode) setIsAddMode(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDownBackground}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center select-none ${
        isPanning ? 'cursor-grabbing' : isAddMode ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {/* Zoom & Canvas Toolbar Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-xl">
        {onBackToStart && (
          <>
            <button
              onClick={onBackToStart}
              title="ย้อนกลับไปเริ่มต้นใหม่แต่แรก (BACK to Start)"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-200 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>BACK</span>
            </button>
            <div className="w-px h-4 bg-slate-800 mx-0.5" />
          </>
        )}
        <button
          onClick={handleZoomIn}
          title="ซูมเข้า (Zoom In)"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1 min-w-[42px] text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomOut}
          title="ซูมออก (Zoom Out)"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-800 mx-0.5" />
        <button
          onClick={handleResetZoom}
          title="รีเซ็ตมุมมอง (Fit View)"
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {mode === 'editor' && (
          <>
            <div className="w-px h-4 bg-slate-800 mx-0.5" />
            <button
              onClick={() => setIsAddMode(!isAddMode)}
              title="คลิกภาพเพื่อเพิ่มจุดบุคคลใหม่ (หรือกด Shift + คลิกภาพ)"
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
                isAddMode
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เพิ่มจุด</span>
            </button>
          </>
        )}
      </div>

      {/* Helpful Hint Overlay */}
      {mode === 'editor' && (
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900/85 backdrop-blur-sm rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
          {people.length === 0 ? (
            <span className="text-amber-300 font-medium flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>ภาพว่างเปล่า: กด Shift + คลิกบนภาพเพื่อเพิ่มบุคคลคนแรก หรือใช้ปุ่ม 'AI ค้นหาศีรษะ'</span>
            </span>
          ) : (
            <>
              <span>คลิกจุดส้มเพื่อเลือก</span>
              <span aria-hidden="true">·</span>
              <span>ลากป้ายเพื่อปรับทิศทาง</span>
              <span aria-hidden="true">·</span>
              <span>ลากจุดเพื่อย้ายตำแหน่งศีรษะ</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">Shift + คลิกภาพเพื่อเพิ่มบุคคล</span>
            </>
          )}
        </div>
      )}

      {/* If No Photo Attached (Empty Project / Clean Slate) */}
      {(!photo.url || photo.sourceType === 'empty') ? (
        <div className="flex flex-col items-center justify-center p-6 max-w-2xl text-center z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">ระบบล้างข้อมูลเรียบร้อย · พร้อมสำหรับการใช้งานใหม่</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            เริ่มต้นใช้งาน FriendMap AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-lg leading-relaxed">
            ระบุพิกัดบุคคลในภาพถ่ายหมู่อย่างแม่นยำ พร้อมระบบจัดป้ายชื่ออัตโนมัติไม่บดบังใบหน้า
            สามารถเลือกจำลองข้อมูลสาธิต หรือแนบภาพจริงของคุณเพื่อเริ่มต้นได้ทันที
          </p>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
            {/* Simulation Card */}
            {onSimulateDemo && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/40 hover:border-amber-400 flex flex-col justify-between text-left transition-all hover:shadow-xl hover:shadow-amber-500/10 group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                      แนะนำสำหรับสาธิต
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    จำลองภาพเพื่อสาธิตการทำงาน
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    โหลดภาพถ่ายสังเคราะห์ 31 คน พร้อมป้ายชื่อ เสียงทักทาย และข้อมูลติดต่อ สำหรับทดลองใช้งานทุกฟังก์ชัน
                  </p>
                </div>
                <button
                  onClick={onSimulateDemo}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md group-hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>จำลองภาพสาธิตทันที (31 คน)</span>
                </button>
              </div>
            )}

            {/* Attach Real Photo Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex flex-col justify-between text-left transition-all hover:shadow-xl group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                    เริ่มงานจริง
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  แนบภาพถ่ายหมู่ของคุณ
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  อัปโหลดภาพจริงจากเครื่อง ลากไฟล์มาวางบนหน้าจอ หรือกด Ctrl+V เพื่อวางภาพจากคลิปบอร์ดได้ทันที
                </p>
              </div>
              <button
                onClick={onOpenAttachPhoto}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-all border border-slate-700 hover:border-slate-600 group-hover:scale-[1.02]"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>เลือกไฟล์ภาพจากเครื่อง</span>
              </button>
            </div>
          </div>

          {/* Quick Helper Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            {onOpenBatchImport && (
              <button
                onClick={onOpenBatchImport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>นำเข้ารายชื่อชุดจาก Excel</span>
              </button>
            )}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                <span>ดูปุ่มลัด (กด ?)</span>
              </button>
            )}
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>คู่มือการใช้งานระบบ</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* The Zoomable & Pannable Stage Container */
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning || dragState ? 'none' : 'transform 0.12s ease-out',
          }}
          className="relative max-w-full max-h-full inline-block shadow-2xl"
        >
          {/* The Base Photo Layer */}
          <img
            ref={imageRef}
            src={photo.url}
            alt={photo.title}
            draggable={false}
            onClick={handlePhotoClick}
            className="block w-auto max-h-[82vh] object-contain rounded-lg border border-slate-800/80 select-none shadow-black/60 shadow-2xl"
          />

          {/* SVG Vector Layer for Leader Lines & Protection Boxes */}
          <svg
            viewBox="0 0 1000 625"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          >
          <defs>
            {/* Filter for subtle line shadow */}
            <filter id="lineShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
            </filter>
            {/* Marker arrow dot */}
            <marker id="headDot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
              <circle cx="5" cy="5" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </marker>
          </defs>

          {/* Render Protected Face Halos if enabled */}
          {settings.showFacesBBox &&
            people.map((p) => {
              const box = getProtectedFaceBox(p);
              return (
                <rect
                  key={`face-${p.id}`}
                  x={box.minX * 1000}
                  y={box.minY * 625}
                  width={(box.maxX - box.minX) * 1000}
                  height={(box.maxY - box.minY) * 625}
                  fill="rgba(239, 68, 68, 0.12)"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  rx="6"
                />
              );
            })}

          {/* Render Leader Lines */}
          {people.map((p) => {
            if (!p.label.visible) return null;

            const isSelected = selectedPersonId === p.id;
            const x1 = p.head.x * 1000;
            const y1 = p.head.y * 625;
            const x2 = (p.head.x + p.label.dx) * 1000;
            const y2 = (p.head.y + p.label.dy) * 625;

            const strokeColor = isSelected
              ? '#f59e0b'
              : p.reviewed
              ? settings.leaderLineColor || '#facc15'
              : '#94a3b8';

            const strokeWidth = isSelected ? 2.5 : settings.leaderLineWidth || 2;

            if (settings.leaderLineStyle === 'curved') {
              // Quadratic curved Bezier line
              const midX = (x1 + x2) / 2 + (p.label.dx > 0 ? -15 : 15);
              const midY = (y1 + y2) / 2;
              return (
                <path
                  key={`line-${p.id}`}
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter="url(#lineShadow)"
                />
              );
            }

            if (settings.leaderLineStyle === 'dashed') {
              return (
                <line
                  key={`line-${p.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray="4 3"
                  filter="url(#lineShadow)"
                />
              );
            }

            // Default cartoon leader line
            return (
              <g key={`line-${p.id}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter="url(#lineShadow)"
                />
                {/* Small indicator circle at balloon attachment */}
                <circle cx={x2} cy={y2} r={isSelected ? 3 : 2} fill={strokeColor} />
              </g>
            );
          })}
        </svg>

        {/* Head Marker Dots Layer */}
        {settings.showDots && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {people.map((p) => {
              const isSelected = selectedPersonId === p.id;
              return (
                <div
                  key={`dot-${p.id}`}
                  style={{
                    left: `${p.head.x * 100}%`,
                    top: `${p.head.y * 100}%`,
                  }}
                  onPointerDown={(e) => {
                    if (mode !== 'editor') return;
                    e.stopPropagation();
                    e.preventDefault();
                    onSelectPerson(p.id);
                    setDragState({
                      type: 'head',
                      personId: p.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      initialDx: p.label.dx,
                      initialDy: p.label.dy,
                      initialHeadX: p.head.x,
                      initialHeadY: p.head.y,
                    });
                    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  }}
                  onClick={() => onSelectPerson(p.id)}
                  title={`${p.id}: ${p.nickname || p.name || 'ยังไม่ระบุชื่อ'}${
                    p.visualHint ? ` (${p.visualHint})` : ''
                  }`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-transform ${
                    isSelected
                      ? 'w-4 h-4 bg-amber-400 ring-4 ring-amber-400/40 shadow-lg shadow-amber-400/50 scale-125 z-25 pointer-events-auto'
                      : p.reviewed
                      ? 'w-3 h-3 bg-emerald-500 ring-2 ring-white/80 hover:scale-125 pointer-events-auto'
                      : 'w-2.5 h-2.5 bg-orange-500 ring-1.5 ring-white hover:scale-125 pointer-events-auto'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Interactive Balloon Labels Overlay Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {people.map((p) => {
            if (!p.label.visible) return null;

            const isSelected = selectedPersonId === p.id;
            const bx = (p.head.x + p.label.dx) * 100;
            const by = (p.head.y + p.label.dy) * 100;

            const displayText = settings.showNicknamesOnly
              ? p.nickname || p.name || p.id
              : p.nickname
              ? `${p.nickname}${p.name ? ` (${p.name})` : ''}`
              : p.name || p.id;

            // Visual Theme Styling for Balloon
            let themeClasses = 'bg-sky-50 text-sky-950 border-sky-400 shadow-md';
            if (settings.balloonTheme === 'cartoon') {
              themeClasses = isSelected
                ? 'bg-amber-300 text-slate-950 border-2 border-slate-950 shadow-xl font-bold'
                : p.reviewed
                ? 'bg-amber-100 text-slate-900 border-2 border-slate-800 shadow-md font-medium'
                : 'bg-white text-slate-800 border-2 border-dashed border-slate-600 shadow-sm';
            } else if (settings.balloonTheme === 'badge') {
              themeClasses = isSelected
                ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-lg font-bold'
                : 'bg-slate-900/90 text-white border border-slate-700 shadow-md backdrop-blur-md';
            } else if (settings.balloonTheme === 'dark') {
              themeClasses = isSelected
                ? 'bg-amber-400 text-slate-950 border border-amber-300 font-bold'
                : 'bg-slate-950/95 text-slate-200 border border-slate-800';
            }

            return (
              <div
                key={`bubble-${p.id}`}
                style={{
                  left: `${bx}%`,
                  top: `${by}%`,
                  fontSize: `${settings.fontSize || 12}px`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onSelectPerson(p.id);

                  if (mode === 'editor') {
                    setDragState({
                      type: 'balloon',
                      personId: p.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      initialDx: p.label.dx,
                      initialDy: p.label.dy,
                      initialHeadX: p.head.x,
                      initialHeadY: p.head.y,
                    });
                    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  }
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 whitespace-nowrap select-none pointer-events-auto transition-transform ${
                  mode === 'editor' ? 'cursor-grab active:cursor-grabbing hover:scale-105' : 'cursor-pointer hover:scale-105'
                } ${themeClasses} ${isSelected ? 'scale-110 ring-2 ring-amber-400 z-30' : 'z-20'}`}
              >
                <div className="flex items-center gap-1.5 leading-none">
                  {settings.showIds && (
                    <span
                      className={`text-[10px] font-mono px-1 py-0.5 rounded leading-none ${
                        isSelected
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-slate-900/10 text-slate-600'
                      }`}
                    >
                      {p.id}
                    </span>
                  )}
                  <span>{displayText}</span>

                  {/* Lock Indicator */}
                  {p.label.locked && (
                    <Lock className="w-2.5 h-2.5 opacity-70 ml-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};
