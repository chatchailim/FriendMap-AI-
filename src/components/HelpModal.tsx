import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Compass,
  Sparkles,
  Upload,
  Download,
  BookOpen,
  CheckCircle2,
  Lock,
  Layers,
  Printer,
  FileJson,
  FileText,
  Search,
  MousePointer,
  RotateCcw,
  Shield,
  ArrowRight,
  Info,
  Keyboard,
  Volume2,
  FileSpreadsheet
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAttachPhoto?: () => void;
  onOpenExport?: () => void;
  onRestoreSample?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onOpenAttachPhoto,
  onOpenExport,
  onRestoreSample,
}) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'workflows' | 'balloons' | 'export' | 'shortcuts' | 'glossary'>('quickstart');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">คู่มือการใช้งานระบบ FriendMap AI (User Guide & Manual)</h3>
              <p className="text-[11px] text-slate-400">เรียนรู้ขั้นตอนการทำงาน การควบคุมป้ายชื่อ และการส่งออกเอกสาร</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/40 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>เริ่มต้นใช้งานด่วน</span>
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'workflows'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>แผนผังการทำงาน (Diagrams)</span>
          </button>

          <button
            onClick={() => setActiveTab('balloons')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'balloons'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>การควบคุมป้าย & หลบใบหน้า</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก & สั่งพิมพ์ PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'shortcuts'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>คีย์ลัด & ฟีเจอร์ใหม่</span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'glossary'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>อภิธานศัพท์เทคนิค</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: QUICK START */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-0.5">ยินดีต้อนรับสู่ FriendMap AI!</p>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    ระบบนี้ช่วยให้คุณใส่ป้ายชื่อ ระบุข้อมูลติดต่อ และจดจำเพื่อนๆ ในภาพถ่ายหมู่ได้โดยไม่ทำลายภาพต้นฉบับ ทำตาม 5 ขั้นตอนง่ายๆ ด้านล่างเพื่อเริ่มสร้างแผนที่บุคคลของคุณ:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
                    <span>แนบภาพถ่ายหมู่</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คลิกปุ่ม <strong>"แนบภาพถ่าย"</strong> ด้านบน หรือลากไฟล์ภาพมาปล่อยลงบนหน้าจอ (Drag & Drop) หรือกด <code>Ctrl+V</code> เพื่อวางภาพ
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAttachPhoto?.();
                    }}
                    className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:underline"
                  >
                    <span>เปิดหน้าต่างแนบภาพ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
                    <span>ระบุตำแหน่งศีรษะ</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    กดปุ่ม <strong>"AI ค้นหาศีรษะ"</strong> เพื่อให้ AI ช่วยสแกน หรือกด <code>Shift + คลิกภาพ</code> ตรงศีรษะเพื่อนเพื่อสร้างจุดเอง
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
                    <span>ปรับตำแหน่งป้ายชื่อ</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    ลากป้ายบอลลูนไปรอบศีรษะอย่างอิสระ หรือกดปุ่ม <strong>"จัดป้ายอัตโนมัติ"</strong> เพื่อให้ระบบคำนวณหลบใบหน้าของคนอื่น
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">4</span>
                    <span>กรอกประวัติ & แนบรูปเดี่ยว</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คลิกเลือกบุคคล กรอกชื่อเล่น, ชื่อจริง, เบอร์โทร, LINE ID และคลิก <strong>"แนบรูป"</strong> เพื่อใส่รูปโพรไฟล์ของเพื่อน
                  </p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">5</span>
                    <span>ส่งออก JSON / Markdown / พิมพ์ PDF</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คลิกปุ่มสีทอง <strong>"ส่งออก / บันทึก"</strong> เพื่อดาวน์โหลดไฟล์ Metadata JSON, เอกสาร Markdown สรุปรายชื่อ หรือสั่งพิมพ์เป็นรายงาน PDF ทางการขนาด A4
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenExport?.();
                    }}
                    className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:underline"
                  >
                    <span>เปิดหน้าต่างส่งออกเอกสาร</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOWS & DIAGRAMS */}
          {activeTab === 'workflows' && (
            <div className="space-y-5 text-xs text-slate-300">
              <div>
                <h4 className="font-bold text-sm text-white mb-1.5 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>สถาปัตยกรรมแบ่งชั้น (Layer Architecture)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  ระบบแยกภาพถ่ายต้นฉบับออกจากข้อความอย่างสมบูรณ์ (Non-destructive) เพื่อให้แก้ไขได้ตลอดเวลา:
                </p>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 leading-relaxed">
                  <div className="text-amber-400 font-semibold">[Layer 1: Immutable Photo Layer]</div>
                  <div className="text-slate-400 pl-4">└── ไฟล์ภาพถ่ายจริง (JPG/PNG) คงสภาพความละเอียดสูงเดิม 100%</div>
                  <div className="text-amber-400 font-semibold">[Layer 2: Normalized Coordinate Layer]</div>
                  <div className="text-slate-400 pl-4">└── พิกัด x, y, dx, dy ในสัดส่วนสัมพัทธ์ [0.0 - 1.0] ทนทานต่อการซูมและย่อขยาย</div>
                  <div className="text-amber-400 font-semibold">[Layer 3: Interactive Balloon Overlay]</div>
                  <div className="text-slate-400 pl-4">└── เส้นชี้เวกเตอร์ SVG + ป้ายบอลลูนการ์ตูน ดึงลากได้รอบ 360 องศา</div>
                  <div className="text-amber-400 font-semibold">[Layer 4: Registry & Multi-Format Publishing]</div>
                  <div className="text-slate-400 pl-4">└── ทะเบียนบุคคล OneVault + ส่งออก Metadata JSON / Markdown / พิมพ์ PDF / รูป PNG</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>วงจรการประมวลผลจัดป้ายหลบใบหน้า (Collision Avoidance Flow)</span>
                </h4>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">1</span>
                    <span>คำนวณกรอบพื้นที่ปลอดภัยรอบใบหน้าของทุกคน (Safety Halo ขยาย 130%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">2</span>
                    <span>ตรวจสอบป้ายที่ถูกล็อกตำแหน่งไว้ (Locked) เพื่อใช้เป็นสิ่งกีดขวางถาวร</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">3</span>
                    <span>สร้างจุดวางป้าย 8 ทิศทาง x 5 ระดับระยะห่าง (40 ตัวเลือกต่อบุคคล)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">4</span>
                    <span>ตัดตำแหน่งที่ทับซ้อนใบหน้าทิ้งทันที (Hard Constraint Pruning)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-400">5</span>
                    <span>ให้คะแนนและเลือกทิศทางที่สั้น สวยงาม และไม่ทับซ้อนกับป้ายของผู้อื่น</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BALLOONS & CONTROLS */}
          {activeTab === 'balloons' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                    <span>การลากป้ายชื่อด้วยเมาส์ (Direct Drag)</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คลิกค้างที่ป้ายชื่อ แล้วลากไปในทิศทางที่ต้องการรอบศีรษะ เส้นชี้จะหมุนและยืดหดตามตำแหน่งเมาส์ทันที
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>แป้นควบคุม 8 ทิศทาง (Compass Pad)</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    ในแถบขวามือ คลิกเลือกลูกศรทิศทาง (NW, N, NE, W, E, SW, S, SE) เพื่อกำหนดทิศทางป้ายอย่างแม่นยำ
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>การล็อกตำแหน่งป้าย (Lock Position)</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    เมื่อจัดวางป้ายมุมที่พอใจแล้ว ให้คลิกปุ่ม "ล็อกตำแหน่ง" (ไอคอนแม่กุญแจ) เพื่อไม่ให้อัลกอริทึมอัตโนมัติมาเลื่อนป้ายนี้
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>ปุ่มจัดป้ายอัตโนมัติ (Auto-Arrange)</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คลิกปุ่ม "จัดป้ายอัตโนมัติ" บน Header ระบบจะสแกนหาที่ว่างรอบศีรษะทุกคน และขยับป้ายให้ไม่บังหน้าเพื่อนในภาพ
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                <span className="font-bold text-slate-200 block">คีย์ลัดที่มีประโยชน์ (Keyboard Shortcuts):</span>
                <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono">
                  <div><code>Shift + คลิกภาพ</code> : เพิ่มจุดบุคคลใหม่</div>
                  <div><code>เลื่อนลูกกลิ้งเมาส์</code> : ซูมเข้า / ซูมออกภาพ</div>
                  <div><code>กด Spacebar + ลากเมาส์</code> : เลื่อนดูภาพ (Pan)</div>
                  <div><code>Esc</code> : ยกเลิกโหมดเพิ่มจุด</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPORT & PDF */}
          {activeTab === 'export' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <FileJson className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5">1. ไฟล์ Photo Metadata JSON (.json)</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      บันทึกพิกัดศีรษะ, ตำแหน่งป้าย, สถิติภาพ, และประวัติทุกคนไว้ในรูปแบบมาตรฐาน เพื่อนำกลับมาโหลดทำงานต่อในครั้งถัดไป โดยตั้งชื่อไฟล์ตรงกับภาพ เช่น <code>32980304_10214774071859417_974758122205741056_n.json</code>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5">2. รายงาน Markdown (.md)</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      สร้างเอกสารสรุปตารางรายชื่อบุคคลและประวัติรายคน สามารถคัดลอกไปใช้วางในโปรแกรมบันทึก เช่น Obsidian, Notion หรือส่งลงเอกสาร GitHub ได้ทันที
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Printer className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-0.5">3. พิมพ์และบันทึกเป็น PDF (.pdf)</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      จัดรูปแบบเอกสารรายงานขนาด A4 สำหรับสั่งพิมพ์ลงกระดาษ หรือเลือกบันทึกเป็นไฟล์ PDF ผ่านหน้าต่างพิมพ์ของเบราว์เซอร์ พร้อมตารางรายชื่อและแถบสถิติสรุป
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-300 mb-0.5">4. โหมดปกป้องความเป็นส่วนตัว (PDPA / Private-by-default)</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      มีตัวเลือกให้ติ๊กซ่อนเบอร์โทรศัพท์และ LINE ID ออกจากไฟล์ส่งออกทุกชนิด เพื่อความปลอดภัยเมื่อนำไฟล์ไปแชร์ในที่สาธารณะ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SHORTCUTS & ADVANCED FEATURES */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Keyboard className="w-4 h-4 text-amber-400" />
                  <span>ตารางคีย์ลัดแป้นพิมพ์ (Keyboard Hotkeys)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>เลื่อนไปยังคนถัดไป / คนก่อนหน้า</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">J / K หรือ ↓ / ↑</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>เปิด/ปิดแสดงบอลลูนป้ายชื่อทั้งหมด</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">Space</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>จัดระเบียบป้ายอัตโนมัติไม่บังหน้า</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">A</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>ล็อก / ปลดล็อกตำแหน่งป้าย</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">L</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>สลับสถานะ: ตรวจแล้ว ↔ รอตรวจ</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">R</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>สลับโหมด Editor ↔ Viewer</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">E / V</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>ยกเลิกการเลือก / ปิดกล่องโต้ตอบ</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">Esc</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                    <span>เปิดหน้าต่างคีย์ลัด</span>
                    <span className="font-mono text-amber-300 bg-slate-800 px-2 py-0.5 rounded">?</span>
                  </div>
                </div>
              </div>

              {/* Advanced features highlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>ครอปใบหน้าอัตโนมัติ</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    สร้าง Thumbnail ใบหน้าทรงกลมจากพิกัดศีรษะบนภาพหมู่โดยตรง แสดงในแถบรายชื่อและโปรไฟล์ ทำให้ระบุตัวบุคคลได้เร็วขึ้น
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-xs">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>นำเข้ารายชื่อชุด (Batch)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    คัดลอกจาก Excel หรือแชท LINE แล้ววางเพื่อจับคู่กับจุดมาร์กเกอร์บนภาพหมู่ตามลำดับ พร้อมตารางตรวจสอบก่อนยืนยัน
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sky-300 text-xs">
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>เสียงความทรงจำ (Voice Memo)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    อัดเสียงทักทายหรือคำพูดสั้นๆ (สูงสุด 30 วิ) ต่อคนได้โดยตรง บันทึกฝังรวมในข้อมูลโครงการและสามารถกดเล่นได้
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GLOSSARY */}
          {activeTab === 'glossary' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาความหมายศัพท์เทคนิค..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                {[
                  {
                    term: 'Normalized Coordinates (พิกัดสัมพัทธ์)',
                    desc: 'พิกัดตัวเลข 0.0 ถึง 1.0 เทียบกับความกว้าง/สูงของภาพ ทำให้จุดชี้ไม่เลื่อนหลุดแม้จะย่อหรือขยายหน้าจอ',
                  },
                  {
                    term: 'Leader Line (เส้นชี้ศีรษะ)',
                    desc: 'เส้นโยงแบบเวกเตอร์จากจุดกึ่งกลางศีรษะไปยังป้ายชื่อบอลลูน ปรับองศาตามการลากป้ายอัตโนมัติ',
                  },
                  {
                    term: 'Face Exclusion Zone / Safety Halo',
                    desc: 'กรอบพื้นที่สมมติรอบใบหน้าบุคคลที่อัลกอริทึมจะถือเป็นเขตห้ามทับ ป้องกันป้ายชื่อบดบังใบหน้าเพื่อน',
                  },
                  {
                    term: 'Review Queue (คิวรอตรวจทาน)',
                    desc: 'สถานะสำหรับบุคคลที่เพิ่มใหม่หรือตรวจจับด้วย AI เพื่อรอให้มนุษย์เข้ามาตรวจสอบและผูกชื่อจริง',
                  },
                  {
                    term: 'Non-Destructive Overlay',
                    desc: 'การแยกชั้นข้อความและพิกัดออกจากไฟล์ภาพถ่ายจริง ทำให้ภาพต้นฉบับคงสภาพเดิม 100% ไม่ถูกเขียนทับ',
                  },
                  {
                    term: 'Photo Metadata JSON',
                    desc: 'รูปแบบไฟล์บันทึกมาตรฐาน (friendmap_photo_metadata) เก็บทั้งข้อมูลกล้อง สถิติภาพ และพิกัดบุคคลทั้งหมด',
                  },
                  {
                    term: 'Private-by-default',
                    desc: 'นโยบายความปลอดภัยที่ซ่อนข้อมูลติดต่อส่วนบุคคลเป็นค่าเริ่มต้นเพื่อความปลอดภัยตามมาตรฐาน PDPA',
                  },
                  {
                    term: 'OneVault / OneManOS Integration',
                    desc: 'ระบบทะเบียนประวัติที่ใช้รหัสบุคคล (Person ID) เดียวกันเพื่อเชื่อมโยงประวัติบุคคลข้ามหลายภาพถ่าย',
                  },
                ]
                  .filter((item) =>
                    !searchQuery ||
                    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-300 block">{item.term}</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>สามารถเปิดดูเอกสารฉบับเต็มได้ที่ไฟล์</span>
            <code className="text-amber-300 font-mono">README.md</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
          >
            เข้าใจแล้วและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
