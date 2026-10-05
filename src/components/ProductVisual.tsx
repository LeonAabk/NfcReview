import React, { useState } from 'react';

interface ProductVisualProps {
  type: 'stand' | 'menu' | 'bundle';
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const [menuSide, setMenuSide] = useState<'tap' | 'scan'>('tap');

  // 1. Google Review Bordskilt (Akryl) - Exact match to user photo
  if (type === 'stand') {
    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200/90 rounded-2xl overflow-hidden ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-radial from-white via-transparent to-stone-300/40 pointer-events-none" />

        {/* 3D Perspective Stand Container */}
        <div className="relative z-10 flex flex-col items-center select-none transform hover:scale-[1.02] transition-transform duration-300">
          {/* Dimension indicator badge */}
          <div className="absolute -top-3 right-0 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
            12.75 × 7.6 cm
          </div>

          {/* Upright Front Acrylic Plate */}
          <div className="relative w-44 sm:w-48 bg-white rounded-t-xl rounded-b-xs p-3.5 shadow-2xl border border-stone-200/90 flex flex-col items-center text-center">
            {/* Gloss highlight on top edge */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

            {/* "Review us on" */}
            <p className="text-[11px] font-extrabold text-slate-800 tracking-tight mt-0.5">
              Review us on
            </p>

            {/* "Google" Colorful Wordmark */}
            <div className="flex items-center justify-center space-x-[1px] text-2xl font-black tracking-tight my-0.5 font-sans">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            {/* 5 Solid Gold Stars */}
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-[#FBBC05] fill-current filter drop-shadow-xs" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Google 4-Color Stripe Bar */}
            <div className="w-full flex h-1 rounded-full overflow-hidden mb-2.5 shadow-xs">
              <div className="w-1/4 bg-[#EA4335]" />
              <div className="w-1/4 bg-[#34A853]" />
              <div className="w-1/4 bg-[#4285F4]" />
              <div className="w-1/4 bg-[#FBBC05]" />
            </div>

            {/* QR Code with Corner Brackets [ ] */}
            <div className="relative p-2 bg-stone-50 border border-stone-200/90 rounded-xl shadow-inner mb-2.5">
              {/* Corner brackets */}
              <div className="absolute top-0.5 left-0.5 w-3 h-3 border-t-2 border-l-2 border-slate-900 rounded-tl-xs" />
              <div className="absolute top-0.5 right-0.5 w-3 h-3 border-t-2 border-r-2 border-slate-900 rounded-tr-xs" />
              <div className="absolute bottom-0.5 left-0.5 w-3 h-3 border-b-2 border-l-2 border-slate-900 rounded-bl-xs" />
              <div className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-2 border-r-2 border-slate-900 rounded-br-xs" />

              {/* QR Code SVG */}
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="15" y="15" width="16" height="16" rx="2" fill="#ffffff" />
                <rect x="19" y="19" width="8" height="8" rx="1" fill="#0f172a" />

                <rect x="64" y="10" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="69" y="15" width="16" height="16" rx="2" fill="#ffffff" />
                <rect x="73" y="19" width="8" height="8" rx="1" fill="#0f172a" />

                <rect x="10" y="64" width="26" height="26" rx="3" fill="#0f172a" />
                <rect x="15" y="69" width="16" height="16" rx="2" fill="#ffffff" />
                <rect x="19" y="73" width="8" height="8" rx="1" fill="#0f172a" />

                <rect x="44" y="14" width="8" height="8" fill="#0f172a" />
                <rect x="42" y="32" width="6" height="6" fill="#0f172a" />
                <rect x="42" y="46" width="16" height="10" fill="#0f172a" />
                <rect x="64" y="44" width="8" height="8" fill="#0f172a" />
                <rect x="76" y="58" width="12" height="6" fill="#0f172a" />
                <rect x="44" y="68" width="8" height="14" fill="#0f172a" />
                <rect x="62" y="72" width="10" height="10" fill="#0f172a" />
                <rect x="80" y="80" width="8" height="8" fill="#0f172a" />
              </svg>
            </div>

            {/* Bottom Row: Tap (NFC) OR Scan (QR) */}
            <div className="w-full flex items-center justify-around text-slate-800 pt-1 border-t border-stone-100">
              {/* Tap */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="5" y="4" width="10" height="16" rx="2" />
                  <path d="M19 8a4 4 0 0 1 0 8" />
                  <path d="M22 6a7 7 0 0 1 0 12" />
                </svg>
                <span className="text-[10px] font-bold">Tap</span>
              </div>

              {/* OR */}
              <span className="text-[9px] font-extrabold text-slate-400">OR</span>

              {/* Scan */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="5" y="4" width="10" height="16" rx="2" />
                  <path d="M8 8h4v4H8z" />
                </svg>
                <span className="text-[10px] font-bold">Scan</span>
              </div>
            </div>
          </div>

          {/* L-Shaped Acrylic Base (5 cm / 1.97 inch depth) */}
          <div className="w-48 sm:w-52 h-4 bg-gradient-to-b from-stone-200 via-white to-stone-300 rounded-b-lg shadow-md border-t border-white/80 opacity-95 transform -translate-y-0.5" />
        </div>
      </div>
    );
  }

  // 2. Meny-kort (NFC Tap + QR Code) - Exact match to user photo
  if (type === 'menu') {
    return (
      <div className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-900 via-black to-stone-950 rounded-2xl overflow-hidden ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Dual Card Presentation (Tap side & Scan side) */}
        <div className="relative z-10 flex items-center justify-center gap-3 w-full max-w-sm">
          {/* Card Side 1: "Tap to view our MENU" */}
          <div className="w-36 sm:w-40 aspect-[0.67/1] bg-black text-white rounded-2xl p-3 border border-stone-800 shadow-2xl flex flex-col items-center justify-between text-center transform hover:-translate-y-1 transition-transform">
            {/* Cutlery circular emblem (Plate with knife, fork, spoon) */}
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mt-1">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {/* Knife */}
                <path d="M7 4v16M7 4a2 2 0 0 1 2 2v6H7" />
                {/* Fork */}
                <path d="M12 4v7m-2-7v4a2 2 0 0 0 4 0V4m-2 7v9" />
                {/* Spoon */}
                <path d="M17 4a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-2.5 2.5M17 11.5V20" />
              </svg>
            </div>

            {/* Typography */}
            <div className="my-auto py-1">
              <p className="text-[10px] text-stone-200 tracking-tight leading-tight">
                Tap to view our
              </p>
              <h4 className="text-xl font-black tracking-wider text-white uppercase font-sans mt-0.5">
                MENU
              </h4>
            </div>

            {/* Phone tapping NFC icon */}
            <div className="flex flex-col items-center justify-center pb-1">
              <div className="flex items-center space-x-1.5 p-1.5 bg-stone-900/80 rounded-xl border border-stone-800">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="6" y="5" width="10" height="15" rx="2" />
                  <path d="M19 9a4 4 0 0 1 0 7" />
                  <path d="M22 7a7 7 0 0 1 0 11" />
                </svg>
                <span className="text-[9px] font-bold text-stone-300 font-mono">NFC</span>
              </div>
            </div>
          </div>

          {/* Card Side 2: "Scan to view our MENU" */}
          <div className="w-36 sm:w-40 aspect-[0.67/1] bg-black text-white rounded-2xl p-3 border border-stone-800 shadow-2xl flex flex-col items-center justify-between text-center transform hover:-translate-y-1 transition-transform">
            {/* Cutlery circular emblem */}
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mt-1">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M7 4v16M7 4a2 2 0 0 1 2 2v6H7" />
                <path d="M12 4v7m-2-7v4a2 2 0 0 0 4 0V4m-2 7v9" />
                <path d="M17 4a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-2.5 2.5M17 11.5V20" />
              </svg>
            </div>

            {/* Typography */}
            <div className="my-auto py-1">
              <p className="text-[10px] text-stone-200 tracking-tight leading-tight">
                Scan to view our
              </p>
              <h4 className="text-xl font-black tracking-wider text-white uppercase font-sans mt-0.5">
                MENU
              </h4>
            </div>

            {/* QR Code in white square */}
            <div className="p-1 bg-white rounded-md shadow-sm mb-1">
              <svg className="w-12 h-12 text-black" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="28" height="28" rx="2" fill="#000000" />
                <rect x="16" y="16" width="16" height="16" rx="1" fill="#ffffff" />
                <rect x="20" y="20" width="8" height="8" fill="#000000" />
                <rect x="62" y="10" width="28" height="28" rx="2" fill="#000000" />
                <rect x="68" y="16" width="16" height="16" rx="1" fill="#ffffff" />
                <rect x="72" y="20" width="8" height="8" fill="#000000" />
                <rect x="10" y="62" width="28" height="28" rx="2" fill="#000000" />
                <rect x="16" y="68" width="16" height="16" rx="1" fill="#ffffff" />
                <rect x="20" y="72" width="8" height="8" fill="#000000" />
                <rect x="46" y="16" width="8" height="8" fill="#000000" />
                <rect x="46" y="46" width="12" height="12" fill="#000000" />
                <rect x="68" y="68" width="14" height="14" fill="#000000" />
              </svg>
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-[10px] text-stone-400 mt-3 font-medium">
          Dobbelsidig NFC Tap + QR Code
        </p>
      </div>
    );
  }

  // 3. Serveringspakke (1x Bordskilt + 2x Menykort)
  return (
    <div className={`relative flex items-center justify-center p-4 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 rounded-2xl overflow-hidden ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
      <div className="relative flex items-center justify-center w-full max-w-sm">
        {/* Acrylic Google Bordskilt in background */}
        <div className="transform scale-90 translate-x-8 -translate-y-2 opacity-95">
          <div className="w-36 bg-white rounded-lg p-2.5 shadow-xl border border-stone-200 text-center">
            <p className="text-[9px] font-bold text-slate-800">Review us on</p>
            <p className="text-sm font-black text-[#4285F4]">Google</p>
            <div className="flex justify-center space-x-0.5 text-[#FBBC05] my-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[9px]">★</span>
              ))}
            </div>
            <div className="w-8 h-8 mx-auto bg-stone-100 border rounded flex items-center justify-center text-[7px] text-slate-500 font-mono">
              QR
            </div>
          </div>
        </div>

        {/* Black Menykort in foreground */}
        <div className="absolute left-4 top-2 w-36 aspect-[0.7/1] bg-black text-white rounded-xl p-2.5 shadow-2xl border border-stone-800 transform -rotate-6 hover:rotate-0 transition-transform flex flex-col justify-between items-center text-center">
          <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
            <span className="text-[10px]">🍽️</span>
          </div>
          <div>
            <p className="text-[8px] text-stone-300">Tap to view our</p>
            <p className="text-xs font-black tracking-wide text-white uppercase">MENU</p>
          </div>
          <span className="text-[7px] font-mono text-stone-400 bg-stone-900 px-1 py-0.5 rounded">
            NFC + QR
          </span>
        </div>
      </div>
    </div>
  );
};
