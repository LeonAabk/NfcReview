import React, { useState } from 'react';
import { Smartphone, Sparkles, CheckCircle2, RotateCcw, Star, X } from 'lucide-react';

export const LiveSimulator: React.FC = () => {
  const [businessName, setBusinessName] = useState('Nordic Bakeri & Kaffe');
  const [isTapped, setIsTapped] = useState(false);
  const [rating, setRating] = useState(5);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [reviewComment, setReviewComment] = useState('Fantastisk service og nydelig kaffe! Anbefales på det varmeste.');

  const handleTap = () => {
    setIsTapped(true);
    setHasSubmitted(false);
  };

  const handleReset = () => {
    setIsTapped(false);
    setHasSubmitted(false);
  };

  return (
    <section id="simulator" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interaktiv demonstrasjon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Prøv selv: Slik opplever kunden det
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Se hvorfor 8 av 10 kunder legger igjen 5 stjerner når terskelen er borte. Klikk på kortet for å simulere en NFC-tap!
          </p>

          {/* Quick Business Name Customizer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <label htmlFor="sim-business-input" className="text-xs text-slate-400">
              Test med ditt bedriftsnavn:
            </label>
            <input
              id="sim-business-input"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="F.eks. Min Frisørsalong"
              className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Interactive Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: The NFC Card Ready to Tap */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
              1. Trykk på kortet for å tappe mobilen
            </div>

            {/* Clickable Card Stage */}
            <div
              onClick={handleTap}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTap()}
              className="group relative cursor-pointer select-none transition-transform active:scale-95 focus:outline-none"
              title="Trykk for å simulere NFC-tap"
            >
              {/* Outer pulsing ring */}
              <div className={`absolute -inset-4 rounded-3xl bg-blue-500/20 blur-xl transition-opacity ${isTapped ? 'opacity-100 scale-105' : 'opacity-40 group-hover:opacity-75'}`} />

              {/* Physical Card Mockup */}
              <div className="relative w-80 sm:w-96 aspect-[1.586/1] bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700/80 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
                {/* Metallic shine line */}
                <div className="absolute top-0 right-0 w-48 h-24 bg-gradient-to-b from-white/10 to-transparent rounded-tr-2xl pointer-events-none" />

                {/* Top: Google brand + NFC waves */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="text-sm font-bold text-white tracking-tight">Google Anmeldelser</span>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-300">
                    <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                      <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                      <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                    </svg>
                  </div>
                </div>

                {/* Center Content */}
                <div className="text-center my-auto">
                  <div className="text-xs font-semibold text-blue-400 mb-1 tracking-wide truncate px-4">
                    {businessName || 'Din Bedrift'}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400 filter drop-shadow" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300">
                    Hold mobilen inntil kortet for å vurdere
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono">NXP NTAG216 CHIP</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-medium">
                    KLAR TIL BRUK
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction helper button */}
            <button
              onClick={handleTap}
              className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Smartphone className="w-4 h-4" />
              <span>Simuler kontaktløs tap</span>
            </button>
          </div>

          {/* Right Column: Simulated Phone Screen Result */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-3">
              2. Hva kunden ser på mobilen (0,8 sekunder)
            </div>

            {/* Smartphone Frame */}
            <div className="relative w-72 sm:w-80 h-[520px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto z-20" />

              {/* Phone Screen Canvas */}
              <div className="relative flex-1 bg-white rounded-[32px] overflow-hidden flex flex-col text-slate-900 mt-1">
                {/* Instant NFC iOS banner prompt if tapped */}
                {isTapped && !hasSubmitted && (
                  <div className="absolute top-2 inset-x-2 z-30 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 animate-in slide-in-from-top duration-300">
                    <div className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase font-medium">NFC-TAG REGISTRERT</p>
                        <p className="text-xs font-semibold truncate">Åpne Google Maps for {businessName}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* State A: Idle screen before tap */}
                {!isTapped ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 animate-bounce">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <p className="font-semibold text-sm text-slate-800">Venter på kontaktløs tap...</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Trykk på kortet til venstre for å se hvordan Google Review-skjemaet popper opp direkte.
                    </p>
                  </div>
                ) : hasSubmitted ? (
                  /* State C: Successfully submitted */
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Anmeldelse publisert!</h3>
                    <p className="text-xs text-slate-600 mt-2">
                      Tusen takk! Din vurdering hjelper {businessName} med å vokse og tiltrekke nye kunder i nærområdet.
                    </p>
                    <div className="flex items-center space-x-1 text-amber-400 my-3">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <button
                      onClick={handleReset}
                      className="mt-4 inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 underline"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Start simulering på nytt</span>
                    </button>
                  </div>
                ) : (
                  /* State B: Official Google Reviews dialogue opened directly */
                  <div className="flex-1 flex flex-col p-4 bg-slate-50/60 animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-700">Google Bedriftsprofil</span>
                      </div>
                      <button onClick={handleReset} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Business identity */}
                    <div className="py-2.5">
                      <p className="text-xs font-bold text-slate-900 leading-tight truncate">{businessName}</p>
                      <p className="text-[10px] text-slate-500">Offentlig anmeldelse på Google</p>
                    </div>

                    {/* Interactive 5 Star Selector */}
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm text-center mb-2">
                      <p className="text-[11px] font-medium text-slate-700 mb-1.5">Gi din vurdering:</p>
                      <div className="flex items-center justify-center space-x-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            type="button"
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Optional Comment Input */}
                    <div className="flex-1 flex flex-col">
                      <label htmlFor="sim-review-text" className="text-[10px] text-slate-500 mb-1">Del din opplevelse (valgfritt):</label>
                      <textarea
                        id="sim-review-text"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={2}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-slate-700"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setHasSubmitted(true)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
                      >
                        Publiser anmeldelse
                      </button>
                      <p className="text-[9px] text-center text-slate-400 mt-1">
                        Kunden er logget inn med sin Google-konto på telefonen
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mb-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
