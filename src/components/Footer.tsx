import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-lg font-bold">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                ★
              </span>
              <span>NFC Review<span className="text-blue-500">.no</span></span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-amber-400/30">UB</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              En stolt norsk <strong>Ungdomsbedrift (UB)</strong> tilknyttet Ungt Entreprenørskap. Vi leverer kontaktløse Google Review-bordskilt og menykort for å løfte lokale serveringssteder og bedrifter.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-amber-400 font-semibold bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
              <span>🇳🇴 Samarbeid med Ungt Entreprenørskap</span>
            </div>
          </div>

          {/* Navigation links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Snarveier
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Hjem</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">Slik fungerer det</a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors">Produktoversikt</a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">Prøv simulator</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Ofte stilte spørsmål</a>
              </li>
            </ul>
          </div>

          {/* Legal and compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Trygghet & Vilkår
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors text-left"
                >
                  Salgsbetingelser
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors text-left"
                >
                  Personvernerklæring
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                100% GDPR-kompatibel. Ingen sporing av kundenes personvern eller mobilenhet.
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Kontakt & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>hei@nfcreview.no</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+47 22 00 11 22</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Storgata 15, 0155 Oslo</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Org.nr: 928 341 552 MVA
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with payment methods, admin link and copyright */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <p>© {new Date().getFullYear()} NFC Review UB.</p>
            <span className="text-slate-700">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-amber-400 flex items-center space-x-1 transition-colors text-[11px]"
              title="Åpne internt ordre- og forsendelsespanel for ungdomsbedriften"
            >
              <span>🔒 Admin & Ordreoversikt</span>
            </button>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="text-[11px] font-semibold text-slate-300">Sikker betaling via</span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-white text-[10px]">
              STRIPE
            </span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-white text-[10px]">
              VIPPS
            </span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-white text-[10px]">
              VISA
            </span>
            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-white text-[10px]">
              MASTERCARD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
