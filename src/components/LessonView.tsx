'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  Circle,
  BookOpen,
  CheckSquare,
  Wrench,
  HelpCircle,
  Edit3,
  Menu,
  X,
  FileCheck
} from 'lucide-react';
import { marked } from 'marked';
import { useProgress } from '@/context/ProgressContext';
import { Lesson, Module } from '@/types/curriculum';
import { modulesData } from '@/data/modules';
import { allLessons, getLessonById, getAdjacentLessons } from '@/data/lessons';
import { learningItemsData } from '@/data/learningItems';
import { exercisesData } from '@/data/exercises';
import { defenseData } from '@/data/defense';
import { CodeBlock } from '@/components/CodeBlock';

function renderMarkdown(content: string): string {
  // Pre-process GitHub alerts: > [!NOTE], > [!TIP], etc.
  const preprocessed = content.replace(
    /> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:> .*\n?)+)/gi,
    (match, type, body) => {
      const cleanBody = body
        .split('\n')
        .map((l: string) => l.replace(/^> ?/, ''))
        .join('\n');
      
      const parsedBody = marked.parse(cleanBody, { async: false, gfm: true, breaks: true }) as string;

      const colors: Record<string, string> = {
        NOTE: 'border-blue-400 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200',
        TIP: 'border-emerald-400 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
        IMPORTANT: 'border-purple-400 dark:border-purple-800 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200',
        WARNING: 'border-amber-400 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
        CAUTION: 'border-rose-400 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
      };
      const styleClass = colors[type.toUpperCase()] || colors.NOTE;
      return `\n\n<div class="my-4 rounded-xl border p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${styleClass}"><strong class="font-bold uppercase tracking-wider block mb-1.5 text-[11px] font-mono">${type}</strong><div class="space-y-1 alert-content">${parsedBody}</div></div>\n\n`;
    }
  );

  let rawHtml = marked.parse(preprocessed, { async: false, gfm: true, breaks: true }) as string;

  // Wrap tables in responsive scroll container
  rawHtml = rawHtml.replace(
    /<table>/g,
    '<div class="overflow-x-auto my-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"><table class="w-full text-left text-xs sm:text-sm border-collapse">'
  ).replace(/<\/table>/g, '</table></div>');

  return rawHtml;
}

interface LessonViewProps {
  lesson: Lesson;
  currentModule: Module;
}

