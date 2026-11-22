import { BlockProgress, ExamPartSummary, MasteryTier } from '../types';

export interface ScoreBreakdown {
  totalQuestions: number;
  answered: number;
  hits: number;
  mistakes: number;
  blanks: number;
  grossScore: number;
  penaltyLost: number;
  netScore: number;
  accuracyOnAnswered: number; // %
  scaledScore50: number;
  scaledScore100: number;
}

/**
 * Fórmula oficial INAP: Puntuación Neta = Aciertos - (Fallos / 3)
 * Preguntas en blanco: 0 puntos (no penalizan).
 */
export function calculateInapScore(
  totalQuestions: number,
  hits: number,
  mistakes: number
): ScoreBreakdown {
  const answered = hits + mistakes;
  const blanks = Math.max(0, totalQuestions - answered);
  const grossScore = hits;
  const penaltyLost = mistakes / 3;
  const netScore = hits - penaltyLost;
  const accuracyOnAnswered = answered > 0 ? (hits / answered) * 100 : 0;

  const safeTotal = totalQuestions > 0 ? totalQuestions : 1;
  const scaledScore50 = Math.max(0, (netScore / safeTotal) * 50);
  const scaledScore100 = Math.max(0, (netScore / safeTotal) * 100);

  return {
    totalQuestions,
    answered,
    hits,
    mistakes,
    blanks,
    grossScore,
    penaltyLost,
    netScore,
    accuracyOnAnswered,
    scaledScore50,
    scaledScore100,
  };
}

export function buildPartSummary(
  label: string,
  totalQuestions: number,
  hits: number,
  mistakes: number,
  cutoff50: number
): ExamPartSummary {
  const s = calculateInapScore(totalQuestions, hits, mistakes);
  return {
    label,
    totalQuestions,
    hits,
    mistakes,
    blanks: s.blanks,
    grossScore: s.grossScore,
    penaltyLost: s.penaltyLost,
    netScore: s.netScore,
    maxScore: totalQuestions,
    scaledScore50: s.scaledScore50,
    cutoff50,
    passed: s.scaledScore50 >= cutoff50,
  };
}

export interface RiskTacticInsight {
  evTwoOptions: number; // +0.333
  evThreeOptions: number; // +0.111
  evFourOptions: number; // 0.000
  breakEvenAccuracyPercent: number; // 25%
  recommendationTitle: string;
  recommendationBody: string;
}

export function evaluateRiskStrategy(
  breakdown: ScoreBreakdown,
  cutoffTarget50?: number
): RiskTacticInsight {
  const evTwoOptions = 0.5 * 1 - 0.5 * (1 / 3); // +0.3333
  const evThreeOptions = (1 / 3) * 1 - (2 / 3) * (1 / 3); // +0.1111
  const evFourOptions = 0.25 * 1 - 0.75 * (1 / 3); // 0.0000

  let recommendationTitle = 'Equilibrio óptimo entre precisión y riesgo';
  let recommendationBody =
    'Si descartas con seguridad 2 alternativas (duda entre 2), la esperanza matemática es +0,33 puntos por pregunta: compensa responder siempre. Si dudas entre 3, el valor esperado es +0,11 (compensa si necesitas remontar hacia la nota de corte). A 4 opciones al azar la esperanza es 0,00 y solo añade varianza.';

  if (breakdown.answered > 0 && breakdown.accuracyOnAnswered < 55 && breakdown.mistakes > 8) {
    recommendationTitle = 'Exceso de penalización por respuestas arriesgadas';
    recommendationBody = `Has perdido ${breakdown.penaltyLost.toFixed(2)} puntos por ${breakdown.mistakes} fallos (tu acierto sobre contestadas es del ${breakdown.accuracyOnAnswered.toFixed(1)} %). Prioriza dejar en blanco las dudas puras entre 4 opciones y arriesga únicamente cuando hayas descartado al menos 2 distractores.`;
  } else if (
    cutoffTarget50 !== undefined &&
    breakdown.scaledScore50 < cutoffTarget50 &&
    breakdown.blanks >= 8
  ) {
    recommendationTitle = 'Conservadurismo excesivo frente a la nota de corte';
    recommendationBody = `Has dejado ${breakdown.blanks} preguntas en blanco y te quedas por debajo del corte (${cutoffTarget50.toFixed(1)}/50). En preguntas donde dudes entre 2 opciones (+0,33 EV) conviene arriesgar para alcanzar el corte.`;
  }

  return {
    evTwoOptions,
    evThreeOptions,
    evFourOptions,
    breakEvenAccuracyPercent: 25,
    recommendationTitle,
    recommendationBody,
  };
}

export function getBlockMasteryTier(progress: BlockProgress): MasteryTier {
  const accuracy = progress.answered > 0 ? progress.hits / progress.answered : 0;
  if (progress.lessonsCompleted === 0 && progress.answered === 0) {
    return 'Sin iniciar';
  }
  if (progress.lessonsCompleted >= 4 && accuracy >= 0.85) {
    return 'Experto INAP';
  }
  if (progress.lessonsCompleted >= 3 && accuracy >= 0.75) {
    return 'Oro';
  }
  if (progress.lessonsCompleted >= 2 && accuracy >= 0.6) {
    return 'Plata';
  }
  return 'Bronce';
}

export function getUserLevelInfo(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const levels = [
    { minXp: 0, title: 'Aspirante C1' },
    { minXp: 150, title: 'Auxiliar en Prácticas' },
    { minXp: 400, title: 'Opositor Constante' },
    { minXp: 800, title: 'Técnico Normativo' },
    { minXp: 1400, title: 'Especialista LPACAP' },
    { minXp: 2200, title: 'Maestro del Supuesto' },
    { minXp: 3200, title: 'Cuerpo General C1 INAP' },
  ];

  let idx = 0;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].minXp) {
      idx = i;
    }
  }

  const current = levels[idx];
  const next = levels[idx + 1];
  if (!next) {
    return {
      level: idx + 1,
      title: current.title,
      currentLevelXp: xp - current.minXp,
      nextLevelXp: 1000,
      progressPercent: 100,
    };
  }

  const span = next.minXp - current.minXp;
  const gained = xp - current.minXp;
  return {
    level: idx + 1,
    title: current.title,
    currentLevelXp: gained,
    nextLevelXp: span,
    progressPercent: Math.min(100, Math.round((gained / span) * 100)),
  };
}
