'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  CheckSquare,
  Wrench,
  ShieldAlert,
  BookA,
  ArrowRight
} from 'lucide-react';
import { allLessons } from '@/data/lessons';
import { requirementsData } from '@/data/requirements';
import { glossaryData } from '@/data/glossary';
import { troubleshootingData } from '@/data/troubleshooting';
import { defenseData } from '@/data/defense';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    const matchedLessons = allLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.objectives.some((o) => o.toLowerCase().includes(q)) ||
        l.content.toLowerCase().includes(q)
    );

    const matchedRequirements = requirementsData.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.detail.toLowerCase().includes(q) ||
        r.verification.toLowerCase().includes(q)
    );

    const matchedGlossary = glossaryData.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.thaiMeaning.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.aliases.some((a) => a.toLowerCase().includes(q))
    );

    const matchedTroubleshooting = troubleshootingData.filter(
      (t) =>
        t.symptom.toLowerCase().includes(q) ||
        t.fix.toLowerCase().includes(q) ||
        t.possibleCauses.some((c) => c.toLowerCase().includes(q))
    );

    const matchedDefense = defenseData.filter(
      (d) =>
        d.question.toLowerCase().includes(q) ||
        d.answer.toLowerCase().includes(q) ||
        d.keyPoints.some((k) => k.toLowerCase().includes(q))
    );

    const totalCount =
      matchedLessons.length +
      matchedRequirements.length +
      matchedGlossary.length +
      matchedTroubleshooting.length +
      matchedDefense.length;

    return {
      totalCount,
      lessons: matchedLessons,
      requirements: matchedRequirements,
      glossary: matchedGlossary,
      troubleshooting: matchedTroubleshooting,
      defense: matchedDefense
    };
  }, [query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          ค้นหาเนื้อหาทั้งระบบ (Search)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ค้นหาครอบคลุมบทเรียน 15 บท, ข้อกำหนด Subject, แนวทางแก้ไขปัญหา, คำถามตรวจ Defense และคำศัพท์
        </p>

        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา เช่น flannel, app3.com, without vagrant, OOMKilled..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      <div>
        {!query && (
          <div className="py-16 text-center text-slate-400 text-sm">
            พิมพ์คำค้นหาอย่างน้อย 2 ตัวอักษร เพื่อค้นหาข้อมูล
          </div>
        )}

        {query && results && results.totalCount === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">
            ไม่พบผลลัพธ์ที่ตรงกับคำว่า &quot;{query}&quot;
          </div>
        )}

        {results && results.totalCount > 0 && (
          <div className="space-y-8">
            <div className="text-xs font-semibold text-slate-500">
              พบ {results.totalCount} ผลลัพธ์ที่เกี่ยวข้อง
            </div>

            {/* Lessons */}
            {results.lessons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>บทเรียนที่พบ ({results.lessons.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.lessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/modules/${l.moduleId}/${l.id}`}
                      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-emerald-500/50 transition-all"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-500">
                        {l.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2 mt-1">{l.summary}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {results.requirements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-600 dark:text-sky-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <CheckSquare className="h-4 w-4" />
                  <span>Checklist โจทย์ที่พบ ({results.requirements.length})</span>
                </div>
                <div className="space-y-2">
                  {results.requirements.map((r) => (
                    <Link
                      key={r.id}
                      href={`/checklist?req=${r.id}`}
                      className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-sky-500/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                          {r.id}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-500">
                          {r.title}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{r.detail}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Troubleshooting */}
            {results.troubleshooting.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-600 dark:text-amber-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <Wrench className="h-4 w-4" />
                  <span>Troubleshooting ที่พบ ({results.troubleshooting.length})</span>
                </div>
                <div className="space-y-2">
                  {results.troubleshooting.map((t) => (
                    <Link
                      key={t.id}
                      href={`/troubleshooting?id=${t.id}`}
                      className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-amber-500/50 transition-all"
                    >
                      <div className="font-bold text-sm text-amber-600 dark:text-amber-400">
                        {t.symptom}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">วิธีแก้: {t.fix}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Defense */}
            {results.defense.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  <span>คำถาม Defense ที่พบ ({results.defense.length})</span>
                </div>
                <div className="space-y-2">
                  {results.defense.map((d) => (
                    <Link
                      key={d.id}
                      href={`/defense?q=${d.id}`}
                      className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-purple-500/50 transition-all"
                    >
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-purple-500">
                        {d.question}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{d.answer}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Glossary */}
            {results.glossary.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-teal-600 dark:text-teal-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <BookA className="h-4 w-4" />
                  <span>คำศัพท์ Glossary ที่พบ ({results.glossary.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.glossary.map((g) => (
                    <Link
                      key={g.id}
                      href={`/glossary#${g.id}`}
                      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-teal-500/50 transition-all"
                    >
                      <div className="font-bold text-sm text-teal-600 dark:text-teal-400">
                        {g.term} <span className="font-normal text-slate-400">({g.thaiMeaning})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{g.explanation}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">กำลังโหลดการค้นหา...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
