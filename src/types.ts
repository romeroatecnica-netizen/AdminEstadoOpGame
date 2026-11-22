export type BlockId = 1 | 2 | 3 | 4 | 5 | 6;

export type AppMode =
  | 'ruta'
  | 'simulacro'
  | 'generador'
  | 'clinica'
  | 'temario';

export type MasteryTier = 'Sin iniciar' | 'Bronce' | 'Plata' | 'Oro' | 'Experto INAP';

export interface Question {
  id: string;
  block: BlockId;
  topic: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  articleRef: string;
  explanation: string;
  difficulty: 'base' | 'medio' | 'alto';
  isTrapWord?: boolean;
  trapWord?: string;
  source?: 'embedded' | 'external' | 'imported';
}

export interface CaseStudy {
  id: 'supuesto-a' | 'supuesto-b';
  code: string;
  title: string;
  subtitle: string;
  blocksCovered: BlockId[];
  statement: string;
  questions: Question[];
}

export interface FailedQuestionRecord {
  questionId: string;
  question: Question;
  wrongCount: number;
  lastWrongOption: number;
  lastFailedAt: string;
  mastered: boolean;
}

export interface ExamPartSummary {
  label: string;
  totalQuestions: number;
  hits: number;
  mistakes: number;
  blanks: number;
  grossScore: number;
  penaltyLost: number;
  netScore: number;
  maxScore: number;
  scaledScore50: number;
  cutoff50: number;
  passed: boolean;
}

export interface ExamHistoryEntry {
  id: string;
  createdAt: string;
  modeLabel: string;
  isFullOfficial: boolean;
  caseStudyChosen?: 'supuesto-a' | 'supuesto-b';
  durationSeconds: number;
  totalQuestions: number;
  hits: number;
  mistakes: number;
  blanks: number;
  grossScore: number;
  penaltyLost: number;
  netScore: number;
  scaledTotal100: number;
  cutoffTotal100: number;
  passed: boolean;
  part1?: ExamPartSummary;
  part2?: ExamPartSummary;
}

export interface BlockProgress {
  answered: number;
  hits: number;
  lessonsCompleted: number;
  xpEarned: number;
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  lives: number;
  maxLives: number;
  freeTrainingMode: boolean; // Entrenamiento libre sin vidas
  blocks: Record<BlockId, BlockProgress>;
  caseStudiesCompleted: string[];
  examHistory: ExamHistoryEntry[];
  errorClinic: Record<string, FailedQuestionRecord>;
}

export interface ParametricExercise {
  id: string;
  category: 'plazos' | 'gasto' | 'excel';
  categoryLabel: string;
  title: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  articleRef: string;
  steps: string[];
  seed: number;
}

export interface SharedChallenge {
  type: 'simulacro' | 'ruta' | 'generador' | 'resultado';
  block?: BlockId | 'all';
  questionCount?: number;
  cutoff?: number;
  seed?: number;
  challengerScore?: string;
  challengerName?: string;
}
