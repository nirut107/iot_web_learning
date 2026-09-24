'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Search,
  Layers,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { troubleshootingData } from '@/data/troubleshooting';
import { getLessonById } from '@/data/lessons';

function TroubleshootingContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('id');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [targetId]);

  const categories = [
    { key: 'ALL', label: 'ทั้งหมด' },
    { key: 'Vagrant/VM', label: 'Vagrant & VM' },
    { key: 'K3s/Network', label: 'K3s & Network' },
    { key: 'Ingress/Routing', label: 'Ingress & Routing' },
    { key: 'K3d/Docker', label: 'K3d & Docker' },
    { key: 'ArgoCD/Git', label: 'Argo CD & Git' },
    { key: 'GitLab/Storage', label: 'GitLab & Storage' }
  ];

  const filteredItems = useMemo(() => {
    return troubleshootingData.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesSymptom = item.symptom.toLowerCase().includes(q);
        const matchesFix = item.fix.toLowerCase().includes(q);
        const matchesCauses = item.possibleCauses.some((c) => c.toLowerCase().includes(q));
        if (!matchesSymptom && !matchesFix && !matchesCauses) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <Wrench className="h-4 w-4" />
          <span>Diagnostic & Incident Response</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          คู่มือแก้ไขปัญหา (Troubleshooting Matrix)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          รวมอาการเสียและกับดักยอดฮิตของโปรเจกต์ IoT ตั้งแต่ Vagrant, K3s Network, Ingress Fallback จนถึง GitLab OOM
        </p>
      </div>

      {/* Layered Troubleshooting Methodology Banner */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-3">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
          <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>หลักการสืบค้นปัญหา 5 เลเยอร์ (จากล่างขึ้นบน)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-amber-200 dark:border-amber-900/60">
            <div className="font-bold text-slate-900 dark:text-slate-100">Layer 1: VM / OS</div>
            <div className="text-[11px] text-slate-500 mt-1">RAM เต็มไหม? systemd k3s รันอยู่ไหม?</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-amber-200 dark:border-amber-900/60">
            <div className="font-bold text-slate-900 dark:text-slate-100">Layer 2: K8s Node / CNI</div>
            <div className="text-[11px] text-slate-500 mt-1">Node Ready ไหม? Flannel ผูกถูก IP ไหม?</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-amber-200 dark:border-amber-900/60">
            <div className="font-bold text-slate-900 dark:text-slate-100">Layer 3: Pods</div>
            <div className="text-[11px] text-slate-500 mt-1">Pod Running หรือ CrashLoopBackOff?</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-amber-200 dark:border-amber-900/60">
            <div className="font-bold text-slate-900 dark:text-slate-100">Layer 4: Service / Ingress</div>
            <div className="text-[11px] text-slate-500 mt-1">Endpoints มี Pod IP ไหม? Host Header ตรงไหม?</div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-900 p-3 border border-amber-200 dark:border-amber-900/60">
            <div className="font-bold text-slate-900 dark:text-slate-100">Layer 5: App Logic</div>
            <div className="text-[11px] text-slate-500 mt-1">แอปตอบ JSON ถูกพอร์ต 8888 ไหม?</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                selectedCategory === c.key
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามอาการ หรือคำสั่ง..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Troubleshooting Cards List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 text-sm">
            ไม่พบรายการปัญหาที่ตรงกับคำค้นหา
          </div>
        ) : (
          filteredItems.map((item) => {
            const lesson = item.lessonId ? getLessonById(item.lessonId) : undefined;
            return (
              <div
                key={item.id}
                id={item.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4 hover:border-amber-400/50 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                      {item.id}
                    </span>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{item.stage}</span>
                  </div>

                  {lesson && (
                    <Link
                      href={`/modules/${lesson.moduleId}/${lesson.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>อ่านในบทเรียน: {lesson.title}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                {/* Symptom */}
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    อาการที่พบ: {item.symptom}
                  </h3>
                </div>

                {/* Causes & Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3.5 space-y-1.5 border border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      สาเหตุที่เป็นไปได้:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                      {item.possibleCauses.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 p-3.5 space-y-1.5 border border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-sky-500" />
                      <span>วิธีตรวจพิสูจน์ (Verification):</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px] leading-relaxed">
                      {item.verification}
                    </p>
                  </div>
                </div>

                {/* Fix */}
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 text-xs space-y-1">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>แนวทางแก้ไขปัญหา (Fix & Solution):</span>
                  </div>
                  <div className="text-emerald-950 dark:text-emerald-200 pl-5 leading-relaxed font-mono">
                    {item.fix}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function TroubleshootingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">กำลังโหลด Troubleshooting...</div>}>
      <TroubleshootingContent />
    </Suspense>
  );
}
