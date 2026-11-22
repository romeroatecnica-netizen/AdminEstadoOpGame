import { BlockId, BlockProgress, ExamHistoryEntry, Question, UserProgress } from '../types';

const PROGRESS_KEY = 'adminestadoopgame_progress_v1';
const CUSTOM_BANK_KEY = 'adminestadoopgame_custom_bank_v1';

function getTodayIsoDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function emptyBlockProgress(): BlockProgress {
  return {
    answered: 0,
    hits: 0,
    lessonsCompleted: 0,
    xpEarned: 0,
  };
}

export function createInitialProgress(): UserProgress {
  return {
    xp: 0,
    streakDays: 1,
    lastActiveDate: getTodayIsoDate(),
    lives: 5,
    maxLives: 5,
    freeTrainingMode: false,
    blocks: {
      1: emptyBlockProgress(),
      2: emptyBlockProgress(),
      3: emptyBlockProgress(),
      4: emptyBlockProgress(),
      5: emptyBlockProgress(),
      6: emptyBlockProgress(),
    },
    caseStudiesCompleted: [],
    examHistory: [],
    errorClinic: {},
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      const initial = createInitialProgress();
      saveUserProgress(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as UserProgress;
    const today = getTodayIsoDate();
    const yesterday = getYesterdayIsoDate();

    let streakDays = parsed.streakDays || 1;
    if (parsed.lastActiveDate !== today) {
      if (parsed.lastActiveDate === yesterday) {
        streakDays += 1;
      } else {
        streakDays = 1;
      }
      parsed.lives = parsed.maxLives ?? 5;
      parsed.lastActiveDate = today;
      parsed.streakDays = streakDays;
    }

    const base = createInitialProgress();
    const merged: UserProgress = {
      ...base,
      ...parsed,
      blocks: {
        ...base.blocks,
        ...(parsed.blocks || {}),
      },
      errorClinic: parsed.errorClinic || {},
      examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
      caseStudiesCompleted: Array.isArray(parsed.caseStudiesCompleted)
        ? parsed.caseStudiesCompleted
        : [],
    };
    saveUserProgress(merged);
    return merged;
  } catch {
    return createInitialProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage quota or private mode fallback: fail gracefully without breaking UI
  }
}

export function recordQuestionAttempt(
  prev: UserProgress,
  question: Question,
  selectedOption: number | null,
  xpPerHit = 15
): UserProgress {
  if (selectedOption === null) return prev;
  const isCorrect = selectedOption === question.correctIndex;
  const blockId: BlockId = question.block;
  const prevBlock = prev.blocks[blockId] || emptyBlockProgress();

  const updatedBlock: BlockProgress = {
    ...prevBlock,
    answered: prevBlock.answered + 1,
    hits: prevBlock.hits + (isCorrect ? 1 : 0),
    xpEarned: prevBlock.xpEarned + (isCorrect ? xpPerHit : 0),
  };

  const nextClinic = { ...prev.errorClinic };
  if (!isCorrect) {
    const existing = nextClinic[question.id];
    nextClinic[question.id] = {
      questionId: question.id,
      question,
      wrongCount: existing ? existing.wrongCount + 1 : 1,
      lastWrongOption: selectedOption,
      lastFailedAt: new Date().toISOString(),
      mastered: false,
    };
  } else if (nextClinic[question.id]) {
    nextClinic[question.id] = {
      ...nextClinic[question.id],
      mastered: true,
    };
  }

  const nextLives =
    !isCorrect && !prev.freeTrainingMode ? Math.max(0, prev.lives - 1) : prev.lives;

  return {
    ...prev,
    xp: prev.xp + (isCorrect ? xpPerHit : 2),
    lives: nextLives,
    lastActiveDate: getTodayIsoDate(),
    blocks: {
      ...prev.blocks,
      [blockId]: updatedBlock,
    },
    errorClinic: nextClinic,
  };
}

export function recordExamResult(
  prev: UserProgress,
  entry: ExamHistoryEntry,
  xpReward: number
): UserProgress {
  const nextHistory = [entry, ...prev.examHistory].slice(0, 40);
  const nextCaseStudies =
    entry.caseStudyChosen && !prev.caseStudiesCompleted.includes(entry.caseStudyChosen)
      ? [...prev.caseStudiesCompleted, entry.caseStudyChosen]
      : prev.caseStudiesCompleted;

  return {
    ...prev,
    xp: prev.xp + xpReward,
    lastActiveDate: getTodayIsoDate(),
    examHistory: nextHistory,
    caseStudiesCompleted: nextCaseStudies,
  };
}

export function loadCustomQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(CUSTOM_BANK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(CUSTOM_BANK_KEY, JSON.stringify(questions));
  } catch {
    // Fail gracefully if quota exceeded
  }
}
