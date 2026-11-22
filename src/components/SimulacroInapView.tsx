import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Flag,
  Play,
  Printer,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { BLOCK_METADATA } from '../data/syllabus';
import { deterministicShuffle, getQuestionsByBlock } from '../engine/questionBank';
import {
  buildPartSummary,
  calculateInapScore,
  evaluateRiskStrategy,
} from '../engine/scoring';
import {
  BlockId,
  CaseStudy,
  ExamHistoryEntry,
  Question,
} from '../types';

interface SimulacroInapViewProps {
  allQuestions: Question[];
  caseStudies: CaseStudy[];
  preselectedCaseId?: 'supuesto-a' | 'supuesto-b' | null;
  challengeSeed?: number;
  challengeBlock?: BlockId | 'all';
  challengeCount?: number;
  challengeCutoff?: number;
  onExamActiveChange: (active: boolean) => void;
  onFinishExam: (
    entry: ExamHistoryEntry,
    answers: Record<string, number | null>,
    questions: Question[]
  ) => void;
}

type ExamSetupMode = 'oficial-completo' | 'parcial';

interface ActiveExamState {
  mode: ExamSetupMode;
  title: string;
  part1Questions: Question[];
  part2CaseStudy: CaseStudy | null;
  part2Questions: Question[];
  reserveCount: number;
  cutoffPart1_50: number;
  cutoffPart2_50: number;
  cutoffTotal100: number;
  totalSeconds: number;
  secondsLeft: number;
  answers: Record<string, number | null>;
  flagged: Record<string, boolean>;
  currentPart: 1 | 2;
  currentIdx: number;
  showCaseStatement: boolean;
  showLiveMonitor: boolean;
}

