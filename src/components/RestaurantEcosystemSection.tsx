import React from 'react';
import { ExternalLink, Zap, ShieldCheck, Tag, UtensilsCrossed, Star, Smartphone, Clock } from 'lucide-react';

export const RestaurantEcosystemSection: React.FC = () => {
  return (
    <section id="restaurant-ecosystem" className="py-20 bg-zinc-900 text-white border-y border-zinc-800 relative overflow-hidden">
      {/* Subtle architectural ambient pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Kicker & Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Kommer senere for bedrifter · Interaktiv demo åpen nå</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Aabak Studio Økosystem
          </span>
          <span className="bg-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-zinc-700">
            NFC Review UB × SmakSync
          </span>
        </div>

        {/* Header & Value Proposition */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Driver du restaurant eller kafé? SmakSync digitale menyer & menykort kommer snart
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-300 font-medium leading-relaxed">
            «Start med Google Review NFC-kort ved kassen i dag – og bli blant de første bedriftene som får digitale menyer ved bordene.»
          </p>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Per nå selger vi våre flate Google Review NFC-kort med 3M™-feste direkte i nettbutikken. Samtidig ferdigstiller vi SmakSync – vår kommende plattform for kontaktløse menykort og sanntids digitale menyer for norske serveringssteder. Du kan allerede nå teste live-demoen og melde uforpliktende interesse!
          </p>
        </div>

        {/* 3 Key Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Fordel 1 */}
          <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 text-emerald-400 flex items-center justify-center mb-5 border border-zinc-700/60">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  0.4s responstid
                </span>
                <span className="text-xs text-zinc-500 font-medium">Kommer snart</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                0.4s lynraske digitale menyer uten app-nedlasting
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Ingen tunge PDF-filer eller apper som må installeres. Gjesten holder mobilen inntil NFC-menykortet på bordet og menyen åpnes momentant i telefonens nettleser.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Fungerer på 100% av nyere iPhone og Android</span>
            </div>
          </div>

          {/* Fordel 2 */}
          <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 text-blue-400 flex items-center justify-center mb-5 border border-zinc-700/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                  14 allergener
                </span>
                <span className="text-xs text-zinc-500 font-medium">Lovpålagt & trygt</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Tydelig allergenmerking og sanntidsendring av priser
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Full interaktiv allergenfiltrering for gluten, laktose og nøtter. Oppdater utsolgte råvarer, sesongretter og priser i sanntid uten å trykke opp nye papirmenyer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Alltid oppdatert · Sparer tusenvis på trykk</span>
            </div>
          </div>

          {/* Fordel 3 */}
          <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 text-amber-400 flex items-center justify-center mb-5 border border-zinc-700/60">
                <Tag className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                  Tidlig tilgang
                </span>
                <span className="text-xs text-zinc-500 font-medium">For bedrifter</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Meld interesse nå for pilotplass og samlerabatt
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Bedrifter som allerede bruker våre Google Review NFC-kort får prioritert tilgang og pakkerabatt når menykortene og SmakSync åpner for ordinære bestillinger.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Uforpliktende interesseliste på SmakSync</span>
            </div>
          </div>
        </div>

        {/* Visual Customer Journey Flow (Bord -> Kasse) */}
        <div className="bg-zinc-950 rounded-2xl p-6 sm:p-8 border border-zinc-800/90 mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <span>Slik fungerer restaurant-synergien</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">Gjestereisen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Step 1: SmakSync ved bordet */}
            <div className="bg-zinc-900/90 rounded-xl p-5 border border-zinc-800 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Kommer senere · Ved bordet</span>
                    <h4 className="text-sm font-bold text-white">SmakSync NFC Meny-bordkort</h4>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">Lanseres senere</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Gjesten tæpper telefonen inntil menykortet på bordet. Den interaktive menyen åpnes med lekre bilder, allergenfilter og dagsaktuelle priser.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850">
                <Smartphone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Prøv live-demo nå: <strong>Restaurant Eik & Gran</strong></span>
              </div>
            </div>

            {/* Step 2: Google Review Card ved kassen */}
            <div className="bg-zinc-900/90 rounded-xl p-5 border border-zinc-800 relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                    <Star className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tilgjengelig NÅ · Ved kassen</span>
                    <h4 className="text-sm font-bold text-white">Google Review NFC-kort (med 3M™-feste)</h4>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">På lager · 399 kr</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                Fornøyd gjest betaler ved kassen eller disken og tapper på det flate Google NFC-kortet som sitter fastmontert med 3M™-bakside. 5 stjerner på under 5 sekunder!
              </p>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850">
                <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                <span>Bestill i dag: <strong>399 kr/stk eller 3-pk for 990 kr (inkl. mva.)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Required Primary & Secondary */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          {/* Primary CTA */}
          <a
            href="https://aabakstudio.com/SmakSync/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-sm rounded-xl transition-all shadow-sm group active:scale-[0.99]"
          >
            <span>Se SmakSync & meld interesse</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Secondary CTA */}
          <a
            href="https://aabakstudio.com/SmakSync/meny.html?id=restaurant_eik_og_gran"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700/90 text-zinc-100 border border-zinc-750 font-semibold text-sm rounded-xl transition-all group active:scale-[0.99]"
          >
            <span>Prøv live meny-demo</span>
            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Guarantee / Micro-copy */}
          <div className="sm:ml-auto text-xs text-zinc-400 flex items-center justify-center sm:justify-end gap-2 pt-2 sm:pt-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Norsk support fra vår ungdomsbedrift</span>
          </div>
        </div>
      </div>
    </section>
  );
};
