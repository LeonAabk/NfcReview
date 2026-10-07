import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/products';
import { Truck, ShieldCheck, Zap } from 'lucide-react';

interface ProductListProps {
  onAddToCart: (product: Product, quantity: number, targetUrl?: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const [filter, setFilter] = useState<'all' | 'stand' | 'menu' | 'bundle'>('all');

  const isBundleOrBulk = (item: Product) =>
    item.type === 'bundle' ||
    item.id.includes('bulk') ||
    item.id.includes('pack') ||
    item.id.includes('double') ||
    item.id.includes('duo');

  const standsCount = PRODUCTS.filter((item) => item.type === 'stand').length;
  const menuCount = PRODUCTS.filter((item) => item.type === 'menu').length;
  const bundleCount = PRODUCTS.filter(isBundleOrBulk).length;

  const filteredProducts = PRODUCTS.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'stand') return item.type === 'stand';
    if (filter === 'menu') return item.type === 'menu';
    if (filter === 'bundle') return isBundleOrBulk(item);
    return true;
  });

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Vårt sortiment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Google Review Bordskilt & Meny-kort
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-xl">
              Ferdige, kontaktløse NFC- og QR-produkter og gunstige pakketilbud for servering og bedrifter. Vi koder dine lenker før forsendelse!
            </p>
          </div>

          {/* Interactive Filter Tabs - Mobile Touch Scrollable */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar py-1 -my-1">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl min-w-max border border-slate-200/80">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 sm:py-1.5 sm:px-3.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center justify-center touch-manipulation ${
                  filter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/60'
                }`}
              >
                Alle varer ({PRODUCTS.length})
              </button>
              <button
                onClick={() => setFilter('stand')}
                className={`px-4 py-2 sm:py-1.5 sm:px-3.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center justify-center touch-manipulation ${
                  filter === 'stand'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/60'
                }`}
              >
                Bordskilt ({standsCount})
              </button>
              <button
                onClick={() => setFilter('menu')}
                className={`px-4 py-2 sm:py-1.5 sm:px-3.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center justify-center touch-manipulation ${
                  filter === 'menu'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 active:bg-slate-200/60'
                }`}
              >
                Meny-kort ({menuCount})
              </button>
              <button
                onClick={() => setFilter('bundle')}
                className={`px-4 py-2 sm:py-1.5 sm:px-3.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap min-h-[40px] sm:min-h-0 flex items-center space-x-1 justify-center touch-manipulation ${
                  filter === 'bundle'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100 active:bg-blue-200/60'
                }`}
              >
                <span>🎁 Pakketilbud & Bulk ({bundleCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Volume & Bulk Deals Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
              %
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  Trinnvise Bulk Deals for servering & bedrifter
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Opptil 20% rabatt
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Kjøp <strong>3+ enheter (10% rabatt)</strong> · <strong>5+ enheter (15% rabatt)</strong> · <strong>10+ enheter (20% rabatt)</strong>. Rabatten trekkes automatisk fra i kassen!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end">
            <span className="text-xs font-bold text-emerald-800 bg-white border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs">
              Fri frakt over 500 kr
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Trust markers under grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-100">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">Fri frakt over 600 kr</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Sendes med Posten direkte fra vårt lager i Norge.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">Klar til bruk på 1-2-3</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Vi forhåndskoder brikkene med dine lenker før sending.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">100% Fornøydgaranti</p>
              <p className="text-[11px] text-slate-500 mt-0.5">30 dagers åpent kjøp og 2 års produktgaranti.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
