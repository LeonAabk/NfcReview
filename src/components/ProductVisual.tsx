import React from 'react';
import googleCardPhoto from '../assets/google-card-photo-hd.png';

interface ProductVisualProps {
  type: 'stand' | 'menu' | 'bundle';
  productId?: string;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  productId,
  size = 'md'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Multi-pack labels
  const getPackBadge = () => {
    if (productId === 'google-stand-double') return '2× NFC-kort i pakken';
    if (productId === 'google-stand-bulk-3') return '3× NFC-kort · Synlighetspakken';
    if (productId === 'google-stand-bulk-5') return '5× NFC-kort · Bedriftspakke';
    if (productId === 'menu-card-nfc') return 'Kommer senere for bedrifter';
    if (productId === 'restaurant-pro-pack') return 'Kommer senere · Meny + Review';
    return null;
  };

  const packBadge = getPackBadge();

  // 1. Google Review NFC-kort (Flatt kort med 3M-klistremerke bakpå) - Renders real product photo
  if (type === 'stand') {
    const isDouble = productId === 'google-stand-double';
    const isTriple = productId === 'google-stand-bulk-3';
    const isFive = productId === 'google-stand-bulk-5';

    return (
      <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200/90 rounded-2xl overflow-hidden group ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
        {/* Soft studio lighting gradient */}
        <div className="absolute inset-0 bg-radial from-white via-transparent to-stone-300/40 pointer-events-none" />

        {/* Dimension or Pack badge */}
        <div className="absolute top-3 right-3 z-20 bg-slate-900/85 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
          {packBadge || 'Flatt NFC-kort · 3M™-bakside'}
        </div>

        {/* Subtle photo verification tag */}
        <div className="absolute bottom-2.5 left-3 z-20 flex items-center space-x-1 text-[10px] text-slate-500 font-medium bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>Ekte produktbilde · 3M™-klistremerke bakpå</span>
        </div>

        {/* DOUBLE PACK (2x cards) */}
        {isDouble ? (
          <div className="relative z-10 flex items-center justify-center w-full select-none transform hover:scale-[1.02] transition-transform duration-300">
            <div className="relative flex flex-col items-center transform -translate-x-8 -translate-y-2 scale-90 opacity-85">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-48 sm:w-56 max-h-52 object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.16)]"
              />
              <div className="w-40 sm:w-48 h-3 bg-slate-900/20 blur-md rounded-full -mt-2" />
            </div>

            <div className="relative flex flex-col items-center transform translate-x-4 translate-y-2 scale-100 z-10">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-52 sm:w-60 max-h-56 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]"
              />
              <div className="w-44 sm:w-52 h-3.5 bg-slate-900/25 blur-md rounded-full -mt-2.5" />
            </div>
          </div>
        ) : isTriple ? (
          /* TRIPLE PACK (3x cards) */
          <div className="relative z-10 flex items-center justify-center w-full select-none transform hover:scale-[1.02] transition-transform duration-300">
            <div className="relative flex flex-col items-center transform -translate-x-12 -translate-y-2 scale-85 opacity-80">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-44 sm:w-50 max-h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              />
              <div className="w-36 h-2.5 bg-slate-900/18 blur-md rounded-full -mt-2" />
            </div>

            <div className="relative flex flex-col items-center transform translate-x-12 -translate-y-2 scale-85 opacity-80">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-44 sm:w-50 max-h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              />
              <div className="w-36 h-2.5 bg-slate-900/18 blur-md rounded-full -mt-2" />
            </div>

            <div className="absolute flex flex-col items-center transform translate-y-2 scale-100 z-10">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-52 sm:w-60 max-h-56 object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.24)]"
              />
              <div className="w-44 sm:w-52 h-3.5 bg-slate-900/25 blur-md rounded-full -mt-2.5" />
            </div>
          </div>
        ) : isFive ? (
          /* 5-PACK (5x cards showroom spread) */
          <div className="relative z-10 flex items-center justify-center w-full select-none transform hover:scale-[1.02] transition-transform duration-300">
            <div className="relative flex flex-col items-center transform -translate-x-16 -translate-y-3 scale-75 opacity-70">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-40 max-h-40 object-contain drop-shadow-md"
              />
            </div>
            <div className="relative flex flex-col items-center transform -translate-x-8 -translate-y-1 scale-85 opacity-85 z-5">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-44 max-h-46 object-contain drop-shadow-lg"
              />
            </div>
            <div className="relative flex flex-col items-center scale-100 z-20">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-52 sm:w-60 max-h-56 object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.25)]"
              />
              <div className="w-44 sm:w-52 h-3.5 bg-slate-900/25 blur-md rounded-full -mt-2.5" />
            </div>
            <div className="relative flex flex-col items-center transform translate-x-8 -translate-y-1 scale-85 opacity-85 z-5">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-44 max-h-46 object-contain drop-shadow-lg"
              />
            </div>
            <div className="relative flex flex-col items-center transform translate-x-16 -translate-y-3 scale-75 opacity-70">
              <img
                src={googleCardPhoto}
                alt="Google Review NFC-kort med 3M-bakside"
                className="w-40 max-h-40 object-contain drop-shadow-md"
              />
            </div>
          </div>
        ) : (
          /* SINGLE CARD: Focused, large, centered hero product photo */
          <div className="relative z-10 flex flex-col items-center justify-center w-full select-none transform hover:scale-[1.03] transition-transform duration-300">
            <img
              src={googleCardPhoto}
              alt="Google Review NFC-kort med 3M-klistremerke bakpå"
              className="w-56 sm:w-64 max-h-60 object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)]"
            />
            <div className="w-48 sm:w-56 h-3.5 bg-slate-900/22 blur-md rounded-full -mt-2.5" />
          </div>
        )}
      </div>
    );
  }

  // 2. Meny-kort (NFC Tap + QR Code) - SmakSync (Kommer senere)
  if (type === 'menu') {
    return (
      <div className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-900 via-black to-stone-950 rounded-2xl overflow-hidden ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {packBadge && (
          <div className="absolute top-3 right-3 z-20 bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs border border-amber-400/30">
            {packBadge}
          </div>
        )}

        {/* Dual Card Presentation (Tap side & Scan side) */}
        <div className="relative z-10 flex items-center justify-center gap-3 w-full max-w-sm opacity-90">
          <div className="w-36 sm:w-40 aspect-[0.67/1] bg-black text-white rounded-2xl p-3 border border-stone-800 shadow-2xl flex flex-col items-center justify-between text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mt-1">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M7 4v16M7 4a2 2 0 0 1 2 2v6H7" />
                <path d="M12 4v7m-2-7v4a2 2 0 0 0 4 0V4m-2 7v9" />
                <path d="M17 4a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-2.5 2.5M17 11.5V20" />
              </svg>
            </div>

            <div className="my-auto py-1">
              <p className="text-[10px] text-stone-200 tracking-tight leading-tight">
                Tap to view our
              </p>
              <h4 className="text-xl font-black tracking-wider text-white uppercase font-sans mt-0.5">
                MENU
              </h4>
            </div>

            <div className="flex items-center justify-center w-full pt-1 border-t border-stone-800/80">
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

          <div className="w-36 sm:w-40 aspect-[0.67/1] bg-black text-white rounded-2xl p-3 border border-stone-800 shadow-2xl flex flex-col items-center justify-between text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mt-1">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M7 4v16M7 4a2 2 0 0 1 2 2v6H7" />
                <path d="M12 4v7m-2-7v4a2 2 0 0 0 4 0V4m-2 7v9" />
                <path d="M17 4a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-2.5 2.5M17 11.5V20" />
              </svg>
            </div>

            <div className="my-auto py-1">
              <p className="text-[10px] text-stone-200 tracking-tight leading-tight">
                Scan to view our
              </p>
              <h4 className="text-xl font-black tracking-wider text-white uppercase font-sans mt-0.5">
                MENU
              </h4>
            </div>

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

        <p className="text-[10px] text-stone-400 mt-3 font-medium">
          SmakSync Bordkort · Lanseres senere for bedrifter
        </p>
      </div>
    );
  }

  // 3. Serveringspakke & Bundles (Kommer senere)
  return (
    <div className={`relative flex items-center justify-center p-4 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 rounded-2xl overflow-hidden ${isSm ? 'h-48' : isLg ? 'h-96' : 'h-80'}`}>
      {packBadge && (
        <div className="absolute top-3 right-3 z-20 bg-slate-900/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-slate-700">
          {packBadge}
        </div>
      )}
      <div className="relative flex items-center justify-center w-full max-w-sm">
        <div className="relative flex flex-col items-center transform translate-x-6 sm:translate-x-8 -translate-y-1 select-none">
          <img
            src={googleCardPhoto}
            alt="Google Review NFC-kort med 3M-bakside"
            className="w-48 sm:w-56 max-h-52 object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.20)]"
          />
          <div className="w-40 sm:w-48 h-3 bg-slate-900/20 blur-md rounded-full -mt-2" />
        </div>

        <div className="absolute left-2 sm:left-4 top-2 w-32 sm:w-36 aspect-[0.7/1] bg-black text-white rounded-xl p-2.5 shadow-2xl border border-stone-800 transform -rotate-6 hover:rotate-0 transition-transform flex flex-col justify-between items-center text-center z-10">
          <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center">
            <span className="text-[10px]">🍽️</span>
          </div>
          <div>
            <p className="text-[8px] text-stone-300">SmakSync</p>
            <p className="text-xs font-black tracking-wide text-white uppercase">MENY</p>
          </div>
          <span className="text-[7px] font-mono text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
            SNART
          </span>
        </div>
      </div>
    </div>
  );
};
