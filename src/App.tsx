/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { StageCanvas } from './components/StageCanvas';
import { PersonDetailPanel } from './components/PersonDetailPanel';
import { PeopleListDrawer } from './components/PeopleListDrawer';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { AIDetectionModal } from './components/AIDetectionModal';
import { AttachPhotoModal } from './components/AttachPhotoModal';
import { HelpModal } from './components/HelpModal';
import { BatchImportModal } from './components/BatchImportModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { BackConfirmModal } from './components/BackConfirmModal';
import { EMPTY_PROJECT, SIMULATION_PROJECT } from './data/sampleDataset';
import { FriendMapProject, Person, PhotoInfo } from './types/friendmap';
import { autoArrangeBalloons } from './utils/collisionAvoidance';
import { Users, Upload, Sparkles, Image as ImageIcon, Keyboard, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function App() {
  const [project, setProject] = useState<FriendMapProject>(EMPTY_PROJECT);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [mode, setMode] = useState<'editor' | 'viewer'>('editor');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3800);
  }, []);

  // Drawer & Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAIDetectOpen, setIsAIDetectOpen] = useState<boolean>(false);
  const [isAttachPhotoOpen, setIsAttachPhotoOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isBackModalOpen, setIsBackModalOpen] = useState<boolean>(false);

  // Auto-save & Local draft state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Global drag-and-drop state
  const [isWindowDragging, setIsWindowDragging] = useState<boolean>(false);

  // Active person lookup
  const selectedPerson = project.people.find((p) => p.id === selectedPersonId) || null;

  // Global window paste listener for pasting images directly
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (ev) => {
              const dataUrl = ev.target?.result as string;
              const img = new Image();
              img.onload = () => {
                const newPhoto: PhotoInfo = {
                  id: `photo_${Date.now()}`,
                  title: file.name ? file.name.replace(/\.[^/.]+$/, '') : 'ภาพจากคลิปบอร์ด',
                  url: dataUrl,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  aspectRatio: img.naturalWidth / img.naturalHeight,
                  sourceType: 'uploaded',
                };
                setProject((prev) => ({
                  ...prev,
                  photo: newPhoto,
                }));
                setIsAIDetectOpen(true);
              };
              img.src = dataUrl;
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Global drag over listener
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsWindowDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX <= 0 || e.clientY <= 0) {
        setIsWindowDragging(false);
      }
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsWindowDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          const img = new Image();
          img.onload = () => {
            const newPhoto: PhotoInfo = {
              id: `photo_${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ''),
              url: dataUrl,
              width: img.naturalWidth,
              height: img.naturalHeight,
              aspectRatio: img.naturalWidth / img.naturalHeight,
              sourceType: 'uploaded',
            };
            setProject((prev) => ({
              ...prev,
              photo: newPhoto,
            }));
            setIsAIDetectOpen(true);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Initial mount: purge old stored data and ensure system starts clean with empty data
  useEffect(() => {
    try {
      // Clear legacy storage keys
      localStorage.removeItem('friendmap_project_draft_v1');
      
      const saved = localStorage.getItem('friendmap_project_draft_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.people) && parsed.photo && parsed.photo.sourceType !== 'empty') {
          setProject(parsed);
          if (parsed.people.length > 0) {
            setSelectedPersonId(parsed.people[0].id);
          }
          const now = new Date();
          setLastSavedTime(
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
        } else {
          setProject(EMPTY_PROJECT);
        }
      } else {
        setProject(EMPTY_PROJECT);
      }
    } catch (e) {
      console.warn('LocalStorage cleanup / restore notice:', e);
      setProject(EMPTY_PROJECT);
    }
  }, []);

  // Auto-save changes to localStorage (only active for user-created content or simulation)
  useEffect(() => {
    // If empty initial state, do not store draft to prevent re-dirtying on refresh
    if (!project || (project.photo.sourceType === 'empty' && project.people.length === 0)) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const jsonStr = JSON.stringify(project);
        if (jsonStr.length < 4 * 1024 * 1024) {
          localStorage.setItem('friendmap_project_draft_v2', jsonStr);
        }
        setSaveStatus('saved');
        const now = new Date();
        setLastSavedTime(
          now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
        setSaveStatus('unsaved');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [project]);

  // Update a single person
  const handleUpdatePerson = useCallback((updatedPerson: Person) => {
    setProject((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      people: prev.people.map((p) => (p.id === updatedPerson.id ? updatedPerson : p)),
    }));
  }, []);

  // Delete a person
  const handleDeletePerson = useCallback((id: string) => {
    setProject((prev) => {
      const idx = prev.people.findIndex((p) => p.id === id);
      const remaining = prev.people.filter((p) => p.id !== id);
      const nextSelected = remaining[idx] ? remaining[idx].id : remaining[idx - 1] ? remaining[idx - 1].id : null;
      setSelectedPersonId(nextSelected);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        people: remaining,
      };
    });
  }, []);

  // Add person at specific coordinates
  const handleAddPersonAt = useCallback((x: number, y: number) => {
    setProject((prev) => {
      let maxNum = 0;
      prev.people.forEach((p) => {
        const num = parseInt(p.id.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      });
      const nextId = `P${String(maxNum + 1).padStart(3, '0')}`;

      const dx = x > 0.5 ? 0.045 : -0.045;
      const dy = y > 0.5 ? 0.065 : -0.075;

      const newPerson: Person = {
        id: nextId,
        name: '',
        nickname: '',
        groupTag: y > 0.6 ? 'แถวนั่งหน้า' : y > 0.35 ? 'แถวกลาง' : 'แถวยืนหลัง',
        contact: { phone: '', email: '', lineId: '' },
        notes: '',
        head: { x, y, radius: 0.026 },
        label: { dx, dy, locked: false, visible: true },
        reviewed: false,
      };

      setSelectedPersonId(nextId);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        people: [...prev.people, newPerson],
      };
    });
  }, []);

  // Reset label position to standard offset
  const handleResetPosition = useCallback(() => {
    if (!selectedPerson) return;
    const dx = selectedPerson.head.x > 0.5 ? 0.05 : -0.05;
    const dy = selectedPerson.head.y > 0.5 ? 0.065 : -0.08;
    handleUpdatePerson({
      ...selectedPerson,
      label: {
        ...selectedPerson.label,
        dx,
        dy,
      },
    });
  }, [selectedPerson, handleUpdatePerson]);

  // Collision-free auto arrange algorithm
  const handleAutoArrange = useCallback(() => {
    setProject((prev) => {
      const arranged = autoArrangeBalloons(prev.people, {
        arrangeOnlyUnlocked: true,
        aspectRatio: prev.photo.aspectRatio,
      });
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        people: arranged,
      };
    });
  }, []);

  // Confirm photo attachment from AttachPhotoModal
  const handleAttachPhoto = (newPhoto: PhotoInfo, actionOption: 'auto_ai' | 'keep_markers' | 'clear_markers') => {
    setProject((prev) => {
      let nextPeople = prev.people;
      if (actionOption === 'clear_markers') {
        nextPeople = [];
        setSelectedPersonId(null);
      } else if (actionOption === 'keep_markers') {
        nextPeople = autoArrangeBalloons(prev.people, {
          arrangeOnlyUnlocked: false,
          aspectRatio: newPhoto.aspectRatio,
        });
      }

      return {
        ...prev,
        photo: newPhoto,
        people: nextPeople,
        updatedAt: new Date().toISOString(),
      };
    });

    if (actionOption === 'auto_ai') {
      // Automatically trigger AI Head Detection modal
      setTimeout(() => {
        setIsAIDetectOpen(true);
      }, 300);
    }
  };

  // Clear project data (empty state / start fresh)
  const handleClearData = useCallback((clearMode: 'markers_only' | 'all') => {
    if (clearMode === 'markers_only') {
      setSelectedPersonId(null);
      setProject((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        people: [],
      }));
      showToast('🧹 ล้างจุดบุคคลทั้งหมดเรียบร้อยแล้ว (คงภาพเดิมไว้)');
    } else {
      setSelectedPersonId(null);
      setProject(EMPTY_PROJECT);
      try {
        localStorage.removeItem('friendmap_project_draft_v1');
        localStorage.removeItem('friendmap_project_draft_v2');
      } catch (e) {}
      showToast('✨ เริ่มต้นใหม่เรียบร้อยแล้ว (ล้างข้อมูลทั้งหมดสู่กระดานว่างเปล่า)');
    }
  }, [showToast]);

  // Demo simulation handler: load 31-person photo & data for presentation
  const handleSimulateDemo = useCallback(() => {
    setProject(SIMULATION_PROJECT);
    setSelectedPersonId('P001');
    try {
      localStorage.setItem('friendmap_project_draft_v2', JSON.stringify(SIMULATION_PROJECT));
    } catch (e) {}
    showToast('🎬 จำลองภาพสาธิต 31 คนเรียบร้อยแล้ว — พร้อมทดลองใช้งานทุกฟังก์ชัน');
  }, [showToast]);

  // BACK button handler: Return to clean start fresh state from anywhere at any time
  const handleRequestBackToStart = useCallback(() => {
    const isAlreadyEmpty =
      (!project.photo?.url || project.photo.sourceType === 'empty') &&
      project.people.length === 0;

    if (isAlreadyEmpty) {
      showToast('✨ ระบบอยู่ที่หน้าเริ่มต้นใหม่ (กระดานว่างเปล่า) เรียบร้อยแล้ว');
    } else {
      setIsBackModalOpen(true);
    }
  }, [project, showToast]);

  const handleConfirmBackToStart = useCallback(() => {
    setSelectedPersonId(null);
    setProject(EMPTY_PROJECT);
    setMode('editor');
    setIsDrawerOpen(false);
    setIsAIDetectOpen(false);
    setIsAttachPhotoOpen(false);
    setIsExportOpen(false);
    setIsSettingsOpen(false);
    setIsHelpOpen(false);
    setIsBatchImportOpen(false);
    setIsShortcutsOpen(false);
    try {
      localStorage.removeItem('friendmap_project_draft_v1');
      localStorage.removeItem('friendmap_project_draft_v2');
    } catch (e) {}
    showToast('✨ ย้อนกลับสู่หน้าเริ่มต้นใหม่เรียบร้อยแล้ว (กระดานว่างเปล่า 100%)');
  }, [showToast]);

  // Batch roster import handler
  const handleApplyBatchPeople = useCallback((
    parsedPeople: Partial<Person>[],
    strategy: 'assign_existing' | 'replace_all' | 'append_new'
  ) => {
    setProject((prev) => {
      let updatedPeople = [...prev.people];

      if (strategy === 'replace_all') {
        updatedPeople = parsedPeople.map((item, idx) => {
          const id = `P${String(idx + 1).padStart(3, '0')}`;
          const col = idx % 8;
          const row = Math.floor(idx / 8);
          const x = 0.15 + (col / 8) * 0.7;
          const y = 0.25 + (row / 4) * 0.5;
          return {
            id,
            name: item.name || '',
            nickname: item.nickname || '',
            groupTag: item.groupTag || 'กลุ่มทั่วไป',
            contact: item.contact || { phone: '', email: '', lineId: '' },
            notes: item.notes || '',
            head: { x, y, radius: 0.026 },
            label: { dx: 0.05, dy: -0.07, locked: false, visible: true },
            reviewed: false,
          };
        });
      } else if (strategy === 'assign_existing') {
        parsedPeople.forEach((item, idx) => {
          if (idx < updatedPeople.length) {
            updatedPeople[idx] = {
              ...updatedPeople[idx],
              name: item.name !== undefined && item.name !== '' ? item.name : updatedPeople[idx].name,
              nickname: item.nickname !== undefined && item.nickname !== '' ? item.nickname : updatedPeople[idx].nickname,
              groupTag: item.groupTag !== undefined && item.groupTag !== '' ? item.groupTag : updatedPeople[idx].groupTag,
              contact: {
                ...updatedPeople[idx].contact,
                phone: item.contact?.phone || updatedPeople[idx].contact?.phone || '',
              },
            };
          } else {
            let maxNum = 0;
            updatedPeople.forEach((p) => {
              const num = parseInt(p.id.replace(/\D/g, ''), 10);
              if (!isNaN(num) && num > maxNum) maxNum = num;
            });
            const nextId = `P${String(maxNum + 1).padStart(3, '0')}`;
            updatedPeople.push({
              id: nextId,
              name: item.name || '',
              nickname: item.nickname || '',
              groupTag: item.groupTag || 'กลุ่มทั่วไป',
              contact: item.contact || { phone: '', email: '', lineId: '' },
              notes: '',
              head: { x: 0.5, y: 0.5, radius: 0.026 },
              label: { dx: 0.05, dy: -0.07, locked: false, visible: true },
              reviewed: false,
            });
          }
        });
      } else if (strategy === 'append_new') {
        parsedPeople.forEach((item) => {
          let maxNum = 0;
          updatedPeople.forEach((p) => {
            const num = parseInt(p.id.replace(/\D/g, ''), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          });
          const nextId = `P${String(maxNum + 1).padStart(3, '0')}`;
          updatedPeople.push({
            id: nextId,
            name: item.name || '',
            nickname: item.nickname || '',
            groupTag: item.groupTag || 'กลุ่มทั่วไป',
            contact: item.contact || { phone: '', email: '', lineId: '' },
            notes: '',
            head: { x: 0.5, y: 0.5, radius: 0.026 },
            label: { dx: 0.05, dy: -0.07, locked: false, visible: true },
            reviewed: false,
          });
        });
      }

      const arranged = autoArrangeBalloons(updatedPeople, {
        arrangeOnlyUnlocked: true,
        aspectRatio: prev.photo.aspectRatio,
      });

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        people: arranged,
      };
    });
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check open modals
      if (
        isAttachPhotoOpen ||
        isExportOpen ||
        isSettingsOpen ||
        isAIDetectOpen ||
        isHelpOpen ||
        isBatchImportOpen ||
        isShortcutsOpen ||
        isBackModalOpen
      ) {
        if (e.key === 'Escape') {
          setIsAttachPhotoOpen(false);
          setIsExportOpen(false);
          setIsSettingsOpen(false);
          setIsAIDetectOpen(false);
          setIsHelpOpen(false);
          setIsBatchImportOpen(false);
          setIsShortcutsOpen(false);
          setIsBackModalOpen(false);
        }
        return;
      }

      // Alt + Left Arrow or Alt + Backspace to trigger Back to Start
      if ((e.altKey && e.key === 'ArrowLeft') || (e.altKey && e.key === 'Backspace')) {
        e.preventDefault();
        handleRequestBackToStart();
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        setSelectedPersonId(null);
        setIsDrawerOpen(false);
        return;
      }

      if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
        e.preventDefault();
        setProject((prev) => {
          if (prev.people.length === 0) return prev;
          const currIdx = prev.people.findIndex((p) => p.id === selectedPersonId);
          const nextIdx = currIdx < prev.people.length - 1 ? currIdx + 1 : 0;
          setSelectedPersonId(prev.people[nextIdx].id);
          return prev;
        });
        return;
      }

      if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
        e.preventDefault();
        setProject((prev) => {
          if (prev.people.length === 0) return prev;
          const currIdx = prev.people.findIndex((p) => p.id === selectedPersonId);
          const prevIdx = currIdx > 0 ? currIdx - 1 : prev.people.length - 1;
          setSelectedPersonId(prev.people[prevIdx].id);
          return prev;
        });
        return;
      }

      if (e.key === ' ' && !e.repeat) {
        e.preventDefault();
        setProject((prev) => {
          const anyHidden = prev.people.some((p) => !p.label.visible);
          return {
            ...prev,
            updatedAt: new Date().toISOString(),
            people: prev.people.map((p) => ({
              ...p,
              label: { ...p.label, visible: anyHidden },
            })),
          };
        });
        return;
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleAutoArrange();
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        if (selectedPerson) {
          e.preventDefault();
          handleUpdatePerson({
            ...selectedPerson,
            label: { ...selectedPerson.label, locked: !selectedPerson.label.locked },
          });
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (selectedPerson) {
          e.preventDefault();
          handleUpdatePerson({
            ...selectedPerson,
            reviewed: !selectedPerson.reviewed,
          });
        }
        return;
      }

      if (e.key === 'e' || e.key === 'E') {
        setMode('editor');
        return;
      }

      if (e.key === 'v' || e.key === 'V') {
        setMode('viewer');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedPersonId,
    selectedPerson,
    isAttachPhotoOpen,
    isExportOpen,
    isSettingsOpen,
    isAIDetectOpen,
    isHelpOpen,
    isBatchImportOpen,
    isShortcutsOpen,
    handleAutoArrange,
    handleUpdatePerson,
  ]);

  // Import JSON people or full PhotoMetadataJSON
  const handleImportPeople = (importedData: any) => {
    // If importing full PhotoMetadataJSON
    if (importedData && importedData.photoMetadata && Array.isArray(importedData.people)) {
      setProject((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        photo: {
          ...prev.photo,
          ...importedData.photoMetadata,
          url: importedData.photoMetadata.url || prev.photo.url,
        },
        settings: importedData.settings || prev.settings,
        people: importedData.people,
      }));
      if (importedData.people.length > 0) {
        setSelectedPersonId(importedData.people[0].id);
      }
      return;
    }

    // Standard array of people
    const peopleList = Array.isArray(importedData) ? importedData : importedData.people || [];
    setProject((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      people: peopleList,
    }));
    if (peopleList.length > 0) {
      setSelectedPersonId(peopleList[0].id);
    }
  };

  // Apply AI detected heads
  const handleApplyDetectedHeads = (newPeople: Person[], applyMode: 'replace' | 'merge') => {
    setProject((prev) => {
      let combined = newPeople;
      if (applyMode === 'merge') {
        combined = [...prev.people, ...newPeople];
      }
      const arranged = autoArrangeBalloons(combined, {
        arrangeOnlyUnlocked: false,
        aspectRatio: prev.photo.aspectRatio,
      });
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        people: arranged,
      };
    });
    if (newPeople.length > 0) {
      setSelectedPersonId(newPeople[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans relative">
      {/* Global Drag-and-Drop Overlay */}
      {isWindowDragging && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 border-4 border-dashed border-amber-400 pointer-events-none">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-bounce">
            <Upload className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">วางไฟล์ภาพถ่ายที่นี่เพื่อแนบภาพ</h2>
          <p className="text-sm text-slate-300">ระบบจะทำการโหลดภาพและเตรียมวิเคราะห์พิกัดบุคคลให้โดยอัตโนมัติ</p>
        </div>
      )}

      {/* Top 3-Zone Header Bar */}
      <Header
        project={project}
        mode={mode}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        onModeChange={setMode}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAIDetect={() => setIsAIDetectOpen(true)}
        onUploadClick={() => setIsAttachPhotoOpen(true)}
        onAutoArrange={handleAutoArrange}
        onClearData={handleClearData}
        onSimulateDemo={handleSimulateDemo}
        onBackToStart={handleRequestBackToStart}
        onRestoreSample={handleSimulateDemo}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenBatchImport={() => setIsBatchImportOpen(true)}
      />

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side Floating Trigger: Open People Directory & Instant BACK */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {(project.people.length > 0 || (project.photo?.url && project.photo.sourceType !== 'empty')) && (
            <button
              onClick={handleRequestBackToStart}
              title="ย้อนกลับไปเริ่มต้นใหม่แต่แรก (BACK to Clean Slate)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-amber-300 border border-slate-800 hover:border-amber-400/60 rounded-xl shadow-lg backdrop-blur-md text-xs font-bold transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>BACK</span>
              <span className="hidden md:inline text-[11px] text-slate-400 font-normal">หน้าแรก</span>
            </button>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            title="เปิดสมุดรายชื่อบุคคล"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl shadow-lg backdrop-blur-md text-xs font-medium transition-all"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>รายชื่อ ({project.people.length})</span>
          </button>

          <button
            onClick={() => setIsAttachPhotoOpen(true)}
            title="แนบภาพถ่ายหมู่ใหม่"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl shadow-lg backdrop-blur-md text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">แนบภาพ</span>
          </button>
        </div>

        {/* Central Pan/Zoom Stage Canvas */}
        <div className="flex-1 h-full relative">
          <StageCanvas
            photo={project.photo}
            people={project.people}
            selectedPersonId={selectedPersonId}
            mode={mode}
            settings={project.settings}
            onSelectPerson={setSelectedPersonId}
            onUpdatePerson={handleUpdatePerson}
            onAddPersonAt={handleAddPersonAt}
            onOpenAttachPhoto={() => setIsAttachPhotoOpen(true)}
            onOpenAIDetect={() => setIsAIDetectOpen(true)}
            onSimulateDemo={handleSimulateDemo}
            onOpenBatchImport={() => setIsBatchImportOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onBackToStart={handleRequestBackToStart}
          />
        </div>

        {/* Right Inspector Panel */}
        <PersonDetailPanel
          person={selectedPerson}
          allPeople={project.people}
          mode={mode}
          settings={project.settings}
          photoUrl={project.photo?.url}
          onUpdatePerson={handleUpdatePerson}
          onDeletePerson={handleDeletePerson}
          onSelectPerson={setSelectedPersonId}
          onResetPosition={handleResetPosition}
        />

        {/* Search & Filter Drawer */}
        <PeopleListDrawer
          people={project.people}
          selectedPersonId={selectedPersonId}
          photoUrl={project.photo?.url}
          onOpenBatchImport={() => setIsBatchImportOpen(true)}
          onSelectPerson={(id) => {
            setSelectedPersonId(id);
            setIsDrawerOpen(false);
          }}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>

      {/* Attach Photo Modal */}
      <AttachPhotoModal
        isOpen={isAttachPhotoOpen}
        onClose={() => setIsAttachPhotoOpen(false)}
        onAttachPhoto={handleAttachPhoto}
        currentPhoto={project.photo}
      />

      {/* Export / Share Modal */}
      <ExportModal
        project={project}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onImportData={handleImportPeople}
      />

      {/* Settings Modal */}
      <SettingsModal
        settings={project.settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newSettings) =>
          setProject((prev) => ({ ...prev, settings: newSettings }))
        }
      />

      {/* AI Head Detection Modal */}
      <AIDetectionModal
        photo={project.photo}
        isOpen={isAIDetectOpen}
        onClose={() => setIsAIDetectOpen(false)}
        onApplyDetectedHeads={handleApplyDetectedHeads}
      />

      {/* Help & User Manual Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onOpenAttachPhoto={() => setIsAttachPhotoOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onRestoreSample={handleSimulateDemo}
      />

      {/* Batch Roster Import Modal */}
      <BatchImportModal
        isOpen={isBatchImportOpen}
        onClose={() => setIsBatchImportOpen(false)}
        existingPeople={project.people}
        onApplyBatchPeople={handleApplyBatchPeople}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Back to Start Confirmation Modal */}
      <BackConfirmModal
        isOpen={isBackModalOpen}
        onClose={() => setIsBackModalOpen(false)}
        onConfirmBack={handleConfirmBackToStart}
        currentPhotoTitle={project.photo?.title}
        peopleCount={project.people.length}
      />

      {/* Floating Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-amber-500/50 text-white rounded-2xl shadow-2xl backdrop-blur-md text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-amber-500/10">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-100">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
