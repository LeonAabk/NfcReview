import React from 'react';
import { X, Shield } from 'lucide-react';

interface TermsModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {type === 'terms' ? 'Salgsbetingelser & Kjøpsvilkår' : 'Personvernerklæring (GDPR)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'terms' ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Generelt</h3>
                <p>
                  Disse salgsbetingelsene gjelder for alt salg av produkter fra NFC Review Norge til forbrukere og bedrifter i Norge. Ved bestilling aksepterer kjøperen disse vilkårene.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Priser og betaling</h3>
                <p>
                  Alle priser er oppgitt i norske kroner (NOK) inkludert merverdiavgift. Betaling skjer trygt og kryptert via Stripe (støtter Visa, Mastercard, Vipps, Apple Pay). Det tilkommer ingen skjulte eller månedlige gebyrer.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Programmering og levering</h3>
                <p>
                  Hvert produkt kodes til kjøperens oppgitte Google Bedriftsprofil før sending. Normal leveringstid er 2-4 virkedager med Posten/Bring. Fri frakt gjelder ved bestilling over 600 kr.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Reklamasjon og garanti</h3>
                <p>
                  Vi yter 2 års funksjonsgaranti på alle våre NFC-brikker og bordskilt. Dersom en brikke slutter å respondere, erstatter vi den kostnadsfritt.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">1. Behandlingsansvarlig</h3>
                <p>
                  NFC Review Norge er behandlingsansvarlig for personopplysninger som samles inn i forbindelse med bestillinger i vår nettbutikk.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">2. Hvilke opplysninger vi behandler</h3>
                <p>
                  Vi samler kun inn nødvendige opplysninger for å levere bestillingen din: Navn på kontaktperson, bedriftsnavn, leveringsadresse, e-postadresse og telefonnummer.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">3. Ingen sporing av sluttkunder</h3>
                <p>
                  Våre NFC-kort lagrer kun en direkte URL til din Google-anmeldelsesside. Kortene samler ingen persondata eller posisjonsdata fra kundene dine som tapper mobilen.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">4. Sikkerhet og tredjeparter</h3>
                <p>
                  Betalingsinformasjon behandles eksklusivt av Stripe, som er PCI-DSS sertifisert. Vi lagrer aldri kortnumre på våre servere.
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
