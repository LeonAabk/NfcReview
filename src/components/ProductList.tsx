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

  const filteredProducts = PRODUCTS.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'stand') return item.type === 'stand';
    if (filter === 'menu') return item.type === 'menu';
    if (filter === 'bundle') return item.type === 'bundle';
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
              Ferdige, kontaktløse NFC- og QR-produkter for servering og fysiske bedrifter. Vi koder dine lenker før forsendelse!
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200/80">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alle varer
            </button>
            <button
              onClick={() => setFilter('stand')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'stand'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bordskilt
            </button>
            <button
              onClick={() => setFilter('menu')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'menu'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meny-kort
            </button>
            <button
              onClick={() => setFilter('bundle')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'bundle'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Serveringspakke
            </button>
          </div>
        </div>

        {/* Volume Discount Offer Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              %
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  Kvantumsrabatt for servering & bedrifter
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Spar 10%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
                Kjøp <strong>3 eller flere</strong> valgfrie produkter (f.eks. menykort til alle bord eller flere bordskilt) og få automatisk <strong>10% rabatt på hele ordren</strong> i kassen!
              </p>
            </div>
          </div>
          <div className="self-end sm:self-auto shrink-0 text-xs font-semibold text-emerald-700 bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Trekkes automatisk fra i kurven
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
