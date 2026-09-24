'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Circle,
  Slash,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Edit3
} from 'lucide-react';
import { Requirement, RequirementStatus } from '@/types/curriculum';
import { useProgress } from '@/context/ProgressContext';
import { getLessonById } from '@/data/lessons';

interface RequirementCardProps {
  requirement: Requirement;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({ requirement }) => {
  const { getRequirementStatus, setRequirementStatus, getNote, saveNote } = useProgress();
  const currentStatus = getRequirementStatus(requirement.id);
  const note = getNote(requirement.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteText, setNoteText] = useState(note);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const statusConfig = {
    'not-started': {
      label: 'ยังไม่เริ่ม',
      icon: Circle,
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
    },
    'in-progress': {
      label: 'กำลังทำ',
      icon: Clock,
      badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
    },
    'verified': {
      label: 'ทดสอบผ่านแล้ว (Verified)',
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
    },
    'not-applicable': {
      label: 'ไม่เกี่ยวข้อง (N/A)',
      icon: Slash,
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRequirementStatus(requirement.id, e.target.value as RequirementStatus);
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    saveNote(requirement.id, noteText);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  const classificationBadge = {
    mandatory: {
      label: 'โจทย์บังคับ (Mandatory)',
      class: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900'
    },
    advice: {
      label: 'โจทย์แนะนำอย่างมาก (Advice)',
      class: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
    },
    optional: {
      label: 'เงื่อนไขเฉพาะ (Conditional / Optional)',
      class: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
    }
  };

  const StatusIcon = statusConfig[currentStatus].icon;

  return (
    <div
      id={requirement.id}
      className={`rounded-xl border transition-all ${
        currentStatus === 'verified'
          ? 'border-emerald-500/40 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
      } shadow-sm`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded">
              {requirement.id}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {requirement.stage}
            </span>
            <span
              className={`rounded border px-2 py-0.5 text-[11px] font-medium ${classificationBadge[requirement.classification].class}`}
            >
              {classificationBadge[requirement.classification].label}
            </span>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${statusConfig[currentStatus].badgeClass.split(' ')[2]}`} />
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${statusConfig[currentStatus].badgeClass}`}
            >
              <option value="not-started">ยังไม่เริ่ม</option>
              <option value="in-progress">กำลังทำ</option>
              <option value="verified">ทดสอบผ่านแล้ว (Verified)</option>
              {requirement.applicabilityCondition && (
                <option value="not-applicable">ไม่เกี่ยวข้อง (N/A)</option>
              )}
            </select>
          </div>
        </div>

        {/* Title & Details */}
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
          {requirement.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          {requirement.detail}
        </p>

        {/* Applicability Condition note */}
        {requirement.applicabilityCondition && (
          <div className="mb-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-2.5 text-xs text-blue-700 dark:text-blue-300">
            <strong>เงื่อนไข:</strong> {requirement.applicabilityCondition}
          </div>
        )}

        {/* Verification Instructions Accordion */}
        <div className="mt-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <span>วิธีตรวจผลในแล็บ (Verification Guide):</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2.5 leading-relaxed overflow-x-auto">
            {requirement.verification}
          </div>
        </div>

        {/* Expandable Section: Notes, Lessons, Sources */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
          <div className="flex items-center gap-3">
            {requirement.lessonIds.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                <span>บทเรียนที่เกี่ยวข้อง:</span>
                <div className="flex items-center gap-1">
                  {requirement.lessonIds.map((lid) => {
                    const lesson = getLessonById(lid);
                    return (
                      <Link
                        key={lid}
                        href={`/modules/${lesson?.moduleId || 'm00'}/${lid}`}
                        className="rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400 hover:underline font-mono text-[11px]"
                      >
                        {lid}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <span>{isExpanded ? 'ซ่อนโน้ตและหลักฐาน' : 'บันทึกผลทดลอง / โน้ต'}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`note-${requirement.id}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <Edit3 className="h-3.5 w-3.5 text-sky-500" />
                <span>บันทึกหลักฐานผลการทดลอง / สิ่งที่พบเฉพาะเครื่องคุณ:</span>
              </label>
              {isSavingNote && (
                <span className="text-[11px] text-emerald-500 font-medium">บันทึกเรียบร้อย</span>
              )}
            </div>
            <textarea
              id={`note-${requirement.id}`}
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="เช่น ทดสอบบน Ubuntu 22.04 ผ่านแล้ว, interface เป็น enp0s8, curl ได้ค่า 200 OK..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <div className="mt-1 flex justify-end">
              <button
                onClick={handleSaveNote}
                className="rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] px-3 py-1 transition-colors cursor-pointer"
              >
                บันทึกโน้ต
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
