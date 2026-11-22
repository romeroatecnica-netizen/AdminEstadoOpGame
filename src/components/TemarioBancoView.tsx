import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileJson,
  History,
  Trash2,
  Upload,
} from 'lucide-react';
import { BLOCK_METADATA } from '../data/syllabus';
import {
  clearCustomBank,
  getQuestionsByBlock,
  importJsonIntoCustomBank,
} from '../engine/questionBank';
import { BlockId, ExamHistoryEntry, Question } from '../types';

interface TemarioBancoViewProps {
  allQuestions: Question[];
  customCount: number;
  examHistory: ExamHistoryEntry[];
  onBankUpdated: () => void;
}

export const TemarioBancoView: React.FC<TemarioBancoViewProps> = ({
  allQuestions,
  customCount,
  examHistory,
  onBankUpdated,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importFeedback, setImportFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const handleImportText = () => {
    if (!jsonInput.trim()) return;
    const res = importJsonIntoCustomBank(jsonInput);
    if (res.error) {
      setImportFeedback({ ok: false, message: res.error });
      return;
    }
    setImportFeedback({
      ok: true,
      message: `Importadas ${res.added} preguntas nuevas (${res.rejected} descartadas por formato). Total en banco importado: ${res.totalCustom}.`,
    });
    setJsonInput('');
    onBankUpdated();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importJsonIntoCustomBank(text);
    if (res.error) {
      setImportFeedback({ ok: false, message: res.error });
    } else {
      setImportFeedback({
        ok: true,
        message: `Archivo "${file.name}" procesado: +${res.added} preguntas nuevas (${res.rejected} descartadas).`,
      });
      onBankUpdated();
    }
    e.target.value = '';
  };

  const handleExportJson = () => {
    const payload = JSON.stringify(allQuestions, null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adminestadoopgame-banco-c1-${allQuestions.length}-preguntas.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCustom = () => {
    clearCustomBank();
    setImportFeedback({
      ok: true,
      message: 'Banco personalizado eliminado. Se mantiene el banco base embebido.',
    });
    onBankUpdated();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-[#1E3A8A]">
          Programa Oficial C1 y Motor Escalable JSON
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Temario Oficial (6 Bloques) y Gestor de Banco de Preguntas
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-slate-600">
          Consulta el desglose completo del programa oficial de Administrativo del Estado (Subgrupo
          C1) e importa paquetes JSON de cientos o miles de preguntas sin depender de servidores
          externos.
        </p>
      </div>

      {/* 6 Blocks Syllabus Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {([1, 2, 3, 4, 5, 6] as BlockId[]).map((id) => {
          const meta = BLOCK_METADATA[id];
          const count = getQuestionsByBlock(allQuestions, id).length;
          return (
            <article
              key={id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-[#1E3A8A]">{meta.roman}</span>
                <span className="tabular-nums">{count} preguntas en banco</span>
              </div>
              <h2 className="mt-1.5 font-display text-base font-bold text-slate-900">
                {meta.title}
              </h2>
              <p className="mt-1 text-xs text-slate-500">{meta.examWeightHint}</p>

              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-700">
                {meta.topics.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#1E3A8A]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-[#E2E8F0] pt-3 text-xs text-slate-500">
                <strong className="text-slate-700">Normativa clave: </strong>
                {meta.keyLaws.join(' · ')}
              </div>
            </article>
          );
        })}
      </section>

      {/* JSON Importer / Exporter */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
              <FileJson className="h-4 w-4" aria-hidden="true" />
              <span>Escalado local a miles de preguntas</span>
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-slate-900">
              Importar / Exportar Banco JSON
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
              El motor carga el banco base embebido, busca opcionalmente archivos estáticos{' '}
              <code className="font-mono">/data/bloque1.json</code> ...{' '}
              <code className="font-mono">/data/bloque6.json</code> y{' '}
              <code className="font-mono">/data/supuestos.json</code>, y guarda tus paquetes
              importados en <code className="font-mono">localStorage</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
              <span>Exportar banco ({allQuestions.length})</span>
            </button>
            {customCount > 0 && (
              <button
                type="button"
                onClick={handleClearCustom}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DC2626]/30 bg-red-50 px-3.5 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Borrar importadas ({customCount})</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-2">
            <label
              htmlFor="json-bank-textarea"
              className="block text-xs font-semibold text-slate-700"
            >
              Pegar JSON de preguntas (array con block 1..6, question, options[4], correctIndex 0..3)
            </label>
            <textarea
              id="json-bank-textarea"
              rows={5}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='[{"id":"ext-1","block":3,"topic":"Plazos","question":"...","options":["A","B","C","D"],"correctIndex":0,"articleRef":"Art. 30 LPACAP","explanation":"..."}]'
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 font-mono text-xs text-slate-800 focus:border-[#1E3A8A] focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleImportText}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#172E6E]"
              >
                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Importar desde texto</span>
              </button>

              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <Upload className="h-3.5 w-3.5 text-[#1E3A8A]" aria-hidden="true" />
                <span>Subir archivo .json</span>
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">Esquema mínimo compatible</div>
            <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-700">
{`{
  "id": "b3-extra-01",
  "block": 3,
  "topic": "Ley 39/2015",
  "question": "Enunciado...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 1,
  "articleRef": "Art. 30.2",
  "explanation": "Motivo..."
}`}
            </pre>
          </div>
        </div>

        {importFeedback && (
          <div
            className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-medium ${
              importFeedback.ok
                ? 'border-[#059669]/30 bg-emerald-50 text-[#059669]'
                : 'border-[#DC2626]/30 bg-red-50 text-[#DC2626]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{importFeedback.message}</span>
          </div>
        )}
      </section>

      {/* Exam History */}
      <section className="rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-slate-900">
            Historial de Simulacros Oficiales
          </h2>
        </div>

        {examHistory.length === 0 ? (
          <p className="text-sm text-slate-500">
            Todavía no has completado ningún simulacro con penalización -1/3.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-slate-500">
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Modalidad</th>
                  <th className="py-2 pr-4 font-medium">Aciertos / Fallos / Blanco</th>
                  <th className="py-2 pr-4 font-medium">Penalización</th>
                  <th className="py-2 pr-4 font-medium">Nota Neta</th>
                  <th className="py-2 pr-4 font-medium">Escala /100</th>
                  <th className="py-2 font-medium">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {examHistory.map((h) => (
                  <tr key={h.id} className="text-slate-700">
                    <td className="py-2.5 pr-4 whitespace-nowrap">
                      {new Date(h.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-slate-900">{h.modeLabel}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-[#059669] font-semibold">{h.hits}</span> /{' '}
                      <span className="text-[#DC2626] font-semibold">{h.mistakes}</span> /{' '}
                      <span className="text-slate-500">{h.blanks}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-[#DC2626]">
                      −{h.penaltyLost.toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-slate-900">
                      {h.netScore.toFixed(2)} / {h.totalQuestions}
                    </td>
                    <td className="py-2.5 pr-4 font-bold text-[#1E3A8A]">
                      {h.scaledTotal100.toFixed(2)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`font-semibold ${
                          h.passed ? 'text-[#059669]' : 'text-[#DC2626]'
                        }`}
                      >
                        {h.passed ? 'APTO' : 'NO APTO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
