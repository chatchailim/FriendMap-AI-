import React, { useState, useMemo } from 'react';
import { X, FileSpreadsheet, Check, AlertCircle, Copy, Sparkles, HelpCircle } from 'lucide-react';
import { Person } from '../types/friendmap';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPeople: Person[];
  onApplyBatchPeople: (
    parsedPeople: Partial<Person>[],
    strategy: 'assign_existing' | 'replace_all' | 'append_new'
  ) => void;
}

const SAMPLE_ROSTER = `สมชาย สุขเกษม\tบอย\tแถวนั่งหน้า\t081-234-5678
วิภาดา เพ็ญศรี\tนก\tแถวนั่งหน้า\t089-987-6543
กิตติศักดิ์ บุญมี\tต้อม\tแถวนั่งหน้า\t086-111-2233
ชัชชัย นพรัตน์\tชัย\tแถวกลาง\t082-345-6789
พรพิมล รัตนศิลป์\tปุ้ย\tแถวกลาง\t083-456-7890
ธนกฤต วิเศษ\tกอล์ฟ\tแถวยืนหลัง\t084-567-8901
นภัสสร ดำรงค์\tแอม\tแถวยืนหลัง\t085-678-9012`;

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  existingPeople,
  onApplyBatchPeople,
}) => {
  const [inputText, setInputText] = useState('');
  const [strategy, setStrategy] = useState<'assign_existing' | 'replace_all' | 'append_new'>('assign_existing');

  // Parse pasted raw text into structured people entries
  const parsedItems = useMemo(() => {
    if (!inputText.trim()) return [];

    const lines = inputText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    return lines.map((line, idx) => {
      // Check if line is tab-separated (from Excel/Sheets) or comma-separated
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t').map((s) => s.trim());
      } else if (line.includes(',')) {
        parts = line.split(',').map((s) => s.trim());
      } else {
        // Handle numbered or bracketed formats: e.g. "1. สมชาย สุขเกษม (บอย)"
        const clean = line.replace(/^\d+[\.\-\)]\s*/, '').trim();
        const matchNick = clean.match(/^([^(]+)\s*\(([^)]+)\)(.*)$/);
        if (matchNick) {
          parts = [matchNick[1].trim(), matchNick[2].trim(), matchNick[3].trim()];
        } else {
          parts = [clean];
        }
      }

      const name = parts[0] || '';
      const nickname = parts[1] || '';
      const groupTag = parts[2] || '';
      const phone = parts[3] || '';

      return {
        name,
        nickname,
        groupTag,
        contact: { phone, email: '', lineId: '' },
      };
    });
  }, [inputText]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (parsedItems.length === 0) return;
    onApplyBatchPeople(parsedItems, strategy);
    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">นำเข้ารายชื่อด่วน (Batch Roster Import)</h3>
              <p className="text-[11px] text-slate-400">
                คัดลอกจาก Excel, Google Sheets, หรือแชทไลน์เพื่อกรอกชื่อบุคคลพร้อมกันในคลิกเดียว
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
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Action options */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">รูปแบบการนำเข้า:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                  strategy === 'assign_existing'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === 'assign_existing'}
                    onChange={() => setStrategy('assign_existing')}
                    className="accent-amber-500"
                  />
                  <span>จับคู่กับมาร์กเกอร์เดิม</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  ใส่ชื่อลงในจุดพิกัดที่มีอยู่ในภาพตามลำดับ (ปัจจุบันมี {existingPeople.length} จุด)
                </span>
              </label>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                  strategy === 'append_new'
                    ? 'bg-amber-500/15 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === 'append_new'}
                    onChange={() => setStrategy('append_new')}
                    className="accent-amber-500"
                  />
                  <span>เพิ่มต่อท้าย</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  เพิ่มคนใหม่ต่อจากที่มีอยู่เดิม
                </span>
              </label>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-colors ${
                  strategy === 'replace_all'
                    ? 'bg-rose-500/15 border-rose-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === 'replace_all'}
                    onChange={() => setStrategy('replace_all')}
                    className="accent-rose-500"
                  />
                  <span>แทนที่รายชื่อทั้งหมด</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  ล้างรายชื่อเดิมแล้วสร้างตามที่วางใหม่
                </span>
              </label>
            </div>
          </div>

          {/* Input text box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">
                วางข้อความรายชื่อ (คอลัมน์: ชื่อ-สกุล [Tab/,] ชื่อเล่น [Tab/,] กลุ่ม/แถว [Tab/,] เบอร์โทร):
              </label>
              <button
                type="button"
                onClick={() => setInputText(SAMPLE_ROSTER)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>โหลดตัวอย่าง</span>
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`สมชาย สุขเกษม\tบอย\tแถวนั่งหน้า\t081-234-5678\nวิภาดา เพ็ญศรี\tนก\tแถวกลาง\t089-987-6543\nหรือ 1. กิตติศักดิ์ (ต้อม)`}
              rows={6}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Real-time Parsed Preview */}
          {parsedItems.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span>ตัวอย่างข้อมูลที่ตรวจพบ</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    {parsedItems.length} คน
                  </span>
                </span>
                {strategy === 'assign_existing' && parsedItems.length > existingPeople.length && (
                  <span className="text-amber-400 text-[10px] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    จำนวนมากกว่ามาร์กเกอร์เดิม ({existingPeople.length}) คนที่เกินจะถูกสร้างเพิ่ม
                  </span>
                )}
              </div>

              <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                      <th className="p-2 w-8">#</th>
                      <th className="p-2">ชื่อ-นามสกุล</th>
                      <th className="p-2">ชื่อเล่น</th>
                      <th className="p-2">กลุ่ม/แถว</th>
                      <th className="p-2">เบอร์โทร</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {parsedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-2 text-slate-500">{idx + 1}</td>
                        <td className="p-2 text-white font-sans">{item.name || '-'}</td>
                        <td className="p-2 text-amber-300">{item.nickname || '-'}</td>
                        <td className="p-2 text-slate-400 font-sans">{item.groupTag || '-'}</td>
                        <td className="p-2 text-slate-400">{item.contact?.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleApply}
            disabled={parsedItems.length === 0}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>ยืนยันการนำเข้า ({parsedItems.length} คน)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
