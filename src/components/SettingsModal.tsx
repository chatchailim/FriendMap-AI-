import React from 'react';
import { Settings, X, Palette, Sliders, Shield, Eye } from 'lucide-react';
import { BalloonSettings, BalloonTheme, LeaderLineStyle } from '../types/friendmap';

interface SettingsModalProps {
  settings: BalloonSettings;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: BalloonSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes: Array<{ id: BalloonTheme; label: string; desc: string }> = [
    { id: 'cartoon', label: 'การ์ตูนคอมิค (Cartoon Comic)', desc: 'ขอบดำชัดเจน สไตล์หนังสือการ์ตูนคลาสสิก' },
    { id: 'badge', label: 'โมเดิร์นป้ายชื่อ (Modern Badge)', desc: 'กระจกดำโปร่งแสง เรียบหรูทันสมัย' },
    { id: 'dark', label: 'ดาร์กโหมด (Dark Tech)', desc: 'คอนทราสต์สูง สำหรับภาพกลางคืน' },
  ];

  const lineStyles: Array<{ id: LeaderLineStyle; label: string }> = [
    { id: 'cartoon', label: 'เส้นตรงธรรมดา (Solid)' },
    { id: 'curved', label: 'เส้นโค้งนุ่มนวล (Curved)' },
    { id: 'dashed', label: 'เส้นประ (Dashed)' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">ตั้งค่ารูปแบบป้ายและเส้นชี้ (Balloon Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* 1. Theme Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>ธีมรูปแบบป้ายชื่อ (Balloon Theme)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ ...settings, balloonTheme: t.id })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.balloonTheme === t.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block mb-0.5 text-slate-200">{t.label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight block">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Leader Line Style */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>ลักษณะเส้นชี้ศีรษะ (Leader Line Style)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lineStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onUpdateSettings({ ...settings, leaderLineStyle: s.id })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                    settings.leaderLineStyle === s.id
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sliders: Font size & Line width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>ขนาดตัวอักษร</span>
                <span className="font-mono">{settings.fontSize} px</span>
              </div>
              <input
                type="range"
                min="10"
                max="18"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>ความหนาเส้นชี้</span>
                <span className="font-mono">{settings.leaderLineWidth} px</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={settings.leaderLineWidth}
                onChange={(e) => onUpdateSettings({ ...settings, leaderLineWidth: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* 4. Display Toggles */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block mb-1">ตัวเลือกการแสดงผล</span>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>แสดงเฉพาะชื่อเล่นบนป้าย (กระชับ ไม่แน่น)</span>
              <input
                type="checkbox"
                checked={settings.showNicknamesOnly}
                onChange={(e) => onUpdateSettings({ ...settings, showNicknamesOnly: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>แสดงรหัสกำกับ (P001, P002...) บนป้าย</span>
              <input
                type="checkbox"
                checked={settings.showIds}
                onChange={(e) => onUpdateSettings({ ...settings, showIds: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>แสดงจุดสีมาร์กตำแหน่งศีรษะ (Head Anchor Dots)</span>
              <input
                type="checkbox"
                checked={settings.showDots}
                onChange={(e) => onUpdateSettings({ ...settings, showDots: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
              <span>แสดงขอบเขตห้ามทับใบหน้า (Face Safety Halos)</span>
              <input
                type="checkbox"
                checked={settings.showFacesBBox}
                onChange={(e) => onUpdateSettings({ ...settings, showFacesBBox: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                โหมดซ่อนข้อมูลติดต่อ (Privacy Mode)
              </span>
              <input
                type="checkbox"
                checked={settings.privacyMode}
                onChange={(e) => onUpdateSettings({ ...settings, privacyMode: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            บันทึกและปิด
          </button>
        </div>
      </div>
    </div>
  );
};
