'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, CheckSquare, Wrench, ShieldAlert, BookA, ArrowRight } from 'lucide-react';
import { allLessons } from '@/data/lessons';
import { requirementsData } from '@/data/requirements';
import { glossaryData } from '@/data/glossary';
import { troubleshootingData } from '@/data/troubleshooting';
import { defenseData } from '@/data/defense';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return null;

    // Search Lessons
    const matchedLessons = allLessons
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.objectives.some((o) => o.toLowerCase().includes(q)) ||
          l.content.toLowerCase().includes(q)
      )
      .slice(0, 5);

    // Search Requirements
    const matchedRequirements = requirementsData
      .filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.detail.toLowerCase().includes(q) ||
          r.verification.toLowerCase().includes(q)
      )
      .slice(0, 5);

    // Search Glossary
    const matchedGlossary = glossaryData
      .filter(
        (g) =>
          g.term.toLowerCase().includes(q) ||
          g.thaiMeaning.toLowerCase().includes(q) ||
          g.explanation.toLowerCase().includes(q) ||
          g.aliases.some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 4);

    // Search Troubleshooting
    const matchedTroubleshooting = troubleshootingData
      .filter(
        (t) =>
          t.symptom.toLowerCase().includes(q) ||
          t.fix.toLowerCase().includes(q) ||
          t.possibleCauses.some((c) => c.toLowerCase().includes(q))
      )
      .slice(0, 4);

    // Search Defense Questions
    const matchedDefense = defenseData
      .filter(
        (d) =>
          d.question.toLowerCase().includes(q) ||
          d.answer.toLowerCase().includes(q) ||
          d.keyPoints.some((k) => k.toLowerCase().includes(q))
      )
      .slice(0, 4);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาบทเรียน, คำสั่ง, requirements, อาการเสีย, คำถามตรวจ (ไทย/อังกฤษ)..."
            className="ml-3 flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[65vh] overflow-y-auto p-4 text-sm">
          {!query && (
            <div className="py-10 text-center text-xs text-slate-400">
              พิมพ์คำค้นหาอย่างน้อย 2 ตัวอักษร เช่น <code className="text-emerald-400">flannel</code>,{' '}
              <code className="text-emerald-400">app3 fallback</code>,{' '}
              <code className="text-emerald-400">Argo CD</code>,{' '}
              <code className="text-emerald-400">OOMKilled</code>
            </div>
          )}

          {query && results && results.totalCount === 0 && (
            <div className="py-10 text-center text-slate-400">
              ไม่พบผลลัพธ์ที่ตรงกับ &quot;{query}&quot;
            </div>
          )}

          {results && results.totalCount > 0 && (
            <div className="space-y-5">
              {/* Lessons */}
              {results.lessons.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>บทเรียน ({results.lessons.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.lessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/modules/${l.moduleId}/${l.id}`}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-800/80 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-slate-200 group-hover:text-emerald-300">
                            {l.title}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">{l.summary}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {results.requirements.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-400">
                    <CheckSquare className="h-3.5 w-3.5" />
                    <span>Checklist โจทย์ ({results.requirements.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.requirements.map((r) => (
                      <Link
                        key={r.id}
                        href={`/checklist?req=${r.id}`}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-800/80 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-sky-950 px-1.5 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-800">
                              {r.id}
                            </span>
                            <span className="font-medium text-slate-200 group-hover:text-sky-300">
                              {r.title}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {r.detail}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Troubleshooting */}
              {results.troubleshooting.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Troubleshooting ({results.troubleshooting.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.troubleshooting.map((t) => (
                      <Link
                        key={t.id}
                        href={`/troubleshooting?id=${t.id}`}
                        onClick={onClose}
                        className="group block rounded-lg p-2.5 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="font-medium text-amber-300">{t.symptom}</div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          วิธีแก้: {t.fix}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Defense Questions */}
              {results.defense.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>คำถามซ้อมตรวจ Defense ({results.defense.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.defense.map((d) => (
                      <Link
                        key={d.id}
                        href={`/defense?q=${d.id}`}
                        onClick={onClose}
                        className="group block rounded-lg p-2.5 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="font-medium text-slate-200 group-hover:text-purple-300">
                          {d.question}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {d.answer}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary */}
              {results.glossary.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-400">
                    <BookA className="h-3.5 w-3.5" />
                    <span>คำศัพท์ Glossary ({results.glossary.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.glossary.map((g) => (
                      <Link
                        key={g.id}
                        href={`/glossary#${g.id}`}
                        onClick={onClose}
                        className="group block rounded-lg p-2.5 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="font-medium text-teal-300">
                          {g.term} <span className="text-slate-400 font-normal">({g.thaiMeaning})</span>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {g.explanation}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2.5 text-[11px] text-slate-500">
          <span>กด ESC เพื่อปิดหน้าต่าง</span>
          <span>ค้นหาได้ทั้งภาษาไทยและอังกฤษ</span>
        </div>
      </div>
    </div>
  );
}
