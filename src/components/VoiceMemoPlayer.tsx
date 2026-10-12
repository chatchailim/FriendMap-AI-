import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Pause, Trash2, Upload, Volume2, AlertCircle } from 'lucide-react';

interface VoiceMemoPlayerProps {
  voiceMemoUrl?: string;
  voiceMemoDuration?: number;
  personName: string;
  onSaveVoiceMemo: (url: string | undefined, duration?: number) => void;
  disabled?: boolean;
}

export const VoiceMemoPlayer: React.FC<VoiceMemoPlayerProps> = ({
  voiceMemoUrl,
  voiceMemoDuration,
  personName,
  onSaveVoiceMemo,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop playback when unmounting or switching URL
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [voiceMemoUrl]);

  // Audio playback handlers
  const handleTogglePlay = () => {
    if (!voiceMemoUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(voiceMemoUrl);
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          setPlayProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayProgress(0);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        setErrorMessage('ไม่สามารถเล่นไฟล์เสียงได้: ' + err.message);
      });
    }
  };

  // Start recording voice memo
  const handleStartRecording = async () => {
    setErrorMessage(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('เบราว์เซอร์นี้ไม่รองรับการบันทึกเสียงผ่านไมโครโฟน');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          onSaveVoiceMemo(base64Data, recordingSeconds);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Timer counter (max 30 seconds)
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 29) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'กรุณาอนุญาตการเข้าถึงไมโครโฟนในเบราว์เซอร์'
          : 'เกิดข้อผิดพลาดในการเปิดไมโครโฟน: ' + err.message
      );
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Handle uploaded audio file
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('ไฟล์เสียงมีขนาดใหญ่เกิน 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onSaveVoiceMemo(dataUrl, voiceMemoDuration || 10);
    };
    reader.readAsDataURL(file);
  };

  // Delete voice memo
  const handleDeleteMemo = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlayProgress(0);
    onSaveVoiceMemo(undefined, undefined);
  };

  return (
    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>เสียงความทรงจำ / คำทักทาย (Voice Memo)</span>
        </div>
        {voiceMemoUrl && (
          <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 bg-amber-500/10 rounded">
            บันทึกแล้ว
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-[11px] text-rose-300 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording State */}
      {isRecording ? (
        <div className="flex items-center justify-between p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-semibold text-rose-300">
              กำลังบันทึกเสียง... {recordingSeconds}s / 30s
            </span>
          </div>
          <button
            onClick={handleStopRecording}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-medium"
          >
            <Square className="w-3 h-3 fill-white" />
            <span>หยุดบันทึก</span>
          </button>
        </div>
      ) : voiceMemoUrl ? (
        /* Playback State */
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow"
              title={isPlaying ? 'หยุดเล่น' : 'เล่นเสียง'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
            </button>

            {/* Progress Bar */}
            <div className="flex-1 min-w-0">
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-150"
                  style={{ width: `${playProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{isPlaying ? 'กำลังเล่น...' : 'พร้อมเล่น'}</span>
                <span>{voiceMemoDuration ? `${voiceMemoDuration}s` : 'เสียงบันทึก'}</span>
              </div>
            </div>

            {!disabled && (
              <button
                onClick={handleDeleteMemo}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                title="ลบไฟล์เสียงนี้"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Idle / Initial State */
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartRecording}
            disabled={disabled}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>อัดเสียงสั้น (ไมโครโฟน)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
            title="อัปโหลดไฟล์เสียง (.mp3, .wav)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
