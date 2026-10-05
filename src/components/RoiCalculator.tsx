import React, { useState } from 'react';
import { Calculator, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export const RoiCalculator: React.FC<{ onExploreProducts: () => void }> = ({ onExploreProducts }) => {
  const [customersPerDay, setCustomersPerDay] = useState(45);
  const [avgCustomerValue, setAvgCustomerValue] = useState(450); // NOK

  // Conversion rates: Without NFC ~ 1.5% leave reviews. With NFC cards at counter ~ 12% tap and review!
  const monthlyCustomers = customersPerDay * 26; // 26 working days
  const organicReviewsMonthly = Math.round(monthlyCustomers * 0.015);
  const nfcReviewsMonthly = Math.round(monthlyCustomers * 0.12);
  const newReviewsGainedPerYear = (nfcReviewsMonthly - organicReviewsMonthly) * 12;

  // Local SEO impact: each 10 extra 5-star reviews attracts ~3-5 additional high-intent customers per month
  const estimatedNewCustomersMonthly = Math.round((newReviewsGainedPerYear / 12) * 0.35);
  const estimatedAnnualRevenueGain = estimatedNewCustomersMonthly * avgCustomerValue * 12;

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator for bedrifter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hvor mye er 5-stjerners anmeldelser verdt for deg?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            78% av norske forbrukere sjekker Google-anmeldelser før de velger restaurant, frisør, tannlege eller håndverker.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold text-slate-800 mb-2">
                  <span>Antall kunder/gjester per dag:</span>
                  <span className="text-blue-600 font-mono text-base">{customersPerDay} kunder</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={customersPerDay}
                  onChange={(e) => setCustomersPerDay(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 (liten klinikk)</span>
                  <span>100 (travel kafé)</span>
                  <span>250+ (butikk)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold text-slate-800 mb-2">
                  <span>Gjennomsnittlig kjøpsverdi per kunde:</span>
                  <span className="text-blue-600 font-mono text-base">{avgCustomerValue} kr</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3500"
                  step="50"
                  value={avgCustomerValue}
                  onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>100 kr</span>
                  <span>1 500 kr</span>
                  <span>3 500 kr</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kortet koster fra <strong>349 kr</strong> (kun engangskjøp).</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tjener seg inn allerede ved din første nye kunde!</span>
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                    Estimert anmeldelsesvekst
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
                      +{nfcReviewsMonthly}
                    </span>
                    <span className="text-sm font-medium text-slate-600">nye anmeldelser / mnd</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    (Mot kun ca. {organicReviewsMonthly} uten aktiv kontaktløs oppfordring)
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                    Beregnet merverdi per år
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                      +{estimatedAnnualRevenueGain.toLocaleString('no-NO')} kr
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Beregnet ut fra ca. {estimatedNewCustomersMonthly} nye kunder per måned som velger deg fremfor konkurrentene pga. høyere Google Maps-rangering.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={onExploreProducts}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm transition-colors"
                >
                  <span>Velg dine kort nå</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
