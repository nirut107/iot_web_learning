'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { modulesData } from '@/data/modules';
import { allLessons } from '@/data/lessons';
import { ProgressBar } from '@/components/ProgressBar';

export default function ModulesPage() {
  const { getLessonStatus, learningProgressPercent } = useProgress();

  const stageBadgeClasses = {
    Foundation: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    'Part 1': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    'Part 2': 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800',
    'Part 3': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
    Bonus: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    Defense: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
  };

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <BookOpen className="h-4 w-4" />
            <span>Curriculum Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            หลักสูตรบทเรียน 15 โมดูล
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            เรียงลำดับเนื้อหาจากรากฐาน Operating System สู่ Kubernetes, Ingress, GitOps, และ GitLab Bonus
          </p>
        </div>

        <div className="w-full sm:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
          <ProgressBar
            label="ความคืบหน้าการเรียนรวม"
            percentage={learningProgressPercent}
            color="emerald"
            size="sm"
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modulesData.map((m) => {
          const mLessons = allLessons.filter((l) => l.moduleId === m.id);
          const completedCount = mLessons.filter((l) => getLessonStatus(l.id) === 'completed').length;
          const isDone = completedCount === mLessons.length && mLessons.length > 0;

          return (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
            >
              {/* Module Header */}
              <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                        stageBadgeClasses[m.stage as keyof typeof stageBadgeClasses] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.stage}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      ID: {m.id}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {m.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {m.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-medium text-slate-500">
                    ผ่านแล้ว {completedCount}/{mLessons.length} บท
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg px-2.5 py-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>จบโมดูลนี้แล้ว</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Lessons Sub-list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {mLessons.map((lesson) => {
                  const status = getLessonStatus(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/modules/${m.id}/${lesson.id}`}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {status === 'completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : status === 'in-progress' ? (
                            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {lesson.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 pl-6 line-clamp-1">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pl-6 sm:pl-0 shrink-0 text-xs">
                        <span className="text-slate-400">อ่าน {lesson.readingTime} นาที</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>เปิดอ่าน</span>
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
