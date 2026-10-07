import React, { useState } from 'react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { Check, ShoppingBag, Plus, Minus } from 'lucide-react';

import { sanitizeText } from '../utils/security';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number, targetUrl?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [targetUrl, setTargetUrl] = useState('');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const handleAdd = () => {
    const cleanUrl = sanitizeText(targetUrl.trim());
    onAddToCart(product, Math.min(99, Math.max(1, quantity)), cleanUrl || undefined);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1600);
  };

  const isMenu = product.type === 'menu';

  return (
    <div className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
      product.isPopular
        ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
        : 'border-slate-200 shadow-xs hover:shadow-md'
    }`}>
      <div>
        {/* Visual Showcase */}
        <div className="relative">
          <ProductVisual
            type={product.type}
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs">
              {product.badge}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="p-6">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {product.name}
            </h3>
          </div>

          <p className="text-xs text-slate-600 mb-4 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {product.price} kr
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through font-mono">
                {product.originalPrice} kr
              </span>
            )}
            <span className="text-[11px] text-slate-500">inkl. mva</span>
          </div>

          {/* Volume Discount micro-badge */}
          <div className="mb-4 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md">
            <span>🔥 Bulk deal: 10% ved 3+ · 15% ved 5+ · 20% ved 10+</span>
          </div>

          {/* Feature Bullets */}
          <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start text-xs text-slate-700 space-x-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Optional Link Input */}
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
            <label
              htmlFor={`url-input-${product.id}`}
              className="block text-xs sm:text-[11px] font-bold text-slate-800 mb-1"
            >
              {isMenu
                ? 'Din digitale meny-lenke (eller fylles ut i kassen):'
                : 'Din Google Review-lenke (eller fylles ut i kassen):'}
            </label>
            <input
              id={`url-input-${product.id}`}
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder={
                isMenu
                  ? 'F.eks. https://restaurant.no/meny eller PDF-lenke'
                  : 'F.eks. https://g.page/r/.../review eller firmanavn'
              }
              className="w-full text-base sm:text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-slate-800 min-h-[44px] sm:min-h-0"
            />
            <p className="text-[11px] sm:text-[10px] text-slate-500 mt-1.5 leading-snug">
              Vi forhåndskoder brikkene og QR-kodene før vi shipper til adressen din.
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer: Quantity + Add to Cart */}
      <div className="p-6 pt-0 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
        {/* Quantity Stepper (Mobile Touch Optimized) */}
        <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-28 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-colors active:scale-95 touch-manipulation"
            aria-label="Reduser antall"
          >
            <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <span className="text-sm sm:text-xs font-bold text-slate-800 font-mono tabular-nums px-3">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-colors active:scale-95 touch-manipulation"
            aria-label="Øk antall"
          >
            <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-3.5 sm:py-2.5 px-4 min-h-[44px] rounded-xl text-xs sm:text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-xs touch-manipulation ${
            isAddedFeedback
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]'
          }`}
        >
          {isAddedFeedback ? (
            <>
              <Check className="w-4 h-4 animate-in zoom-in" />
              <span>Lagt til i kurven!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Legg i handlekurv</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
