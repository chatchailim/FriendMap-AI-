import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Settings,
  Download,
  Eye,
  Edit3,
  Shield,
  UserCheck,
  Trash2,
  RotateCcw,
  ChevronDown,
  HelpCircle,
  Keyboard,
  FileSpreadsheet,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { FriendMapProject } from '../types/friendmap';

interface HeaderProps {
  project: FriendMapProject;
  mode: 'editor' | 'viewer';
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  lastSavedTime?: string | null;
  onModeChange: (mode: 'editor' | 'viewer') => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenAIDetect: () => void;
  onUploadClick: () => void;
  onAutoArrange: () => void;
  onClearData: (clearMode: 'markers_only' | 'all') => void;
  onSimulateDemo: () => void;
  onBackToStart: () => void;
  onRestoreSample?: () => void;
  onOpenHelp: () => void;
  onOpenShortcuts?: () => void;
  onOpenBatchImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  mode,
  saveStatus = 'saved',
  lastSavedTime,
  onModeChange,
  onOpenExport,
  onOpenSettings,
  onOpenAIDetect,
  onUploadClick,
  onAutoArrange,
  onClearData,
  onSimulateDemo,
  onBackToStart,
  onRestoreSample,
  onOpenHelp,
  onOpenShortcuts,
  onOpenBatchImport,
}) => {
  const [showClearMenu, setShowClearMenu] = useState<boolean>(false);
  const total = project.people.length;
  const reviewedCount = project.people.filter((p) => p.reviewed).length;
  const hasPhoto = Boolean(project.photo?.url && project.photo.sourceType !== 'empty');

  return (
    <header className="h-16 px-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-6 shrink-0 z-30 select-none">
      {/* Zone 1: Brand Wordmark & Omnipresent BACK button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onBackToStart}
          title="ย้อนกลับไปเริ่มต้นใหม่แต่แรกได้ตลอดเวลา (BACK to Clean Slate / Start Fresh)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 hover:text-amber-300 border border-slate-700 hover:border-amber-400/60 rounded-xl transition-all shadow-sm group active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>BACK</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-normal">เริ่มต้นใหม่</span>
        </button>

        <a href="/" onClick={(e) => { e.preventDefault(); onBackToStart(); }} className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
          <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
            FM
          </span>
          <span>FriendMap AI</span>
        </a>
        <span className="hidden lg:inline text-xs text-slate-400 font-normal">
          Photo People Mapper v1.0
        </span>
      </div>

      {/* Zone 2: Navigation Links & Mode Selector */}
      <div className="flex items-center gap-4">
        {/* Editor vs Viewer Mode Switch */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-lg border border-slate-800 shadow-inner">
          <button
            onClick={() => onModeChange('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              mode === 'editor'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>โหมดจัดวาง (Editor)</span>
          </button>
          <button
            onClick={() => onModeChange('viewer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              mode === 'viewer'
                ? 'bg-sky-500 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>โหมดนำเสนอ (Viewer)</span>
          </button>
        </div>

        {/* Status Count: Clean unboxed metadata with dot separator */}
        {total > 0 || hasPhoto ? (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 tabular-nums">
            <span className="flex items-center gap-1.5 text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ตรวจทานแล้ว {reviewedCount}/{total} คน</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{project.photo.title ? project.photo.title.split(' ')[0] : 'ภาพถ่าย'}</span>
            {project.settings.privacyMode && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-amber-400/90 text-[11px]">
                  <Shield className="w-3 h-3" /> ซ่อนข้อมูลติดต่อ
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>กระดานว่างเปล่า · พร้อมเริ่มต้นใหม่</span>
            </span>
          </div>
        )}

        {/* Auto-Save Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              saveStatus === 'saved'
                ? 'bg-emerald-400'
                : saveStatus === 'saving'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-400">
            {saveStatus === 'saved'
              ? `ออโต้เซฟ ${lastSavedTime || 'ล่าสุด'}`
              : saveStatus === 'saving'
              ? 'กำลังบันทึก...'
              : 'รอเซฟ'}
          </span>
        </div>
      </div>

      {/* Zone 3: Functional Action Tools */}
      <div className="flex items-center gap-2 shrink-0">
        {mode === 'editor' && (
          <>
            {/* Auto Arrange Balloons */}
            <button
              onClick={onAutoArrange}
              title="จัดวางป้ายอัตโนมัติ ไม่บดบังใบหน้า (Collision-free layout)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>จัดป้ายอัตโนมัติ</span>
            </button>

            {/* AI Head Detect */}
            <button
              onClick={onOpenAIDetect}
              title="วิเคราะห์ค้นหาจุดศีรษะอัตโนมัติด้วย AI Gemini"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI ค้นหาศีรษะ</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Batch Roster Import */}
            {onOpenBatchImport && (
              <button
                onClick={onOpenBatchImport}
                title="นำเข้ารายชื่อหลายคนจาก Excel หรือแชทไลน์ (Batch Roster Import)"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>นำเข้าชุด</span>
              </button>
            )}
          </>
        )}

        {/* Demo Simulation Button */}
        <button
          onClick={onSimulateDemo}
          title="จำลองภาพถ่ายและข้อมูลบุคคล 31 คน สำหรับสาธิตระบบ (Demo Simulation)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400 rounded-lg transition-all shadow-sm shadow-amber-500/10 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>จำลองภาพสาธิต</span>
          <span className="hidden xl:inline text-[10px] font-mono bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded font-bold">31 คน</span>
        </button>

        {/* Clear Data & Start Fresh Controls */}
        {mode === 'editor' && (
          <div className="relative">
            <button
              onClick={() => {
                if (total === 0 && !hasPhoto) {
                  onClearData('all');
                } else {
                  setShowClearMenu(!showClearMenu);
                }
              }}
              title="เริ่มต้นใหม่ / ล้างข้อมูลทั้งหมดเพื่อเริ่มงานใหม่"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">เริ่มต้นใหม่</span>
              {(total > 0 || hasPhoto) && <ChevronDown className="w-3 h-3 opacity-60" />}
            </button>

            {showClearMenu && (total > 0 || hasPhoto) && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs backdrop-blur-xl">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-slate-800 mb-1">
                  ตัวเลือกล้างข้อมูลและเริ่มต้นใหม่
                </div>
                <button
                  onClick={() => {
                    setShowClearMenu(false);
                    onClearData('all');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-rose-500/20 text-rose-300 transition-colors block group"
                >
                  <div className="flex items-center gap-2 mb-0.5 font-bold text-rose-300 group-hover:text-rose-200">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>เริ่มต้นใหม่ทั้งหมด (ล้างกระดาน 100%)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pl-5.5">
                    ล้างภาพและจุดบุคคลทั้งหมด คืนสู่กระดานว่างเปล่า
                  </span>
                </button>
                {total > 0 && (
                  <>
                    <div className="h-px bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setShowClearMenu(false);
                        onClearData('markers_only');
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors block"
                    >
                      <div className="flex items-center gap-2 mb-0.5 font-semibold text-amber-300">
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>ล้างเฉพาะจุดบุคคล ({total} คน)</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block pl-5.5">
                        คงภาพถ่ายเดิมไว้ เพื่อเริ่มระบุพิกัดใหม่
                      </span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Attach Photo Button */}
        <button
          onClick={onUploadClick}
          title="แนบภาพถ่ายหมู่เพื่อดำเนินการ (Attach photo to proceed)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-amber-500/50 rounded-lg transition-all whitespace-nowrap shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span>แนบภาพถ่าย</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="ปรับแต่งรูปแบบป้าย เส้นชี้ และความเป็นส่วนตัว"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Keyboard Shortcuts Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="ปุ่มลัดแป้นพิมพ์ (กด ? ได้ทุกเมื่อ)"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        {/* Help / Guide Button */}
        <button
          onClick={onOpenHelp}
          title="เปิดคู่มือการใช้งานและแผนผังระบบ (Help & User Manual)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">คู่มือ</span>
        </button>

        {/* Export / Share */}
        <button
          onClick={onOpenExport}
          title="ส่งออก JSON, บันทึกภาพ PNG หรือ SVG"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap font-semibold"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ส่งออก / บันทึก</span>
        </button>
      </div>
    </header>
  );
};
