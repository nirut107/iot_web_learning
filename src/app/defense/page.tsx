'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  HelpCircle,
  AlertOctagon,
  Search,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  FileCheck2,
  AlertTriangle,
  Terminal,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  FileDown,
  Eye
} from 'lucide-react';
import { defenseData } from '@/data/defense';
import { evaluationSheetData } from '@/data/evalSheet';
import { getLessonById } from '@/data/lessons';

function DefenseContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('q');
  const initialTab = searchParams.get('tab') === 'qa' ? 'qa' : 'scale';

  const [activeTab, setActiveTab] = useState<'scale' | 'qa'>(initialTab);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestionIds, setOpenQuestionIds] = useState<string[]>([]);
  const [checkedEvalItemIds, setCheckedEvalItemIds] = useState<string[]>([]);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    if (targetId) {
      setActiveTab('qa');
      setOpenQuestionIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [targetId]);

  const stages = [
    { key: 'ALL', label: 'ทั้งหมด' },
    { key: 'General', label: 'General' },
    { key: 'Part 1', label: 'Part 1 (K3s & Vagrant)' },
    { key: 'Part 2', label: 'Part 2 (Apps & Ingress)' },
    { key: 'Part 3', label: 'Part 3 (K3d & GitOps)' },
    { key: 'Bonus', label: 'Bonus (GitLab)' }
  ];

  const filteredQuestions = useMemo(() => {
    return defenseData.filter((item) => {
      if (selectedStage !== 'ALL') {
        if (!item.stage.includes(selectedStage)) return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesQ = item.question.toLowerCase().includes(q);
        const matchesA = item.answer.toLowerCase().includes(q);
        const matchesKp = item.keyPoints.some((k) => k.toLowerCase().includes(q));
        if (!matchesQ && !matchesA && !matchesKp) return false;
      }
      return true;
    });
  }, [selectedStage, searchQuery]);

  const toggleQuestion = (id: string) => {
    setOpenQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleEvalCheck = (id: string) => {
    setCheckedEvalItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenQuestionIds(defenseData.map((d) => d.id));
  };

  const collapseAll = () => {
    setOpenQuestionIds([]);
  };

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          <ShieldAlert className="h-4 w-4" />
          <span>Peer-Evaluation & Defense Prep</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
          ซ้อมสอบ Defense & ใบตรวจคะแนน 42 (Evaluation Sheet)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          ถอดแบบตามใบตรวจจริงจาก <code>eval.pdf</code> (Scale for Project Inception-of-Things) และคลังคำถามสัมภาษณ์เชิงลึก 16 ข้อพร้อมแนวคำตอบ
        </p>
      </div>

      {/* Main Tab Toggle: Official Scale Sheet vs In-Depth Q&A */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('scale')}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
              activeTab === 'scale'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>1. เกณฑ์ตรวจคะแนนในระบบ (eval.pdf)</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>2. คลังคำถาม & แนวคำตอบ 16 ข้อ (พร้อมเฉลยละเอียด)</span>
            <span className="rounded-full bg-purple-200 dark:bg-purple-900 px-2 py-0.5 text-[10px] font-extrabold text-purple-900 dark:text-purple-200">
              {defenseData.length}
            </span>
          </button>
        </div>

        {/* Direct PDF Link */}
        <a
          href="/eval.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-sm"
          title="เปิดไฟล์ PDF ต้นฉบับในแท็บใหม่"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>เปิดไฟล์ต้นฉบับ eval.pdf</span>
        </a>
      </div>

      {/* TAB 1: OFFICIAL EVALUATION SCALE SHEET (eval.pdf) */}
      {activeTab === 'scale' && (
        <div className="space-y-6">
          {/* Quick Switch Banner to Q&A Answers */}
          <div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-sky-950 dark:text-sky-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-900 dark:text-sky-300">
                <HelpCircle className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>กำลังมองหาแนวทางการตอบคำถามสัมภาษณ์ปากเปล่า?</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                คลิกเพื่อสลับไปยังคลังแนวคำตอบ 16 ข้อ พร้อม Keywords ที่ต้องพูดถึง และประเด็นหลอกลวง (Evaluator Traps) ที่ผู้ตรวจมักใช้แกล้งถาม
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className="shrink-0 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap text-xs"
            >
              เปิดดูแนวคำตอบ 16 ข้อ →
            </button>
          </div>

          {/* Scale Sheet Notice */}
          <div className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20 p-5 space-y-3 text-xs text-purple-950 dark:text-purple-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold text-sm text-purple-900 dark:text-purple-300">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>โครงสร้างข้อตรวจจริงจาก Intra Scale Sheet (Version 4.0):</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowPdfPreview((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-xs hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{showPdfPreview ? 'ซ่อนพรีวิว PDF' : 'แสดงพรีวิว PDF ในหน้านี้'}</span>
                </button>
                <a
                  href="/eval.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>เปิดแท็บใหม่</span>
                </a>
              </div>
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              นี่คือขั้นตอนที่ Peer Evaluator จะต้องคลิก <strong>[Yes / No]</strong> บนหน้าจอคอมพิวเตอร์ระหว่างนั่งตรวจโปรเจกต์ของคุณ
              แต่ละจุดจะมีคำแนะนำว่าผู้ตรวจจะพิมพ์คำสั่งใด และคุณต้องเตรียมตอบอย่างไรเพื่อไม่ให้ถูกสั่งหยุดการตรวจ (Evaluation stops here)
            </p>

            {/* Embedded PDF Preview Toggle */}
            {showPdfPreview && (
              <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>ไฟล์เอกสาร Scale for Project Inception-of-Things (eval.pdf)</span>
                  <a
                    href="/eval.pdf"
                    download="eval.pdf"
                    className="hover:underline text-purple-600 dark:text-purple-400 font-medium inline-flex items-center gap-1"
                  >
                    <FileDown className="h-3 w-3" />
                    <span>ดาวน์โหลดไฟล์ (.pdf)</span>
                  </a>
                </div>
                <div className="w-full h-[650px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                  <iframe
                    src="/eval.pdf"
                    title="eval.pdf preview"
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sections of Scale Sheet */}
          <div className="space-y-6">
            {evaluationSheetData.map((section) => (
              <div
                key={section.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              >
                {/* Section Header */}
                <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {section.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {section.description}
                  </p>
                </div>

                {/* Items in section */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {section.items.map((item) => {
                    const isChecked = checkedEvalItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-5 space-y-3.5 transition-colors ${
                          isChecked ? 'bg-emerald-500/[0.03]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleEvalCheck(item.id)}
                              className="mt-1 h-4 w-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <div>
                              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <span>{item.title}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                                {item.instruction}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold shrink-0 ${
                              isChecked
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isChecked ? 'ซ้อมผ่านแล้ว' : 'ยังไม่ซ้อม'}
                          </span>
                        </div>

                        {/* Critical Stop Alert if any */}
                        {item.criticalStopWarning && (
                          <div className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <strong>จุดตาย (Critical Warning):</strong> {item.criticalStopWarning}
                            </div>
                          </div>
                        )}

                        {/* Two columns: Evaluator Action vs Student Guide */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-3.5 border border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <UserCheck className="h-4 w-4 text-sky-500" />
                              <span>สิ่งที่ผู้ตรวจจะทำ / จะถาม:</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {item.evaluatorAction}
                            </p>
                          </div>

                          <div className="rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 border border-emerald-200 dark:border-emerald-800 space-y-1">
                            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>แนวทางที่คุณต้องอธิบาย / แสดงให้ดู:</span>
                            </div>
                            <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed">
                              {item.studentExplanationGuide}
                            </p>
                          </div>
                        </div>

                        {/* Commands to run during check */}
                        {item.commands && item.commands.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                              <Terminal className="h-3 w-3" />
                              <span>คำสั่งที่ใช้ทดสอบข้อนี้:</span>
                            </div>
                            {item.commands.map((cmd, cIdx) => (
                              <div
                                key={cIdx}
                                className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono overflow-x-auto space-y-1"
                              >
                                <div className="text-emerald-400">$ {cmd.command}</div>
                                {cmd.expected && (
                                  <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                                    Expected: {cmd.expected}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IN-DEPTH DEFENSE Q&A */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Stage Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs scrollbar-none">
              {stages.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setSelectedStage(st.key)}
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                    selectedStage === st.key
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Search & Expand toggles */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาตามคำถาม..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={openQuestionIds.length > 0 ? collapseAll : expandAll}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                {openQuestionIds.length > 0 ? 'ย่อทั้งหมด' : 'เปิดทั้งหมด'}
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 text-sm">
                ไม่พบคำถามที่ตรงกับตัวกรอง
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isOpen = openQuestionIds.includes(q.id);
                return (
                  <details
                    key={q.id}
                    id={q.id}
                    open={isOpen}
                    onToggle={(e) => {
                      const isNowOpen = (e.currentTarget as HTMLDetailsElement).open;
                      setOpenQuestionIds((prev) =>
                        isNowOpen
                          ? (prev.includes(q.id) ? prev : [...prev, q.id])
                          : prev.filter((item) => item !== q.id)
                      );
                    }}
                    className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
                  >
                    <summary className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-purple-100 dark:bg-purple-950 font-mono text-[11px] font-bold text-purple-700 dark:text-purple-400 px-2 py-0.5 border border-purple-200 dark:border-purple-800">
                            {q.id}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{q.stage}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mt-1 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-200/60 dark:border-purple-800/60">
                        <span className="group-open:hidden">ดูคำตอบ</span>
                        <span className="hidden group-open:inline">ซ่อนคำตอบ</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                      </div>
                    </summary>

                    <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 p-5 space-y-4 text-xs sm:text-sm">
                      {/* Model Answer */}
                      <div className="space-y-1.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <HelpCircle className="h-4 w-4 text-emerald-500" />
                          <span>แนวคำตอบที่แนะนำ:</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5 font-normal">
                          {q.answer}
                        </p>
                      </div>

                      {/* Key points to mention */}
                      {q.keyPoints.length > 0 && (
                        <div className="rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-4 space-y-2">
                          <div className="font-bold text-purple-900 dark:text-purple-300">
                            ประเด็นสำคัญที่ควรเอ่ยชื่อ (Keywords เพื่อคะแนนเต็ม):
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-purple-950 dark:text-purple-200">
                            {q.keyPoints.map((kp, idx) => (
                              <li key={idx}>{kp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Trap warning */}
                      {q.trap && (
                        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-4 flex items-start gap-2.5 text-rose-900 dark:text-rose-200 leading-relaxed">
                          <AlertOctagon className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>กับดักคำถามของผู้ตรวจ:</strong> {q.trap}
                          </div>
                        </div>
                      )}

                      {/* Related Lessons */}
                      {q.relatedLessons.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
                          <span className="text-slate-500">ทบทวนในบทเรียน:</span>
                          <div className="flex items-center gap-1.5">
                            {q.relatedLessons.map((lid) => {
                              const lesson = getLessonById(lid);
                              return (
                                <Link
                                  key={lid}
                                  href={`/modules/${lesson?.moduleId || 'm00'}/${lid}`}
                                  className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 hover:text-purple-500"
                                >
                                  {lid}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DefensePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">กำลังโหลด Defense...</div>}>
      <DefenseContent />
    </Suspense>
  );
}
