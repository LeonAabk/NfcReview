import React, { useState } from 'react';
import { CartItem, CustomerOrderData, OrderRecord } from '../types';
import { X, CheckCircle, Lock, CreditCard, Sparkles, Printer, Mail, Send } from 'lucide-react';
import { saveOrder, generateStoreOwnerNotificationEmail } from '../utils/orders';

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
  const [savedOrderRecord, setSavedOrderRecord] = useState<OrderRecord | null>(null);

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

    const generatedId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      orderId: generatedId,
      createdAt: new Date().toISOString(),
      status: 'ny',
      items,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      customer: formData
    };
    saveOrder(newOrder);
    setSavedOrderRecord(newOrder);

    if (stripePaymentLink.trim().startsWith('https://buy.stripe.com/')) {
      const url = new URL(stripePaymentLink.trim());
      url.searchParams.set('client_reference_id', generatedId);
      if (formData.email) {
        url.searchParams.set('prefilled_email', formData.email);
      }
      window.location.href = url.toString();
      return;
    }

    setTimeout(() => {
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex sm:items-center sm:justify-center p-0 sm:p-4">
      <div className="relative bg-white w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col justify-between">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md">
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
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Lukk kasse"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          /* Confirmation Screen */
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto">
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
                    <span>Bulk Deal Rabatt:</span>
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
                  Du sparte {discountAmount} kr med bulk deal!
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              {savedOrderRecord && (
                <a
                  href={generateStoreOwnerNotificationEmail(savedOrderRecord)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Varsle bedriften på e-post</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Skriv ut kvittering</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Gå til butikken
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Stripe Admin Integration Hint / Customizer */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-blue-900 text-[11px] sm:text-xs">
                    Klar for <strong>Stripe Checkout / Payment Links</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStripeConfig(!showStripeConfig)}
                  className="text-[11px] font-semibold text-blue-700 underline p-1 touch-manipulation"
                >
                  {showStripeConfig ? 'Skjul felt' : 'Konfigurer'}
                </button>
              </div>

              {showStripeConfig && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-in fade-in">
                  <label className="font-semibold text-slate-800 block text-xs">
                    Stripe Payment Link URL:
                  </label>
                  <input
                    type="url"
                    value={stripePaymentLink}
                    onChange={(e) => setStripePaymentLink(e.target.value)}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full text-base sm:text-xs p-3 sm:p-2 bg-white border border-slate-200 rounded-lg min-h-[44px] sm:min-h-0"
                  />
                  <p className="text-[11px] text-slate-500">
                    Lim inn din offentlige Stripe Payment Link her for direkte omdirigering. La stå tom for testmodus.
                  </p>
                </div>
              )}

              {/* Order Items & Discount Summary Header */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Artikler i bestillingen:</span>
                  <span className="text-slate-500 font-mono font-semibold">{items.reduce((s, i) => s + i.quantity, 0)} stk</span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-xs">
                    <span>🎉 Bulk Deal Rabatt fratrekkes:</span>
                    <span className="font-mono">-{discountAmount} kr</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Tips: Kjøp 3+ enheter for automatisk bulk deal (10% ved 3+, 15% ved 5+, 20% ved 10+)!
                  </p>
                )}
              </div>

              {/* UB Support Badge */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs flex items-center space-x-2 text-amber-900">
                <span className="text-base shrink-0">🎓</span>
                <p className="text-[11px] leading-tight">
                  <strong>Takk for at du støtter en norsk ungdomsbedrift (UB)!</strong> Din bestilling gir oss uvurderlig praktisk erfaring med ekte næringsliv.
                </p>
              </div>

              {/* Step 1: Customer & Company Details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  1. Bedriftsinformasjon & Kontaktperson
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      Bedriftens navn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="F.eks. Café Sentrum AS"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      Organisasjonsnummer (valgfritt)
                    </label>
                    <input
                      type="text"
                      value={formData.orgNumber}
                      onChange={(e) => setFormData({ ...formData, orgNumber: e.target.value })}
                      placeholder="9 siffer"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      Kontaktperson *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Fornavn og etternavn"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      E-post (for ordrebekreftelse) *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="post@bedrift.no"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                    Telefonnummer (for Posten sporings-SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Mobilnummer (8 siffer)"
                    className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Step 2: URL Programming Section */}
              <div className="space-y-4 pt-2 bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold text-blue-900 tracking-wider">
                    2. Lenker som kodes inn på brikkene *
                  </h3>
                  <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                    Før sending
                  </span>
                </div>

                {/* If Google Review Bordskilt is in cart */}
                {(hasReviewProducts || (!hasReviewProducts && !hasMenuProducts)) && (
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-[11px] font-bold text-slate-800">
                      Google Review-lenke (for Bordskilt):
                    </label>
                    <input
                      type="text"
                      required={hasReviewProducts}
                      value={formData.googleReviewUrl || ''}
                      onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                      placeholder="https://g.page/r/.../review eller f.eks. 'Café Sentrum Oslo'"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 min-h-[44px]"
                    />
                    <div className="p-2.5 bg-white/90 rounded-lg border border-blue-200/60 text-[11px] sm:text-[10px] text-slate-600 space-y-0.5">
                      <p className="font-semibold text-slate-700">💡 Slik henter du Google-lenken:</p>
                      <p>Søk opp din bedrift på Google $\to$ Klikk «Be om anmeldelser» $\to$ Kopiér lenken og lim inn her.</p>
                    </div>
                  </div>
                )}

                {/* If Meny-kort is in cart */}
                {(hasMenuProducts || (!hasReviewProducts && !hasMenuProducts)) && (
                  <div className="space-y-1.5 pt-2 border-t border-blue-200/60">
                    <label className="block text-xs sm:text-[11px] font-bold text-slate-800">
                      Meny-lenke (for Meny-kort):
                    </label>
                    <input
                      type="text"
                      required={hasMenuProducts}
                      value={formData.menuUrl || ''}
                      onChange={(e) => setFormData({ ...formData, menuUrl: e.target.value })}
                      placeholder="F.eks. https://restaurant.no/meny eller Favrit/PDF-lenke"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 min-h-[44px]"
                    />
                    <p className="text-[11px] sm:text-[10px] text-slate-500">
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
                  <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                    Gateadresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Gate og nummer"
                    className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      Postnummer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="4 siffer"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[11px] font-semibold text-slate-700 mb-1">
                      Poststed *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="F.eks. Oslo"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="sticky bottom-0 z-20 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg sm:shadow-none">
              <div className="flex items-center justify-between w-full sm:w-auto sm:block">
                <p className="text-xs text-slate-500">Totalsum å betale:</p>
                <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">{total} kr</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold text-base sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 touch-manipulation min-h-[48px] active:scale-[0.99]"
              >
                {isProcessing ? (
                  <span>Forbereder betaling...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 sm:w-4 sm:h-4" />
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
