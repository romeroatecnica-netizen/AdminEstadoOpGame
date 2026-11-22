import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { BLOCK_METADATA } from '../data/syllabus';
import { BlockId, FailedQuestionRecord, Question } from '../types';

interface ClinicaFallosViewProps {
  errorClinic: Record<string, FailedQuestionRecord>;
  onMarkMastered: (questionId: string) => void;
  onRemoveRecord: (questionId: string) => void;
  onClearMastered: () => void;
  onAttemptQuestion: (question: Question, selectedIndex: number) => void;
}

export const ClinicaFallosView: React.FC<ClinicaFallosViewProps> = ({
  errorClinic,
  onMarkMastered,
  onRemoveRecord,
  onClearMastered,
  onAttemptQuestion,
}) => {
  const [filterBlock, setFilterBlock] = useState<BlockId | 'all'>('all');
  const [showMastered, setShowMastered] = useState(false);
  const [drillQueue, setDrillQueue] = useState<Question[] | null>(null);
  const [drillIdx, setDrillIdx] = useState(0);
  const [drillSelected, setDrillSelected] = useState<number | null>(null);
  const [drillHits, setDrillHits] = useState(0);

  const records = useMemo(() => {
    return Object.values(errorClinic)
      .filter((r) => (showMastered ? true : !r.mastered))
      .filter((r) => (filterBlock === 'all' ? true : r.question.block === filterBlock))
      .sort((a, b) => b.wrongCount - a.wrongCount);
  }, [errorClinic, filterBlock, showMastered]);

  const pendingCount = useMemo(
    () => Object.values(errorClinic).filter((r) => !r.mastered).length,
    [errorClinic]
  );

  const masteredCount = useMemo(
    () => Object.values(errorClinic).filter((r) => r.mastered).length,
    [errorClinic]
  );

  const startDrill = () => {
    const pending = records.map((r) => r.question);
    if (pending.length === 0) return;
    setDrillQueue(pending.slice(0, 15));
    setDrillIdx(0);
    setDrillSelected(null);
    setDrillHits(0);
  };

  const letters = ['A', 'B', 'C', 'D'];

  if (drillQueue && drillQueue.length > 0) {
    const currentQ = drillQueue[drillIdx];
    const isLast = drillIdx >= drillQueue.length - 1;

    return (
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <p className="text-xs font-medium text-[#1E3A8A]">
              Clínica de Fallos · Repaso activo
            </p>
            <h1 className="font-display text-xl font-bold text-slate-900">
              Pregunta {drillIdx + 1} de {drillQueue.length}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setDrillQueue(null)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Salir del repaso
          </button>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="text-xs text-slate-500">
            {BLOCK_METADATA[currentQ.block].roman} · {currentQ.topic} · {currentQ.articleRef}
          </div>
          <h2 className="mt-2 text-base font-semibold leading-relaxed text-slate-900">
            {currentQ.question}
          </h2>

          <div className="mt-5 space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const revealed = drillSelected !== null;
              const isCorrect = idx === currentQ.correctIndex;
              const isSelected = idx === drillSelected;
              let cls = 'border-[#E2E8F0] bg-white hover:border-[#1E3A8A]/50 hover:bg-[#F8FAFC]';
              if (revealed) {
                if (isCorrect) cls = 'border-[#059669] bg-emerald-50/70';
                else if (isSelected) cls = 'border-[#DC2626] bg-red-50/70';
                else cls = 'border-[#E2E8F0] bg-slate-50 text-slate-500';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={revealed}
                  onClick={() => {
                    setDrillSelected(idx);
                    if (idx === currentQ.correctIndex) setDrillHits((h) => h + 1);
                    onAttemptQuestion(currentQ, idx);
                  }}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm min-h-[48px] ${cls}`}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-bold">
                    {letters[idx]}
                  </span>
                  <span className="flex-1">{opt}</span>
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

          {drillSelected !== null && (
            <div className="mt-5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold text-[#1E3A8A]">{currentQ.articleRef}</p>
              <p className="mt-1 text-sm text-slate-700">{currentQ.explanation}</p>
              <div className="mt-4 flex justify-end">
                {!isLast ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDrillIdx((i) => i + 1);
                      setDrillSelected(null);
                    }}
                    className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
                  >
                    Siguiente pregunta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDrillQueue(null)}
                    className="rounded-lg bg-[#059669] px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Finalizar repaso ({drillHits}/{drillQueue.length} aciertos)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#DC2626]">
            Artículos críticos y errores acumulados
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mi Clínica de Fallos C1
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
            Cada error cometido en la Ruta o en un Simulacro INAP queda registrado aquí con su
            artículo exacto. Al volver a acertarla en un repaso se marca automáticamente como
            dominada.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {masteredCount > 0 && (
            <button
              type="button"
              onClick={onClearMastered}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Limpiar dominadas ({masteredCount})</span>
            </button>
          )}
          <button
            type="button"
            disabled={records.length === 0}
            onClick={startDrill}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E] disabled:opacity-40"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Practicar mis fallos ({records.length})</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F8FAFC] p-1">
          <button
            type="button"
            onClick={() => setFilterBlock('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filterBlock === 'all'
                ? 'bg-[#1E3A8A] text-white'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Todos ({pendingCount})
          </button>
          {([1, 2, 3, 4, 5, 6] as BlockId[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setFilterBlock(b)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                filterBlock === b
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              {BLOCK_METADATA[b].roman}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showMastered}
            onChange={(e) => setShowMastered(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#1E3A8A]"
          />
          <span>Mostrar también ya dominadas ({masteredCount})</span>
        </label>
      </div>

      {/* List */}
      {records.length === 0 ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#059669]" aria-hidden="true" />
          <h2 className="mt-3 font-display text-lg font-bold text-slate-900">
            No tienes fallos pendientes en esta selección
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cuando falles alguna pregunta en la Ruta C1 o en un Simulacro INAP, aparecerá aquí con
            su referencia legal para repasarla.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <article
              key={rec.questionId}
              className="rounded-xl border border-[#E2E8F0] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-[#1E3A8A]">
                    {BLOCK_METADATA[rec.question.block].roman}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{rec.question.articleRef}</span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#DC2626]">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    Fallada {rec.wrongCount} {rec.wrongCount === 1 ? 'vez' : 'veces'}
                  </span>
                  {rec.mastered && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#059669]">Dominada</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!rec.mastered && (
                    <button
                      type="button"
                      onClick={() => onMarkMastered(rec.questionId)}
                      className="inline-flex items-center gap-1 rounded-md border border-[#059669]/30 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-[#059669] hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Marcar dominada</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveRecord(rec.questionId)}
                    aria-label="Eliminar de clínica"
                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                {rec.question.question}
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-[#059669]/30 bg-emerald-50/60 p-2.5 text-slate-800">
                  <span className="font-semibold text-[#059669]">
                    Correcta ({letters[rec.question.correctIndex]}):{' '}
                  </span>
                  {rec.question.options[rec.question.correctIndex]}
                </div>
                <div className="rounded-lg border border-[#DC2626]/30 bg-red-50/60 p-2.5 text-slate-800">
                  <span className="font-semibold text-[#DC2626]">
                    Tu último fallo ({letters[rec.lastWrongOption] || '?'}):{' '}
                  </span>
                  {rec.question.options[rec.lastWrongOption] || 'No registrada'}
                </div>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                {rec.question.explanation}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
