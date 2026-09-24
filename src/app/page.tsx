'use client';

import React from 'react';
import Link from 'next/link';
import {
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  CheckSquare,
  ShieldAlert,
  Award,
  Sparkles,
  Server,
  Repeat,
  Route,
  Container,
  GitBranch,
  HardDrive,
  Cpu,
  Terminal,
  Network,
  Box,
  Boxes
} from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { modulesData } from '@/data/modules';
import { allLessons, getLessonById } from '@/data/lessons';
import { ProgressBar } from '@/components/ProgressBar';

export default function HomePage() {
  const {
    isLoaded,
    progress,
    learningProgressPercent,
    mandatoryProgressPercent,
    bonusProgressPercent,
    statsByStage,
    completedLessonsCount,
    totalLessonsCount,
    getLessonStatus
  } = useProgress();

  // Find resume lesson
  const lastLocation = progress.lastLocation;
  const resumeLesson = lastLocation ? getLessonById(lastLocation.lessonId) : undefined;

  // Find next recommended lesson (first lesson that is not completed)
  const nextRecommendedLesson = allLessons.find(
    (l) => getLessonStatus(l.id) !== 'completed'
  ) || allLessons[0];

  const stageBadgeClasses = {
    Foundation: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    'Part 1': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    'Part 2': 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800',
    'Part 3': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
    Bonus: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    Defense: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return Layers;
      case 'Terminal': return Terminal;
      case 'Network': return Network;
      case 'Cpu': return Cpu;
      case 'Box': return Box;
      case 'Boxes': return Boxes;
      case 'Server': return Server;
      case 'Repeat': return Repeat;
      case 'Route': return Route;
      case 'Container': return Container;
      case 'GitBranch': return GitBranch;
      case 'CheckCircle2': return CheckCircle2;
      case 'HardDrive': return HardDrive;
      case 'Award': return Award;
      case 'ShieldAlert': return ShieldAlert;
      default: return BookOpen;
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-60 w-60 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>42 Inception-of-Things (IoT) Masterclass</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            เรียนรู้และพิชิต Inception-of-Things{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              ตั้งแต่ศูนย์จนถึงจบ Defense
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            คู่มือเรียนรู้ภาษาไทยฉบับละเอียดครบ 15 บท พร้อมแผนคำสั่งจริง, Ingress Routing, GitOps Argo CD,
            และ Local GitLab Bonus ไม่ต้องเดาสุ่ม ไม่ติดกรอบตารางเวลา และบันทึกความคืบหน้าไว้บนเบราว์เซอร์ของคุณ
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {resumeLesson ? (
              <Link
                href={`/modules/${resumeLesson.moduleId}/${resumeLesson.id}`}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>เรียนต่อ: {resumeLesson.title}</span>
              </Link>
            ) : (
              <Link
                href={`/modules/${nextRecommendedLesson.moduleId}/${nextRecommendedLesson.id}`}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>เริ่มบทเรียนแรก: {nextRecommendedLesson.title}</span>
              </Link>
            )}

            <Link
              href="/checklist"
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors"
            >
              <CheckSquare className="h-4 w-4 text-sky-400" />
              <span>เปิดดู Checklist โจทย์</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Progress Cards (Learning vs Mandatory vs Bonus) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Learning Progress */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>ความคืบหน้าการเรียนรู้</span>
            </div>
            <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {completedLessonsCount}/{totalLessonsCount} บท
            </span>
          </div>

          <ProgressBar
            label="รายการ Checklist ประจำบทที่ติ๊กแล้ว"
            percentage={learningProgressPercent}
            color="emerald"
            size="md"
          />

          <p className="text-xs text-slate-500 dark:text-slate-400">
            คำนวณจากหัวข้อและแบบฝึกหัดที่จำเป็นใน 15 บทเรียน ติ๊กเพื่อจำจุดที่อ่านและทดลองแล้ว
          </p>
        </div>

        {/* Card 2: Mandatory Readiness */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <CheckSquare className="h-4 w-4 text-sky-500" />
              <span>ความพร้อม Mandatory (P1–P3)</span>
            </div>
            <span className="rounded-md bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              {mandatoryProgressPercent}% ผ่านการทดสอบ
            </span>
          </div>

          <ProgressBar
            label="ข้อกำหนดตาม Subject ที่ผู้ใช้ทดสอบผ่านแล้ว"
            percentage={mandatoryProgressPercent}
            color="blue"
            size="md"
          />

          <p className="text-xs text-slate-500 dark:text-slate-400">
            ครอบคลุม General, Part 1 (K3s), Part 2 (3 Apps Ingress), Part 3 (Argo CD), และ Submission
          </p>
        </div>

        {/* Card 3: Bonus Readiness */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
              <Award className="h-4 w-4 text-purple-500" />
              <span>ความพร้อม Bonus (GitLab)</span>
            </div>
            <span className="rounded-md bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              {bonusProgressPercent}% ผ่านการทดสอบ
            </span>
          </div>

          <ProgressBar
            label="ข้อกำหนดโบนัส (แสดงผลแยกจาก Mandatory)"
            percentage={bonusProgressPercent}
            color="purple"
            size="md"
          />

          <p className="text-xs text-slate-500 dark:text-slate-400">
            โบนัสจะได้รับการตรวจเฉพาะเมื่อ Mandatory ผ่าน 100% โดยไม่มีข้อผิดพลาด
          </p>
        </div>
      </section>

      {/* Part Readiness Breakdown Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-emerald-500" />
          <span>สรุปความพร้อมตรวจแยกตามแต่ละส่วนของโปรเจกต์</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['General', 'P1', 'P2', 'P3', 'Bonus', 'Submission'] as const).map((stage) => {
            const st = statsByStage[stage];
            return (
              <div
                key={stage}
                className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 p-3.5 space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stage === 'P1' ? 'Part 1 (K3s)' : stage === 'P2' ? 'Part 2 (Apps)' : stage === 'P3' ? 'Part 3 (Argo)' : stage}
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {st.percentage}%
                </div>
                <div className="text-[11px] text-slate-500">
                  ผ่าน {st.verified} จาก {st.applicable} ข้อ
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 15 Modules Pathway Overview */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              เส้นทางการเรียนรู้ 15 โมดูล (Curriculum Pathway)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              เรียนรู้ตามลำดับบทจากพื้นฐานสู่งานจริง ครอบคลุมทั้งแนวคิด คำสั่ง แล็บ และวิธีตรวจ
            </p>
          </div>
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>ดูสารบัญเต็ม</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulesData.map((m) => {
            const Icon = getModuleIcon(m.iconName);
            const mLessons = allLessons.filter((l) => l.moduleId === m.id);
            const completedInModule = mLessons.filter((l) => getLessonStatus(l.id) === 'completed').length;
            const isCompleted = completedInModule === mLessons.length && mLessons.length > 0;
            const isInProgress = completedInModule > 0 && !isCompleted;

            return (
              <div
                key={m.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                        stageBadgeClasses[m.stage as keyof typeof stageBadgeClasses] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.stage}
                    </span>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>ผ่านแล้ว</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>กำลังเรียน ({completedInModule}/{mLessons.length})</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">ยังไม่เริ่ม</span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 group-hover:text-emerald-500 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{mLessons.length} บทเรียนย่อย</span>
                  <Link
                    href={`/modules/${m.id}/${mLessons[0]?.id || ''}`}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-1"
                  >
                    <span>เริ่มอ่าน</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
