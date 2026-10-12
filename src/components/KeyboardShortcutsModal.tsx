import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'การนำทางและเลือกบุคคล (Navigation)',
      items: [
        { key: 'J / ↓', desc: 'เลื่อนไปยังบุคคลถัดไป (Next person)' },
        { key: 'K / ↑', desc: 'เลื่อนไปยังบุคคลก่อนหน้า (Previous person)' },
        { key: 'Esc', desc: 'ยกเลิกการเลือกบุคคล / ปิดหน้าต่างที่เปิดอยู่' },
      ],
    },
    {
      title: 'การจัดการป้ายและมาร์กเกอร์ (Balloons & Review)',
      items: [
        { key: 'Space', desc: 'เปิด/ปิดการแสดงป้ายชื่อบอลลูนทั้งหมด' },
        { key: 'A', desc: 'จัดระเบียบป้ายอัตโนมัติไม่บังใบหน้า (Smart Auto-Arrange)' },
        { key: 'L', desc: 'ล็อก / ปลดล็อกตำแหน่งป้ายของคนที่เลือก' },
        { key: 'R', desc: 'สลับสถานะ: ตรวจแล้ว ↔ รอตรวจ (Review toggle)' },
      ],
    },
    {
      title: 'โหมดและเครื่องมือ (Tools & Modes)',
      items: [
        { key: 'ปุ่ม BACK', desc: 'ย้อนกลับไปหน้าเริ่มต้นใหม่แต่แรกได้ตลอดเวลา (Clean Slate)' },
        { key: 'E / V', desc: 'สลับระหว่างโหมดแก้ไข (Editor) และโหมดนำเสนอ (Viewer)' },
        { key: 'Ctrl + V', desc: 'วางภาพจากคลิปบอร์ดเพื่อเริ่มงานใหม่ทันที' },
        { key: 'Drag & Drop', desc: 'ลากไฟล์ภาพมาวางบนหน้าจอได้ทุกเมื่อ' },
        { key: '?', desc: 'เปิดหน้าต่างคีย์ลัดนี้' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ปุ่มลัดแป้นพิมพ์ (Keyboard Shortcuts)</h3>
              <p className="text-[11px] text-slate-400">เพิ่มความรวดเร็วในการจัดการข้อมูลภาพถ่ายหมู่</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl divide-y divide-slate-800/60">
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center justify-between p-2.5 text-xs">
                    <span className="text-slate-300">{item.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] font-semibold shadow-inner">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
          <span className="text-[11px] text-slate-500">
            กดปุ่ม <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">?</kbd> ได้ทุกเมื่อเพื่อเรียกดูคีย์ลัด
          </span>
        </div>
      </div>
    </div>
  );
};
