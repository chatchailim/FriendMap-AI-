import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Clipboard, Camera, RotateCcw, X, Check, AlertCircle } from 'lucide-react';
import { PhotoInfo, Person } from '../types/friendmap';
import { createSyntheticSampleImageUri } from '../data/sampleDataset';

interface AttachPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachPhoto: (photo: PhotoInfo, actionOption: 'auto_ai' | 'keep_markers' | 'clear_markers') => void;
  currentPhoto: PhotoInfo;
}

export const AttachPhotoModal: React.FC<AttachPhotoModalProps> = ({
  isOpen,
  onClose,
  onAttachPhoto,
  currentPhoto,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState<string>('');
  const [photoMeta, setPhotoMeta] = useState<{ width: number; height: number; sizeKb?: number } | null>(null);
  const [actionOption, setActionOption] = useState<'auto_ai' | 'keep_markers' | 'clear_markers'>('auto_ai');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process a loaded file
  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('กรุณาเลือกไฟล์ที่เป็นรูปภาพ (JPEG, PNG, WEBP, HEIC)');
      return;
    }

    setIsProcessing(true);
    setPhotoTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setPreviewUrl(dataUrl);
        setPhotoMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb: Math.round(file.size / 1024),
        });
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMsg('ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ อาจเป็นฟอร์แมตที่ไม่รองรับ');
        setIsProcessing(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Paste from clipboard handler
  const handlePasteClipboard = async () => {
    setErrorMsg(null);
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], `clipboard_image_${Date.now()}.png`, { type: imageType });
          processFile(file);
          return;
        }
      }
      setErrorMsg('ไม่พบรูปภาพในคลิปบอร์ด กรุณาคัดลอกภาพก่อนกดวาง');
    } catch {
      setErrorMsg('เบราว์เซอร์จำกัดการอ่านคลิปบอร์ด กรุณากดปุ่ม Ctrl+V (หรือ Cmd+V) บนหน้าจอเพื่อวางภาพ');
    }
  };

  // Load sample photo
  const handleLoadSample = () => {
    const sampleUri = createSyntheticSampleImageUri();
    setPreviewUrl(sampleUri);
    setPhotoTitle('ภาพหมู่คืนสู่เหย้า 31 คน (ตัวอย่างภาพสังเคราะห์)');
    setPhotoMeta({
      width: 1536,
      height: 959,
      sizeKb: 120,
    });
  };

  // Confirm attach photo
  const handleConfirm = () => {
    if (!previewUrl || !photoMeta) return;

    const newPhoto: PhotoInfo = {
      id: `photo_${Date.now()}`,
      title: photoTitle || 'ภาพถ่ายหมู่',
      url: previewUrl,
      width: photoMeta.width,
      height: photoMeta.height,
      aspectRatio: photoMeta.width / photoMeta.height,
      sourceType: 'uploaded',
    };

    onAttachPhoto(newPhoto, actionOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">แนบภาพถ่ายหมู่ (Attach Photo)</h3>
              <p className="text-[11px] text-slate-400">อัปโหลดภาพกลุ่มหรือภาพกิจกรรมเพื่อเริ่มระบุตัวตนและจัดวางป้าย</p>
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
        <div className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="hidden"
          />

          {/* If image is selected, show preview; otherwise show Dropzone */}
          {previewUrl && photoMeta ? (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950/80 flex items-center justify-center max-h-56">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-56 w-auto object-contain rounded-lg shadow-inner"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setPhotoMeta(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/90 hover:bg-rose-500/80 text-white rounded-lg shadow-md transition-colors text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>เปลี่ยนภาพ</span>
                </button>
              </div>

              {/* Photo Metadata Bar */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <div className="truncate mr-2">
                  <span className="font-semibold text-white block truncate">{photoTitle}</span>
                  <span className="text-[11px] text-slate-400">
                    ความละเอียด: {photoMeta.width} × {photoMeta.height} px
                    {photoMeta.sizeKb ? ` · ${photoMeta.sizeKb} KB` : ''}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono shrink-0">
                  พร้อมใช้งาน
                </span>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl cursor-pointer text-center transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-slate-700 bg-slate-950/60 hover:border-slate-500 hover:bg-slate-950'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">
                  คลิกเพื่อเลือกไฟล์ หรือลากภาพมาวางที่นี่
                </p>
                <p className="text-xs text-slate-400">
                  รองรับไฟล์ JPG, PNG, WEBP, HEIC (ความละเอียดสูง แนะนำ &gt; 1500px)
                </p>
              </div>

              {/* Quick source shortcuts */}
              <div className="flex items-center gap-2 mt-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                >
                  <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>วางจากคลิปบอร์ด</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>ถ่ายภาพ</span>
                </button>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>โหลดภาพตัวอย่าง 31 คน</span>
                </button>
              </div>
            </div>
          )}

          {/* Action options after attaching */}
          {previewUrl && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block">
                ขั้นตอนถัดไปหลังจากแนบภาพ:
              </label>

              <div className="space-y-2">
                <label
                  onClick={() => setActionOption('auto_ai')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    actionOption === 'auto_ai'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="actionOption"
                    checked={actionOption === 'auto_ai'}
                    onChange={() => setActionOption('auto_ai')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ให้ AI วิเคราะห์ค้นหาศีรษะอัตโนมัติทันที (แนะนำ)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      AI จะสแกนหาตำแหน่งบุคคลทุกแถว และสร้างป้ายชื่อตั้งต้นเพื่อให้คุณตรวจสอบและกรอกชื่อ
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setActionOption('keep_markers')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    actionOption === 'keep_markers'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="actionOption"
                    checked={actionOption === 'keep_markers'}
                    onChange={() => setActionOption('keep_markers')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      คงตำแหน่งจุดและรายชื่อเดิมไว้ (สำหรับภาพมุมเดิมหรือความละเอียดใหม่)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      รักษาข้อมูล 31 คนเดิมไว้บนภาพใหม่ โดยใช้พิกัดสัดส่วนเดิม
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setActionOption('clear_markers')}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    actionOption === 'clear_markers'
                      ? 'bg-amber-500/10 border-amber-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950'
                  }`}
                >
                  <input
                    type="radio"
                    name="actionOption"
                    checked={actionOption === 'clear_markers'}
                    onChange={() => setActionOption('clear_markers')}
                    className="mt-0.5 accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      เริ่มภาพใหม่ว่างเปล่า (ระบุจุดด้วยตนเองตั้งแต่คนแรก)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      ล้างรายชื่อเก่าทั้งหมด แล้วเริ่มกำหนดจุดศีรษะใหม่ทีละคนด้วย Shift + คลิก
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleConfirm}
            disabled={!previewUrl || isProcessing}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-3.5 h-3.5" />
            <span>ยืนยันและดำเนินการ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
