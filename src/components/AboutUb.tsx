import React from 'react';
import { Award, HeartHandshake, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutUbProps {
  onOrderClick: () => void;
}

export const AboutUb: React.FC<AboutUbProps> = ({ onOrderClick }) => {
  return (
    <section id="about-ub" className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 border border-amber-300 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <span>🇳🇴</span>
            <span>Stolt Norsk Ungdomsbedrift (UB)</span>
            <span className="text-amber-400">·</span>
            <span>Ungt Entreprenørskap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Drevet av unge grundere med lidenskap for smarte løsninger
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Vi er en registrert <strong>ungdomsbedrift (UB)</strong> etablert gjennom <strong>Ungt Entreprenørskap</strong>. Vårt mål er å gjøre kontaktløs teknologi tilgjengelig, rimelig og enkelt for norske serveringssteder og lokale bedrifter.
          </p>
        </div>

        {/* 3 Pillars of our Youth Enterprise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-5 border border-amber-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Støtt ungt entreprenørskap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Når du handler fra oss, støtter du unge norske elever som lærer praktisk bedriftsdrift, kundeservice og teknologi. Du får ekte engasjement og en leverandør som bryr seg om hver eneste bestilling.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Direkte støtte til ungt næringsliv</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-5 border border-blue-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Håndkodet & kvalitetstestet i Norge
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vi programmerer personlig hver eneste NFC-brikke og dobbeltsjekker QR-kodene manuelt med både iPhone og Android før forsendelse. Ingen masseproduksjon uten menneskelig kvalitetskontroll.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-medium text-blue-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>100% klare til bruk ut av esken</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-5 border border-emerald-200">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Ingen dyre abonnementer
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Mange leverandører krever flere hundre kroner i måneden for lignende løsninger. Som ungdomsbedrift mener vi at gode verktøy skal være rimelige for alle – du betaler kun et engangsbeløp for utstyret!
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Null faste månedlige kostnader</span>
            </div>
          </div>
        </div>

        {/* Callout Banner with CTA */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
              <span>🎓 Tilknyttet Ungt Entreprenørskap</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
              Klar til å støtte vår ungdomsbedrift og øke anmeldelsene dine?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Vi koder inn din Google Review-lenke eller menylenke og sender direkte til din bedrift med Posten. Gode bulk deals og opptil 20% rabatt!
            </p>
          </div>

          <button
            onClick={onOrderClick}
            className="w-full md:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 shrink-0 touch-manipulation"
          >
            <span>Bestill fra vår ungdomsbedrift</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
