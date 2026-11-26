import { AppMode } from '../types';

export const CANONICAL_ORIGIN = 'https://adminestadoopgame.bastelar.com';
export const CANONICAL_URL = `${CANONICAL_ORIGIN}/`;

export const SUPPORTED_HREFLANGS = [
  { hreflang: 'es', href: CANONICAL_URL },
  { hreflang: 'x-default', href: CANONICAL_URL },
] as const;

const MODE_SEO_META: Record<AppMode, { title: string; description: string }> = {
  ruta: {
    title: 'AdminEstadoOpGame — Test Oficial C1 Administrativo del Estado y Simulacros INAP',
    description:
      'Prepara gratis las oposiciones de Administrativo del Estado (C1 Turno Libre): simulacros INAP con penalización -1/3, supuestos prácticos, ruta gamificada de los 6 bloques y generador de plazos Ley 39/2015.',
  },
  simulacro: {
    title: 'Simulacro Oficial INAP (-1/3) — AdminEstadoOpGame C1',
    description:
      'Realiza simulacros oficiales del Cuerpo General Administrativo del Estado (C1) con penalización real 1/3, supuestos prácticos A/B y calculadora estratégica de riesgo.',
  },
  generador: {
    title: 'Generador de Plazos Ley 39/2015, Gasto y Excel — AdminEstadoOpGame C1',
    description:
      'Practica ejercicios deterministas ilimitados sobre cómputo de plazos administrativos, fases del gasto público (A-D-O-K-P) y fórmulas de Excel para Administrativo del Estado C1.',
  },
  clinica: {
    title: 'Clínica de Fallos y Artículos Críticos — AdminEstadoOpGame C1',
    description:
      'Repasa las preguntas falladas con referencia exacta de artículo normativo hasta dominar todos los puntos clave de la oposición C1.',
  },
  temario: {
    title: 'Temario C1 (6 Bloques) y Banco JSON — AdminEstadoOpGame',
    description:
      'Consulta el temario completo de los 6 bloques oficiales del Cuerpo General Administrativo del Estado (C1) e importa o exporta bancos de preguntas en JSON.',
  },
};

function upsertHeadLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (hreflang) {
      el.setAttribute('hreflang', hreflang);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Mantiene <head> sincronizado usando CANONICAL_ORIGIN como única fuente de verdad.
 * Consolida la URL canónica de toda la SPA en https://adminestadoopgame.bastelar.com/
 * evitando indexar subdominios *.pages.dev, previews o parámetros efímeros (?reto=...).
 */
export function syncDocumentSeo(mode: AppMode): void {
  if (typeof document === 'undefined') return;
  const meta = MODE_SEO_META[mode] || MODE_SEO_META.ruta;

  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:url', CANONICAL_URL);
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);

  upsertHeadLink('canonical', CANONICAL_URL);
  SUPPORTED_HREFLANGS.forEach(({ hreflang, href }) => {
    upsertHeadLink('alternate', href, hreflang);
  });
}
