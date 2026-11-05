import React, { useState } from 'react';
import { CartItem, CustomerOrderData, OrderRecord } from '../types';
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { saveOrder } from '../utils/orders';
import { sanitizeText, sanitizePhone, isValidEmail } from '../utils/security';

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  onBackToStore: () => void;
  onOrderCompleted: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  subtotal,
  discountAmount,
  shippingFee,
  total,
  onBackToStore,
  onOrderCompleted
}) => {
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);
  const [reviewInputMode, setReviewInputMode] = useState<'url' | 'lookup'>('lookup');
  const [googleLookupName, setGoogleLookupName] = useState('');
  const [googleLookupCity, setGoogleLookupCity] = useState('');

  const [formData, setFormData] = useState<CustomerOrderData>({
    companyName: '',
    orgNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    googleReviewUrl: '',
    menuUrl: '',
    notes: '',
    paymentMethod: 'vipps'
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasReviewProducts = items.some(
    (item) => item.product.type === 'stand' || item.product.type === 'bundle'
  );

  const handleInputChange = (field: keyof CustomerOrderData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCompany = sanitizeText(formData.companyName);
    const cleanContact = sanitizeText(formData.contactPerson);
    const cleanEmail = sanitizeText(formData.email).toLowerCase();
    const cleanAddress = sanitizeText(formData.address);
    const cleanPostal = sanitizeText(formData.postalCode).replace(/\s+/g, '');
    const cleanCity = sanitizeText(formData.city);
    const cleanPhone = sanitizePhone(formData.phone);
    const cleanOrg = sanitizeText(formData.orgNumber || '').replace(/\s+/g, '');

    if (!cleanCompany || !cleanContact || !cleanAddress || !cleanPostal || !cleanCity || !cleanPhone) {
      setFormError('Vennligst fyll ut alle påkrevde felt (merket med *).');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setFormError('Vennligst oppgi en gyldig e-postadresse.');
      return;
    }

    const cleanLookupName = sanitizeText(googleLookupName || cleanCompany);
    const cleanLookupCity = sanitizeText(googleLookupCity || cleanCity);

    if (hasReviewProducts && reviewInputMode === 'lookup' && (!cleanLookupName || !cleanLookupCity)) {
      setFormError('Vennligst oppgi virksomhetens navn og by for Google Place ID-oppslag.');
      return;
    }

    if (hasReviewProducts && reviewInputMode === 'url' && !sanitizeText(formData.googleReviewUrl || '')) {
      setFormError('Vennligst legg inn Google Review-lenken din, eller velg «Finn for meg».');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;

    const sanitizedCustomer: CustomerOrderData = {
      companyName: cleanCompany,
      orgNumber: cleanOrg || undefined,
      contactPerson: cleanContact,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddress,
      postalCode: cleanPostal,
      city: cleanCity,
      reviewInputMode: hasReviewProducts ? reviewInputMode : undefined,
      googleLookupName: hasReviewProducts && reviewInputMode === 'lookup' ? cleanLookupName : undefined,
      googleLookupCity: hasReviewProducts && reviewInputMode === 'lookup' ? cleanLookupCity : undefined,
      googleReviewUrl: hasReviewProducts && reviewInputMode === 'lookup'
        ? `Søk via Place ID: ${cleanLookupName} (${cleanLookupCity})`
        : sanitizeText(formData.googleReviewUrl || ''),
      menuUrl: sanitizeText(formData.menuUrl || ''),
      notes: sanitizeText(formData.notes || ''),
      paymentMethod: 'vipps'
    };

    const newOrder: OrderRecord = {
      orderId: generatedId,
      createdAt: new Date().toISOString(),
      status: 'ny',
      items,
      subtotal: Math.max(0, subtotal),
      discountAmount: Math.max(0, discountAmount),
      shippingFee: Math.max(0, shippingFee),
      total: Math.max(0, total),
      customer: sanitizedCustomer,
      checklist: {
        programmedChip: false,
        qrTested: false,
        packed: false,
        shipped: false
      }
    };

    // Lagre lokalt og i Firestore i skyen
    saveOrder(newOrder);

    // Rute direkte til ordrebekreftelse og Vipps-instruksjoner
    setTimeout(() => {
      onOrderCompleted(generatedId);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner & Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tilbake til butikken</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
              ★
            </span>
            <span className="font-extrabold text-slate-900 text-base sm:text-lg">
              NFC Review<span className="text-blue-600">.no</span>
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-300">
              UB
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">256-bit SSL kryptert</span>
            <span className="sm:hidden">Sikker kasse</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fullfør bestilling
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Google Review NFC-kort med 3M™-feste · Ferdig programmert og kvalitetstestet
          </p>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Vennligst sjekk bestillingen:</p>
              <p>{formError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Bedriftsinformasjon */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h2 className="text-base font-bold text-slate-900">Bedriftsinformasjon & Kontakt</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bedriftens navn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="F.eks. Bakeriet Hamar AS"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organisasjonsnummer <span className="text-slate-400 font-normal">(valgfritt)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="9 siffer (f.eks. 987 654 321)"
                    value={formData.orgNumber || ''}
                    onChange={(e) => handleInputChange('orgNumber', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kontaktperson *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Fornavn og etternavn"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-post (for ordrebekreftelse & sporing) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="post@bedrift.no"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobilnummer (for Posten sporings-SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="8 siffer (f.eks. 94118086)"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Leveringsadresse */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h2 className="text-base font-bold text-slate-900">Leveringsadresse med Posten</h2>
                </div>
                <span className="text-xs text-slate-500 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sendes som pakke</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gateadresse *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Storgata 1"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postnummer *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="2319"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Poststed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hamar"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Programmering av Google-lenke */}
            {hasReviewProducts && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <h2 className="text-base font-bold text-slate-900">Google Review-kobling</h2>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ferdigkodet ved levering
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Velg hvordan du ønsker at vi koder NFC-brikkene dine før utsending:
                </p>

                {/* Input Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setReviewInputMode('lookup')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      reviewInputMode === 'lookup'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Finn for meg (Enklest)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewInputMode('url')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      reviewInputMode === 'url'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Lim inn lenke selv</span>
                  </button>
                </div>

                {reviewInputMode === 'lookup' ? (
                  <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-3">
                    <div className="flex items-start space-x-2.5 text-xs text-blue-900">
                      <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p>
                        <strong>Null stress:</strong> Oppgi virksomhetens navn og by, så finner vi din offisielle <strong>Google Place ID</strong> og programmerer den permanente direkte-lenken for deg før sending!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Virksomhetens navn på Google Maps *
                        </label>
                        <input
                          type="text"
                          placeholder={formData.companyName || 'F.eks. Bakeriet Hamar'}
                          value={googleLookupName}
                          onChange={(e) => setGoogleLookupName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          By / Poststed *
                        </label>
                        <input
                          type="text"
                          placeholder={formData.city || 'F.eks. Hamar'}
                          value={googleLookupCity}
                          onChange={(e) => setGoogleLookupCity(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google Review-lenke *
                      </label>
                      <input
                        type="url"
                        placeholder="https://g.page/r/... eller https://maps.app.goo.gl/..."
                        value={formData.googleReviewUrl || ''}
                        onChange={(e) => handleInputChange('googleReviewUrl', e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGoogleGuide(!showGoogleGuide)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Hvordan finner jeg lenken min?</span>
                      {showGoogleGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showGoogleGuide && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-600">
                        <p className="font-bold text-slate-800">Slik finner du Google Review-lenken:</p>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Søk opp bedriften din på Google mens du er logget inn som eier.</li>
                          <li>Klikk på <strong>«Be om vurderinger»</strong> eller <strong>«Få flere anmeldelser»</strong>.</li>
                          <li>Kopier kortlenken som vises (f.eks. <code>https://g.page/r/.../review</code>) og lim den inn her.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Betaling */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#ff5b24]/15 text-[#ff5b24] flex items-center justify-center text-xs font-bold">
                    {hasReviewProducts ? '4' : '3'}
                  </span>
                  <h2 className="text-base font-bold text-slate-900">Betalingsmetode</h2>
                </div>
                <span className="text-xs text-slate-500 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vipps Bedrift</span>
                </span>
              </div>

              <div className="p-4 rounded-xl border-2 border-[#ff5b24] bg-orange-50/40 flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#ff5b24] text-white flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-xs">
                  V
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span>Vipps Bedrift</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ff5b24]/10 text-[#ff5b24]">
                      Enkelt & Raskt
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Når du trykker på fullfør under, opprettes ordren umiddelbart og du får opp Vippsnummer og instruksjoner for betaling med din unike ordrereferanse.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#ff5b24] hover:bg-[#e04f1e] active:bg-[#c94317] text-white font-extrabold text-base shadow-lg shadow-[#ff5b24]/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting ? 'Oppretter bestilling...' : `Fullfør og betal med Vipps · ${total} kr`}
                </span>
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Ved å fullføre bestillingen godtar du våre salgsbetingelser for Aabakstudio Ungdomsbedrift (Org.nr: 938 823 014).
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Ordresammendrag
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs shrink-0">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">3M™ NFC-kort</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {item.product.price * item.quantity} kr
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Delsum:</span>
                  <span className="font-mono">{subtotal} kr</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Pakkegunst-rabatt:</span>
                    <span className="font-mono">-{discountAmount} kr</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Frakt med Posten:</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Gratis</span>
                    ) : (
                      `${shippingFee} kr`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900">
                  <span className="text-sm font-bold">Totalsum:</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-blue-600 font-mono">
                      {total} kr
                    </span>
                    <span className="block text-[10px] text-slate-500">inkl. mva.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Cards */}
            <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200/80 space-y-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2.5 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Norsk Ungdomsbedrift (UB)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Offisielt registrert som <strong>Aabakstudio Ungdomsbedrift</strong> (Org.nr: <span className="font-mono font-semibold">938 823 014</span>) tilknyttet Ungt Entreprenørskap Innlandet.
              </p>
              <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kortene kodes og kvalitetstestes manuelt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Rask utsending innen 24–48 timer</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
