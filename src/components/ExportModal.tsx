import React, { useState, useMemo } from 'react';
import {
  Download,
  Upload,
  Copy,
  Check,
  FileJson,
  FileText,
  Printer,
  Image as ImageIcon,
  Shield,
  X,
  Users,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { FriendMapProject, Person } from '../types/friendmap';

interface ExportModalProps {
  project: FriendMapProject;
  isOpen: boolean;
  onClose: () => void;
  onImportData: (data: any) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
  onImportData,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'md' | 'pdf' | 'image'>('json');
  const [copied, setCopied] = useState<boolean>(false);
  const [excludePrivateContacts, setExcludePrivateContacts] = useState<boolean>(true);
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);

  // Derive base filename from image title (e.g. 32980304_10214774071859417_974758122205741056_n)
  const baseFileName = useMemo(() => {
    const raw = (project.photo.title || '').replace(/\.[^/.]+$/, '').trim();
    return raw || '32980304_10214774071859417_974758122205741056_n';
  }, [project.photo.title]);

  if (!isOpen) return null;

  // Prepare sanitized JSON payload
  const preparedPeople = project.people.map((p) => {
    if (excludePrivateContacts) {
      return {
        ...p,
        contact: { phone: '', email: '', lineId: '', social: '' },
      };
    }
    return p;
  });

  const exportPayload = {
    version: '1.0.0',
    exportType: 'friendmap_photo_metadata',
    exportedAt: new Date().toISOString(),
    photoMetadata: {
      id: project.photo.id || baseFileName,
      fileName: project.photo.fileName || `${baseFileName}.jpg`,
      title: project.photo.title || baseFileName,
      width: project.photo.width,
      height: project.photo.height,
      aspectRatio: project.photo.aspectRatio,
      fileSizeBytes: project.photo.fileSizeBytes,
      mimeType: project.photo.mimeType || 'image/jpeg',
      capturedDate: project.photo.capturedDate || '2026-10-11',
      locationName: project.photo.locationName,
      cameraInfo: project.photo.cameraInfo,
      depthLayers: project.photo.depthLayers || 3,
      notes: project.photo.notes,
    },
    statistics: {
      totalPeople: project.people.length,
      reviewedCount: project.people.filter((p) => p.reviewed).length,
      unreviewedCount: project.people.filter((p) => !p.reviewed).length,
      rowsCount: 3,
    },
    settings: project.settings,
    people: preparedPeople,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  // Generate Markdown report
  const markdownString = useMemo(() => {
    const reviewedCount = project.people.filter((p) => p.reviewed).length;
    const totalCount = project.people.length;

    let md = `# FriendMap AI — บัญชีรายชื่อบุคคลในภาพถ่ายหมู่ (${baseFileName})\n\n`;
    md += `- **ชื่อไฟล์ภาพต้นฉบับ:** \`${baseFileName}.jpg\`\n`;
    md += `- **ความละเอียดภาพ:** ${project.photo.width} × ${project.photo.height} พิกเซล\n`;
    md += `- **จำนวนบุคคลที่ตรวจพบ/บันทึก:** ${totalCount} คน\n`;
    md += `- **สถานะการตรวจทาน:** ตรวจทานแล้ว ${reviewedCount} คน / รอตรวจทาน ${totalCount - reviewedCount} คน\n`;
    md += `- **โหมดความเป็นส่วนตัว:** ${excludePrivateContacts ? 'เปิดใช้งาน (ซ่อนข้อมูลติดต่อ)' : 'ปิดใช้งาน (แสดงข้อมูลติดต่อ)'}\n`;
    md += `- **วันที่ส่งออกเอกสาร:** ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n`;
    md += `---\n\n`;

    md += `## 1. สรุปการจัดวางบุคคลตามระดับความลึกของแถว\n\n`;
    const backRow = project.people.filter((p) => p.groupTag?.includes('หลัง') || p.depthRow === 'back_standing');
    const midRow = project.people.filter((p) => p.groupTag?.includes('กลาง') || p.depthRow === 'middle_standing');
    const frontRow = project.people.filter((p) => p.groupTag?.includes('หน้า') || p.depthRow === 'front_seated');

    md += `- **แถวยืนหลังสุด (Back Standing Row):** ${backRow.length} คน (รหัส: ${backRow.map((p) => p.id).join(', ')})\n`;
    md += `- **แถวกลาง (Middle Row):** ${midRow.length} คน (รหัส: ${midRow.map((p) => p.id).join(', ')})\n`;
    md += `- **แถวนั่งและคุกเข่าด้านหน้า (Front Seated & Kneeling Row):** ${frontRow.length} คน (รหัส: ${frontRow.map((p) => p.id).join(', ')})\n\n`;
    md += `---\n\n`;

    md += `## 2. ตารางรายชื่อบุคคลทั้งหมด (Directory Table)\n\n`;
    md += `| ลำดับ | รหัส | ชื่อเล่น | ชื่อ-นามสกุล | แถว/กลุ่ม | ลักษณะเด่นในภาพ | ข้อมูลติดต่อ | พิกัดศีรษะ (x, y) | ตรวจทาน |\n`;
    md += `|:---:|:---:|:---|:---|:---|:---|:---|:---:|:---:|\n`;

    project.people.forEach((p, idx) => {
      const contactStr = excludePrivateContacts
        ? '*(ซ่อนตาม PDPA)*'
        : [p.contact.phone, p.contact.lineId ? `LINE: ${p.contact.lineId}` : '', p.contact.email].filter(Boolean).join(' · ') || '-';
      md += `| ${idx + 1} | **${p.id}** | ${p.nickname || '-'} | ${p.name || '-'} | ${p.groupTag || '-'} | ${p.visualHint || '-'} | ${contactStr} | (${p.head.x.toFixed(3)}, ${p.head.y.toFixed(3)}) | ${p.reviewed ? '✅ ตรวจแล้ว' : '⏳ รอตรวจ'} |\n`;
    });

    md += `\n---\n\n## 3. รายละเอียดบุคคลแยกรายคน (Individual Profiles)\n\n`;
    project.people.forEach((p) => {
      md += `### [${p.id}] ${p.nickname ? `${p.nickname} — ` : ''}${p.name || 'ยังไม่ระบุชื่อ'}\n`;
      md += `- **กลุ่ม/แถว:** ${p.groupTag || 'ไม่ระบุ'}\n`;
      if (p.visualHint) md += `- **ลักษณะในภาพ:** ${p.visualHint}\n`;
      if (!excludePrivateContacts) {
        if (p.contact.phone) md += `- **โทรศัพท์:** ${p.contact.phone}\n`;
        if (p.contact.email) md += `- **อีเมล:** ${p.contact.email}\n`;
        if (p.contact.lineId) md += `- **LINE ID:** ${p.contact.lineId}\n`;
      }
      if (p.notes) md += `- **บันทึก:** ${p.notes}\n`;
      md += `- **พิกัดศีรษะ:** \`x: ${p.head.x}, y: ${p.head.y}, radius: ${p.head.radius}\`\n`;
      md += `- **ตำแหน่งป้ายบอลลูน:** \`dx: ${p.label.dx}, dy: ${p.label.dy}\` (${p.label.locked ? 'ล็อกตำแหน่งแล้ว' : 'ปรับอัตโนมัติ'})\n`;
      md += `- **สถานะการตรวจทาน:** ${p.reviewed ? 'ตรวจทานเรียบร้อยแล้ว' : 'ยังไม่ได้ตรวจทาน'}\n\n`;
    });

    md += `---\n*เอกสารนี้สร้างโดยระบบ FriendMap AI (Photo People Mapper & Interactive Name Balloon System)*\n`;
    return md;
  }, [project, baseFileName, excludePrivateContacts]);

  // Copy text helper
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Download JSON file with image-matching name
  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseFileName}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Download Markdown file with image-matching name
  const handleDownloadMD = () => {
    const blob = new Blob([markdownString], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseFileName}.md`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Trigger Print to PDF via hidden iframe (safe in iframes, no popup blocking)
  const handlePrintPDF = () => {
    const reviewedCount = project.people.filter((p) => p.reviewed).length;
    const totalCount = project.people.length;

    const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <title>${baseFileName} — FriendMap AI</title>
  <style>
    @page { size: A4; margin: 15mm 12mm; }
    body { font-family: 'Prompt', 'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 11pt; line-height: 1.4; }
    h1 { font-size: 16pt; margin: 0 0 4px 0; color: #0f172a; }
    .subtitle { font-size: 10pt; color: #64748b; margin-bottom: 12px; }
    .kpi-row { display: flex; gap: 12px; margin-bottom: 16px; }
    .kpi-card { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; }
    .kpi-num { font-size: 14pt; font-weight: bold; color: #0284c7; }
    .kpi-label { font-size: 9pt; color: #64748b; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
    th { background: #0f172a; color: #ffffff; font-weight: 600; text-align: left; padding: 6px 8px; border: 1px solid #0f172a; }
    td { padding: 5px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background: #f8fafc; }
    .badge { display: inline-block; padding: 1px 5px; border-radius: 4px; font-size: 8.5pt; font-weight: 600; font-family: monospace; }
    .badge-id { background: #e0f2fe; color: #0369a1; }
    .badge-ok { background: #dcfce7; color: #15803d; }
    .badge-wait { background: #fef3c7; color: #b45309; }
    .footer { margin-top: 20px; font-size: 8.5pt; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <h1>FriendMap AI — ทะเบียนรายชื่อบุคคลในภาพถ่ายหมู่</h1>
  <div class="subtitle">
    ชื่อไฟล์ภาพ: <strong>${baseFileName}.jpg</strong> · ขนาดภาพ: ${project.photo.width}×${project.photo.height} px · วันที่: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-num">${totalCount} คน</div>
      <div class="kpi-label">บุคคลทั้งหมดที่ตรวจพบ</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #16a34a;">${reviewedCount} คน</div>
      <div class="kpi-label">ตรวจทานและยืนยันแล้ว</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #d97706;">${totalCount - reviewedCount} คน</div>
      <div class="kpi-label">รอการตรวจทาน</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #475569;">3 ระดับ</div>
      <div class="kpi-label">ความลึก (ยืนหลัง / กลาง / นั่งหน้า)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">ที่</th>
        <th style="width: 55px; text-align: center;">รหัส</th>
        <th style="width: 90px;">ชื่อเล่น</th>
        <th style="width: 140px;">ชื่อ-นามสกุล</th>
        <th style="width: 85px;">แถว/กลุ่ม</th>
        <th>ลักษณะเด่นในภาพ</th>
        <th style="width: 130px;">ข้อมูลติดต่อ</th>
        <th style="width: 65px; text-align: center;">สถานะ</th>
      </tr>
    </thead>
    <tbody>
      ${project.people
        .map(
          (p, i) => `
        <tr>
          <td style="text-align: center; color: #64748b;">${i + 1}</td>
          <td style="text-align: center;"><span class="badge badge-id">${p.id}</span></td>
          <td><strong>${p.nickname || '-'}</strong></td>
          <td>${p.name || '-'}</td>
          <td>${p.groupTag || '-'}</td>
          <td>${p.visualHint || '-'}</td>
          <td>${
            excludePrivateContacts
              ? '<span style="color:#94a3b8; font-size:8pt;">(ซ่อนตาม PDPA)</span>'
              : [p.contact.phone, p.contact.lineId ? `LINE: ${p.contact.lineId}` : '', p.contact.email].filter(Boolean).join('<br>') || '-'
          }</td>
          <td style="text-align: center;">
            <span class="badge ${p.reviewed ? 'badge-ok' : 'badge-wait'}">
              ${p.reviewed ? 'ตรวจแล้ว' : 'รอตรวจ'}
            </span>
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    จัดทำโดย FriendMap AI · เอกสารทะเบียนบุคคล OneVault / OneManOS Ready
  </div>
</body>
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }, 500);
    }
  };

  // Import JSON file (supports PhotoMetadataJSON and standard people list)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (parsed.photoMetadata && Array.isArray(parsed.people)) {
        onImportData(parsed);
        onClose();
        return;
      }

      if (Array.isArray(parsed.people)) {
        onImportData(parsed.people);
        onClose();
        return;
      }

      if (Array.isArray(parsed)) {
        onImportData(parsed);
        onClose();
        return;
      }

      throw new Error('โครงสร้าง JSON ไม่ถูกต้อง: ขาดคุณสมบัติ people[] หรือ photoMetadata');
    } catch (err: any) {
      alert(`ไม่สามารถนำเข้าไฟล์ได้: ${err.message}`);
    }
  };

  // Render & Export High-Res Annotated PNG
  const handleExportPNG = async () => {
    setIsExportingImage(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = project.photo.url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      const W = img.naturalWidth || 1536;
      const H = img.naturalHeight || 959;
      canvas.width = W;
      canvas.height = H;

      // 1. Draw base photo
      ctx.drawImage(img, 0, 0, W, H);

      // 2. Draw leader lines
      for (const p of project.people) {
        if (!p.label.visible) continue;
        const x1 = p.head.x * W;
        const y1 = p.head.y * H;
        const x2 = (p.head.x + p.label.dx) * W;
        const y2 = (p.head.y + p.label.dy) * H;

        ctx.beginPath();
        ctx.strokeStyle = p.reviewed ? '#facc15' : '#94a3b8';
        ctx.lineWidth = Math.max(2, W * 0.002);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#f59e0b';
        ctx.arc(x1, y1, Math.max(4, W * 0.0035), 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }

      // 3. Draw balloons
      for (const p of project.people) {
        if (!p.label.visible) continue;
        const bx = (p.head.x + p.label.dx) * W;
        const by = (p.head.y + p.label.dy) * H;

        const text = p.nickname
          ? `${p.id}: ${p.nickname}`
          : p.name
          ? `${p.id}: ${p.name}`
          : p.id;

        const fontSize = Math.max(14, Math.round(W * 0.011));
        ctx.font = `600 ${fontSize}px sans-serif`;
        const textMetrics = ctx.measureText(text);
        const padX = fontSize * 0.8;
        const padY = fontSize * 0.45;
        const bubbleW = textMetrics.width + padX * 2;
        const bubbleH = fontSize + padY * 2;

        const rx = bx - bubbleW / 2;
        const ry = by - bubbleH / 2;

        ctx.beginPath();
        ctx.roundRect(rx, ry, bubbleW, bubbleH, bubbleH / 2);
        ctx.fillStyle = p.reviewed ? '#fef08a' : '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(text, bx, by);
      }

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${baseFileName}-annotated.png`;
      a.click();
    } catch (err: any) {
      alert(`ไม่สามารถบันทึกรูปภาพได้: ${err.message}`);
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">ส่งออกและนำเสนอข้อมูล (Export & Presentation)</h3>
              <p className="text-[11px] text-slate-400">
                ชื่อไฟล์เป้าหมาย: <code className="text-amber-300 font-mono">{baseFileName}.*</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs: JSON, Markdown, PDF, PNG */}
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>ไฟล์ JSON (.json)</span>
          </button>

          <button
            onClick={() => setActiveTab('md')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'md'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>รายงาน Markdown (.md)</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'pdf'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์และบันทึก PDF (.pdf)</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'image'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ภาพพร้อมป้าย (PNG)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Privacy Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <input
              type="checkbox"
              checked={excludePrivateContacts}
              onChange={(e) => setExcludePrivateContacts(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded mt-0.5"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                โหมดปกป้องความเป็นส่วนตัว (Private-by-default)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ตัดเบอร์โทรศัพท์และ LINE ID ออกจากไฟล์ส่งออก เพื่อความปลอดภัยตามมาตรฐาน PDPA
              </p>
            </div>
          </label>

          {/* TAB 1: JSON */}
          {activeTab === 'json' && (
            <>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono text-amber-300">{baseFileName}.json ({project.people.length} บุคคล)</span>
                  <button
                    onClick={() => handleCopy(jsonString)}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={9}
                  value={jsonString}
                  className="w-full p-3 font-mono text-[11px] bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none select-all"
                />
              </div>

              {/* Import Section */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">นำเข้าข้อมูล JSON</span>
                  <span className="text-[11px] text-slate-400">อัปโหลดไฟล์ JSON ที่ตรงกับภาพเพื่อเปิดงานต่อ</span>
                </div>
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-700">
                  <Upload className="w-3.5 h-3.5" />
                  <span>เลือกไฟล์ JSON</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          )}

          {/* TAB 2: MARKDOWN (.md) */}
          {activeTab === 'md' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-amber-300">{baseFileName}.md (รายงานพร้อมตารางสรุป)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(markdownString)}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกเนื้อหา MD'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMD}
                    className="flex items-center gap-1 text-[11px] text-slate-950 font-semibold bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด .md</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={11}
                value={markdownString}
                className="w-full p-3 font-mono text-[11px] bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none select-all"
              />
            </div>
          )}

          {/* TAB 3: PDF PRINT */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">พิมพ์หรือบันทึกเป็นไฟล์ PDF ทางการ</h4>
                  <p className="text-[11px] text-slate-400">
                    เอกสารจัดรูปแบบตารางสรุป 31 คน พร้อมหมายเลขกำกับ, สถิติแยกตามแถว, และสัญลักษณ์สถานะตรวจทาน
                  </p>
                </div>
                <button
                  onClick={handlePrintPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ / บันทึก PDF ตอนนี้</span>
                </button>
              </div>

              {/* Print Preview Table Mockup */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-2 max-h-56 overflow-y-auto">
                <div className="font-semibold text-amber-300 border-b border-slate-800 pb-1 flex justify-between">
                  <span>ตัวอย่างตารางในเอกสาร PDF ({project.people.length} รายการ)</span>
                  <span className="font-mono text-slate-500">{baseFileName}.pdf</span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {project.people.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-1.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 text-[10px]">{p.id}</span>
                        <span className="font-medium text-white">{p.nickname || p.name || '-'}</span>
                        <span className="text-slate-400 text-[10px]">({p.groupTag || 'ทั่วไป'})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{p.visualHint || '-'}</span>
                    </div>
                  ))}
                  <div className="py-1 text-center text-slate-500 text-[10px]">
                    ... และอีก {project.people.length - 5} คนในเอกสารฉบับเต็ม ...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PNG IMAGE */}
          {activeTab === 'image' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">บันทึกเป็นภาพ PNG พร้อมป้ายชื่อ</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  รวมภาพถ่ายต้นฉบับ เส้นชี้ศีรษะ และบอลลูนชื่อ เป็นรูปภาพรูปเดียว ชื่อไฟล์: <code className="text-amber-300 font-mono">{baseFileName}-annotated.png</code>
                </p>
              </div>

              <button
                onClick={handleExportPNG}
                disabled={isExportingImage}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingImage ? 'กำลังประมวลผลภาพ...' : 'ดาวน์โหลดภาพ PNG'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {baseFileName}
          </span>
          {activeTab === 'json' && (
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด {baseFileName}.json</span>
            </button>
          )}
          {activeTab === 'md' && (
            <button
              onClick={handleDownloadMD}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด {baseFileName}.md</span>
            </button>
          )}
          {activeTab === 'pdf' && (
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>เปิดหน้าต่างพิมพ์ PDF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
