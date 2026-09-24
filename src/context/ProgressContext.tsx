'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import {
  LessonStatus,
  RequirementStatus,
  ProgressState,
  RequirementStage
} from '@/types/curriculum';
import { learningItemsData } from '@/data/learningItems';
import { requirementsData } from '@/data/requirements';
import { allLessons } from '@/data/lessons';

const STORAGE_KEY = 'iot_inception_progress_v1';
const CURRENT_SCHEMA_VERSION = 1;
const CONTENT_VERSION = '4.0.0';

interface StageStats {
  total: number;
  verified: number;
  applicable: number;
  percentage: number;
}

interface ProgressContextType {
  isLoaded: boolean;
  progress: ProgressState;
  learningProgressPercent: number;
  mandatoryProgressPercent: number;
  bonusProgressPercent: number;
  statsByStage: Record<RequirementStage, StageStats>;
  completedLessonsCount: number;
  totalLessonsCount: number;
  
  toggleLearningItem: (id: string) => void;
  isItemChecked: (id: string) => boolean;
  setLessonStatus: (lessonId: string, status: LessonStatus) => void;
  getLessonStatus: (lessonId: string) => LessonStatus;
  
  setRequirementStatus: (reqId: string, status: RequirementStatus) => void;
  getRequirementStatus: (reqId: string) => RequirementStatus;
  
  saveNote: (id: string, note: string) => void;
  getNote: (id: string) => string;
  
  recordVisitLesson: (moduleId: string, lessonId: string) => void;
  exportProgressJSON: () => string;
  importProgressJSON: (jsonStr: string) => { success: boolean; message: string };
  resetProgress: () => void;
}

