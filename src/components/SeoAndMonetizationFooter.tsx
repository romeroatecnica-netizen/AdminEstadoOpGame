import React, { useState } from 'react';
import { BookMarked, Calculator, ChevronDown, ExternalLink } from 'lucide-react';
import { BLOCK_METADATA, OFFICIAL_CUTOFF_INFO } from '../data/syllabus';
import { calculateInapScore } from '../engine/scoring';
import { BlockId } from '../types';

interface SeoAndMonetizationFooterProps {
  isExamActive: boolean;
  onQuickNavigate: (mode: 'ruta' | 'simulacro' | 'generador' | 'temario') => void;
}

const FAQS = [
  {
    q: '¿Cómo se calcula la puntuación y la penalización 1/3 en el examen C1 Administrativo del Estado?',
    a: 'Cada pregunta tipo test cuenta con 4 respuestas alternativas (A, B, C, D) siendo solo una correcta. Cada respuesta acertada suma 1 punto base, cada respuesta errónea penaliza un tercio (1/3 = -0,333 puntos) y las preguntas dejadas en blanco ni suman ni restan. La fórmula exacta es Puntuación Neta = Aciertos − (Fallos / 3).',
  },
  {
    q: '¿Cuál es la estructura del ejercicio único de Administrativo del Estado (Turno Libre)?',
    a: 'Es un ejercicio único dividido en dos partes obligatorias y eliminatorias: la Primera Parte consiste en un cuestionario teórico-práctico sobre los 6 bloques del temario (incluyendo informática y ofimática), y la Segunda Parte consiste en un supuesto práctico tipo test a elegir entre dos opciones propuestas por el Tribunal sobre los bloques II, III, IV y V, ambas con preguntas adicionales de reserva.',
  },
  {
    q: '¿Cuándo conviene arriesgar y cuándo dejar en blanco con penalización -1/3?',
    a: 'Si descartas dos opciones con certeza (dudas entre 2 alternativas), tu probabilidad de acierto es del 50 % y la esperanza matemática es +0,33 puntos por pregunta: conviene responder siempre. Si dudas entre 3 opciones, la esperanza es +0,11 puntos (útil para alcanzar la nota de corte). Si no puedes descartar ninguna de las 4 opciones, la esperanza matemática es 0 y dejar en blanco protege tu puntuación frente a la varianza.',
  },
  {
    q: '¿Cómo puedo añadir mis propios paquetes de 500 o 1.000 preguntas en JSON?',
    a: 'En la pestaña «Temario C1» dispones de un importador y exportador JSON que guarda tus paquetes de preguntas en el almacenamiento local del navegador (localStorage) y además detecta automáticamente archivos estáticos /data/bloque1.json a /data/bloque6.json y /data/supuestos.json si alojas el proyecto en un servidor propio.',
  },
];