export function LessonView({ lesson, currentModule }: LessonViewProps) {
  const {
    isLoaded,
    recordVisitLesson,
    toggleLearningItem,
    isItemChecked,
    getLessonStatus,
    getNote,
    saveNote
  } = useProgress();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Record visit on mount
  useEffect(() => {
    if (isLoaded) {
      recordVisitLesson(currentModule.id, lesson.id);
    }
  }, [currentModule.id, lesson.id, isLoaded, recordVisitLesson]);

  // Load note
  useEffect(() => {
    if (isLoaded) {
      setNoteContent(getNote(lesson.id));
    }
  }, [lesson.id, isLoaded, getNote]);

  const handleSaveNote = () => {
    setIsSavingNote(true);
    saveNote(lesson.id, noteContent);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  const { prev: prevLesson, next: nextLesson } = getAdjacentLessons(lesson.id);

  // Lesson checklist items
  const lessonChecklist = learningItemsData.filter((i) => i.lessonId === lesson.id);
  const requiredCount = lessonChecklist.filter((i) => i.required).length;
  const checkedRequiredCount = lessonChecklist.filter(
    (i) => i.required && isItemChecked(i.id)
  ).length;

  // Exercises
  const lessonExercises = exercisesData.filter((e) => e.lessonId === lesson.id);

  // Relevant defense questions
  const relatedDefense = defenseData.filter(
    (d) => d.relatedLessons.includes(lesson.id) || d.relatedLessons.some((rl) => rl.startsWith(currentModule.id))
  ).slice(0, 3);



  const stageBadgeClasses = {
    Foundation: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    'Part 1': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
    'Part 2': 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-800',
    'Part 3': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
    Bonus: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
    Defense: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
  };

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Mobile Sidebar Trigger */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-emerald-500 transition-colors">
            หน้าหลัก
          </Link>
          <span>/</span>
          <Link href="/modules" className="hover:text-emerald-500 transition-colors">
            หลักสูตร
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{currentModule.title}</span>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 truncate max-w-xs">{lesson.title}</span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>สารบัญบทเรียน</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar (Course Navigation) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 p-4 border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-transform lg:static lg:z-0 lg:w-full lg:p-0 lg:border-0 lg:shadow-none lg:block lg:col-span-3 xl:col-span-3 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">สารบัญหลักสูตร</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-slate-400 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              15 โมดูลทั้งหมด
            </div>

            <div className="space-y-3">
              {modulesData.map((m) => {
                const mLessons = allLessons.filter((l) => l.moduleId === m.id);
                const isCurrentModule = m.id === currentModule.id;

                return (
                  <div key={m.id} className="space-y-1">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between px-2 py-1">
                      <span className="truncate">{m.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{m.stage}</span>
                    </div>

                    <div className="space-y-0.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                      {mLessons.map((l) => {
                        const isCurrentLesson = l.id === lesson.id;
                        const status = getLessonStatus(l.id);

                        return (
                          <Link
                            key={l.id}
                            href={`/modules/${m.id}/${l.id}`}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                              isCurrentLesson
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                          >
                            <span className="truncate mr-2">{l.title}</span>
                            {status === 'completed' ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : status === 'in-progress' ? (
                              <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-8 min-w-0">
          {/* Lesson Header */}
          <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded border px-2.5 py-0.5 text-xs font-semibold ${
                  stageBadgeClasses[lesson.stage as keyof typeof stageBadgeClasses] || 'bg-slate-100'
                }`}
              >
                {lesson.stage}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>เวลาอ่านโดยประมาณ {lesson.readingTime} นาที</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {lesson.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {lesson.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          {/* Objectives Card */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-emerald-900 dark:text-emerald-300">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>เป้าหมายของบทเรียน (Learning Objectives)</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/90 dark:bg-emerald-900/90 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mt-0.5 shadow-xs">
                    {i + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites & Project Usage Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ใช้ตรงไหนในโปรเจกต์:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{lesson.stage}</span>
            </div>

            {lesson.prerequisiteIds.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">แนะนำให้อ่านก่อน:</span>
                <div className="flex items-center gap-1">
                  {lesson.prerequisiteIds.map((pid) => (
                    <Link
                      key={pid}
                      href={`/modules/${pid.split('-')[0]}/${pid}`}
                      className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 hover:text-emerald-500"
                    >
                      {pid}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Markdown Content */}
          <article className="markdown-content text-sm sm:text-base leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(lesson.content)
              }}
            />
          </article>

          {/* Hands-on Exercises */}
          {lessonExercises.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-sky-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  แบบฝึกหัดลงมือปฏิบัติ (Hands-on Exercise)
                </h2>
              </div>

              {lessonExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20 p-5 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-200 dark:border-sky-900/60 pb-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {ex.title}
                    </h3>
                    <span className="rounded bg-sky-100 dark:bg-sky-950 px-2 py-0.5 text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                      รันที่: {ex.executionContext}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <strong>เป้าหมาย:</strong> {ex.goal}
                  </p>

                  {/* Steps */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      ขั้นตอนปฏิบัติการ:
                    </div>
                    {ex.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white text-[11px] font-bold">
                            {st.stepNumber}
                          </span>
                          <span>{st.instruction}</span>
                        </div>

                        {st.explanation && (
                          <div className="text-xs text-slate-500 pl-7">{st.explanation}</div>
                        )}

                        {st.command && (
                          <div className="pl-7">
                            <CodeBlock
                              command={st.command}
                              expectedOutput={st.expectedOutput}
                              context={ex.executionContext}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Verification & Expected Result */}
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 space-y-1 text-xs">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4" />
                      <span>วิธีตรวจผลว่าผ่าน:</span>
                    </div>
                    <div className="text-emerald-900 dark:text-emerald-200 pl-5 leading-relaxed">
                      {ex.verification}
                    </div>
                  </div>

                  {/* Troubleshooting tip */}
                  {ex.troubleshooting && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                      <strong>ปัญหาที่พบบ่อยและวิธีแก้:</strong> {ex.troubleshooting}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Interactive Lesson Checklist */}
          {lessonChecklist.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Checklist ตรวจสอบความเข้าใจประจำบท
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  เสร็จแล้ว {checkedRequiredCount} จาก {requiredCount} ข้อที่จำเป็น
                </span>
              </div>

              <div className="space-y-2">
                {lessonChecklist.map((item) => {
                  const checked = isItemChecked(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleLearningItem(item.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                        checked
                          ? 'border-emerald-400 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}} // handled by parent div
                        className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div className="flex-1 text-xs sm:text-sm">
                        <span
                          className={`font-medium ${
                            checked
                              ? 'text-emerald-900 dark:text-emerald-200 line-through'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {item.text}
                        </span>
                        <div className="mt-1 flex items-center gap-2 text-[11px]">
                          <span
                            className={`rounded px-1.5 py-0.2 ${
                              item.kind === 'concept'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                : item.kind === 'practice'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            }`}
                          >
                            {item.kind === 'concept' ? 'แนวคิด' : item.kind === 'practice' ? 'ฝึกปฏิบัติ' : 'ตรวจผล'}
                          </span>
                          {!item.required && (
                            <span className="text-slate-400 font-semibold">[เนื้อหาเสริม]</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Defense Questions Accordion */}
          {relatedDefense.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    คำถามซ้อมตอบตอนสอบ Defense ({relatedDefense.length} ข้อ)
                  </h2>
                </div>
                <Link
                  href="/defense?tab=qa"
                  className="text-xs font-medium text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <span>คลังคำถาม 16 ข้อ</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {relatedDefense.map((q) => (
                  <details
                    key={`${lesson.id}-${q.id}`}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
                  >
                    <summary className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                        <div className="flex items-start gap-2.5">
                          <span className="rounded bg-purple-100 dark:bg-purple-950 px-2 py-0.5 text-[11px] font-mono font-bold text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 mt-0.5 shrink-0">
                            {q.id}
                          </span>
                          <span className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-snug">
                            {q.question}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 shrink-0 font-medium bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200/60 dark:border-purple-800/60">
                          <span className="group-open:hidden">ดูแนวคำตอบ</span>
                          <span className="hidden group-open:inline">ซ่อนแนวคำตอบ</span>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                        </div>
                      </summary>

                      <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-purple-50/20 dark:bg-purple-950/10 text-xs sm:text-sm space-y-3.5">
                        <div className="space-y-1.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm">
                            <HelpCircle className="h-4 w-4 text-emerald-500" />
                            <span>แนวคำตอบที่แนะนำ:</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5 font-normal">
                            {q.answer}
                          </p>
                        </div>
                        {q.keyPoints.length > 0 && (
                          <div className="space-y-1.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-3.5">
                            <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">
                              ประเด็นสำคัญที่ควรเอ่ยชื่อ (Keywords เพื่อคะแนนเต็ม):
                            </span>
                            <ul className="list-disc list-inside text-xs text-purple-950 dark:text-purple-300 space-y-1 mt-1">
                              {q.keyPoints.map((kp, idx) => (
                                <li key={idx}>{kp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {q.trap && (
                          <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900 leading-relaxed">
                            <strong>⚠️ กับดักคำถามของผู้ตรวจ (Evaluator Trap):</strong> {q.trap}
                          </div>
                        )}
                        <div className="pt-1 flex justify-end">
                          <Link
                            href={`/defense?tab=qa&q=${q.id}`}
                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>เปิดดูในหน้าระบบซ้อมสอบ Defense เต็มรูปแบบ</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          )}

          {/* Personal Note Section */}
          <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`note-${lesson.id}`}
                className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100"
              >
                <Edit3 className="h-4 w-4 text-emerald-500" />
                <span>สมุดบันทึกส่วนตัวประจำบทเรียนนี้</span>
              </label>
              {isSavingNote && (
                <span className="text-xs text-emerald-500 font-semibold">บันทึกเรียบร้อย</span>
              )}
            </div>

            <textarea
              id={`note-${lesson.id}`}
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="จดบันทึกสิ่งที่คุณค้นพบ คำสั่งที่ใช้กับเครื่องของคุณเอง หรือคำถามที่ต้องการถามเพื่อน..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-1.5 font-semibold transition-colors cursor-pointer"
              >
                บันทึกโน้ต
              </button>
            </div>
          </section>

          {/* Prev / Next Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
            {prevLesson ? (
              <Link
                href={`/modules/${prevLesson.moduleId}/${prevLesson.id}`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>บทก่อนหน้า: {prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/modules/${nextLesson.moduleId}/${nextLesson.id}`}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <span>บทถัดไป: {nextLesson.title}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/checklist"
                className="flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all"
              >
                <span>ไปตรวจ Checklist โจทย์</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
