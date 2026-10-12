import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Loader2, X, Users, RefreshCw } from 'lucide-react';
import { Person, PhotoInfo } from '../types/friendmap';

interface AIDetectionModalProps {
  photo: PhotoInfo;
  isOpen: boolean;
  onClose: () => void;
  onApplyDetectedHeads: (newPeople: Person[], mode: 'replace' | 'merge') => void;
}

export const AIDetectionModal: React.FC<AIDetectionModalProps> = ({
  photo,
  isOpen,
  onClose,
  onApplyDetectedHeads,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedResults, setDetectedResults] = useState<{
    totalCount: number;
    heads: Array<{
      x: number;
      y: number;
      radius: number;
      depthRow?: string;
      suggestedNicknameHint?: string;
    }>;
    notes?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleStartDetection = async () => {
    setLoading(true);
    setError(null);

    try {
      // Send photo URL / base64 to backend
      const response = await fetch('/api/detect-heads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photo.url,
          mimeType: photo.url.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || resData.message || 'เกิดข้อผิดพลาดในการวิเคราะห์ด้วย AI');
      }

      const detected = resData.data.detectedHeads || [];
      setDetectedResults({
        totalCount: detected.length,
        heads: detected,
        notes: resData.data.notes,
      });
    } catch (err: any) {
      console.warn('API error or fallback:', err);
      setError(err.message || 'ไม่สามารถติดต่อ AI API ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (applyMode: 'replace' | 'merge') => {
    if (!detectedResults) return;

    const newPeopleList: Person[] = detectedResults.heads.map((h, i) => {
      const id = `P${String(i + 1).padStart(3, '0')}`;
      return {
        id,
        name: '',
        nickname: h.suggestedNicknameHint || `คนตำแหน่งที่ ${i + 1}`,
        groupTag: h.depthRow === 'front_seated' ? 'แถวนั่งหน้า' : h.depthRow === 'back_standing' ? 'แถวยืนหลัง' : 'แถวกลาง',
        contact: { phone: '', email: '', lineId: '' },
        notes: `AI ตรวจจับความลึก: ${h.depthRow || 'ไม่ระบุ'}`,
        head: {
          x: Math.max(0.01, Math.min(0.99, h.x)),
          y: Math.max(0.01, Math.min(0.99, h.y)),
          radius: h.radius || 0.025,
        },
        label: {
          dx: h.x > 0.5 ? 0.05 : -0.05,
          dy: h.y > 0.5 ? 0.06 : -0.08,
          locked: false,
          visible: true,
        },
        reviewed: false, // User must review
        visualHint: h.suggestedNicknameHint,
      };
    });

    onApplyDetectedHeads(newPeopleList, applyMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI ตรวจจับตำแหน่งศีรษะอัตโนมัติ</h3>
              <p className="text-[11px] text-slate-400">ค้นหาพิกัดบุคคลในภาพถ่ายหมู่ด้วยโมเดล Gemini 3.8 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
            <p className="mb-2 font-medium text-amber-300 flex items-center gap-1.5">
              <span>นโยบายความถูกต้องและความเป็นส่วนตัว:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>ระบบ AI จะค้นหาเฉพาะ <strong>"ตำแหน่งศีรษะ (Head Candidates)"</strong> เท่านั้น</li>
              <li>ระบบ <strong>ไม่เดาชื่อหรือระบุตัวตนจากใบหน้าโดยอัตโนมัติ</strong> เพื่อความปลอดภัยสูงสุด</li>
              <li>ผู้ใช้จะเป็นผู้ตรวจสอบและผูกชื่อจริงกับแต่ละคนในขั้นตอนการตรวจทาน (Review Queue)</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">ไม่สามารถประมวลผลผ่าน AI API ได้</p>
                <p className="text-[11px] text-rose-400/90">{error}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  (หมายเหตุ: สามารถใช้จุดตั้งต้น 31 จุด หรือกดเพิ่มจุดด้วย Shift+คลิกบนภาพได้ตลอดเวลา)
                </p>
              </div>
            </div>
          )}

          {detectedResults ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  ตรวจพบทั้งหมด {detectedResults.totalCount} ตำแหน่ง
                </span>
                <span className="text-[11px] text-slate-400">สถานะ: รอการยืนยัน</span>
              </div>
              {detectedResults.notes && (
                <p className="text-xs text-slate-300 italic">"{detectedResults.notes}"</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={handleStartDetection}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังวิเคราะห์ภาพถ่าย...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>เริ่มตรวจจับศีรษะด้วย AI ตอนนี้</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>

          {detectedResults && (
            <>
              <button
                onClick={() => handleApply('merge')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                ผสานกับข้อมูลเดิม (Merge)
              </button>
              <button
                onClick={() => handleApply('replace')}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
              >
                แทนที่ด้วยผลตรวจจับ (Replace)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
