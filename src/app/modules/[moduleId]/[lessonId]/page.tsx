import React from 'react';
import { notFound } from 'next/navigation';
import { allLessons, getLessonById } from '@/data/lessons';
import { modulesData } from '@/data/modules';
import { LessonView } from '@/components/LessonView';

export function generateStaticParams() {
  return allLessons.map((l) => ({
    moduleId: l.moduleId,
    lessonId: l.id,
  }));
}

interface PageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { moduleId, lessonId } = await params;

  const lesson = getLessonById(lessonId);
  const currentModule = modulesData.find((m) => m.id === moduleId);

  if (!lesson || !currentModule) {
    notFound();
  }

  return <LessonView lesson={lesson} currentModule={currentModule} />;
}
