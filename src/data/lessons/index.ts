import { Lesson } from '@/types/curriculum';
import { m00Lessons } from './m00';
import { m01Lessons } from './m01';
import { m02Lessons } from './m02';
import { m03Lessons } from './m03';
import { m04Lessons } from './m04';
import { m05Lessons } from './m05';
import { m06Lessons } from './m06';
import { m07Lessons } from './m07';
import { m08Lessons } from './m08';
import { m09Lessons } from './m09';
import { m10Lessons } from './m10';
import { m11Lessons } from './m11';
import { m12Lessons } from './m12';
import { m13Lessons } from './m13';
import { m14Lessons } from './m14';

export const allLessons: Lesson[] = [
  ...m00Lessons,
  ...m01Lessons,
  ...m02Lessons,
  ...m03Lessons,
  ...m04Lessons,
  ...m05Lessons,
  ...m06Lessons,
  ...m07Lessons,
  ...m08Lessons,
  ...m09Lessons,
  ...m10Lessons,
  ...m11Lessons,
  ...m12Lessons,
  ...m13Lessons,
  ...m14Lessons,
];

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getLessonsByModuleId(moduleId: string): Lesson[] {
  return allLessons.filter((l) => l.moduleId === moduleId);
}

export function getAdjacentLessons(currentId: string): { prev?: Lesson; next?: Lesson } {
  const index = allLessons.findIndex((l) => l.id === currentId);
  if (index === -1) return {};
  return {
    prev: index > 0 ? allLessons[index - 1] : undefined,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : undefined,
  };
}
