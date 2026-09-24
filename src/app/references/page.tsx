'use client';

import React from 'react';
import { FileText, ExternalLink, BookOpen, Layers, FileDown, FileCheck2 } from 'lucide-react';
import { officialReferences } from '@/data/references';

export default function ReferencesPage() {
  const subjectChapters = [
    { chapter: 'Chapter I', title: 'Preamble', page: 'Page 2', detail: 'บทนำและภาพรวม' },
    { chapter: 'Chapter II', title: 'Introduction', page: 'Page 3', detail: 'เป้าหมายการเรียนรู้ K3d, K3s, และ Vagrant' },
    { chapter: 'Chapter III', title: 'General Guidelines', page: 'Page 4', detail: 'ข้อกำหนดทำใน VM, โฟลเดอร์ p1, p2, p3, bonus' },
    { chapter: 'Chapter IV.1', title: 'Part 1: K3s and Vagrant', page: 'Page 6–8', detail: '2 VMs, Dedicated IP .110/.111, Hostname wilS/wilSW, Passwordless SSH, K3s Server & Agent' },
    { chapter: 'Chapter IV.2', title: 'Part 2: K3s and 3 Simple Applications', page: 'Page 9–11', detail: '1 VM, 3 Apps, Ingress app1.com/app2.com, app3 default fallback, app2 3 replicas' },
    { chapter: 'Chapter IV.3', title: 'Part 3: K3d and Argo CD', page: 'Page 12–16', detail: 'K3d without Vagrant, Docker, install script, argocd/dev namespaces, GitHub repo, v1/v2 demo' },
    { chapter: 'Chapter V', title: 'Bonus Part', page: 'Page 16', detail: 'Local GitLab latest version, gitlab namespace, workflow Part 3 ผ่าน local GitLab, โฟลเดอร์ bonus/' },
    { chapter: 'Chapter VI', title: 'Submission and Peer-Evaluation', page: 'Page 17–18', detail: 'โครงสร้างไดเรกทอรี p1, p2, p3, bonus และ scripts/, confs/ ภายในแต่ละโฟลเดอร์' }
  ];

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <FileText className="h-4 w-4" />
          <span>Source Documents & Citations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          เอกสารอ้างอิงและคู่มือทางการ (References)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          รวบรวมแหล่งข้อมูลอ้างอิงทางการ S1–S21 จาก Learning Plan และข้อกำหนดในเอกสาร Subject Version 4.0
        </p>
      </div>

      {/* Official PDF Documents */}
      <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-emerald-900 dark:text-emerald-300">
          <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>ไฟล์เอกสารทางการฉบับสมบูรณ์ (Official 42 PDF Documents)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          สามารถเปิดอ่านหรือดาวน์โหลดไฟล์ PDF ต้นฉบับจากระบบ Intra ของ 42 เพื่อใช้ตรวจสอบคู่ขนานกับบทเรียน:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* en.subject.pdf */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" />
                  <span>en.subject.pdf</span>
                </span>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Version 4.0 (2.2 MB)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                เอกสารโจทย์โครงการทางการ (18 หน้า) ระบุเป้าหมาย สถาปัตยกรรม และข้อกำหนดของ Part 1, 2, 3, Bonus และ Submission
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href="/en.subject.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>เปิดดูในแท็บใหม่</span>
              </a>
              <a
                href="/en.subject.pdf"
                download="en.subject.pdf"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                title="ดาวน์โหลดไฟล์"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>ดาวน์โหลด</span>
              </a>
            </div>
          </div>

          {/* eval.pdf */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-purple-500" />
                  <span>eval.pdf</span>
                </span>
                <span className="rounded bg-purple-100 dark:bg-purple-950 px-2 py-0.5 text-[11px] font-mono text-purple-800 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                  Scale Sheet (210 KB)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ใบตรวจคะแนนจริงสำหรับ Peer Evaluation จากระบบ Intra กำหนดลำดับคำสั่งที่ผู้ตรวจจะพิมพ์ทดสอบและเงื่อนไขการให้คะแนน
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href="/eval.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>เปิดดูในแท็บใหม่</span>
              </a>
              <a
                href="/eval.pdf"
                download="eval.pdf"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                title="ดาวน์โหลดไฟล์"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span>ดาวน์โหลด</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Version 4.0 Overview Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-slate-100">
          <Layers className="h-5 w-5 text-emerald-500" />
          <span>โครงสร้างเอกสาร Subject (Inception-of-Things Version 4.0)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          เอกสารทางการของโรงเรียน 42 ใช้สำหรับประเมินผลโครงการจริง สามารถอ้างอิงแต่ละส่วนได้ดังนี้:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subjectChapters.map((sc) => (
            <div
              key={sc.chapter}
              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-3.5 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">{sc.chapter}: {sc.title}</span>
                <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  {sc.page}
                </span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                {sc.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official External References (S1 to S21) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100">
          <BookOpen className="h-5 w-5 text-sky-500" />
          <span>เอกสารทางการอ่านประกอบตามบท (S1–S21)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          ลิงก์ไปยัง Documentation ทางการของเครื่องมือแต่ละตัว พร้อมคำอธิบายว่าควรอ่านส่วนใดเพื่อขยายความรู้
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialReferences.map((ref) => (
            <div
              key={ref.sourceId}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-sky-500/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-sky-50 dark:bg-sky-950 font-mono text-[11px] font-bold text-sky-700 dark:text-sky-400 px-2 py-0.5 border border-sky-200 dark:border-sky-800">
                    {ref.sourceId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{ref.section}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {ref.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ref.description}
                </p>
              </div>

              {ref.url && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <span>เปิดเอกสารทางการ</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
