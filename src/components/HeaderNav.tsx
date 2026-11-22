import React, { useState } from 'react';
import {
  Check,
  Copy,
  Flame,
  Heart,
  Infinity as InfinityIcon,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { AppMode, UserProgress } from '../types';
import { getUserLevelInfo } from '../engine/scoring';

interface HeaderNavProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  progress: UserProgress;
  onToggleFreeTraining: () => void;
  onRefillLives: () => void;
  totalBankQuestions: number;
  isExamActive: boolean;
  shareUrl: string;
  failedPendingCount: number;
}

const NAV_ITEMS: { id: AppMode; label: string }[] = [
  { id: 'ruta', label: 'Ruta C1' },
  { id: 'simulacro', label: 'Simulacro INAP' },
  { id: 'generador', label: 'Generador' },
  { id: 'clinica', label: 'Clínica Fallos' },
  { id: 'temario', label: 'Temario C1' },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  mode,
  onSelectMode,
  progress,
  onToggleFreeTraining,
  onRefillLives,
  totalBankQuestions,
  isExamActive,
  shareUrl,
  failedPendingCount,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const levelInfo = getUserLevelInfo(progress.xp);

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => onSelectMode('ruta')}
            className="font-display text-lg font-extrabold tracking-tight text-[#1E3A8A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            AdminEstadoOpGame
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectMode(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
                    active
                      ? 'text-[#1E3A8A] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {item.id === 'clinica' && failedPendingCount > 0 ? ` (${failedPendingCount})` : ''}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[13px] h-0.5 bg-[#1E3A8A]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#172E6E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Compartir reto</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet concise scrollable mode selector */}
        <nav
          aria-label="Selector de modo móvil"
          className="flex lg:hidden items-center gap-1 overflow-x-auto border-t border-[#E2E8F0] px-3 py-1.5 bg-[#F8FAFC]"
        >
          {NAV_ITEMS.map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectMode(item.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900'
                }`}
              >
                {item.label}
                {item.id === 'clinica' && failedPendingCount > 0 ? ` (${failedPendingCount})` : ''}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Non-sticky Workspace Study Telemetry Strip (hidden when exam is active to keep reading crisp) */}
      {!isExamActive && (
        <div className="border-b border-[#E2E8F0] bg-white no-print">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6 text-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-slate-700">
              <div className="flex items-center gap-1.5 font-medium">
                <Flame className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
                <span className="tabular-nums font-semibold text-slate-900">
                  {progress.streakDays} {progress.streakDays === 1 ? 'día' : 'días'}
                </span>
                <span className="text-slate-500">de racha</span>
              </div>

              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>

              <div className="flex items-center gap-1.5 font-medium">
                <Trophy className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
                <span className="tabular-nums font-semibold text-slate-900">
                  {progress.xp.toLocaleString('es-ES')} XP
                </span>
                <span className="text-slate-500">
                  · Nivel {levelInfo.level}: {levelInfo.title}
                </span>
              </div>

              <span aria-hidden="true" className="hidden sm:inline text-slate-300">
                ·
              </span>

              <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
                <span>
                  Banco activo:{' '}
                  <strong className="tabular-nums text-slate-900">{totalBankQuestions}</strong>{' '}
                  preguntas + generador ilimitado
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!progress.freeTrainingMode ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" title="Vidas disponibles en Ruta">
                    {Array.from({ length: progress.maxLives }).map((_, idx) => (
                      <Heart
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < progress.lives
                            ? 'fill-[#DC2626] text-[#DC2626]'
                            : 'text-slate-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1 tabular-nums font-semibold text-slate-800">
                      {progress.lives}/{progress.maxLives}
                    </span>
                  </div>
                  {progress.lives < progress.maxLives && (
                    <button
                      type="button"
                      onClick={onRefillLives}
                      className="text-xs font-medium text-[#1E3A8A] underline-offset-2 hover:underline whitespace-nowrap"
                    >
                      Recuperar
                    </button>
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 font-medium text-[#059669]">
                  <InfinityIcon className="h-4 w-4" aria-hidden="true" />
                  Modo libre sin vidas
                </span>
              )}

              <button
                type="button"
                onClick={onToggleFreeTraining}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  progress.freeTrainingMode
                    ? 'border-[#059669]/30 bg-emerald-50 text-[#059669]'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 hover:bg-slate-100'
                }`}
              >
                {progress.freeTrainingMode ? 'Activar vidas' : 'Entrenamiento libre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Challenge Modal */}
      {shareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 no-print"
        >
          <div className="w-full max-w-lg rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="share-dialog-title"
                  className="font-display text-lg font-bold text-slate-900"
                >
                  Compartir reto C1 por enlace
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Envía este enlace a otros opositores para competir con exactamente la misma
                  semilla de preguntas o comparar tu puntuación neta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                aria-label="Cerrar ventana"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <label htmlFor="share-url-input" className="sr-only">
                Enlace de reto
              </label>
              <input
                id="share-url-input"
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-xs text-slate-700"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Enlace copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copiar enlace</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