export const SeoAndMonetizationFooter: React.FC<SeoAndMonetizationFooterProps> = ({
  isExamActive,
  onQuickNavigate,
}) => {
  const [calcTotal, setCalcTotal] = useState(100);
  const [calcHits, setCalcHits] = useState(68);
  const [calcMistakes, setCalcMistakes] = useState(18);
  const [calcCutoff, setCalcCutoff] = useState(25);

  // Nunca superponer ni mostrar anuncios ni distracciones durante un simulacro activo
  if (isExamActive) {
    return null;
  }

  const safeHits = Math.min(calcHits, calcTotal);
  const safeMistakes = Math.min(calcMistakes, Math.max(0, calcTotal - safeHits));
  const score = calculateInapScore(calcTotal, safeHits, safeMistakes);
  const passedPart = score.scaledScore50 >= calcCutoff;

  return (
    <div className="mt-12 space-y-10 border-t border-[#E2E8F0] pt-10 no-print">
      {/*
        =========================================================================
        MEDIA.NET AD SLOT 1 (MID-PAGE)
        Instrucciones de integración Media.net:
        1. Inserta el script global de Media.net Contextual Ads en index.html (<head>)
           con tu Publisher ID (cid) y Domain ID.
        2. Reemplaza el contenido interior de #medianet-slot-mid con tu etiqueta
           <div id="YOUR_MEDIANET_SLOT_ID_MID"></div> y llama a window._mNHandle.queue.
        3. Mantén min-height: 110px para evitar Cumulative Layout Shift (CLS = 0).
        =========================================================================
      */}
      <aside
        id="medianet-slot-mid"
        data-ad-slot="medianet"
        aria-label="Espacio publicitario contextual"
        className="mx-auto flex min-h-[110px] w-full max-w-5xl flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-4 py-4 text-center"
      >
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Publicidad · Espacio reservado Media.net (Slot Intermedio · min-height 110px)
        </span>
        <p className="mt-1 text-xs text-slate-500">
          Contenedor preconfigurado libre de CLS para anuncios contextuales educativos.
        </p>
      </aside>

      {/* SEO Long-Tail Guide: 6 Blocks + Penalty Calculator + FAQ */}
      <section aria-labelledby="seo-guia-c1" className="space-y-8">
        <div className="max-w-3xl">
          <h2 id="seo-guia-c1" className="font-display text-2xl font-bold text-slate-900">
            Guía completa del examen C1 Administrativo del Estado (Turno Libre INAP)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Prepara gratis los test de Administrativo del Estado C1 con preguntas actualizadas de
            Ley 39/2015, Ley 40/2015, TREBEP, Ley General Presupuestaria, contratos (LCSP) y
            ofimática Microsoft 365 (Excel, Word, Access y Windows).
          </p>
        </div>

        {/* Interactive Cut-off & Penalty Calculator */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 rounded-xl border border-[#E2E8F0] bg-white p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              <span>Calculadora interactiva de nota de corte y penalización 1/3</span>
            </div>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
              {OFFICIAL_CUTOFF_INFO.formulaText}
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Ajusta tus aciertos y fallos estimados para comprobar cuánto te resta la penalización
              de 1/3 y si alcanzas la nota de corte sobre 50 puntos.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label
                  htmlFor="calc-total"
                  className="flex justify-between font-medium text-slate-700 tabular-nums"
                >
                  <span>Preguntas del ejercicio</span>
                  <strong>{calcTotal}</strong>
                </label>
                <input
                  id="calc-total"
                  type="range"
                  min={15}
                  max={100}
                  step={5}
                  value={calcTotal}
                  onChange={(e) => setCalcTotal(Number(e.target.value))}
                  className="mt-1.5 w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-cutoff"
                  className="flex justify-between font-medium text-slate-700 tabular-nums"
                >
                  <span>Nota de corte orientativa (/50)</span>
                  <strong>{calcCutoff}</strong>
                </label>
                <input
                  id="calc-cutoff"
                  type="range"
                  min={15}
                  max={45}
                  step={0.5}
                  value={calcCutoff}
                  onChange={(e) => setCalcCutoff(Number(e.target.value))}
                  className="mt-1.5 w-full accent-[#1E3A8A]"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-hits"
                  className="flex justify-between font-medium text-[#059669] tabular-nums"
                >
                  <span>Aciertos</span>
                  <strong>{safeHits}</strong>
                </label>
                <input
                  id="calc-hits"
                  type="range"
                  min={0}
                  max={calcTotal}
                  value={safeHits}
                  onChange={(e) => setCalcHits(Number(e.target.value))}
                  className="mt-1.5 w-full accent-[#059669]"
                />
              </div>

              <div>
                <label
                  htmlFor="calc-mistakes"
                  className="flex justify-between font-medium text-[#DC2626] tabular-nums"
                >
                  <span>Fallos (−0,333 c/u)</span>
                  <strong>{safeMistakes}</strong>
                </label>
                <input
                  id="calc-mistakes"
                  type="range"
                  min={0}
                  max={Math.max(0, calcTotal - safeHits)}
                  value={safeMistakes}
                  onChange={(e) => setCalcMistakes(Number(e.target.value))}
                  className="mt-1.5 w-full accent-[#DC2626]"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E2E8F0] pt-4 sm:grid-cols-4 text-center tabular-nums">
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <div className="text-[11px] text-slate-500">Bruta</div>
                <div className="font-mono-tabular text-lg font-bold text-slate-900">
                  {score.grossScore}
                </div>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <div className="text-[11px] text-slate-500">Penalización</div>
                <div className="font-mono-tabular text-lg font-bold text-[#DC2626]">
                  −{score.penaltyLost.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <div className="text-[11px] text-slate-500">Neta</div>
                <div className="font-mono-tabular text-lg font-bold text-[#1E3A8A]">
                  {score.netScore.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <div className="text-[11px] text-slate-500">Nota /50</div>
                <div
                  className={`font-mono-tabular text-lg font-bold ${
                    passedPart ? 'text-[#059669]' : 'text-[#DC2626]'
                  }`}
                >
                  {score.scaledScore50.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* 6-Block summary list */}
          <div className="lg:col-span-5 rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-slate-900">
              Desglose de los 6 bloques del temario C1
            </h3>
            <ul className="divide-y divide-[#E2E8F0] text-xs">
              {([1, 2, 3, 4, 5, 6] as BlockId[]).map((id) => (
                <li key={id} className="py-2.5">
                  <div className="font-semibold text-[#1E3A8A]">
                    {BLOCK_METADATA[id].roman}: {BLOCK_METADATA[id].title}
                  </div>
                  <p className="mt-0.5 text-slate-600">{BLOCK_METADATA[id].keyLaws.slice(0, 3).join(' · ')}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onQuickNavigate('temario')}
              className="text-xs font-semibold text-[#1E3A8A] underline underline-offset-2"
            >
              Ver programa completo e importar JSON →
            </button>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <h3 className="font-display text-lg font-bold text-slate-900">
            Preguntas frecuentes sobre la oposición Administrativo del Estado (C1)
          </h3>
          <div className="mt-4 divide-y divide-[#E2E8F0]">
            {FAQS.map((item, idx) => (
              <details key={idx} className="group py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Discreet Affiliate / Recommended Study Materials */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <BookMarked className="h-4 w-4 text-[#1E3A8A]" aria-hidden="true" />
              <span>Temarios, libros de test y material recomendado C1</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Enlaces de afiliado · Sin coste adicional para ti
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
            <a
              href="https://www.boe.es/biblioteca_juridica/index.php?tipo=C"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors hover:border-[#1E3A8A]/40"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  Códigos Electrónicos BOE (Legislación Consolidada)
                </div>
                <p className="mt-1 text-slate-600">
                  CE 1978, Ley 39/2015, Ley 40/2015, TREBEP, LGP y LCSP siempre actualizadas.
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 font-semibold text-[#1E3A8A]">
                Consultar recurso <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            </a>

            <a
              href="https://sede.inap.gob.es/cuerpo-general-administrativo-de-la-administracion-del-estado"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors hover:border-[#1E3A8A]/40"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  Manuales de Supuestos Prácticos y Exámenes INAP C1
                </div>
                <p className="mt-1 text-slate-600">
                  Recopilación comentada de casos de procedimiento, personal y presupuestos.
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 font-semibold text-[#1E3A8A]">
                Ver material C1 <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            </a>

            <a
              href="https://support.microsoft.com/es-es/excel"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-colors hover:border-[#1E3A8A]/40"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  Guía Oficial Microsoft 365 (Excel, Word y Access)
                </div>
                <p className="mt-1 text-slate-600">
                  Referencia de funciones, atajos y gestión de bases de datos para el Bloque VI.
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 font-semibold text-[#1E3A8A]">
                Abrir guía técnica <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/*
        =========================================================================
        MEDIA.NET AD SLOT 2 (FOOTER)
        Instrucciones de integración Media.net:
        Reemplaza el contenido interno por tu etiqueta de anuncio Media.net
        para el pie de página (ej. 728x90 / 970x90 responsive).
        =========================================================================
      */}
      <aside
        id="medianet-slot-footer"
        data-ad-slot="medianet"
        aria-label="Espacio publicitario inferior"
        className="mx-auto flex min-h-[110px] w-full max-w-5xl flex-col items-center justify-center rounded-xl border border-dashed border-[#E2E8F0] bg-white px-4 py-4 text-center"
      >
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Publicidad · Espacio reservado Media.net (Slot Inferior · min-height 110px)
        </span>
        <p className="mt-1 text-xs text-slate-500">
          Oculto automáticamente durante simulacros activos y en la vista de impresión.
        </p>
      </aside>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6 pb-8 text-xs text-slate-500">
        <div>
          <strong className="text-slate-800">AdminEstadoOpGame</strong> · Preparación C1
          Administrativo del Estado (Turno Libre) · Ejecución 100 % local en tu navegador.
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onQuickNavigate('ruta')}
            className="hover:text-slate-800"
          >
            Ruta C1
          </button>
          <button
            type="button"
            onClick={() => onQuickNavigate('simulacro')}
            className="hover:text-slate-800"
          >
            Simulacro -1/3
          </button>
          <button
            type="button"
            onClick={() => onQuickNavigate('generador')}
            className="hover:text-slate-800"
          >
            Generador de plazos
          </button>
        </div>
      </footer>
    </div>
  );
};
