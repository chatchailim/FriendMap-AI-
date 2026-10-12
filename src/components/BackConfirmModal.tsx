import React, { useEffect } from 'react';
import { ArrowLeft, RotateCcw, AlertTriangle, X, Sparkles } from 'lucide-react';

interface BackConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmBack: () => void;
  currentPhotoTitle?: string;
  peopleCount: number;
}

export const BackConfirmModal: React.FC<BackConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmBack,
  currentPhotoTitle,
  peopleCount,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="back-modal-title"
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 id="back-modal-title" className="text-sm font-bold text-white">
                ย้อนกลับไปเริ่มต้นใหม่แต่แรก (BACK)
              </h3>
              <p className="text-[11px] text-slate-400">
                รีเซ็ตระบบกลับสู่กระดานว่างเปล่า
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-amber-200 mb-0.5 font-semibold">
                ต้องการย้อนกลับไปหน้าเริ่มต้นใหม่ใช่หรือไม่?
              </strong>
              <span>
                ระบบจะทำการล้างข้อมูลในโปรเจกต์ปัจจุบัน (รวมถึงภาพถ่ายและจุดระบุบุคคล) และนำคุณกลับสู่หน้ากระดานว่างเปล่าเริ่มต้นเหมือนเพิ่งเปิดระบบใหม่
              </span>
            </div>
          </div>

          {(peopleCount > 0 || currentPhotoTitle) && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="text-[11px] text-slate-400 font-medium">ข้อมูลที่จะถูกรีเซ็ต:</div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">ภาพถ่ายปัจจุบัน:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">
                  {currentPhotoTitle || 'ภาพถ่ายที่โหลดไว้'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">จำนวนบุคคลที่ระบุไว้:</span>
                <span className="font-semibold text-amber-400 tabular-nums">
                  {peopleCount} คน
                </span>
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 leading-normal">
            💡 หลังจากกลับสู่หน้าเริ่มต้นแล้ว คุณยังสามารถกดปุ่ม <span className="text-amber-300 font-semibold">"จำลองภาพสาธิต"</span> เพื่อทดลองระบบใหม่ หรือเลือกแนบภาพถ่ายจริงได้ตลอดเวลา
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          >
            ยกเลิก (ทำงานต่อ)
          </button>
          <button
            onClick={() => {
              onConfirmBack();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ยืนยันกลับไปเริ่มต้นใหม่ (BACK)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
