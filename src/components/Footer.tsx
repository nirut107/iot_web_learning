import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, HardDrive, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Layers className="h-4 w-4 text-emerald-500" />
              <span>Inception-of-Things (IoT) Learning & Tracking App</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
              แอปพลิเคชันสำหรับเรียนรู้และติดตามการทำโปรเจกต์ Inception-of-Things ให้ครบตั้งแต่พื้นฐานจนถึง
              Mandatory Part 1–3 และ Bonus GitLab ตามเอกสาร Subject Version 4.0
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg p-2.5 max-w-md">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                <strong>ข้อชี้แจง:</strong> แอปนี้เป็นเครื่องมือเรียนรู้ด้วยตนเอง การผ่าน checklist ในแอปไม่ได้การันตีผลการประเมินจริงของโรงเรียน 42
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">ทางลัดการเรียนรู้</div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/modules" className="hover:text-emerald-500 transition-colors">
                  แผนการเรียน 15 บท
                </Link>
              </li>
              <li>
                <Link href="/checklist" className="hover:text-emerald-500 transition-colors">
                  Checklist ตรวจข้อกำหนดโจทย์
                </Link>
              </li>
              <li>
                <Link href="/troubleshooting" className="hover:text-emerald-500 transition-colors">
                  แนวทางแก้ไขปัญหา (Troubleshooting)
                </Link>
              </li>
              <li>
                <Link href="/defense" className="hover:text-emerald-500 transition-colors">
                  คลังคำถามซ้อมสอบ Defense
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Reference & Local Storage */}
          <div className="space-y-2">
            <div className="font-semibold text-slate-800 dark:text-slate-200">เอกสาร & ข้อมูลในเครื่อง</div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/references" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                  <span>เอกสารอ้างอิงทางการ (S1–S21)</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-emerald-500 transition-colors">
                  พจนานุกรมคำศัพท์ (Glossary)
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  <span>ส่งออก / สำรองความคืบหน้า (JSON)</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            อ้างอิงเอกสาร: <strong>Inception-of-Things Subject Version 4.0</strong> และ <strong>Learning Plan (TH)</strong>
          </div>
          <div>
            ข้อมูลความคืบหน้าและโน้ตทั้งหมดถูกจัดเก็บบน <code>localStorage</code> ของเบราว์เซอร์นี้
          </div>
        </div>
      </div>
    </footer>
  );
}
