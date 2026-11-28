export const AMAZON_AFFILIATE_TAG = 'bastelar-21';
export const AMAZON_ES_ORIGIN = 'https://www.amazon.es';

export const AFFILIATE_DISCLOSURE =
  'En calidad de Afiliado de Amazon España, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables, sin ningún coste adicional para ti.';

/**
 * Fuerza exclusivamente el dominio https://www.amazon.es y el identificador
 * oficial tag=bastelar-21 en cualquier URL o consulta de búsqueda de producto.
 */
export function buildAmazonEsAffiliateUrl(searchTermsOrUrl: string): string {
  const trimmed = searchTermsOrUrl.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      parsed.protocol = 'https:';
      parsed.hostname = 'www.amazon.es';
      parsed.port = '';
      parsed.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
      return parsed.toString();
    } catch {
      // Fallback to amazon.es search if URL is malformed
    }
  }

  const searchUrl = new URL(`${AMAZON_ES_ORIGIN}/s`);
  searchUrl.searchParams.set('k', trimmed);
  searchUrl.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
  return searchUrl.toString();
}

export interface AffiliateProduct {
  id: string;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  url: string;
  ctaLabel: string;
}

export const RECOMMENDED_C1_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'temario-c1-completo',
    category: 'Temario Oficial C1',
    title: 'Temario Completo Administrativo del Estado (C1)',
    description:
      'Volúmenes actualizados con los 6 bloques oficiales del programa INAP, esquemas de plazos y ofimática Microsoft 365.',
    imageSrc: '/src/assets/images/prod_temario_c1_1795860967258.jpg',
    imageAlt: 'Temario completo de oposiciones Administrativo del Estado C1 en dos volúmenes',
    url: buildAmazonEsAffiliateUrl('temario administrativo del estado c1 oposiciones'),
    ctaLabel: 'Ver en Amazon.es',
  },
  {
    id: 'test-supuestos-c1',
    category: 'Test y Supuestos INAP',
    title: 'Libro de Test y Supuestos Prácticos C1',
    description:
      'Baterías de exámenes tipo test con penalización y casos prácticos resueltos de procedimiento, personal y presupuestos.',
    imageSrc: '/src/assets/images/prod_supuestos_c1_1795860967811.jpg',
    imageAlt: 'Libro de test y casos prácticos para oposiciones Administrativo del Estado C1',
    url: buildAmazonEsAffiliateUrl('test supuestos practicos administrativo del estado c1'),
    ctaLabel: 'Ver en Amazon.es',
  },
  {
    id: 'codigo-leyes-c1',
    category: 'Legislación Consolidada',
    title: 'Código Administrativo: CE, Ley 39/2015, 40/2015 y TREBEP',
    description:
      'Edición en papel para subrayar artículos literales de Constitución, procedimiento común, contratos y función pública.',
    imageSrc: '/src/assets/images/prod_legislacion_c1_1795860968658.jpg',
    imageAlt: 'Código de Derecho Administrativo Español con legislación consolidada',
    url: buildAmazonEsAffiliateUrl('ley 39/2015 40/2015 trebep codigo administrativo libro'),
    ctaLabel: 'Ver en Amazon.es',
  },
  {
    id: 'kit-estudio-opositor',
    category: 'Equipamiento de Estudio',
    title: 'Atril Ergonómico, Cronómetro Silencioso y Subrayadores',
    description:
      'Soporte de lectura postural, temporizador digital para simulacros INAP y rotuladores pastel sin traspaso.',
    imageSrc: '/src/assets/images/prod_ergonomia_estudio_1795860969240.jpg',
    imageAlt: 'Atril ergonómico de aluminio con cronómetro digital de estudio y subrayadores',
    url: buildAmazonEsAffiliateUrl('atril lectura libros ergonomico estudio cronometro oposiciones'),
    ctaLabel: 'Ver en Amazon.es',
  },
];
