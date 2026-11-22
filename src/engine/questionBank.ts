import { BLOQUE_1_QUESTIONS } from '../data/bloque1';
import { BLOQUE_2_QUESTIONS } from '../data/bloque2';
import { BLOQUE_3_QUESTIONS } from '../data/bloque3';
import { BLOQUE_4_QUESTIONS } from '../data/bloque4';
import { BLOQUE_5_QUESTIONS } from '../data/bloque5';
import { BLOQUE_6_QUESTIONS } from '../data/bloque6';
import { OFFICIAL_CASE_STUDIES } from '../data/supuestos';
import { BlockId, CaseStudy, Question } from '../types';
import { loadCustomQuestions, saveCustomQuestions } from './storage';

export const EMBEDDED_QUESTIONS: Question[] = [
  ...BLOQUE_1_QUESTIONS,
  ...BLOQUE_2_QUESTIONS,
  ...BLOQUE_3_QUESTIONS,
  ...BLOQUE_4_QUESTIONS,
  ...BLOQUE_5_QUESTIONS,
  ...BLOQUE_6_QUESTIONS,
].map((q) => ({ ...q, source: 'embedded' as const }));

export const EMBEDDED_CASE_STUDIES: CaseStudy[] = OFFICIAL_CASE_STUDIES;

export function isValidQuestion(candidate: unknown): candidate is Question {
  if (!candidate || typeof candidate !== 'object') return false;
  const q = candidate as Record<string, unknown>;
  const validBlock =
    typeof q.block === 'number' && [1, 2, 3, 4, 5, 6].includes(q.block);
  const validOptions =
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0);
  const validCorrect =
    typeof q.correctIndex === 'number' && [0, 1, 2, 3].includes(q.correctIndex);

  return (
    typeof q.id === 'string' &&
    q.id.trim().length > 0 &&
    validBlock &&
    typeof q.question === 'string' &&
    q.question.trim().length > 5 &&
    validOptions &&
    validCorrect
  );
}

export function normalizeImportedQuestions(rawList: unknown[]): {
  valid: Question[];
  rejected: number;
} {
  const valid: Question[] = [];
  let rejected = 0;

  rawList.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      rejected++;
      return;
    }
    const obj = item as Record<string, unknown>;
    const normalized: Record<string, unknown> = {
      ...obj,
      id: typeof obj.id === 'string' && obj.id.trim() ? obj.id.trim() : `imp-${Date.now()}-${index}`,
      topic: typeof obj.topic === 'string' && obj.topic.trim() ? obj.topic.trim() : 'Banco importado',
      articleRef:
        typeof obj.articleRef === 'string' && obj.articleRef.trim()
          ? obj.articleRef.trim()
          : 'Referencia normativa C1',
      explanation:
        typeof obj.explanation === 'string' && obj.explanation.trim()
          ? obj.explanation.trim()
          : 'Pregunta importada desde paquete JSON externo.',
      difficulty:
        obj.difficulty === 'base' || obj.difficulty === 'medio' || obj.difficulty === 'alto'
          ? obj.difficulty
          : 'medio',
      source: 'imported',
    };

    if (isValidQuestion(normalized)) {
      valid.push(normalized);
    } else {
      rejected++;
    }
  });

  return { valid, rejected };
}

/**
 * Carga opcional y asíncrona desde /data/bloque1.json ... /data/bloque6.json
 * y /data/supuestos.json si el usuario aloja archivos estáticos adicionales.
 */
export async function loadOptionalExternalBanks(): Promise<{
  questions: Question[];
  caseStudies: CaseStudy[];
}> {
  const externalQuestions: Question[] = [];
  const externalCaseStudies: CaseStudy[] = [];

  const blockUrls = [1, 2, 3, 4, 5, 6].map((b) => `/data/bloque${b}.json`);

  await Promise.all(
    blockUrls.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return;
        const data = await res.json();
        const arr = Array.isArray(data) ? data : Array.isArray(data?.questions) ? data.questions : [];
        const { valid } = normalizeImportedQuestions(arr);
        valid.forEach((q) => externalQuestions.push({ ...q, source: 'external' }));
      } catch {
        // Silencioso: los archivos externos son estrictamente opcionales
      }
    })
  );

  try {
    const res = await fetch('/data/supuestos.json', { cache: 'no-store' });
    if (res.ok && (res.headers.get('content-type') || '').includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((cs) => {
          if (cs && typeof cs.title === 'string' && Array.isArray(cs.questions)) {
            externalCaseStudies.push(cs as CaseStudy);
          }
        });
      }
    }
  } catch {
    // Opcional
  }

  return { questions: externalQuestions, caseStudies: externalCaseStudies };
}

export function mergeQuestionBanks(
  embedded: Question[],
  external: Question[],
  imported: Question[]
): Question[] {
  const map = new Map<string, Question>();
  [...embedded, ...external, ...imported].forEach((q) => {
    map.set(q.id, q);
  });
  return Array.from(map.values());
}

export function importJsonIntoCustomBank(jsonText: string): {
  added: number;
  rejected: number;
  totalCustom: number;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonText);
    const list = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.questions)
      ? parsed.questions
      : null;

    if (!list) {
      return {
        added: 0,
        rejected: 0,
        totalCustom: loadCustomQuestions().length,
        error: 'El JSON debe ser un array de preguntas o un objeto con la propiedad "questions".',
      };
    }

    const { valid, rejected } = normalizeImportedQuestions(list);
    const existing = loadCustomQuestions();
    const mergedMap = new Map<string, Question>();
    existing.forEach((q) => mergedMap.set(q.id, q));
    let added = 0;
    valid.forEach((q) => {
      if (!mergedMap.has(q.id)) added++;
      mergedMap.set(q.id, q);
    });

    const finalCustom = Array.from(mergedMap.values());
    saveCustomQuestions(finalCustom);

    return {
      added,
      rejected,
      totalCustom: finalCustom.length,
    };
  } catch {
    return {
      added: 0,
      rejected: 0,
      totalCustom: loadCustomQuestions().length,
      error: 'Error de sintaxis JSON. Verifica llaves, comillas dobles y comas.',
    };
  }
}

export function clearCustomBank(): void {
  saveCustomQuestions([]);
}

export function getQuestionsByBlock(allQuestions: Question[], block: BlockId | 'all'): Question[] {
  if (block === 'all') return allQuestions;
  return allQuestions.filter((q) => q.block === block);
}

/**
 * Baraja determinista usando PRNG Mulberry32 para que los retos compartidos por URL
 * generen exactamente el mismo orden de preguntas para ambos opositores.
 */
export function deterministicShuffle<T>(items: T[], seed: number): T[] {
  const copy = [...items];
  let t = seed >>> 0;
  const rand = () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
