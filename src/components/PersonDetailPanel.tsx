import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Phone,
  Mail,
  MessageCircle,
  Tag,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  Eye,
  EyeOff,
  User,
  Shield,
  FileText,
  Upload,
  Camera,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { Person, BalloonSettings } from '../types/friendmap';
import { COMPASS_DIRECTIONS } from '../utils/collisionAvoidance';
import { FaceThumbnail } from './FaceThumbnail';
import { VoiceMemoPlayer } from './VoiceMemoPlayer';

interface PersonDetailPanelProps {
  person: Person | null;
  allPeople: Person[];
  mode: 'editor' | 'viewer';
  settings: BalloonSettings;
  photoUrl?: string;
  onUpdatePerson: (person: Person) => void;
  onDeletePerson: (id: string) => void;
  onSelectPerson: (id: string) => void;
  onResetPosition: () => void;
}

export const PersonDetailPanel: React.FC<PersonDetailPanelProps> = ({
  person,
  allPeople,
  mode,
  settings,
  photoUrl,
  onUpdatePerson,
  onDeletePerson,
  onSelectPerson,
  onResetPosition,
}) => {
  if (!person) {
    return (
      <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-slate-400 select-none">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">ยังไม่ได้เลือกบุคคล</h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          คลิกที่จุดสีส้มหรือป้ายชื่อบนภาพ หรือเลือกบุคคลจากรายการเพื่อเปิดข้อมูลและแก้ไขรายละเอียด
        </p>
      </aside>
    );
  }

  // Navigation indexes
  const currentIndex = allPeople.findIndex((p) => p.id === person.id);
  const prevPerson = currentIndex > 0 ? allPeople[currentIndex - 1] : null;
  const nextPerson = currentIndex < allPeople.length - 1 ? allPeople[currentIndex + 1] : null;

  // Jump to next unreviewed
  const nextUnreviewed = allPeople.find((p, idx) => idx > currentIndex && !p.reviewed) ||
    allPeople.find((p) => !p.reviewed);

  const personPhotoInputRef = useRef<HTMLInputElement>(null);

  const handlePersonPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdatePerson({
        ...person,
        photoUrl: ev.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Apply 8-way directional nudge
  const handleApplyDirection = (dirKey: keyof typeof COMPASS_DIRECTIONS) => {
    const dir = COMPASS_DIRECTIONS[dirKey];
    const distance = Math.hypot(person.label.dx, person.label.dy) || 0.09;
    onUpdatePerson({
      ...person,
      label: {
        ...person.label,
        dx: Number((dir.x * distance).toFixed(4)),
        dy: Number((dir.y * distance).toFixed(4)),
        customDirection: dirKey as any,
      },
    });
  };

  // Adjust distance slider
  const currentDistance = Math.hypot(person.label.dx, person.label.dy) || 0.08;
  const handleDistanceChange = (newDistance: number) => {
    const angle = Math.atan2(person.label.dy, person.label.dx);
    onUpdatePerson({
      ...person,
      label: {
        ...person.label,
        dx: Number((Math.cos(angle) * newDistance).toFixed(4)),
        dy: Number((Math.sin(angle) * newDistance).toFixed(4)),
      },
    });
  };

  return (
    <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col h-full overflow-hidden select-none">
      {/* Top Header of the Panel */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
            {person.id}
          </span>
          <span className="text-sm font-semibold text-white truncate max-w-[130px]">
            {person.nickname || person.name || 'ไม่ระบุชื่อ'}
          </span>
        </div>

        {/* Previous / Next Person Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevPerson && onSelectPerson(prevPerson.id)}
            disabled={!prevPerson}
            title="คนก่อนหน้า"
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums px-1">
            {currentIndex + 1}/{allPeople.length}
          </span>
          <button
            onClick={() => nextPerson && onSelectPerson(nextPerson.id)}
            disabled={!nextPerson}
            title="คนถัดไป"
            className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form Body with Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === 'viewer' ? (
          /* VIEWER MODE: Clean profile view */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="flex items-start gap-3">
                <FaceThumbnail
                  photoUrl={photoUrl}
                  head={person.head}
                  customPhotoUrl={person.photoUrl}
                  size={56}
                  fallbackText={person.nickname || person.name || person.id}
                  ringColor={person.reviewed ? '#10b981' : '#f59e0b'}
                  className="shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-amber-400 font-mono">{person.id}</span>
                    {person.groupTag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {person.groupTag}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white truncate">
                    {person.nickname ? person.nickname : person.name || 'ไม่ระบุชื่อ'}
                  </h2>
                  {person.nickname && person.name && (
                    <p className="text-xs text-slate-400 truncate">{person.name}</p>
                  )}
                </div>
              </div>

              {person.notes && (
                <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/50 mt-3">
                  "{person.notes}"
                </p>
              )}
            </div>

            {/* Voice Memo Greeting in Viewer Mode */}
            {person.voiceMemoUrl && (
              <VoiceMemoPlayer
                voiceMemoUrl={person.voiceMemoUrl}
                voiceMemoDuration={person.voiceMemoDuration}
                personName={person.nickname || person.name || person.id}
                onSaveVoiceMemo={(url, duration) => {
                  onUpdatePerson({ ...person, voiceMemoUrl: url, voiceMemoDuration: duration });
                }}
                disabled={true}
              />
            )}

            {/* Contact details card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>ข้อมูลติดต่อ</span>
                {settings.privacyMode && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400">
                    <Shield className="w-3 h-3" /> โหมดปกป้องความเป็นส่วนตัว
                  </span>
                )}
              </div>

              {settings.privacyMode ? (
                <div className="p-3 rounded-lg bg-slate-900 text-center text-xs text-slate-500">
                  ซ่อนข้อมูลเบอร์โทรศัพท์และอีเมลตามนโยบายความเป็นส่วนตัว
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{person.contact.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{person.contact.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <MessageCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>LINE: {person.contact.lineId || '-'}</span>
                  </div>
                </>
              )}
            </div>

            {person.visualHint && (
              <div className="text-xs text-slate-400 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                <span className="font-medium text-slate-300">ลักษณะในภาพ:</span> {person.visualHint}
              </div>
            )}
          </div>
        ) : (
          /* EDITOR MODE: Full input editing */
          <>
            {/* Reviewed Toggle Banner */}
            <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
              person.reviewed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <span className="text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 ${person.reviewed ? 'text-emerald-400' : 'text-amber-400'}`} />
                {person.reviewed ? 'ตรวจทานตำแหน่งแล้ว' : 'ยังไม่ได้ตรวจทาน (รอตรวจทาน)'}
              </span>
              <input
                type="checkbox"
                checked={person.reviewed}
                onChange={(e) => onUpdatePerson({ ...person, reviewed: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </label>

            {/* Hidden file input for personal portrait */}
            <input
              ref={personPhotoInputRef}
              type="file"
              accept="image/*"
              onChange={handlePersonPhotoChange}
              className="hidden"
            />

            {/* Person Portrait / Avatar Attachment Card */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative group shrink-0">
                  <FaceThumbnail
                    photoUrl={photoUrl}
                    head={person.head}
                    customPhotoUrl={person.photoUrl}
                    size={48}
                    fallbackText={person.nickname || person.name || person.id}
                    ringColor={person.reviewed ? '#10b981' : '#f59e0b'}
                  />
                  {person.photoUrl && (
                    <button
                      onClick={() => onUpdatePerson({ ...person, photoUrl: undefined })}
                      title="ลบรูปเดี่ยว (ใช้รูปครอปอัตโนมัติ)"
                      className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate">
                    {person.photoUrl ? 'มีรูปภาพเดี่ยวแนบแล้ว' : 'แสดงภาพครอปใบหน้าอัตโนมัติ'}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {person.photoUrl ? 'กดเปลี่ยนรูป หรือลบเพื่อใช้ภาพจากภาพหมู่' : 'สามารถกดแนบรูปเดี่ยวเพื่อเปลี่ยนได้'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => personPhotoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{person.photoUrl ? 'เปลี่ยนรูป' : 'แนบรูป'}</span>
              </button>
            </div>

            {/* Identity Information */}
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  ชื่อเล่น (จะแสดงเด่นบนป้าย)
                </label>
                <input
                  type="text"
                  value={person.nickname}
                  onChange={(e) => onUpdatePerson({ ...person, nickname: e.target.value })}
                  placeholder="เช่น พี่หนึ่ง, กอล์ฟ, เปิ้ล"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  ชื่อ-นามสกุลจริง
                </label>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => onUpdatePerson({ ...person, name: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  กลุ่ม / ตำแหน่งแถว
                </label>
                <input
                  type="text"
                  value={person.groupTag || ''}
                  onChange={(e) => onUpdatePerson({ ...person, groupTag: e.target.value })}
                  placeholder="เช่น แถวนั่งหน้า, แถวยืนหลัง, ทีมงาน"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* 8-Way Directional Pad & Balloon Position */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  ทิศทางป้ายชื่อ (8 ทิศทาง)
                </span>
                <button
                  onClick={onResetPosition}
                  title="รีเซ็ตตำแหน่งป้าย"
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> รีเซ็ต
                </button>
              </div>

              {/* 3x3 Compass Direction Grid */}
              <div className="grid grid-cols-3 gap-1 w-36 mx-auto">
                <button
                  onClick={() => handleApplyDirection('NW')}
                  title="ทิศตะวันตกเฉียงเหนือ (NW)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('N')}
                  title="ทิศเหนือ (N)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('NE')}
                  title="ทิศตะวันออกเฉียงเหนือ (NE)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('W')}
                  title="ทิศตะวันตก (W)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div className="p-1 text-[10px] text-center font-mono text-slate-500 flex items-center justify-center">
                  ศีรษะ
                </div>
                <button
                  onClick={() => handleApplyDirection('E')}
                  title="ทิศตะวันออก (E)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('SW')}
                  title="ทิศตะวันตกเฉียงใต้ (SW)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('S')}
                  title="ทิศใต้ (S)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleApplyDirection('SE')}
                  title="ทิศตะวันออกเฉียงใต้ (SE)"
                  className="p-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 rounded border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Distance Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>ระยะห่างเส้นชี้</span>
                  <span className="font-mono">{Math.round(currentDistance * 1000)} px</span>
                </div>
                <input
                  type="range"
                  min="0.04"
                  max="0.25"
                  step="0.01"
                  value={currentDistance}
                  onChange={(e) => handleDistanceChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Lock & Visible Toggles */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() =>
                    onUpdatePerson({
                      ...person,
                      label: { ...person.label, locked: !person.label.locked },
                    })
                  }
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                    person.label.locked
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {person.label.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{person.label.locked ? 'ล็อกตำแหน่งแล้ว' : 'ยังไม่ล็อก'}</span>
                </button>

                <button
                  onClick={() =>
                    onUpdatePerson({
                      ...person,
                      label: { ...person.label, visible: !person.label.visible },
                    })
                  }
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  {person.label.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{person.label.visible ? 'แสดงป้าย' : 'ซ่อนป้าย'}</span>
                </button>
              </div>
            </div>

            {/* Contact Details Fields */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                ข้อมูลติดต่อ & บันทึก
              </span>
              <div>
                <input
                  type="text"
                  value={person.contact.phone}
                  onChange={(e) =>
                    onUpdatePerson({
                      ...person,
                      contact: { ...person.contact, phone: e.target.value },
                    })
                  }
                  placeholder="โทรศัพท์ (เช่น 081-234-5678)"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={person.contact.email}
                  onChange={(e) =>
                    onUpdatePerson({
                      ...person,
                      contact: { ...person.contact, email: e.target.value },
                    })
                  }
                  placeholder="อีเมล (เช่น friend@example.com)"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={person.contact.lineId}
                  onChange={(e) =>
                    onUpdatePerson({
                      ...person,
                      contact: { ...person.contact, lineId: e.target.value },
                    })
                  }
                  placeholder="LINE ID"
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  value={person.notes}
                  onChange={(e) => onUpdatePerson({ ...person, notes: e.target.value })}
                  placeholder="บันทึกประวัติ หรือความสัมพันธ์เพิ่มเติม..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Visual Clue Field */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                ลักษณะเด่นในภาพ (Visual Hint)
              </label>
              <input
                type="text"
                value={person.visualHint || ''}
                onChange={(e) => onUpdatePerson({ ...person, visualHint: e.target.value })}
                placeholder="เช่น เสื้อโปโลเทา, แว่นตา, นั่งพื้น"
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Voice Memo Greeting / Audio Record in Editor Mode */}
            <VoiceMemoPlayer
              voiceMemoUrl={person.voiceMemoUrl}
              voiceMemoDuration={person.voiceMemoDuration}
              personName={person.nickname || person.name || person.id}
              onSaveVoiceMemo={(url, duration) => {
                onUpdatePerson({
                  ...person,
                  voiceMemoUrl: url,
                  voiceMemoDuration: duration,
                });
              }}
              disabled={false}
            />
          </>
        )}
      </div>

      {/* Bottom Footer Actions */}
      {mode === 'editor' && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`คุณต้องการลบจุดตำแหน่ง ${person.id} หรือไม่?`)) {
                onDeletePerson(person.id);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ลบจุดนี้</span>
          </button>

          {nextUnreviewed && (
            <button
              onClick={() => onSelectPerson(nextUnreviewed.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors font-medium"
            >
              <span>ข้ามไปจุดที่ยังไม่ตรวจ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
