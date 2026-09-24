'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookA, Search, BookOpen, ArrowRight } from 'lucide-react';
import { glossaryData } from '@/data/glossary';
import { getLessonById } from '@/data/lessons';

export default function GlossaryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Kubernetes', 'GitOps', 'Network', 'Docker', 'Vagrant', 'Linux'];

  const filteredTerms = useMemo(() => {
    return glossaryData.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = item.term.toLowerCase().includes(q);
        const matchesThai = item.thaiMeaning.toLowerCase().includes(q);
        const matchesExp = item.explanation.toLowerCase().includes(q);
        const matchesAliases = item.aliases.some((a) => a.toLowerCase().includes(q));
        if (!matchesTerm && !matchesThai && !matchesExp && !matchesAliases) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-[1700px] w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
          <BookA className="h-4 w-4" />
          <span>Technical Dictionary & Concept Map</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          พจนานุกรมคำศัพท์เทคนิค (Glossary)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          นิยามคำศัพท์สำคัญในโปรเจกต์ IoT แปลความหมายภาษาไทยและอธิบายเชิงระบบพร้อมลิงก์ไปยังบทเรียนที่เกี่ยวข้อง
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'ทั้งหมด' : cat}
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
            placeholder="ค้นหาคำศัพท์ (ไทย/อังกฤษ)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-400 text-sm">
            ไม่พบคำศัพท์ที่ตรงกับคำค้นหา
          </div>
        ) : (
          filteredTerms.map((term) => (
            <div
              key={term.id}
              id={term.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 hover:border-teal-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-teal-50 dark:bg-teal-950 px-2 py-0.5 font-semibold text-[11px] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {term.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {term.aliases.map((al) => (
                      <span
                        key={al}
                        className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-slate-500"
                      >
                        {al}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {term.term}
                  </h3>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    ความหมาย: {term.thaiMeaning}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {term.explanation}
                </p>
              </div>

              {/* Linked Lessons */}
              {term.lessonIds.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>บทที่ใช้:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {term.lessonIds.map((lid) => {
                      const lesson = getLessonById(lid);
                      return (
                        <Link
                          key={lid}
                          href={`/modules/${lesson?.moduleId || 'm00'}/${lid}`}
                          className="rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                        >
                          {lid}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
