import React, { useState } from 'react';
import { ArrowRight, Star, ShieldCheck, Zap, Truck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onSimulatorClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onSimulatorClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasTappedMockup, setHasTappedMockup] = useState(false);

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-100/60 via-amber-50/40 to-slate-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Kicker: Ungdomsbedrift */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 shadow-xs px-3.5 py-1.5 rounded-full">
                <span>🇳🇴</span>
                <span>Offisiell Ungdomsbedrift (UB)</span>
                <span className="text-amber-400">·</span>
                <span className="font-semibold text-amber-800">Ungt Entreprenørskap</span>
              </div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 shadow-xs px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Nylansert 2026 · Støtt ungt entreprenørskap</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
              Få flere <span className="text-blue-600">5-stjerners</span> anmeldelser på sekunder.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Gjestene holder bare mobilen inntil det kontaktløse akryl-bordskiltet eller meny-kortet. Google-anmeldelsessiden eller den digitale menyen din åpner seg lynraskt. Ingen app, ingen tasting, ingen friksjon.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ingen månedlige gebyrer</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ferdig programmert</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NFC & QR på alle mobiler</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5"
              >
                <span>Se bordskilt & meny-kort</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onSimulatorClick}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center space-x-2"
              >
                <span>Se hvordan det virker</span>
              </button>
            </div>

            {/* Delivery & Security reassurance */}
            <div className="pt-2 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Rask levering med Posten</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Trygg betaling med Stripe</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Realistic Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-md cursor-pointer select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setHasTappedMockup(!hasTappedMockup)}
            >
              {/* Soft ambient shadow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-transparent rounded-3xl blur-2xl transform scale-95" />

              {/* Composition Container */}
              <div className="relative bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl overflow-hidden">
                {/* Floating NFC waves animation badge */}
                <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200/70 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600 animate-pulse" />
                  <span>NFC + QR TEKNOLOGI</span>
                </div>

                <div className="mt-6 flex flex-col items-center">
                  {/* Smartphone coming down toward the card */}
                  <div className={`transition-all duration-500 transform ${isHovered || hasTappedMockup ? 'translate-y-3' : '-translate-y-2'}`}>
                    <div className="w-48 sm:w-56 h-36 bg-slate-900 rounded-t-[28px] border-t-4 border-x-4 border-slate-800 p-2 shadow-2xl flex flex-col items-center">
                      <div className="w-16 h-2.5 bg-black rounded-full mb-3" />
                      <div className="w-full bg-white/95 rounded-xl p-2.5 text-center shadow-md animate-in fade-in">
                        <div className="flex items-center justify-center space-x-1 text-[10px] text-blue-600 font-bold">
                          <span>Google Maps</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-900 truncate">Vurder din opplevelse</p>
                        <div className="flex justify-center space-x-0.5 text-amber-400 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tap Pulse Ripple Indicator */}
                  <div className="relative -my-3 z-20">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 animate-ping absolute inset-0" />
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                      <Zap className="w-6 h-6 fill-white" />
                    </div>
                  </div>

                  {/* The NFC Review Stand & Menykort resting on surface */}
                  <div className="relative mt-2 flex items-center justify-center">
                    {/* White Google Review Stand */}
                    <div className="w-52 bg-white rounded-xl p-3 shadow-2xl border border-stone-200 text-center select-none transform hover:scale-105 transition-transform z-10">
                      <p className="text-[10px] font-extrabold text-slate-800">Review us on</p>
                      <div className="flex items-center justify-center space-x-[1px] text-lg font-black tracking-tight my-0.5 font-sans">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                      </div>
                      <div className="flex justify-center space-x-0.5 text-[#FBBC05] mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#FBBC05]" />
                        ))}
                      </div>
                      <div className="w-full flex h-1 rounded-full overflow-hidden mb-2">
                        <div className="w-1/4 bg-[#EA4335]" />
                        <div className="w-1/4 bg-[#34A853]" />
                        <div className="w-1/4 bg-[#4285F4]" />
                        <div className="w-1/4 bg-[#FBBC05]" />
                      </div>
                      <div className="w-14 h-14 mx-auto bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center text-[8px] font-mono text-slate-500 mb-1.5">
                        QR KODE
                      </div>
                      <div className="flex justify-around items-center text-[9px] font-bold text-slate-600 border-t border-stone-100 pt-1">
                        <span>Tap</span>
                        <span className="text-slate-400 font-normal">OR</span>
                        <span>Scan</span>
                      </div>
                    </div>

                    {/* Black Menykort peeking behind */}
                    <div className="absolute -right-4 -bottom-2 w-32 aspect-[0.68/1] bg-black rounded-xl p-2.5 shadow-xl border border-stone-800 transform rotate-12 flex flex-col justify-between items-center text-center text-white pointer-events-none">
                      <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[8px]">
                        🍽️
                      </div>
                      <div>
                        <p className="text-[7px] text-stone-300">Tap to view our</p>
                        <p className="text-[11px] font-black tracking-wider uppercase text-white">MENU</p>
                      </div>
                      <span className="text-[7px] font-mono text-stone-400">NFC TAP</span>
                    </div>
                  </div>
                </div>

                {/* Micro helper label */}
                <p className="text-[11px] text-slate-400 text-center mt-5">
                  Trykk på illustrasjonen for å se bevegelsen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