const defaultProgress: ProgressState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  contentVersion: CONTENT_VERSION,
  lessonStates: {},
  checkedLearningItemIds: [],
  requirementStates: {},
  notes: {},
  settings: {
    theme: 'light'
  }
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage safely on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // Validate & migrate if needed
          setProgress((prev) => ({
            ...prev,
            ...parsed,
            lessonStates: parsed.lessonStates || {},
            checkedLearningItemIds: Array.isArray(parsed.checkedLearningItemIds) ? parsed.checkedLearningItemIds : [],
            requirementStates: parsed.requirementStates || {},
            notes: parsed.notes || {}
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load IoT progress from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change (only after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save IoT progress to localStorage:', e);
    }
  }, [progress, isLoaded]);

  // --- Calculations ---

  // Required learning items calculation
  const { learningProgressPercent, completedLessonsCount, totalLessonsCount } = useMemo(() => {
    const requiredItems = learningItemsData.filter((i) => i.required);
    const checkedRequiredCount = requiredItems.filter((i) =>
      progress.checkedLearningItemIds.includes(i.id)
    ).length;

    const percent = requiredItems.length > 0
      ? Math.round((checkedRequiredCount / requiredItems.length) * 100)
      : 0;

    let completedCount = 0;
    allLessons.forEach((l) => {
      const lessonItems = learningItemsData.filter((i) => i.lessonId === l.id && i.required);
      if (lessonItems.length > 0) {
        const allDone = lessonItems.every((i) => progress.checkedLearningItemIds.includes(i.id));
        if (allDone || progress.lessonStates[l.id] === 'completed') {
          completedCount++;
        }
      } else if (progress.lessonStates[l.id] === 'completed') {
        completedCount++;
      }
    });

    return {
      learningProgressPercent: percent,
      completedLessonsCount: completedCount,
      totalLessonsCount: allLessons.length
    };
  }, [progress.checkedLearningItemIds, progress.lessonStates]);

  // Requirements Readiness by Stage
  const { mandatoryProgressPercent, bonusProgressPercent, statsByStage } = useMemo(() => {
    const stages: RequirementStage[] = ['General', 'P1', 'P2', 'P3', 'Bonus', 'Submission'];
    const result: Record<RequirementStage, StageStats> = {
      General: { total: 0, verified: 0, applicable: 0, percentage: 0 },
      P1: { total: 0, verified: 0, applicable: 0, percentage: 0 },
      P2: { total: 0, verified: 0, applicable: 0, percentage: 0 },
      P3: { total: 0, verified: 0, applicable: 0, percentage: 0 },
      Bonus: { total: 0, verified: 0, applicable: 0, percentage: 0 },
      Submission: { total: 0, verified: 0, applicable: 0, percentage: 0 }
    };

    let totalMandatoryApplicable = 0;
    let totalMandatoryVerified = 0;

    let totalBonusApplicable = 0;
    let totalBonusVerified = 0;

    requirementsData.forEach((req) => {
      // Only count mandatory classified requirements for standard readiness percentage
      if (req.classification !== 'mandatory') return;

      const stage = req.stage;
      const status = progress.requirementStates[req.id] || 'not-started';
      const isApplicable = status !== 'not-applicable';
      const isVerified = status === 'verified';

      result[stage].total++;
      if (isApplicable) {
        result[stage].applicable++;
      }
      if (isVerified) {
        result[stage].verified++;
      }

      if (stage === 'Bonus') {
        if (isApplicable) totalBonusApplicable++;
        if (isVerified) totalBonusVerified++;
      } else {
        if (isApplicable) totalMandatoryApplicable++;
        if (isVerified) totalMandatoryVerified++;
      }
    });

    stages.forEach((s) => {
      const st = result[s];
      st.percentage = st.applicable > 0 ? Math.round((st.verified / st.applicable) * 100) : 0;
    });

    const mPercent = totalMandatoryApplicable > 0
      ? Math.round((totalMandatoryVerified / totalMandatoryApplicable) * 100)
      : 0;

    const bPercent = totalBonusApplicable > 0
      ? Math.round((totalBonusVerified / totalBonusApplicable) * 100)
      : 0;

    return {
      mandatoryProgressPercent: mPercent,
      bonusProgressPercent: bPercent,
      statsByStage: result
    };
  }, [progress.requirementStates]);

  // Ref to always access latest progress in callbacks without causing dependency thrashing
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // --- Actions ---

  const toggleLearningItem = useCallback((id: string) => {
    setProgress((prev) => {
      const isCurrentlyChecked = prev.checkedLearningItemIds.includes(id);
      const newChecked = isCurrentlyChecked
        ? prev.checkedLearningItemIds.filter((itemId) => itemId !== id)
        : [...prev.checkedLearningItemIds, id];

      // Find which lesson this item belongs to
      const item = learningItemsData.find((i) => i.id === id);
      const newLessonStates = { ...prev.lessonStates };

      if (item) {
        const lessonItems = learningItemsData.filter((i) => i.lessonId === item.lessonId && i.required);
        const allLessonRequiredDone = lessonItems.every((i) => newChecked.includes(i.id));

        if (allLessonRequiredDone && lessonItems.length > 0) {
          newLessonStates[item.lessonId] = 'completed';
        } else if (newLessonStates[item.lessonId] === 'completed') {
          newLessonStates[item.lessonId] = 'in-progress';
        }
      }

      return {
        ...prev,
        checkedLearningItemIds: newChecked,
        lessonStates: newLessonStates
      };
    });
  }, []);

  const isItemChecked = useCallback(
    (id: string) => {
      return progress.checkedLearningItemIds.includes(id);
    },
    [progress.checkedLearningItemIds]
  );

  const setLessonStatus = useCallback((lessonId: string, status: LessonStatus) => {
    setProgress((prev) => {
      if (prev.lessonStates[lessonId] === status) return prev;
      return {
        ...prev,
        lessonStates: {
          ...prev.lessonStates,
          [lessonId]: status
        }
      };
    });
  }, []);

  const getLessonStatus = useCallback(
    (lessonId: string): LessonStatus => {
      // If all required items are checked, automatically completed
      const lessonItems = learningItemsData.filter((i) => i.lessonId === lessonId && i.required);
      if (lessonItems.length > 0 && lessonItems.every((i) => progress.checkedLearningItemIds.includes(i.id))) {
        return 'completed';
      }
      return progress.lessonStates[lessonId] || 'not-started';
    },
    [progress.checkedLearningItemIds, progress.lessonStates]
  );

  const setRequirementStatus = useCallback((reqId: string, status: RequirementStatus) => {
    setProgress((prev) => {
      if (prev.requirementStates[reqId] === status) return prev;
      return {
        ...prev,
        requirementStates: {
          ...prev.requirementStates,
          [reqId]: status
        }
      };
    });
  }, []);

  const getRequirementStatus = useCallback(
    (reqId: string): RequirementStatus => {
      return progress.requirementStates[reqId] || 'not-started';
    },
    [progress.requirementStates]
  );

  const saveNote = useCallback((id: string, note: string) => {
    setProgress((prev) => {
      if (prev.notes[id] === note) return prev;
      return {
        ...prev,
        notes: {
          ...prev.notes,
          [id]: note
        }
      };
    });
  }, []);

  const getNote = useCallback((id: string): string => {
    return progressRef.current.notes[id] || '';
  }, []);

  const recordVisitLesson = useCallback((moduleId: string, lessonId: string) => {
    setProgress((prev) => {
      const currentStatus = prev.lessonStates[lessonId];
      const nextStatus = currentStatus === 'completed' ? 'completed' : 'in-progress';
      if (
        prev.lastLocation?.moduleId === moduleId &&
        prev.lastLocation?.lessonId === lessonId &&
        currentStatus === nextStatus
      ) {
        return prev;
      }
      return {
        ...prev,
        lastLocation: { moduleId, lessonId },
        lessonStates: {
          ...prev.lessonStates,
          [lessonId]: nextStatus
        }
      };
    });
  }, []);

  const exportProgressJSON = useCallback((): string => {
    const current = progressRef.current;
    const exportData = {
      exportDate: new Date().toISOString(),
      schemaVersion: CURRENT_SCHEMA_VERSION,
      contentVersion: CONTENT_VERSION,
      progress: {
        lessonStates: current.lessonStates,
        checkedLearningItemIds: current.checkedLearningItemIds,
        requirementStates: current.requirementStates,
        notes: current.notes,
        lastLocation: current.lastLocation
      }
    };
    return JSON.stringify(exportData, null, 2);
  }, []);

  const importProgressJSON = useCallback((jsonStr: string): { success: boolean; message: string } => {
    try {
      if (!jsonStr || jsonStr.trim().length === 0) {
        return { success: false, message: 'ไฟล์ JSON ว่างเปล่า' };
      }
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'รูปแบบ JSON ไม่ถูกต้อง' };
      }

      const pData = parsed.progress || parsed;
      if (!pData || typeof pData !== 'object') {
        return { success: false, message: 'ไม่พบข้อมูล progress ในไฟล์ JSON' };
      }

      const newLessonStates = pData.lessonStates && typeof pData.lessonStates === 'object' ? pData.lessonStates : {};
      const newChecked = Array.isArray(pData.checkedLearningItemIds) ? pData.checkedLearningItemIds : [];
      const newRequirements = pData.requirementStates && typeof pData.requirementStates === 'object' ? pData.requirementStates : {};
      const newNotes = pData.notes && typeof pData.notes === 'object' ? pData.notes : {};

      setProgress((prev) => ({
        ...prev,
        lessonStates: newLessonStates,
        checkedLearningItemIds: newChecked,
        requirementStates: newRequirements,
        notes: newNotes,
        lastLocation: pData.lastLocation || prev.lastLocation
      }));

      return {
        success: true,
        message: `นำเข้าความคืบหน้าสำเร็จ! (ติ๊กแล้ว ${newChecked.length} รายการ, บันทึก ${Object.keys(newNotes).length} โน้ต)`
      };
    } catch (e: any) {
      return { success: false, message: `เกิดข้อผิดพลาดในการอ่าน JSON: ${e?.message || 'รูปแบบไม่ถูกต้อง'}` };
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const contextValue = useMemo<ProgressContextType>(
    () => ({
      isLoaded,
      progress,
      learningProgressPercent,
      mandatoryProgressPercent,
      bonusProgressPercent,
      statsByStage,
      completedLessonsCount,
      totalLessonsCount,
      toggleLearningItem,
      isItemChecked,
      setLessonStatus,
      getLessonStatus,
      setRequirementStatus,
      getRequirementStatus,
      saveNote,
      getNote,
      recordVisitLesson,
      exportProgressJSON,
      importProgressJSON,
      resetProgress
    }),
    [
      isLoaded,
      progress,
      learningProgressPercent,
      mandatoryProgressPercent,
      bonusProgressPercent,
      statsByStage,
      completedLessonsCount,
      totalLessonsCount,
      toggleLearningItem,
      isItemChecked,
      setLessonStatus,
      getLessonStatus,
      setRequirementStatus,
      getRequirementStatus,
      saveNote,
      getNote,
      recordVisitLesson,
      exportProgressJSON,
      importProgressJSON,
      resetProgress
    ]
  );

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
