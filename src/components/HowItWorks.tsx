import React from 'react';
import { Smartphone, ExternalLink, Trophy, Check } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Kunden tapper kortet med mobilen',
      description:
        'Kunden holder sin iPhone eller Android-telefon inntil NFC-kortet eller bordskiltet ditt. Ingen app eller forberedelse kreves.',
      subtext: 'Fungerer med alle moderne smarttelefoner.',
      icon: Smartphone,
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      number: '02',
      title: 'Sendes direkte til Google Review',
      description:
        'Telefonen åpner umiddelbart bedriftens offisielle anmeldelsesside på Google Maps, ferdig med 5 stjerner klar til å bekreftes.',
      subtext: 'Tar under 5 sekunder for kunden.',
      icon: ExternalLink,
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      number: '03',
      title: 'Høyere rangering og flere nye kunder',
      description:
        'Flere positive anmeldelser heiser bedriften din til topps i lokale Google-søk. Du tiltrekker deg kontinuerlig nye kunder som stoler på deg.',
      subtext: 'Bærekraftig vekst uten månedlige markedsføringsgebyrer.',
      icon: Trophy,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Enkel og sømløs prosess
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Slik fungerer det i praksis
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Fra betaling i kassa til en fersk 5-stjerners anmeldelse på Google på under 10 sekunder.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-slate-300">
                      {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.accentColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-xs font-medium text-slate-500">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fulfillment reassurance banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Ferdigtrykkede kort – vi koder din lenke før sending!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Kortene og akrylskiltene er ferdigproduserte med profesjonell Google-branding, NFC-brikke og QR-kode. Du oppgir bare din anmeldelseslenke ved bestilling, så koder vi alt før vi shipper til din bedriftsadresse.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
              100% klare til bruk
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
