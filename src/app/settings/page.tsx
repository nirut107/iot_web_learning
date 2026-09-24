'use client';

import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Moon,
  Sun,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useTheme } from '@/context/ThemeContext';
import { copyToClipboard } from '@/lib/clipboard';

export default function SettingsPage() {
  const {
    progress,
    exportProgressJSON,
    importProgressJSON,
    resetProgress,
    completedLessonsCount,
    totalLessonsCount
  } = useProgress();
  const { theme, setTheme } = useTheme();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleExportDownload = () => {
    const jsonStr = exportProgressJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iot-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCopy = async () => {
    const jsonStr = exportProgressJSON();
    const ok = await copyToClipboard(jsonStr);
    if (ok) {
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 2000);
    }
  };

  const handleImportSubmit = () => {
    setImportStatus(null);
    if (!importText.trim()) {
      setImportStatus({ success: false, message: 'กรุณาวางข้อความ JSON ก่อนกดยืนยัน' });
      return;
    }
    const res = importProgressJSON(importText);
    setImportStatus(res);
    if (res.success) {
      setImportText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
        const res = importProgressJSON(content);
        setImportStatus(res);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setImportStatus({ success: true, message: 'ล้างข้อมูลความคืบหน้าทั้งหมดเรียบร้อยแล้ว' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Settings className="h-4 w-4" />
          <span>Preferences & Data Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          การตั้งค่าและสำรองความคืบหน้า (Settings)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          จัดการข้อมูลการเรียนรู้ ส่งออก/นำเข้าไฟล์ JSON เพื่อย้ายเบราว์เซอร์ และตั้งค่าธีมการแสดงผล
        </p>
      </div>

      {/* Local Storage Privacy Explanation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
          <HardDrive className="h-4 w-4 text-emerald-500" />
          <span>การจัดเก็บข้อมูลในเครื่อง (Local Storage Persistence)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          แอปพลิเคชันนี้ทำงานแบบ <strong>Client-side 100%</strong> ข้อมูลความคืบหน้า รายการที่ติ๊ก และโน้ตส่วนตัวของคุณจะถูกจัดเก็บไว้บน <code>localStorage</code> ภายในเบราว์เซอร์นี้เท่านั้น ไม่มีการส่งข้อมูลใดๆ ไปยังเซิร์ฟเวอร์ภายนอก หากต้องการย้ายเครื่องหรือเปลี่ยนเบราว์เซอร์ แนะนำให้ส่งออกไฟล์ JSON เพื่อสำรองข้อมูล
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-center border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {progress.checkedLearningItemIds.length}
            </div>
            <div className="text-[11px] text-slate-500">Checklist ที่ติ๊กแล้ว</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-center border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {Object.values(progress.requirementStates).filter((s) => s === 'verified').length}
            </div>
            <div className="text-[11px] text-slate-500">โจทย์ที่ Verified</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-center border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {Object.keys(progress.notes).length}
            </div>
            <div className="text-[11px] text-slate-500">โน้ตที่บันทึกไว้</div>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-center border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {completedLessonsCount}/{totalLessonsCount}
            </div>
            <div className="text-[11px] text-slate-500">บทที่เรียนจบ</div>
          </div>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          ธีมการแสดงผล (Appearance)
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>โหมดสว่าง (Light)</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="h-4 w-4 text-sky-400" />
            <span>โหมดมืด (Dark)</span>
          </button>
        </div>
      </div>

      {/* Export / Backup Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            ส่งออกความคืบหน้า (Export Progress)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ดาวน์โหลดไฟล์ JSON บันทึกสถานะ checklist, โน้ต, และบทเรียนที่เปิดล่าสุด เพื่อนำไปเปิดในเครื่องอื่น
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportDownload}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>ดาวน์โหลดไฟล์ JSON</span>
          </button>
          <button
            onClick={handleExportCopy}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>{copiedExport ? 'คัดลอกลงคลิปบอร์ดแล้ว!' : 'คัดลอก JSON ไปยังคลิปบอร์ด'}</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div>
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            นำเข้าความคืบหน้า (Import Progress)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เลือกไฟล์ JSON หรือวางข้อความ JSON ที่เคยสำรองไว้เพื่อกู้คืนสถานะ
          </p>
        </div>

        {importStatus && (
          <div
            className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>เลือกไฟล์ .json จากเครื่อง</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="หรือวางข้อความ JSON ที่นี่เพื่อกู้คืน..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />

          <div className="flex justify-end">
            <button
              onClick={handleImportSubmit}
              className="rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-4 py-2 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ยืนยันการนำเข้า
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset */}
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 p-5 shadow-sm space-y-4">
        <div>
          <h2 className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>พื้นที่อันตราย: ล้างข้อมูลความคืบหน้า (Reset Progress)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            การสั่งล้างข้อมูลจะยกเลิก checklist และโน้ตทั้งหมดที่บันทึกไว้ในเบราว์เซอร์นี้
          </p>
        </div>

        {showResetConfirm ? (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 p-4 space-y-3 text-xs">
            <p className="text-rose-900 dark:text-rose-200 font-medium">
              คุณแน่ใจหรือไม่ว่าต้องการล้างความคืบหน้าทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้ (แนะนำให้ก๊อปปี้หรือดาวน์โหลดไฟล์ JSON สำรองไว้ก่อน)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 transition-colors cursor-pointer"
              >
                ยืนยันการล้างข้อมูลทันที
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-700 dark:text-rose-400 text-xs font-semibold px-4 py-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>ล้างความคืบหน้าทั้งหมดกลับสู่ค่าเริ่มต้น</span>
          </button>
        )}
      </div>
    </div>
  );
}
