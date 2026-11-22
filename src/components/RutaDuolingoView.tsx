import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Heart,
  Play,
  RefreshCw,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react';
import { BLOCK_METADATA } from '../data/syllabus';
import { deterministicShuffle, getQuestionsByBlock } from '../engine/questionBank';
import { getBlockMasteryTier } from '../engine/scoring';
import { BlockId, CaseStudy, Question, UserProgress } from '../types';

interface RutaDuolingoViewProps {
  allQuestions: Question[];
  caseStudies: CaseStudy[];
  progress: UserProgress;
  onAttemptQuestion: (question: Question, selectedIndex: number, xpPerHit?: number) => void;
  onCompleteLesson: (blockId: BlockId | 'mixed', xpBonus: number) => void;
  onRefillLives: () => void;
  onOpenSimulacroWithCase: (caseId: 'supuesto-a' | 'supuesto-b') => void;
  onOpenClinica: () => void;
}

type ActiveSessionType =
  | { kind: 'block'; blockId: BlockId; title: string }
  | { kind: 'blitz'; title: string }
  | { kind: 'traps'; title: string }
  | { kind: 'office'; title: string }
  | { kind: 'clinic'; title: string };

export const RutaDuolingoView: React.FC<RutaDuolingoViewProps> = ({
  allQuestions,
  caseStudies,
  progress,
  onAttemptQuestion,
  onCompleteLesson,
  onRefillLives,
  onOpenSimulacroWithCase,
  onOpenClinica,
}) => {
  const [activeSession, setActiveSession] = useState<ActiveSessionType | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sessionHits, setSessionHits] = useState(0);
  const [sessionMistakes, setSessionMistakes] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState(60);

  const pendingClinicQuestions = useMemo(
    () =>
      Object.values(progress.errorClinic)
        .filter((r) => !r.mastered)
        .map((r) => r.question),
    [progress.errorClinic]
  );

  // Blitz 60-second timer
  useEffect(() => {
    if (!activeSession || activeSession.kind !== 'blitz' || sessionFinished) return;
    if (blitzSecondsLeft <= 0) {
      setSessionFinished(true);
      onCompleteLesson('mixed', sessionHits * 5);
      return;
    }
    const timer = window.setInterval(() => {
      setBlitzSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeSession, blitzSecondsLeft, sessionFinished, sessionHits, onCompleteLesson]);

  const startSession = (type: ActiveSessionType) => {
    if (!progress.freeTrainingMode && progress.lives <= 0) {
      return;
    }
    const seed = Date.now() % 1000000;
    let pool: Question[] = [];

    if (type.kind === 'block') {
      pool = deterministicShuffle(getQuestionsByBlock(allQuestions, type.blockId), seed).slice(0, 10);
    } else if (type.kind === 'blitz') {
      const lawPool = allQuestions.filter((q) => [1, 2, 3, 4, 5].includes(q.block));
      pool = deterministicShuffle(lawPool, seed).slice(0, 25);
      setBlitzSecondsLeft(60);
    } else if (type.kind === 'traps') {
      const trapPool = allQuestions.filter(
        (q) =>
          q.isTrapWord ||
          /\b(solo|exclusivamente|siempre|potestativo|en todo caso|únicamente|preceptivo)\b/i.test(
            q.question + ' ' + q.options.join(' ')
          )
      );
      pool = deterministicShuffle(trapPool.length >= 10 ? trapPool : allQuestions, seed).slice(0, 10);
    } else if (type.kind === 'office') {
      pool = deterministicShuffle(getQuestionsByBlock(allQuestions, 6), seed).slice(0, 10);
    } else if (type.kind === 'clinic') {
      pool = deterministicShuffle(pendingClinicQuestions, seed).slice(0, 10);
    }

    if (pool.length === 0) return;
    setActiveSession(type);
    setSessionQuestions(pool);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSessionHits(0);
    setSessionMistakes(0);
    setSessionFinished(false);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || sessionFinished) return;
    const currentQ = sessionQuestions[currentIndex];
    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setSessionHits((h) => h + 1);
    } else {
      setSessionMistakes((m) => m + 1);
    }
    onAttemptQuestion(currentQ, idx, activeSession?.kind === 'blitz' ? 12 : 15);
  };

  const handleAdvance = () => {
    if (!progress.freeTrainingMode && progress.lives <= 0) {
      setSessionFinished(true);
      return;
    }
    if (currentIndex >= sessionQuestions.length - 1) {
      setSessionFinished(true);
      const bonus = sessionHits >= 8 ? 35 : 15;
      onCompleteLesson(activeSession?.kind === 'block' ? activeSession.blockId : 'mixed', bonus);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
  };

  const letters = ['A', 'B', 'C', 'D'];

  // Active Lesson / Minigame Runner
  if (activeSession) {
    const currentQ = sessionQuestions[currentIndex];
    const progressPct = Math.round(((currentIndex + (selectedOption !== null ? 1 : 0)) / sessionQuestions.length) * 100);

    if (sessionFinished) {
      const answered = sessionHits + sessionMistakes;
      const netSimulated = sessionHits - sessionMistakes / 3;
      const outOfLives = !progress.freeTrainingMode && progress.lives <= 0;

      return (
        <section className="mx-auto max-w-2xl rounded-xl border border-[#E2E8F0] bg-white p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A]">
              {outOfLives ? <Heart className="h-6 w-6 text-[#DC2626]" /> : <Award className="h-6 w-6" />}
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold text-slate-900">
              {outOfLives ? 'Sin vidas disponibles en modo estándar' : 'Entrenamiento completado'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{activeSession.title}</p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-y border-[#E2E8F0] py-5 text-center">
            <div>
              <div className="text-xs text-slate-500">Aciertos</div>
              <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#059669]">
                {sessionHits}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Fallos</div>
              <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#DC2626]">
                {sessionMistakes}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Nota neta (-1/3)</div>
              <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#1E3A8A]">
                {netSimulated.toFixed(2)}
                <span className="text-sm font-normal text-slate-500">/{answered || 1}</span>
              </div>
            </div>
          </div>

          {sessionMistakes > 0 && (
            <p className="mt-4 text-center text-xs text-slate-600">
              Tus {sessionMistakes} fallos se han guardado automáticamente en{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveSession(null);
                  onOpenClinica();
                }}
                className="font-semibold text-[#1E3A8A] underline underline-offset-2"
              >
                Mi Clínica de Fallos
              </button>{' '}
              para repaso dirigido.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {outOfLives && (
              <button
                type="button"
                onClick={() => {
                  onRefillLives();
                  setActiveSession(null);
                }}
                className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
              >
                Recargar 5 vidas
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveSession(null)}
              className="rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#172E6E]"
            >
              Volver a la Ruta C1
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-3xl space-y-5">
        {/* Session progress bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setActiveSession(null)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Salir
          </button>

          <div className="flex-1">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-[#1E3A8A] transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold tabular-nums">
            {activeSession.kind === 'blitz' && (
              <span
                className={`inline-flex items-center gap-1 font-mono-tabular ${
                  blitzSecondsLeft <= 10 ? 'text-[#DC2626]' : 'text-[#1E3A8A]'
                }`}
              >
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {blitzSecondsLeft}s
              </span>
            )}
            <span className="text-slate-700">
              {currentIndex + 1}/{sessionQuestions.length}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              <strong className="text-[#1E3A8A]">{BLOCK_METADATA[currentQ.block].roman}</strong>
              <span aria-hidden="true"> · </span>
              <span>{currentQ.topic}</span>
            </span>
            {currentQ.trapWord && (
              <span className="font-medium text-[#D97706]">
                Atención a palabra clave normativa
              </span>
            )}
          </div>

          <h2 className="mt-3 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
            {currentQ.question}
          </h2>

          <div className="mt-5 space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const revealed = selectedOption !== null;
              const isCorrect = idx === currentQ.correctIndex;
              const isSelected = idx === selectedOption;
              let cls =
                'border-[#E2E8F0] bg-white text-slate-800 hover:border-[#1E3A8A]/50 hover:bg-[#F8FAFC]';
              if (revealed) {
                if (isCorrect) cls = 'border-[#059669] bg-emerald-50/70 text-slate-900';
                else if (isSelected) cls = 'border-[#DC2626] bg-red-50/70 text-slate-900';
                else cls = 'border-[#E2E8F0] bg-slate-50/60 text-slate-500';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors duration-150 min-h-[48px] ${cls}`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                      revealed && isCorrect
                        ? 'border-[#059669] bg-[#059669] text-white'
                        : revealed && isSelected && !isCorrect
                        ? 'border-[#DC2626] bg-[#DC2626] text-white'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700'
                    }`}
                  >
                    {letters[idx]}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                  {revealed && isCorrect && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#059669]" />
                  )}
                  {revealed && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold ${
                    selectedOption === currentQ.correctIndex
                      ? 'text-[#059669]'
                      : 'text-[#DC2626]'
                  }`}
                >
                  {selectedOption === currentQ.correctIndex
                    ? '¡Acierto! (+15 XP)'
                    : 'Fallo registrado en Clínica (-0,33 en examen oficial)'}
                </span>
                <span className="text-xs font-semibold text-[#1E3A8A]">
                  {currentQ.articleRef}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {currentQ.explanation}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#172E6E]"
                >
                  {currentIndex >= sessionQuestions.length - 1
                    ? 'Ver resultado de la lección'
                    : 'Continuar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <p className="text-xs font-medium text-[#1E3A8A]">
              Cuerpo General Administrativo del Estado · Subgrupo C1 Turno Libre
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Ruta de Entrenamiento C1 y Simulacros Oficiales INAP
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Domina los 6 bloques oficiales del programa y los supuestos prácticos con lecciones
              gamificadas de 10 preguntas, cita normativa exacta en cada respuesta y simulacros con
              penalización real de 1/3.
            </p>
          </div>

          <div className="lg:col-span-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
            <div className="text-xs font-semibold text-slate-700">
              Regla oficial de examen INAP
            </div>
            <div className="mt-2 font-mono-tabular text-lg font-bold text-[#1E3A8A]">
              Puntuación = Aciertos − (Fallos / 3)
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              4 opciones (A/B/C/D). Cada fallo resta 0,333 puntos; las preguntas en blanco no
              penalizan.
            </p>
          </div>
        </div>
      </section>

      {/* No lives banner if applicable */}
      {!progress.freeTrainingMode && progress.lives <= 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#DC2626]/30 bg-red-50/70 p-4 text-sm text-slate-800">
          <div>
            <strong className="text-[#DC2626]">Has agotado tus 5 vidas diarias.</strong> Recarga tus
            vidas o activa el «Entrenamiento libre» arriba para seguir sin límites.
          </div>
          <button
            type="button"
            onClick={onRefillLives}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Recargar 5 vidas</span>
          </button>
        </div>
      )}

      {/* 6 Blocks Duolingo-style Progression Map */}
      <section aria-labelledby="ruta-bloques-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="ruta-bloques-heading"
              className="font-display text-xl font-bold text-slate-900"
            >
              01. Ruta por los 6 Bloques Oficiales
            </h2>
            <p className="text-sm text-slate-600">
              Completa lecciones rápidas de 10 preguntas para subir de nivel: Bronce, Plata, Oro y
              Experto INAP.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {([1, 2, 3, 4, 5, 6] as BlockId[]).map((blockId) => {
            const meta = BLOCK_METADATA[blockId];
            const bProg = progress.blocks[blockId];
            const tier = getBlockMasteryTier(bProg);
            const acc =
              bProg.answered > 0 ? Math.round((bProg.hits / bProg.answered) * 100) : 0;
            const bankCount = getQuestionsByBlock(allQuestions, blockId).length;
            const levelBarPct = Math.min(100, bProg.lessonsCompleted * 25);

            return (
              <article
                key={blockId}
                className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 transition-colors hover:border-[#1E3A8A]/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#1E3A8A]">
                      {meta.roman} · {bankCount} preguntas
                    </span>
                    <span
                      className={`font-semibold ${
                        tier === 'Experto INAP' || tier === 'Oro'
                          ? 'text-[#D97706]'
                          : tier === 'Plata'
                          ? 'text-[#1E3A8A]'
                          : tier === 'Bronce'
                          ? 'text-[#059669]'
                          : 'text-slate-500'
                      }`}
                    >
                      {tier}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-base font-bold text-slate-900">
                    {meta.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                      <span>{bProg.lessonsCompleted} lecciones</span>
                      <span>{bProg.answered > 0 ? `${acc}% acierto` : 'Sin intentos'}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-[#1E3A8A]"
                        style={{ width: `${levelBarPct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      startSession({
                        kind: 'block',
                        blockId,
                        title: `${meta.roman}: ${meta.shortTitle}`,
                      })
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#172E6E]"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Entrenar 10 preguntas</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4 Minigames */}
      <section aria-labelledby="minijuegos-heading" className="space-y-4">
        <div>
          <h2 id="minijuegos-heading" className="font-display text-xl font-bold text-slate-900">
            02. Minijuegos Tácticos de Oposición
          </h2>
          <p className="text-sm text-slate-600">
            Entrena reflejos bajo presión de tiempo, detección de palabras trampa y cálculo ofimático.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div>
              <Zap className="h-5 w-5 text-[#D97706]" aria-hidden="true" />
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                Contrarreloj de Plazos y Leyes (60 s)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Responde el máximo número de preguntas jurídicas de los bloques I–V en 60 segundos.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                startSession({
                  kind: 'blitz',
                  title: 'Contrarreloj de Plazos y Leyes (60 s)',
                })
              }
              className="mt-4 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Iniciar 60 segundos
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div>
              <AlertTriangle className="h-5 w-5 text-[#DC2626]" aria-hidden="true" />
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                Caza la Palabra Trampa
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Enunciados con matices críticos («solo», «exclusivamente», «siempre», «en todo caso»).
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                startSession({
                  kind: 'traps',
                  title: 'Caza la Palabra Trampa INAP',
                })
              }
              className="mt-4 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Detectar trampas
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div>
              <FileSpreadsheet className="h-5 w-5 text-[#059669]" aria-hidden="true" />
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                Reto de Ofimática (Excel y Word)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Fórmulas BUSCARV/BUSCARX, referencias absolutas, atajos de teclado y Windows 11.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                startSession({
                  kind: 'office',
                  title: 'Reto de Ofimática M365 & Windows',
                })
              }
              className="mt-4 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              Practicar Bloque VI
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5">
            <div>
              <Shield className="h-5 w-5 text-[#1E3A8A]" aria-hidden="true" />
              <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                Repaso de Fallos Acumulados
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {pendingClinicQuestions.length > 0
                  ? `Tienes ${pendingClinicQuestions.length} preguntas falladas pendientes de dominar.`
                  : 'Sin fallos pendientes: ¡mantén tu racha impecable!'}
              </p>
            </div>
            <button
              type="button"
              disabled={pendingClinicQuestions.length === 0}
              onClick={() =>
                startSession({
                  kind: 'clinic',
                  title: 'Repaso rápido de Clínica de Fallos',
                })
              }
              className="mt-4 w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-40"
            >
              {pendingClinicQuestions.length > 0 ? 'Repasar fallos' : 'Sin fallos'}
            </button>
          </div>
        </div>
      </section>

      {/* Second part preview: Supuestos Prácticos */}
      <section aria-labelledby="supuestos-ruta-heading" className="space-y-4">
        <div>
          <h2 id="supuestos-ruta-heading" className="font-display text-xl font-bold text-slate-900">
            03. Segunda Parte Oficial: Supuestos Prácticos C1
          </h2>
          <p className="text-sm text-slate-600">
            En el examen INAP elegirás entre dos supuestos propuestos sobre los bloques II, III, IV
            y V. Practícalos en el simulador con penalización real -1/3.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {caseStudies.map((cs) => {
            const done = progress.caseStudiesCompleted.includes(cs.id);
            return (
              <article
                key={cs.id}
                className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1E3A8A]">{cs.code}</span>
                    <span className={done ? 'font-semibold text-[#059669]' : 'text-slate-500'}>
                      {done ? 'Completado' : `${cs.questions.length} preguntas`}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-slate-900">
                    {cs.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{cs.subtitle}</p>
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {cs.statement}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenSimulacroWithCase(cs.id)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E3A8A] bg-white px-4 py-2 text-xs font-semibold text-[#1E3A8A] transition-colors hover:bg-[#1E3A8A] hover:text-white"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Resolver en Simulacro INAP</span>
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
