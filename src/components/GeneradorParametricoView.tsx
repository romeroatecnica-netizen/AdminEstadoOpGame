import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { generateParametricExercise } from '../engine/parametricGenerator';

interface GeneradorParametricoViewProps {
  initialSeed?: number;
  onXpGain: (amount: number) => void;
}

type CategoryChoice = 'mixto' | 'plazos' | 'gasto' | 'excel';

export const GeneradorParametricoView: React.FC<GeneradorParametricoViewProps> = ({
  initialSeed,
  onXpGain,
}) => {
  const [category, setCategory] = useState<CategoryChoice>('mixto');
  const [seed, setSeed] = useState<number>(initialSeed || 202601);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [hitsCount, setHitsCount] = useState(0);

  const exercise = useMemo(
    () => generateParametricExercise(category, seed),
    [category, seed]
  );

  const handleSelectOption = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setSolvedCount((c) => c + 1);
    if (idx === exercise.correctIndex) {
      setHitsCount((h) => h + 1);
      onXpGain(20);
    } else {
      onXpGain(3);
    }
  };

  const handleNextExercise = () => {
    setSelectedIdx(null);
    setSeed((prev) => ((prev * 1664525 + 1013904223) >>> 0) % 900000 + 100000);
  };

  const handleSelectCategory = (nextCat: CategoryChoice) => {
    setCategory(nextCat);
    setSelectedIdx(null);
    setSeed((prev) => prev + 17);
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#1E3A8A]">
            Motor determinista local · Variaciones ilimitadas sin IA
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Generador de Plazos, Gasto Público y Fórmulas Excel
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
            Practica ejercicios paramétricos con resolución paso a paso sobre cómputo de plazos
            (Ley 39/2015), crédito disponible y contratos menores (LGP/LCSP) y referencias/funciones
            de Excel.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 tabular-nums shrink-0">
          <span>
            Resueltos: <strong className="text-slate-900">{solvedCount}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Aciertos: <strong className="text-[#059669]">{hitsCount}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular text-slate-500">Semilla #{seed}</span>
        </div>
      </div>

      {/* Category segmented bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-[#F8FAFC] p-1">
          {(
            [
              { id: 'mixto', label: 'Mixto' },
              { id: 'plazos', label: 'Plazos Ley 39/2015' },
              { id: 'gasto', label: 'Gasto y LCSP' },
              { id: 'excel', label: 'Fórmulas Excel' },
            ] as { id: CategoryChoice; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectCategory(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                category === tab.id
                  ? 'bg-[#1E3A8A] text-white'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextExercise}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
          <span>Generar otro supuesto</span>
        </button>
      </div>

      {/* Exercise Stage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <Calculator className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
            <span className="font-medium text-[#1E3A8A]">{exercise.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{exercise.articleRef}</span>
          </div>

          <h2 className="mt-2 font-display text-lg font-bold text-slate-900">
            {exercise.title}
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-800">{exercise.prompt}</p>

          <div className="mt-5 space-y-2.5">
            {exercise.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === exercise.correctIndex;
              const revealed = selectedIdx !== null;

              let buttonClass =
                'border-[#E2E8F0] bg-white text-slate-800 hover:border-[#1E3A8A]/50 hover:bg-[#F8FAFC]';
              if (revealed) {
                if (isCorrect) {
                  buttonClass = 'border-[#059669] bg-emerald-50/70 text-slate-900';
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'border-[#DC2626] bg-red-50/70 text-slate-900';
                } else {
                  buttonClass = 'border-[#E2E8F0] bg-slate-50/60 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={revealed}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors duration-150 min-h-[48px] ${buttonClass}`}
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
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 text-[#059669]"
                      aria-label="Opción correcta"
                    />
                  )}
                  {revealed && isSelected && !isCorrect && (
                    <XCircle
                      className="h-5 w-5 shrink-0 text-[#DC2626]"
                      aria-label="Opción incorrecta"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-step resolution deck */}
        <div className="lg:col-span-5 rounded-xl border border-[#E2E8F0] bg-white p-6">
          <h3 className="font-display text-base font-bold text-slate-900">
            Resolución paso a paso
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Referencia: {exercise.articleRef}
          </p>

          {selectedIdx === null ? (
            <div className="mt-5 rounded-lg border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-5 text-sm text-slate-600">
              Selecciona una de las cuatro opciones A, B, C o D para verificar tu cálculo y
              desbloquear el desglose matemático y normativo completo.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div
                className={`rounded-lg border p-3.5 text-sm font-medium ${
                  selectedIdx === exercise.correctIndex
                    ? 'border-[#059669]/30 bg-emerald-50 text-[#059669]'
                    : 'border-[#DC2626]/30 bg-red-50 text-[#DC2626]'
                }`}
              >
                {selectedIdx === exercise.correctIndex
                  ? 'Respuesta correcta (+20 XP). Has aplicado bien la regla.'
                  : `Respuesta incorrecta (-0,33 en examen oficial). La correcta era la ${
                      letters[exercise.correctIndex]
                    }.`}
              </div>

              <ol className="space-y-2.5 text-sm leading-relaxed text-slate-700">
                {exercise.steps.map((step, i) => (
                  <li key={i} className="rounded-lg bg-[#F8FAFC] p-3 border border-[#E2E8F0]">
                    {step}
                  </li>
                ))}
              </ol>

              <button
                type="button"
                onClick={handleNextExercise}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#172E6E]"
              >
                <span>Siguiente ejercicio</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
