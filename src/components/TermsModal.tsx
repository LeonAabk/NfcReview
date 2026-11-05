import React, { useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { COMPANY_NAME, COMPANY_ORG_NR, COMPANY_ADDRESS, STORE_NOTIFICATION_EMAIL } from '../utils/orders';

interface TermsModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    if (!type) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {type === 'terms' ? 'Salgsbetingelser & Kjøpsvilkår' : 'Personvernerklæring (GDPR)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Lukk vilkår"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'terms' ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Generelt & Selgerinformasjon</h3>
                <p>
                  Disse salgsbetingelsene gjelder for alt salg av produkter fra vår registrerte ungdomsbedrift, <strong>{COMPANY_NAME}</strong> (Organisasjonsnummer: <strong>{COMPANY_ORG_NR}</strong>, Forretningsadresse: {COMPANY_ADDRESS}, E-post: {STORE_NOTIFICATION_EMAIL}), til bedrifter og forbrukere i Norge. Ved bestilling aksepterer kjøperen disse vilkårene.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Priser og betaling</h3>
                <p>
                  Alle priser i nettbutikken er oppgitt i norske kroner (NOK) inkludert merverdiavgift. Betaling skjer trygt og enkelt via Vipps Bedrift til bedriftens offisielle konto. Det tilkommer ingen løpende eller skjulte månedlige gebyrer på våre Google Review NFC-kort.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Programmering, montering og levering</h3>
                <p>
                  Hvert NFC-kort leveres som et flatt kort med kraftig 3M™-klistremerke på baksiden og kodes ferdig til kjøperens oppgitte Google Bedriftsprofil før sending. Normal leveringstid er 2–4 virkedager med Posten/Bring. Fri frakt gjelder ved bestilling over 500 kr (inkludert i Synlighetspakken og Bedriftspakken).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Reklamasjon og garanti</h3>
                <p>
                  Vi yter 2 års funksjonsgaranti på alle våre NFC-kort. Dersom en NFC-brikke slutter å respondere ved normal bruk, erstatter vi kortet kostnadsfritt.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Behandlingsansvarlig</h3>
                <p>
                  <strong>{COMPANY_NAME}</strong> (Org.nr: <strong>{COMPANY_ORG_NR}</strong>) er behandlingsansvarlig for personopplysninger som samles inn i forbindelse med bestillinger i vår nettbutikk.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Hvilke opplysninger vi behandler</h3>
                <p>
                  Vi samler kun inn nødvendige opplysninger for å programmere og levere bestillingen din: Navn på kontaktperson, bedriftsnavn, leveringsadresse, e-postadresse, telefonnummer og bedriftens offentlige Google-anmeldelseslenke eller stedsnavn.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Ingen sporing av sluttkunder</h3>
                <p>
                  Våre Google Review NFC-kort åpner kun din Google-anmeldelsesside i kundens nettleser/Google Maps. Kortene lagrer eller sporer ingen persondata fra kundene dine som tæpper mobilen mot kortet.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Sikkerhet og tredjeparter</h3>
                <p>
                  Betalinger formidles trygt via Vipps MobilePay til vår bedriftskonto i SpareBank 1 Østlandet. Vi lagrer aldri sensitive betalingsopplysninger.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
};
