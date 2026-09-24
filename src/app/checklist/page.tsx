'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckSquare,
  Filter,
  Layers,
  Award,
  AlertCircle,
  HelpCircle,
  Search,
  CheckCircle2,
  Clock,
  Circle
} from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { requirementsData } from '@/data/requirements';
import { RequirementStage, RequirementStatus } from '@/types/curriculum';
import { RequirementCard } from '@/components/RequirementCard';
import { ProgressBar } from '@/components/ProgressBar';

function ChecklistContent() {
  const searchParams = useSearchParams();
  const targetReqId = searchParams.get('req');

  const {
    mandatoryProgressPercent,
    bonusProgressPercent,
    statsByStage,
    getRequirementStatus
  } = useProgress();

  const [selectedStage, setSelectedStage] = useState<RequirementStage | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'IN_PROGRESS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to targeted requirement if requested via query param
  useEffect(() => {
    if (targetReqId) {
      setTimeout(() => {
        const el = document.getElementById(targetReqId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [targetReqId]);

  const stages: { key: RequirementStage | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'ทั้งหมด' },
    { key: 'General', label: 'General' },
    { key: 'P1', label: 'Part 1 (K3s)' },
    { key: 'P2', label: 'Part 2 (Apps)' },
    { key: 'P3', label: 'Part 3 (Argo CD)' },
    { key: 'Bonus', label: 'Bonus (GitLab)' },
    { key: 'Submission', label: 'Submission' }
  ];

  const filteredRequirements = useMemo(() => {
    return requirementsData.filter((req) => {
      // Stage filter
      if (selectedStage !== 'ALL' && req.stage !== selectedStage) {
        return false;
      }

      // Status filter
      const status = getRequirementStatus(req.id);
      if (selectedStatusFilter === 'PENDING') {
        if (status === 'verified' || status === 'not-applicable') return false;
      } else if (selectedStatusFilter === 'VERIFIED') {
        if (status !== 'verified') return false;
      } else if (selectedStatusFilter === 'IN_PROGRESS') {
        if (status !== 'in-progress') return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesDetail = req.detail.toLowerCase().includes(q);
        const matchesVerif = req.verification.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesDetail && !matchesVerif) {
          return false;
        }
      }

      return true;
    });
  }, [selectedStage, selectedStatusFilter, searchQuery, getRequirementStatus]);

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <CheckSquare className="h-4 w-4" />
            <span>Subject Requirements Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Checklist ข้อกำหนดโจทย์ Subject v4.0
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ติดตามและยืนยันข้อกำหนดทุกข้อของโปรเจกต์ ทั้ง Mandatory และ Bonus พร้อมวิธีตรวจผลจริงในแล็บ
          </p>
        </div>

        {/* Dual Progress Summary Cards */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-60 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30 p-3.5 shadow-sm">
            <ProgressBar
              label="Mandatory Readiness"
              percentage={mandatoryProgressPercent}
              color="blue"
              size="sm"
            />
          </div>
          <div className="w-full sm:w-60 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 p-3.5 shadow-sm">
            <ProgressBar
              label="Bonus Readiness"
              percentage={bonusProgressPercent}
              color="purple"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Info Alert: Meaning of Verified */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed space-y-1">
          <strong>สถานะ &quot;ทดสอบผ่านแล้ว (Verified)&quot;:</strong> หมายถึงผู้เรียนได้ลงมือรันคำสั่งและพิสูจน์ผลลัพธ์บนเครื่องของตนเองตามคำแนะนำในช่อง Verification Guide เรียบร้อยแล้ว (ไม่ใช่ระบบตรวจคลัสเตอร์อัตโนมัติ)
        </div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-4">
        {/* Stage Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs scrollbar-none">
          {stages.map((st) => {
            const isActive = selectedStage === st.key;
            const count = st.key === 'ALL'
              ? requirementsData.length
              : requirementsData.filter((r) => r.stage === st.key).length;

            return (
              <button
                key={st.key}
                onClick={() => setSelectedStage(st.key)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900 font-bold'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหา requirement ID (เช่น req-p1-01), ข้อความ หรือคำสั่งตรวจ..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer ${
                selectedStatusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedStatusFilter('PENDING')}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedStatusFilter === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>ยังไม่ผ่าน (Pending)</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('VERIFIED')}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedStatusFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>ผ่านแล้ว</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 text-sm">
            ไม่พบข้อกำหนดที่ตรงกับตัวกรองที่เลือก
          </div>
        ) : (
          filteredRequirements.map((req) => (
            <RequirementCard key={req.id} requirement={req} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">กำลังโหลด Checklist...</div>}>
      <ChecklistContent />
    </Suspense>
  );
}
