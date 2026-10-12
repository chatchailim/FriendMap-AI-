import React, { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertCircle, Filter, X, ChevronRight, User, FileSpreadsheet, Volume2 } from 'lucide-react';
import { Person } from '../types/friendmap';
import { FaceThumbnail } from './FaceThumbnail';

interface PeopleListDrawerProps {
  people: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  photoUrl?: string;
  onOpenBatchImport?: () => void;
}

export const PeopleListDrawer: React.FC<PeopleListDrawerProps> = ({
  people,
  selectedPersonId,
  onSelectPerson,
  isOpen,
  onClose,
  photoUrl,
  onOpenBatchImport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unreviewed' | 'reviewed'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Extract all distinct group tags
  const tags = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      if (p.groupTag) set.add(p.groupTag);
    });
    return Array.from(set);
  }, [people]);

  // Filtered people
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      // Status filter
      if (filterStatus === 'unreviewed' && p.reviewed) return false;
      if (filterStatus === 'reviewed' && !p.reviewed) return false;

      // Tag filter
      if (selectedTag !== 'all' && p.groupTag !== selectedTag) return false;

      // Search text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchId = p.id.toLowerCase().includes(q);
      const matchName = p.name.toLowerCase().includes(q);
      const matchNick = p.nickname.toLowerCase().includes(q);
      const matchHint = (p.visualHint || '').toLowerCase().includes(q);
      return matchId || matchName || matchNick || matchHint;
    });
  }, [people, filterStatus, selectedTag, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 bottom-0 left-0 w-80 lg:w-96 bg-slate-900/95 border-r border-slate-800 shadow-2xl z-30 flex flex-col backdrop-blur-md">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">สมุดรายชื่อบุคคลในภาพ</h3>
          <span className="text-xs text-slate-400 font-mono">({filteredPeople.length})</span>
        </div>
        <div className="flex items-center gap-1">
          {onOpenBatchImport && (
            <button
              onClick={onOpenBatchImport}
              title="นำเข้ารายชื่อชุดจาก Excel หรือแชท (Batch Import)"
              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>นำเข้าชุด</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, ชื่อเล่น, หมายเลข..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg mt-2.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ทั้งหมด ({people.length})
          </button>
          <button
            onClick={() => setFilterStatus('unreviewed')}
            className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
              filterStatus === 'unreviewed'
                ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รอตรวจ ({people.filter((p) => !p.reviewed).length})
          </button>
          <button
            onClick={() => setFilterStatus('reviewed')}
            className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors ${
              filterStatus === 'reviewed'
                ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ตรวจแล้ว ({people.filter((p) => p.reviewed).length})
          </button>
        </div>

        {/* Optional Tag Pills */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded whitespace-nowrap ${
                selectedTag === 'all'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ทุกแถว
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`px-2 py-0.5 rounded whitespace-nowrap ${
                  selectedTag === t
                    ? 'bg-amber-500/20 text-amber-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* People List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredPeople.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            ไม่พบรายชื่อที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          filteredPeople.map((p) => {
            const isSelected = selectedPersonId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => onSelectPerson(p.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-500/15 border border-amber-500/40 text-white'
                    : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FaceThumbnail
                    photoUrl={photoUrl}
                    head={p.head}
                    customPhotoUrl={p.photoUrl}
                    size={32}
                    fallbackText={p.nickname || p.name || p.id}
                    ringColor={p.reviewed ? '#10b981' : '#f59e0b'}
                  />
                  <div className="truncate min-w-0">
                    <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1 py-0.2 rounded shrink-0 bg-slate-800 text-slate-300">
                        {p.id}
                      </span>
                      <span className="truncate">{p.nickname || p.name || 'ยังไม่ระบุชื่อ'}</span>
                      {p.voiceMemoUrl && (
                        <span title="มีเสียงบันทึก">
                          <Volume2 className="w-3 h-3 text-amber-400 shrink-0" />
                        </span>
                      )}
                      {p.reviewed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-auto" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-400 shrink-0 ml-auto" />
                      )}
                    </div>
                    {p.name && p.nickname && (
                      <div className="text-[11px] text-slate-400 truncate">{p.name}</div>
                    )}
                    {p.visualHint && (
                      <div className="text-[10px] text-slate-500 truncate">{p.visualHint}</div>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
