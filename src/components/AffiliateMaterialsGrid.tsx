import React, { useState } from 'react';
import { BookMarked, ExternalLink } from 'lucide-react';
import {
  AFFILIATE_DISCLOSURE,
  AffiliateProduct,
  RECOMMENDED_C1_PRODUCTS,
} from '../config/affiliates';

interface AffiliateProductCardProps {
  product: AffiliateProduct;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({ product }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <a
      href={product.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] transition-colors duration-150 hover:border-[#1E3A8A]/50 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-[#E2E8F0] bg-slate-100">
        {!imgFailed ? (
          <img
            src={product.imageSrc}
            alt={product.imageAlt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 text-center">
            <BookMarked className="h-7 w-7 text-[#1E3A8A]/60" aria-hidden="true" />
            <span className="mt-2 text-xs font-semibold text-slate-700">
              {product.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="text-[11px] font-semibold text-[#1E3A8A]">
            {product.category} · Amazon.es
          </div>
          <h4 className="mt-1 font-display text-sm font-bold leading-snug text-slate-900">
            {product.title}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {product.description}
          </p>
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] group-hover:underline">
          <span>{product.ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
};

interface AffiliateMaterialsGridProps {
  heading?: string;
  subheading?: string;
}

export const AffiliateMaterialsGrid: React.FC<AffiliateMaterialsGridProps> = ({
  heading = 'Temarios, libros de test y material recomendado C1',
  subheading = 'Selección práctica para combinar con tus simulacros diarios',
}) => {
  return (
    <section
      aria-label={heading}
      className="rounded-xl border border-[#E2E8F0] bg-white p-6 space-y-4 no-print"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E3A8A]">
            <BookMarked className="h-4 w-4" aria-hidden="true" />
            <span>{heading}</span>
          </div>
          <p className="mt-1 text-xs text-slate-600">{subheading}</p>
        </div>
        <span className="text-[11px] font-medium text-slate-500">
          Amazon.es · Enlaces de afiliado
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RECOMMENDED_C1_PRODUCTS.map((product) => (
          <AffiliateProductCard key={product.id} product={product} />
        ))}
      </div>

      <p className="border-t border-[#E2E8F0] pt-3 text-[11px] leading-relaxed text-slate-500">
        Aviso legal: {AFFILIATE_DISCLOSURE}
      </p>
    </section>
  );
};
