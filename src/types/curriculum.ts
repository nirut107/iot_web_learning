export type Stage =
  | 'Foundation'
  | 'Part 1'
  | 'Part 2'
  | 'Part 3'
  | 'Bonus'
  | 'Defense';

export type RequirementStage =
  | 'General'
  | 'P1'
  | 'P2'
  | 'P3'
  | 'Bonus'
  | 'Submission';

export type RequirementClassification = 'mandatory' | 'advice' | 'optional';

export type RequirementStatus =
  | 'not-started'
  | 'in-progress'
  | 'verified'
  | 'not-applicable';

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export type LearningItemKind = 'concept' | 'practice' | 'verification';

export interface SourceRef {
  sourceId: string;
  title: string;
  section?: string;
  printedPage?: number;
  pdfPage?: number;
  url?: string;
}

export interface ExerciseStep {
  stepNumber: number;
  instruction: string;
  command?: string;
  expectedOutput?: string;
  explanation?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  goal: string;
  prerequisites: string[];
  executionContext: string;
  steps: ExerciseStep[];
  expectedResult: string;
  verification: string;
  cleanup?: string;
  troubleshooting: string;
}

export interface LearningItem {
  id: string;
  lessonId: string;
  text: string;
  required: boolean;
  kind: LearningItemKind;
}

export interface Lesson {
  id: string;
  slug: string;
  moduleId: string;
  title: string;
  objectives: string[];
  prerequisiteIds: string[];
  stage: Stage;
  readingTime: number; // in minutes
  summary: string;
  content: string; // rich markdown text
  exerciseIds: string[];
  checklistIds: string[];
  sourceRefs: SourceRef[];
}

export interface Module {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  stage: Stage;
  description: string;
  iconName: string;
  lessonIds: string[];
}

export interface Requirement {
  id: string;
  stage: RequirementStage;
  title: string;
  detail: string;
  classification: RequirementClassification;
  applicabilityCondition?: string;
  sourceRefs: SourceRef[];
  lessonIds: string[];
  verification: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  aliases: string[];
  thaiMeaning: string;
  explanation: string;
  lessonIds: string[];
  category: 'Kubernetes' | 'Docker' | 'Network' | 'Vagrant' | 'GitOps' | 'Linux' | 'General';
}

export interface TroubleshootingItem {
  id: string;
  symptom: string;
  category: 'Vagrant/VM' | 'K3s/Network' | 'Ingress/Routing' | 'K3d/Docker' | 'ArgoCD/Git' | 'GitLab/Storage' | 'General';
  possibleCauses: string[];
  verification: string;
  fix: string;
  stage: string;
  lessonId?: string;
}

export interface DefenseQuestion {
  id: string;
  question: string;
  answer: string;
  stage: string;
  relatedLessons: string[];
  keyPoints: string[];
  trap?: string;
}

export interface ProgressState {
  schemaVersion: number;
  contentVersion: string;
  lessonStates: Record<string, LessonStatus>;
  checkedLearningItemIds: string[];
  requirementStates: Record<string, RequirementStatus>;
  notes: Record<string, string>;
  lastLocation?: { moduleId: string; lessonId: string };
  settings: {
    theme: 'light' | 'dark' | 'system';
  };
}