export const SimulacroInapView: React.FC<SimulacroInapViewProps> = ({
  allQuestions,
  caseStudies,
  preselectedCaseId,
  challengeSeed,
  challengeBlock,
  challengeCount,
  challengeCutoff,
  onExamActiveChange,
  onFinishExam,
}) => {
  const [setupMode, setSetupMode] = useState<ExamSetupMode>(
    preselectedCaseId ? 'oficial-completo' : 'oficial-completo'
  );
  const [partialCount, setPartialCount] = useState<30 | 50 | 100>(
    challengeCount === 30 || challengeCount === 50 || challengeCount === 100
      ? challengeCount
      : 50
  );
  const [selectedBlocks, setSelectedBlocks] = useState<BlockId[]>(
    challengeBlock && challengeBlock !== 'all'
      ? [challengeBlock]
      : [1, 2, 3, 4, 5, 6]
  );
  const [part1CountOfficial, setPart1CountOfficial] = useState<60 | 100>(60);
  const [chosenCaseId, setChosenCaseId] = useState<'supuesto-a' | 'supuesto-b'>(
    preselectedCaseId || 'supuesto-a'
  );
  const [cutoffPart50, setCutoffPart50] = useState<number>(challengeCutoff ?? 25);
  const [minutesConfig, setMinutesConfig] = useState<number>(90);

  const [activeExam, setActiveExam] = useState<ActiveExamState | null>(null);
  const [finishedResult, setFinishedResult] = useState<{
    entry: ExamHistoryEntry;
    questions: Question[];
    answers: Record<string, number | null>;
    caseStudy: CaseStudy | null;
    part1Count: number;
  } | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'mistakes' | 'blanks'>('all');

  useEffect(() => {
    if (preselectedCaseId) {
      setChosenCaseId(preselectedCaseId);
      setSetupMode('oficial-completo');
    }
  }, [preselectedCaseId]);

  useEffect(() => {
    onExamActiveChange(activeExam !== null);
  }, [activeExam, onExamActiveChange]);

  // Countdown timer
  useEffect(() => {
    if (!activeExam) return;
    if (activeExam.secondsLeft <= 0) {
      finalizeExam(activeExam);
      return;
    }
    const timer = window.setInterval(() => {
      setActiveExam((prev) =>
        prev ? { ...prev, secondsLeft: Math.max(0, prev.secondsLeft - 1) } : null
      );
    }, 1000);
    return () => window.clearInterval(timer);
  });

  const toggleBlockSelection = (b: BlockId) => {
    setSelectedBlocks((prev) =>
      prev.includes(b)
        ? prev.length > 1
          ? prev.filter((x) => x !== b)
          : prev
        : [...prev, b]
    );
  };

  const startExam = () => {
    const seed = challengeSeed || Date.now() % 1000000;

    if (setupMode === 'oficial-completo') {
      const part1Pool = deterministicShuffle(allQuestions, seed);
      const part1Questions = part1Pool.slice(
        0,
        Math.min(part1CountOfficial, part1Pool.length)
      );
      const cs =
        caseStudies.find((c) => c.id === chosenCaseId) || caseStudies[0];
      const part2Questions = cs ? cs.questions : [];
      const totalSeconds = minutesConfig * 60;

      setFinishedResult(null);
      setActiveExam({
        mode: 'oficial-completo',
        title: `Simulacro Oficial INAP · Parte 1 + ${cs.code}`,
        part1Questions,
        part2CaseStudy: cs,
        part2Questions,
        reserveCount: 5,
        cutoffPart1_50: cutoffPart50,
        cutoffPart2_50: cutoffPart50,
        cutoffTotal100: cutoffPart50 * 2,
        totalSeconds,
        secondsLeft: totalSeconds,
        answers: {},
        flagged: {},
        currentPart: 1,
        currentIdx: 0,
        showCaseStatement: false,
        showLiveMonitor: true,
      });
    } else {
      const filtered = allQuestions.filter((q) =>
        selectedBlocks.includes(q.block)
      );
      const shuffled = deterministicShuffle(filtered, seed);
      const picked = shuffled.slice(0, Math.min(partialCount, shuffled.length));
      const totalSeconds = Math.round(picked.length * 1.1) * 60;

      setFinishedResult(null);
      setActiveExam({
        mode: 'parcial',
        title: `Simulacro Parcial (${picked.length} preguntas)`,
        part1Questions: picked,
        part2CaseStudy: null,
        part2Questions: [],
        reserveCount: 0,
        cutoffPart1_50: cutoffPart50,
        cutoffPart2_50: cutoffPart50,
        cutoffTotal100: cutoffPart50 * 2,
        totalSeconds,
        secondsLeft: totalSeconds,
        answers: {},
        flagged: {},
        currentPart: 1,
        currentIdx: 0,
        showCaseStatement: false,
        showLiveMonitor: true,
      });
    }
  };

  const finalizeExam = (exam: ActiveExamState) => {
    const p1Total = exam.part1Questions.length;
    let p1Hits = 0;
    let p1Mistakes = 0;
    exam.part1Questions.forEach((q) => {
      const ans = exam.answers[q.id];
      if (ans !== undefined && ans !== null) {
        if (ans === q.correctIndex) p1Hits++;
        else p1Mistakes++;
      }
    });

    const p2Total = exam.part2Questions.length;
    let p2Hits = 0;
    let p2Mistakes = 0;
    exam.part2Questions.forEach((q) => {
      const ans = exam.answers[q.id];
      if (ans !== undefined && ans !== null) {
        if (ans === q.correctIndex) p2Hits++;
        else p2Mistakes++;
      }
    });

    const allExamQuestions = [...exam.part1Questions, ...exam.part2Questions];
    const totalHits = p1Hits + p2Hits;
    const totalMistakes = p1Mistakes + p2Mistakes;
    const overall = calculateInapScore(
      allExamQuestions.length,
      totalHits,
      totalMistakes
    );

    const part1Summary = buildPartSummary(
      'Primera Parte (Cuestionario 6 Bloques)',
      p1Total,
      p1Hits,
      p1Mistakes,
      exam.cutoffPart1_50
    );

    const part2Summary =
      p2Total > 0
        ? buildPartSummary(
            `Segunda Parte (${exam.part2CaseStudy?.code || 'Supuesto Práctico'})`,
            p2Total,
            p2Hits,
            p2Mistakes,
            exam.cutoffPart2_50
          )
        : undefined;

    const scaledTotal100 = part2Summary
      ? part1Summary.scaledScore50 + part2Summary.scaledScore50
      : overall.scaledScore100;

    const passed = part2Summary
      ? part1Summary.passed && part2Summary.passed
      : part1Summary.passed;

    const entry: ExamHistoryEntry = {
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      modeLabel: exam.title,
      isFullOfficial: exam.mode === 'oficial-completo',
      caseStudyChosen: exam.part2CaseStudy?.id,
      durationSeconds: exam.totalSeconds - exam.secondsLeft,
      totalQuestions: allExamQuestions.length,
      hits: overall.hits,
      mistakes: overall.mistakes,
      blanks: overall.blanks,
      grossScore: overall.grossScore,
      penaltyLost: overall.penaltyLost,
      netScore: overall.netScore,
      scaledTotal100,
      cutoffTotal100: exam.cutoffTotal100,
      passed,
      part1: part1Summary,
      part2: part2Summary,
    };

    onFinishExam(entry, exam.answers, allExamQuestions);
    setFinishedResult({
      entry,
      questions: allExamQuestions,
      answers: exam.answers,
      caseStudy: exam.part2CaseStudy,
      part1Count: p1Total,
    });
    setActiveExam(null);
  };

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Live Score calculation during active exam
  const liveStats = useMemo(() => {
    if (!activeExam) return null;
    const allQ = [...activeExam.part1Questions, ...activeExam.part2Questions];
    let answered = 0;
    let hits = 0;
    let mistakes = 0;
    allQ.forEach((q) => {
      const a = activeExam.answers[q.id];
      if (a !== undefined && a !== null) {
        answered++;
        if (a === q.correctIndex) hits++;
        else mistakes++;
      }
    });
    return {
      answered,
      total: allQ.length,
      blanks: allQ.length - answered,
      score: calculateInapScore(allQ.length, hits, mistakes),
    };
  }, [activeExam]);

  const letters = ['A', 'B', 'C', 'D'];

  // 1) ACTIVE EXAM INTERFACE
  if (activeExam && liveStats) {
    const currentList =
      activeExam.currentPart === 1
        ? activeExam.part1Questions
        : activeExam.part2Questions;
    const currentQ = currentList[activeExam.currentIdx];
    const selectedAns = activeExam.answers[currentQ.id] ?? null;
    const isFlagged = !!activeExam.flagged[currentQ.id];

    return (
      <section className="space-y-5">
        {/* Top Exam Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div>
            <div className="text-xs font-semibold text-[#1E3A8A]">
              {activeExam.title} · Penalización oficial -1/3 por fallo
            </div>
            <div className="mt-0.5 text-xs text-slate-500 tabular-nums">
              Contestadas: <strong className="text-slate-900">{liveStats.answered}</strong> /{' '}
              {liveStats.total} · En blanco: <strong>{liveStats.blanks}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono-tabular text-sm font-bold ${
                activeExam.secondsLeft < 300
                  ? 'border-[#DC2626]/40 bg-red-50 text-[#DC2626]'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-900'
              }`}
            >
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{formatTimer(activeExam.secondsLeft)}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveExam((prev) =>
                  prev ? { ...prev, showLiveMonitor: !prev.showLiveMonitor } : null
                )
              }
              className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {activeExam.showLiveMonitor ? 'Ocultar monitor riesgo' : 'Ver monitor riesgo'}
            </button>

            <button
              type="button"
              onClick={() => finalizeExam(activeExam)}
              className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
            >
              Entregar y corregir
            </button>
          </div>
        </div>

        {/* Part Switcher if Official 2-Part Exam */}
        {activeExam.mode === 'oficial-completo' && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setActiveExam((prev) =>
                    prev ? { ...prev, currentPart: 1, currentIdx: 0 } : null
                  )
                }
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  activeExam.currentPart === 1
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-700 hover:bg-[#F8FAFC]'
                }`}
              >
                Parte 1: Cuestionario ({activeExam.part1Questions.length} preg.)
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveExam((prev) =>
                    prev
                      ? {
                          ...prev,
                          currentPart: 2,
                          currentIdx: 0,
                          showCaseStatement: true,
                        }
                      : null
                  )
                }
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  activeExam.currentPart === 2
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-700 hover:bg-[#F8FAFC]'
                }`}
              >
                Parte 2: {activeExam.part2CaseStudy?.code} (
                {activeExam.part2Questions.length} preg.)
              </button>
            </div>

            {activeExam.currentPart === 2 && activeExam.part2CaseStudy && (
              <button
                type="button"
                onClick={() =>
                  setActiveExam((prev) =>
                    prev
                      ? { ...prev, showCaseStatement: !prev.showCaseStatement }
                      : null
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-medium text-[#1E3A8A] hover:bg-[#F8FAFC]"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {activeExam.showCaseStatement
                    ? 'Ocultar enunciado del supuesto'
                    : 'Mostrar enunciado del supuesto'}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Case Study Statement Drawer in Part 2 */}
        {activeExam.currentPart === 2 &&
          activeExam.part2CaseStudy &&
          activeExam.showCaseStatement && (
            <div className="rounded-xl border border-[#1E3A8A]/25 bg-white p-5">
              <div className="text-xs font-semibold text-[#1E3A8A]">
                {activeExam.part2CaseStudy.code} · {activeExam.part2CaseStudy.title}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {activeExam.part2CaseStudy.statement}
              </p>
            </div>
          )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Question Card */}
          <div className="lg:col-span-8 rounded-xl border border-[#E2E8F0] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Pregunta <strong className="text-slate-900">{activeExam.currentIdx + 1}</strong> de{' '}
                {currentList.length} ·{' '}
                <span className="text-[#1E3A8A] font-medium">
                  {BLOCK_METADATA[currentQ.block].roman}
                </span>
                {activeExam.currentPart === 1 &&
                  activeExam.currentIdx >= currentList.length - activeExam.reserveCount && (
                    <span className="ml-2 font-semibold text-[#D97706]">
                      (Reserva)
                    </span>
                  )}
              </span>

              <button
                type="button"
                onClick={() =>
                  setActiveExam((prev) =>
                    prev
                      ? {
                          ...prev,
                          flagged: {
                            ...prev.flagged,
                            [currentQ.id]: !prev.flagged[currentQ.id],
                          },
                        }
                      : null
                  )
                }
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
                  isFlagged
                    ? 'bg-amber-50 text-[#D97706] border border-[#D97706]/30'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isFlagged ? 'Marcada para revisar' : 'Marcar duda'}</span>
              </button>
            </div>

            <h2 className="mt-3 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
              {currentQ.question}
            </h2>

            <div className="mt-5 space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAns === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setActiveExam((prev) => {
                        if (!prev) return null;
                        const currentVal = prev.answers[currentQ.id];
                        return {
                          ...prev,
                          answers: {
                            ...prev.answers,
                            [currentQ.id]: currentVal === idx ? null : idx,
                          },
                        };
                      })
                    }
                    className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors duration-150 min-h-[48px] ${
                      isSelected
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-slate-900 font-medium'
                        : 'border-[#E2E8F0] bg-white text-slate-800 hover:border-[#1E3A8A]/40 hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700'
                      }`}
                    >
                      {letters[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeExam.currentIdx === 0}
                  onClick={() =>
                    setActiveExam((prev) =>
                      prev
                        ? { ...prev, currentIdx: Math.max(0, prev.currentIdx - 1) }
                        : null
                    )
                  }
                  className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveExam((prev) =>
                      prev
                        ? {
                            ...prev,
                            answers: { ...prev.answers, [currentQ.id]: null },
                          }
                        : null
                    )
                  }
                  className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Dejar en blanco
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activeExam.currentIdx < currentList.length - 1) {
                    setActiveExam((prev) =>
                      prev ? { ...prev, currentIdx: prev.currentIdx + 1 } : null
                    );
                  } else if (
                    activeExam.mode === 'oficial-completo' &&
                    activeExam.currentPart === 1
                  ) {
                    setActiveExam((prev) =>
                      prev
                        ? {
                            ...prev,
                            currentPart: 2,
                            currentIdx: 0,
                            showCaseStatement: true,
                          }
                        : null
                    );
                  } else {
                    finalizeExam(activeExam);
                  }
                }}
                className="rounded-lg bg-[#1E3A8A] px-5 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
              >
                {activeExam.currentIdx < currentList.length - 1
                  ? 'Siguiente'
                  : activeExam.mode === 'oficial-completo' &&
                    activeExam.currentPart === 1
                  ? 'Ir a Parte 2 (Supuesto)'
                  : 'Finalizar y corregir'}
              </button>
            </div>
          </div>

          {/* Right Sidebar: Navigator Grid & Live Strategic Risk Monitor */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-display text-sm font-bold text-slate-900">
                Mapa de respuestas ({activeExam.currentPart === 1 ? 'Parte 1' : 'Parte 2'})
              </h3>
              <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-6">
                {currentList.map((q, i) => {
                  const ans = activeExam.answers[q.id];
                  const isAnswered = ans !== undefined && ans !== null;
                  const isCurr = i === activeExam.currentIdx;
                  const isQFlagged = !!activeExam.flagged[q.id];
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() =>
                        setActiveExam((prev) =>
                          prev ? { ...prev, currentIdx: i } : null
                        )
                      }
                      className={`relative h-8 rounded-md border text-xs font-semibold tabular-nums transition-colors ${
                        isCurr
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : isAnswered
                          ? 'border-[#1E3A8A]/30 bg-[#1E3A8A]/10 text-[#1E3A8A]'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                      {isQFlagged && (
                        <span
                          aria-label="Marcada"
                          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D97706]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                <span>Azul: contestada</span>
                <span>·</span>
                <span>Gris: en blanco</span>
                <span>·</span>
                <span>Ámbar: duda</span>
              </div>
            </div>

            {activeExam.showLiveMonitor && (
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Calculadora Estratégica de Riesgo
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Regla de decisión bajo penalización <span className="font-mono">-1/3</span>:
                </p>
                <div className="space-y-1.5 text-xs tabular-nums">
                  <div className="flex justify-between rounded-md bg-[#F8FAFC] px-3 py-2">
                    <span className="text-slate-700">Duda entre 2 opciones</span>
                    <span className="font-semibold text-[#059669]">+0,33 EV (Responder)</span>
                  </div>
                  <div className="flex justify-between rounded-md bg-[#F8FAFC] px-3 py-2">
                    <span className="text-slate-700">Duda entre 3 opciones</span>
                    <span className="font-semibold text-[#1E3A8A]">+0,11 EV (Si falta corte)</span>
                  </div>
                  <div className="flex justify-between rounded-md bg-[#F8FAFC] px-3 py-2">
                    <span className="text-slate-700">Al azar entre 4 opciones</span>
                    <span className="font-semibold text-slate-600">0,00 EV (Dejar en blanco)</span>
                  </div>
                </div>
                <div className="border-t border-[#E2E8F0] pt-3 text-xs text-slate-600 tabular-nums">
                  Si terminaras ahora: Puntuación neta provisional{' '}
                  <strong className="text-[#1E3A8A]">
                    {liveStats.score.netScore.toFixed(2)}
                  </strong>{' '}
                  (bruta {liveStats.score.grossScore}, penalización −
                  {liveStats.score.penaltyLost.toFixed(2)}).
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    );
  }

  // 2) EXAM FINISHED RESULTS & NORMATIVE REVIEW
  if (finishedResult) {
    const { entry, questions, answers, caseStudy } = finishedResult;
    const overallBreakdown = calculateInapScore(
      entry.totalQuestions,
      entry.hits,
      entry.mistakes
    );
    const riskInsight = evaluateRiskStrategy(
      overallBreakdown,
      entry.part1?.cutoff50
    );

    const reviewQuestions = questions.filter((q) => {
      const a = answers[q.id];
      if (reviewFilter === 'mistakes') {
        return a !== undefined && a !== null && a !== q.correctIndex;
      }
      if (reviewFilter === 'blanks') {
        return a === undefined || a === null;
      }
      return true;
    });

    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4 no-print">
          <div>
            <p className="text-xs font-medium text-[#1E3A8A]">{entry.modeLabel}</p>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Resultado Oficial y Análisis de Penalización (-1/3)
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Imprimir acta / repaso</span>
            </button>
            <button
              type="button"
              onClick={() => setFinishedResult(null)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Nuevo simulacro</span>
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-xs text-slate-500">Calificación Global</div>
            <div
              className={`mt-1 font-display text-2xl font-extrabold tabular-nums ${
                entry.passed ? 'text-[#059669]' : 'text-[#DC2626]'
              }`}
            >
              {entry.passed ? 'APTO' : 'NO APTO'}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              {entry.scaledTotal100.toFixed(2)} / 100 (Corte {entry.cutoffTotal100})
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-xs text-slate-500">Puntuación Neta</div>
            <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#1E3A8A]">
              {entry.netScore.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              Sobre {entry.totalQuestions} preguntas
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-xs text-slate-500">Puntuación Bruta</div>
            <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#059669]">
              {entry.grossScore}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              {overallBreakdown.accuracyOnAnswered.toFixed(1)} % acierto sobre contestadas
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-xs text-slate-500">Puntos perdidos (-1/3)</div>
            <div className="mt-1 font-mono-tabular text-2xl font-bold text-[#DC2626]">
              −{entry.penaltyLost.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              Por {entry.mistakes} fallos cometidos
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="text-xs text-slate-500">En blanco / Tiempo</div>
            <div className="mt-1 font-mono-tabular text-2xl font-bold text-slate-800">
              {entry.blanks}
            </div>
            <div className="mt-1 text-xs text-slate-500 tabular-nums">
              Tiempo: {formatTimer(entry.durationSeconds)}
            </div>
          </div>
        </div>

        {/* Two-Part Official Breakdown */}
        {entry.part1 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[entry.part1, entry.part2].filter(Boolean).map((part, idx) =>
              part ? (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-bold text-slate-900">
                      {part.label}
                    </h2>
                    <span
                      className={`text-xs font-bold ${
                        part.passed ? 'text-[#059669]' : 'text-[#DC2626]'
                      }`}
                    >
                      {part.passed ? 'SUPERA CORTE' : 'BAJO CORTE'}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs tabular-nums">
                    <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                      <div className="text-slate-500">Escala /50</div>
                      <div className="mt-0.5 font-mono-tabular text-base font-bold text-[#1E3A8A]">
                        {part.scaledScore50.toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                      <div className="text-slate-500">Corte /50</div>
                      <div className="mt-0.5 font-mono-tabular text-base font-bold text-slate-800">
                        {part.cutoff50.toFixed(1)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#F8FAFC] p-2.5">
                      <div className="text-slate-500">A / F / B</div>
                      <div className="mt-0.5 font-mono-tabular text-sm font-semibold text-slate-900">
                        {part.hits} / {part.mistakes} / {part.blanks}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Strategic Risk Analysis */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            <span>Diagnóstico Táctico de Riesgo</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
            {riskInsight.recommendationTitle}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
            {riskInsight.recommendationBody}
          </p>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Corrección comentada pregunta a pregunta
            </h2>
            <div className="flex items-center gap-1 rounded-lg bg-white border border-[#E2E8F0] p-1 no-print">
              {(
                [
                  { id: 'all', label: `Todas (${questions.length})` },
                  { id: 'mistakes', label: `Fallos (${entry.mistakes})` },
                  { id: 'blanks', label: `En blanco (${entry.blanks})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setReviewFilter(f.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    reviewFilter === f.id
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-slate-700 hover:bg-[#F8FAFC]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {caseStudy && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <div className="text-xs font-semibold text-[#1E3A8A]">{caseStudy.code}</div>
              <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                {caseStudy.statement}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {reviewQuestions.map((q) => {
              const userAns = answers[q.id];
              const isBlank = userAns === undefined || userAns === null;
              const isCorrect = !isBlank && userAns === q.correctIndex;

              return (
                <article
                  key={q.id}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#1E3A8A]">
                      {BLOCK_METADATA[q.block].roman} · {q.articleRef}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        isCorrect
                          ? 'text-[#059669]'
                          : isBlank
                          ? 'text-slate-500'
                          : 'text-[#DC2626]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Acierto (+1,00)
                        </>
                      ) : isBlank ? (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" /> En blanco (0,00)
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" /> Fallo (−0,33)
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-slate-900">{q.question}</h3>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {q.options.map((opt, idx) => {
                      const optCorrect = idx === q.correctIndex;
                      const optPicked = idx === userAns;
                      return (
                        <div
                          key={idx}
                          className={`rounded-lg border px-3 py-2 ${
                            optCorrect
                              ? 'border-[#059669]/40 bg-emerald-50/70 font-medium text-slate-900'
                              : optPicked && !optCorrect
                              ? 'border-[#DC2626]/40 bg-red-50/70 text-[#DC2626]'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-600'
                          }`}
                        >
                          <strong>{letters[idx]}.</strong> {opt}
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {q.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 3) CONFIGURATOR SCREEN
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-medium text-[#1E3A8A]">
          Simulador INAP con fórmula real Aciertos − (Fallos / 3)
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Configurar Simulacro Oficial C1
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
          Elige entre el ejercicio único completo (Parte 1 teórica y ofimática + Parte 2 supuesto
          práctico A o B) o un simulacro parcial por bloques con cronómetro y nota de corte
          configurable.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-6">
          {/* Mode Toggle */}
          <div>
            <div className="text-xs font-semibold text-slate-700">Modalidad del ejercicio</div>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSetupMode('oficial-completo')}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  setupMode === 'oficial-completo'
                    ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">
                  Simulacro Completo INAP (2 partes)
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Parte 1 (6 bloques + reserva) + Parte 2 (Supuesto Práctico A o B de 15 preguntas).
                  Ambas eliminatorias.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSetupMode('parcial')}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  setupMode === 'parcial'
                    ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                    : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="text-sm font-bold text-slate-900">
                  Simulacro Parcial (30, 50 o 100)
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Selecciona bloques concretos o entrena el cuestionario completo con penalización
                  1/3.
                </p>
              </button>
            </div>
          </div>

          {setupMode === 'oficial-completo' ? (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-slate-700">
                  Extensión de la Primera Parte (Cuestionario 6 bloques)
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([60, 100] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPart1CountOfficial(n)}
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold ${
                        part1CountOfficial === n
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700'
                      }`}
                    >
                      {n} preguntas + 5 reserva (hasta {Math.min(n, allQuestions.length)} disp.)
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700">
                  Elección obligatoria de Supuesto Práctico (Segunda Parte)
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {caseStudies.map((cs) => (
                    <button
                      key={cs.id}
                      type="button"
                      onClick={() => setChosenCaseId(cs.id)}
                      className={`rounded-lg border p-3.5 text-left transition-colors ${
                        chosenCaseId === cs.id
                          ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
                          : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="text-xs font-bold text-[#1E3A8A]">{cs.code}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-900">
                        {cs.title}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">{cs.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-slate-700">Número de preguntas</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([30, 50, 100] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setPartialCount(cnt)}
                      className={`rounded-lg border px-4 py-2 text-xs font-semibold tabular-nums ${
                        partialCount === cnt
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                          : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700'
                      }`}
                    >
                      {cnt} preguntas
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700">
                  Bloques incluidos ({selectedBlocks.length} seleccionados)
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {([1, 2, 3, 4, 5, 6] as BlockId[]).map((b) => {
                    const active = selectedBlocks.includes(b);
                    const count = getQuestionsByBlock(allQuestions, b).length;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => toggleBlockSelection(b)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs ${
                          active
                            ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 font-semibold text-[#1E3A8A]'
                            : 'border-[#E2E8F0] bg-white text-slate-600'
                        }`}
                      >
                        <span>
                          {BLOCK_METADATA[b].roman}: {BLOCK_METADATA[b].shortTitle}
                        </span>
                        <span className="tabular-nums text-[11px]">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sliders: Cut-off and Time */}
          <div className="grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="cutoff-range"
                className="flex items-center justify-between text-xs font-semibold text-slate-700 tabular-nums"
              >
                <span>Nota de corte por parte (0–50)</span>
                <span className="text-[#1E3A8A]">
                  {cutoffPart50} / 50 ({cutoffPart50 * 2} / 100 total)
                </span>
              </label>
              <input
                id="cutoff-range"
                type="range"
                min={15}
                max={45}
                step={0.5}
                value={cutoffPart50}
                onChange={(e) => setCutoffPart50(Number(e.target.value))}
                className="mt-2 w-full accent-[#1E3A8A]"
              />
            </div>

            {setupMode === 'oficial-completo' && (
              <div>
                <label
                  htmlFor="minutes-range"
                  className="flex items-center justify-between text-xs font-semibold text-slate-700 tabular-nums"
                >
                  <span>Duración cronómetro oficial</span>
                  <span className="text-[#1E3A8A]">{minutesConfig} minutos</span>
                </label>
                <input
                  id="minutes-range"
                  type="range"
                  min={45}
                  max={120}
                  step={5}
                  value={minutesConfig}
                  onChange={(e) => setMinutesConfig(Number(e.target.value))}
                  className="mt-2 w-full accent-[#1E3A8A]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Launch Panel */}
        <aside className="lg:col-span-4 rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Resumen de la convocatoria simulada</span>
          </div>

          <dl className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500">Fórmula de corrección</dt>
              <dd className="font-mono-tabular font-semibold text-slate-900">A − (F / 3)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Valor del acierto</dt>
              <dd className="font-mono-tabular font-semibold text-[#059669]">+1,00 punto</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Penalización por fallo</dt>
              <dd className="font-mono-tabular font-semibold text-[#DC2626]">−0,333 puntos</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Pregunta en blanco</dt>
              <dd className="font-mono-tabular font-semibold text-slate-700">0,00 puntos</dd>
            </div>
            <div className="flex justify-between border-t border-[#E2E8F0] pt-2.5">
              <dt className="text-slate-500">Corte exigido</dt>
              <dd className="font-mono-tabular font-bold text-[#1E3A8A]">
                {cutoffPart50} / 50 por parte
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={startExam}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#172E6E]"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            <span>Comenzar Simulacro Oficial</span>
          </button>

          <p className="text-[11px] leading-relaxed text-slate-500">
            Durante el simulacro se ocultan los bloques publicitarios y el temario inferior para
            garantizar una lectura limpia sin distracciones.
          </p>
        </aside>
      </div>
    </section>
  );
};
