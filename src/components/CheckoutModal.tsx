import React, { useState } from 'react';
import { CartItem, CustomerOrderData } from '../types';
import { X, CheckCircle, Lock, CreditCard, Sparkles, HelpCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  shippingFee,
  total,
  onClearCart
}) => {
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
    notes: ''
  });

  const [stripePaymentLink, setStripePaymentLink] = useState('');
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const hasReviewProducts = items.some(
    (i) => i.product.type === 'stand' || i.product.type === 'bundle'
  );
  const hasMenuProducts = items.some(
    (i) => i.product.type === 'menu' || i.product.type === 'bundle'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (stripePaymentLink.trim().startsWith('https://buy.stripe.com/')) {
      const generatedId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderPayload = {
        orderId: generatedId,
        date: new Date().toISOString(),
        items,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        formData
      };
      localStorage.setItem(`order_${generatedId}`, JSON.stringify(orderPayload));

      const url = new URL(stripePaymentLink.trim());
      url.searchParams.set('client_reference_id', generatedId);
      if (formData.email) {
        url.searchParams.set('prefilled_email', formData.email);
      }
      window.location.href = url.toString();
      return;
    }

    setTimeout(() => {
      const generatedId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sikker utsjekk</h2>
              <p className="text-[11px] text-slate-500">Google Review Bordskilt & Meny-kort</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Lukk kasse"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Takk for din bestilling!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Ordrenummer <strong>#{orderId}</strong> er registrert. Vi koder dine ferdige NFC- og QR-produkter med dine oppgitte lenker og sender pakken med Posten innen 24-48 timer.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2">
              <p className="font-semibold text-slate-800">Bestillingssammendrag:</p>
              <p className="text-slate-600">Bedrift: {formData.companyName} ({formData.contactPerson})</p>
              <p className="text-slate-600">Levering: {formData.address}, {formData.postalCode} {formData.city}</p>
              {formData.googleReviewUrl && (
                <p className="text-blue-700 font-medium break-all">
                  Google Review-lenke: {formData.googleReviewUrl}
                </p>
              )}
              {formData.menuUrl && (
                <p className="text-amber-800 font-medium break-all">
                  Meny-lenke: {formData.menuUrl}
                </p>
              )}
              
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Delsum:</span>
                  <span className="font-mono">{subtotal} kr</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>10% Kvantumsrabatt (3+ varer):</span>
                    <span className="font-mono">-{discountAmount} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Frakt (Posten):</span>
                  <span className="font-mono">{shippingFee === 0 ? 'Gratis' : `${shippingFee} kr`}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Totalsum betalt:</span>
                  <span className="font-mono text-blue-600">{total} kr</span>
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="p-2 bg-emerald-100/80 rounded-lg text-emerald-800 text-[11px] font-semibold text-center">
                  Du sparte {discountAmount} kr med kvantumsrabatt!
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Lukk og gå tilbake til butikken
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Stripe Admin Integration Hint / Customizer */}
            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-blue-900">
                  Klar for <strong>Stripe Checkout / Payment Links</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowStripeConfig(!showStripeConfig)}
                className="text-[11px] font-semibold text-blue-700 underline"
              >
                {showStripeConfig ? 'Skjul Stripe-lenke felt' : 'Konfigurer Stripe Payment Link'}
              </button>
            </div>

            {showStripeConfig && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-in fade-in">
                <label className="font-semibold text-slate-800 block">
                  Stripe Payment Link URL:
                </label>
                <input
                  type="url"
                  value={stripePaymentLink}
                  onChange={(e) => setStripePaymentLink(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <p className="text-[11px] text-slate-500">
                  Lim inn din offentlige Stripe Payment Link her for direkte omdirigering. La stå tom for interaktiv testmodus.
                </p>
              </div>
            )}

            {/* Order Items & Discount Summary Header */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Artikler i bestillingen:</span>
                <span className="text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} stk</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 p-1.5 rounded border border-emerald-200">
                  <span>🎉 10% Kvantumsrabatt fratrekkes:</span>
                  <span className="font-mono">-{discountAmount} kr</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Tips: Bestill 3 eller flere enheter for 10% rabatt på hele ordren!
                </p>
              )}
            </div>

            {/* Step 1: Customer & Company Details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                1. Bedriftsinformasjon & Kontaktperson
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Bedriftens navn *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="F.eks. Café Sentrum AS"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Organisasjonsnummer (valgfritt)
                  </label>
                  <input
                    type="text"
                    value={formData.orgNumber}
                    onChange={(e) => setFormData({ ...formData, orgNumber: e.target.value })}
                    placeholder="9 siffer"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kontaktperson *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Fornavn og etternavn"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    E-post (for ordrebekreftelse) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="post@bedrift.no"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Telefonnummer (for Posten sporings-SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Mobilnummer (8 siffer)"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Step 2: URL Programming Section */}
            <div className="space-y-4 pt-2 bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-extrabold text-blue-900 tracking-wider">
                  2. Lenker som skal kodes inn på brikkene *
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Vi koder før sending
                </span>
              </div>

              {/* If Google Review Bordskilt is in cart */}
              {(hasReviewProducts || (!hasReviewProducts && !hasMenuProducts)) && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-800">
                    Google Review-lenke (for Google Review Bordskilt):
                  </label>
                  <input
                    type="text"
                    required={hasReviewProducts}
                    value={formData.googleReviewUrl || ''}
                    onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                    placeholder="https://g.page/r/.../review eller f.eks. 'Café Sentrum Oslo'"
                    className="w-full text-xs p-2.5 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                  />
                  <div className="p-2.5 bg-white/90 rounded-lg border border-blue-200/60 text-[10px] text-slate-600 space-y-0.5">
                    <p className="font-semibold text-slate-700">💡 Slik henter du Google-lenken:</p>
                    <p>Søk opp din bedrift på Google $\to$ Klikk «Be om anmeldelser» $\to$ Kopiér lenken og lim inn her.</p>
                  </div>
                </div>
              )}

              {/* If Meny-kort is in cart */}
              {(hasMenuProducts || (!hasReviewProducts && !hasMenuProducts)) && (
                <div className="space-y-1.5 pt-2 border-t border-blue-200/60">
                  <label className="block text-[11px] font-bold text-slate-800">
                    Meny-lenke (for Meny-kort):
                  </label>
                  <input
                    type="text"
                    required={hasMenuProducts}
                    value={formData.menuUrl || ''}
                    onChange={(e) => setFormData({ ...formData, menuUrl: e.target.value })}
                    placeholder="F.eks. https://restaurant.no/meny eller link til PDF / Favrit / Wolt"
                    className="w-full text-xs p-2.5 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500">
                    Hit sendes gjestene når de tapper mobilen på menykortet på bordet.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Delivery Address */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                3. Leveringsadresse (Hit sender vi pakken)
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Gateadresse *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Gate og nummer"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Postnummer *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="4 siffer"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Poststed *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="F.eks. Oslo"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Total and Submit */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Totalbeløp å betale:</p>
                <p className="text-2xl font-black text-slate-900 font-mono">{total} kr</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>Forbereder betaling...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {stripePaymentLink ? 'Gå til Stripe Payment Link' : 'Fullfør bestilling'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
