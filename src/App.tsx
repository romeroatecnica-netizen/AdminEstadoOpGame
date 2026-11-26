import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClinicaFallosView } from './components/ClinicaFallosView';
import { GeneradorParametricoView } from './components/GeneradorParametricoView';
import { HeaderNav } from './components/HeaderNav';
import { RutaDuolingoView } from './components/RutaDuolingoView';
import { SeoAndMonetizationFooter } from './components/SeoAndMonetizationFooter';
import { SimulacroInapView } from './components/SimulacroInapView';
import { TemarioBancoView } from './components/TemarioBancoView';
import { syncDocumentSeo } from './config/seo';
import {
  EMBEDDED_CASE_STUDIES,
  EMBEDDED_QUESTIONS,
  loadOptionalExternalBanks,
  mergeQuestionBanks,
} from './engine/questionBank';
import {
  loadCustomQuestions,
  loadUserProgress,
  recordExamResult,
  recordQuestionAttempt,
  saveUserProgress,
} from './engine/storage';
import {
  clearChallengeFromUrl,
  decodeChallengeFromUrl,
  encodeChallengeToUrl,
} from './engine/urlChallenge';
import {
  AppMode,
  BlockId,
  CaseStudy,
  ExamHistoryEntry,
  Question,
  SharedChallenge,
  UserProgress,
} from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('ruta');
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());
  const [externalQuestions, setExternalQuestions] = useState<Question[]>([]);
  const [externalCases, setExternalCases] = useState<CaseStudy[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() =>
    loadCustomQuestions()
  );
  const [isExamActive, setIsExamActive] = useState(false);
  const [preselectedCaseId, setPreselectedCaseId] = useState<
    'supuesto-a' | 'supuesto-b' | null
  >(null);
  const [incomingChallenge, setIncomingChallenge] =
    useState<SharedChallenge | null>(() => decodeChallengeFromUrl());
  const [sessionSeed] = useState<number>(() => Date.now() % 900000 + 100000);

  // Persist user progress automatically
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Synchronize <head> canonical, hreflang, and og:url using CANONICAL_ORIGIN
  useEffect(() => {
    syncDocumentSeo(mode);
  }, [mode]);

  // Optional static JSON banks (/data/bloque1.json .. /data/bloque6.json)
  useEffect(() => {
    let mounted = true;
    loadOptionalExternalBanks().then(({ questions, caseStudies }) => {
      if (!mounted) return;
      if (questions.length > 0) setExternalQuestions(questions);
      if (caseStudies.length > 0) setExternalCases(caseStudies);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const allQuestions = useMemo(
    () =>
      mergeQuestionBanks(
        EMBEDDED_QUESTIONS,
        externalQuestions,
        customQuestions
      ),
    [externalQuestions, customQuestions]
  );

  const allCaseStudies = useMemo(
    () => [...EMBEDDED_CASE_STUDIES, ...externalCases],
    [externalCases]
  );

  const failedPendingCount = useMemo(
    () =>
      Object.values(progress.errorClinic).filter((r) => !r.mastered).length,
    [progress.errorClinic]
  );

  const shareUrl = useMemo(() => {
    const lastExam = progress.examHistory[0];
    return encodeChallengeToUrl({
      type: mode === 'generador' ? 'generador' : 'simulacro',
      block: 'all',
      questionCount: 50,
      cutoff: 25,
      seed: sessionSeed,
      challengerScore: lastExam
        ? `${lastExam.scaledTotal100.toFixed(1)}/100`
        : `${progress.xp} XP`,
    });
  }, [mode, progress.examHistory, progress.xp, sessionSeed]);

  const handleToggleFreeTraining = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      freeTrainingMode: !prev.freeTrainingMode,
    }));
  }, []);

  const handleRefillLives = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      lives: prev.maxLives,
    }));
  }, []);

  const handleAttemptQuestion = useCallback(
    (question: Question, selectedIndex: number, xpPerHit = 15) => {
      setProgress((prev) =>
        recordQuestionAttempt(prev, question, selectedIndex, xpPerHit)
      );
    },
    []
  );

  const handleCompleteLesson = useCallback(
    (blockId: BlockId | 'mixed', xpBonus: number) => {
      setProgress((prev) => {
        if (blockId === 'mixed') {
          return { ...prev, xp: prev.xp + xpBonus };
        }
        const curr = prev.blocks[blockId];
        return {
          ...prev,
          xp: prev.xp + xpBonus,
          blocks: {
            ...prev.blocks,
            [blockId]: {
              ...curr,
              lessonsCompleted: curr.lessonsCompleted + 1,
              xpEarned: curr.xpEarned + xpBonus,
            },
          },
        };
      });
    },
    []
  );

  const handleFinishExam = useCallback(
    (
      entry: ExamHistoryEntry,
      answers: Record<string, number | null>,
      questions: Question[]
    ) => {
      setProgress((prev) => {
        let updated = prev;
        questions.forEach((q) => {
          const ans = answers[q.id];
          if (ans !== undefined && ans !== null) {
            updated = recordQuestionAttempt(updated, q, ans, 10);
          }
        });
        const bonusXp = entry.passed ? 120 : 50;
        return recordExamResult(updated, entry, bonusXp);
      });
    },
    []
  );

  const handleMarkMastered = useCallback((questionId: string) => {
    setProgress((prev) => {
      const existing = prev.errorClinic[questionId];
      if (!existing) return prev;
      return {
        ...prev,
        xp: prev.xp + 10,
        errorClinic: {
          ...prev.errorClinic,
          [questionId]: { ...existing, mastered: true },
        },
      };
    });
  }, []);

  const handleRemoveClinicRecord = useCallback((questionId: string) => {
    setProgress((prev) => {
      const next = { ...prev.errorClinic };
      delete next[questionId];
      return { ...prev, errorClinic: next };
    });
  }, []);

  const handleClearMastered = useCallback(() => {
    setProgress((prev) => {
      const next: typeof prev.errorClinic = {};
      Object.entries(prev.errorClinic).forEach(([k, v]) => {
        if (!v.mastered) next[k] = v;
      });
      return { ...prev, errorClinic: next };
    });
  }, []);

  const handleXpGain = useCallback((amount: number) => {
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const handleSelectMode = (nextMode: AppMode) => {
    setIsExamActive(false);
    setMode(nextMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <HeaderNav
        mode={mode}
        onSelectMode={handleSelectMode}
        progress={progress}
        onToggleFreeTraining={handleToggleFreeTraining}
        onRefillLives={handleRefillLives}
        totalBankQuestions={allQuestions.length}
        isExamActive={isExamActive}
        shareUrl={shareUrl}
        failedPendingCount={failedPendingCount}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Shared Challenge Banner */}
        {incomingChallenge && !isExamActive && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#1E3A8A]/30 bg-white p-4">
            <div className="text-xs sm:text-sm">
              <strong className="text-[#1E3A8A]">Reto compartido recibido:</strong>{' '}
              <span className="text-slate-700">
                Semilla #{incomingChallenge.seed || sessionSeed}
                {incomingChallenge.challengerScore
                  ? ` · Marca del retador: ${incomingChallenge.challengerScore}`
                  : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode(
                    incomingChallenge.type === 'generador'
                      ? 'generador'
                      : 'simulacro'
                  );
                }}
                className="rounded-lg bg-[#1E3A8A] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#172E6E]"
              >
                Aceptar reto
              </button>
              <button
                type="button"
                onClick={() => {
                  clearChallengeFromUrl();
                  setIncomingChallenge(null);
                }}
                className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {mode === 'ruta' && (
          <RutaDuolingoView
            allQuestions={allQuestions}
            caseStudies={allCaseStudies}
            progress={progress}
            onAttemptQuestion={handleAttemptQuestion}
            onCompleteLesson={handleCompleteLesson}
            onRefillLives={handleRefillLives}
            onOpenSimulacroWithCase={(caseId) => {
              setPreselectedCaseId(caseId);
              setMode('simulacro');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenClinica={() => handleSelectMode('clinica')}
          />
        )}

        {mode === 'simulacro' && (
          <SimulacroInapView
            allQuestions={allQuestions}
            caseStudies={allCaseStudies}
            preselectedCaseId={preselectedCaseId}
            challengeSeed={incomingChallenge?.seed}
            challengeBlock={incomingChallenge?.block}
            challengeCount={incomingChallenge?.questionCount}
            challengeCutoff={incomingChallenge?.cutoff}
            onExamActiveChange={setIsExamActive}
            onFinishExam={handleFinishExam}
          />
        )}

        {mode === 'generador' && (
          <GeneradorParametricoView
            initialSeed={incomingChallenge?.seed}
            onXpGain={handleXpGain}
          />
        )}

        {mode === 'clinica' && (
          <ClinicaFallosView
            errorClinic={progress.errorClinic}
            onMarkMastered={handleMarkMastered}
            onRemoveRecord={handleRemoveClinicRecord}
            onClearMastered={handleClearMastered}
            onAttemptQuestion={(q, idx) => handleAttemptQuestion(q, idx, 15)}
          />
        )}

        {mode === 'temario' && (
          <TemarioBancoView
            allQuestions={allQuestions}
            customCount={customQuestions.length}
            examHistory={progress.examHistory}
            onBankUpdated={() => setCustomQuestions(loadCustomQuestions())}
          />
        )}

        <SeoAndMonetizationFooter
          isExamActive={isExamActive}
          onQuickNavigate={(m) => handleSelectMode(m)}
        />
      </main>
    </div>
  );
}
