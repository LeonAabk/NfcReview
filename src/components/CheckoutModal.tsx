import React, { useState, useEffect } from 'react';
import { CartItem, CustomerOrderData, OrderRecord, PaymentMethod } from '../types';
import {
  X,
  CheckCircle,
  Lock,
  CreditCard,
  Sparkles,
  Printer,
  Mail,
  Send,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  ExternalLink,
  Search,
  Check,
  Loader2
} from 'lucide-react';
import { saveOrder, generateStoreOwnerNotificationEmail } from '../utils/orders';
import { sanitizeText, sanitizePhone, isValidEmail, sanitizeSafeUrl } from '../utils/security';

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
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);
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
    paymentMethod: 'vipps_card'
  });

  const [stripePaymentLink, setStripePaymentLink] = useState('');
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [savedOrderRecord, setSavedOrderRecord] = useState<OrderRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleClose = () => {
    if (isProcessing) return; // Prevent closing while processing
    setOrderComplete(false);
    setIsProcessing(false);
    setProcessingStep(0);
    setFormError(null);
    onClose();
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOrderComplete(false);
      setIsProcessing(false);
      setProcessingStep(0);
      setFormError(null);
    }
  }, [isOpen]);

  // Stepped feedback messages while processing order
  useEffect(() => {
    if (!isProcessing) {
      setProcessingStep(0);
      return;
    }

    const t1 = setTimeout(() => setProcessingStep(1), 450);
    const t2 = setTimeout(() => setProcessingStep(2), 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isProcessing]);

  // Handle ESC key to close modal (disabled during processing)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing]);

  if (!isOpen) return null;

  const hasReviewProducts = items.some(
    (i) => i.product.type === 'stand' || i.product.type === 'bundle'
  );
  const hasMenuProducts = items.some(
    (i) => i.product.type === 'menu' || i.product.type === 'bundle'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return; // Prevent multiple submissions
    setFormError(null);

    const cleanEmail = sanitizeText(formData.email).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setFormError('Vennligst skriv inn en gyldig kontakt-e-postadresse.');
      return;
    }

    const cleanCompany = sanitizeText(formData.companyName);
    const cleanContact = sanitizeText(formData.contactPerson);
    const cleanAddress = sanitizeText(formData.address);
    const cleanPostal = sanitizeText(formData.postalCode);
    const cleanCity = sanitizeText(formData.city);
    const cleanPhone = sanitizePhone(formData.phone);
    const cleanOrg = sanitizeText(formData.orgNumber).replace(/\s+/g, '');

    if (!cleanCompany || !cleanContact || !cleanAddress || !cleanPostal || !cleanCity || !cleanPhone) {
      setFormError('Vennligst fyll ut alle påkrevde felter med gyldig informasjon.');
      return;
    }

    setIsProcessing(true);

    const sanitizedCustomer: CustomerOrderData = {
      companyName: cleanCompany,
      orgNumber: cleanOrg || sanitizeText(formData.orgNumber),
      contactPerson: cleanContact,
      email: cleanEmail,
      phone: cleanPhone,
      address: cleanAddress,
      postalCode: cleanPostal,
      city: cleanCity,
      googleReviewUrl: sanitizeText(formData.googleReviewUrl),
      menuUrl: sanitizeText(formData.menuUrl),
      notes: sanitizeText(formData.notes),
      paymentMethod: 'vipps_card'
    };

    const generatedId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;
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

    saveOrder(newOrder);
    setSavedOrderRecord(newOrder);

    // If Stripe Payment Link is enabled
    if (stripePaymentLink.trim().startsWith('https://buy.stripe.com/')) {
      const url = new URL(stripePaymentLink.trim());
      url.searchParams.set('client_reference_id', generatedId);
      if (sanitizedCustomer.email) {
        url.searchParams.set('prefilled_email', sanitizedCustomer.email);
      }
      window.location.href = url.toString();
      return;
    }

    setTimeout(() => {
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);
      onClearCart();
    }, 1400);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex sm:items-center sm:justify-center p-0 sm:p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
    >
      {/* Global Loading State Indicator Overlay */}
      {isProcessing && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="status"
          aria-live="polite"
          aria-label="Behandler din bestilling"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            {/* Animated Spinner Icon with pulsing halo */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-25" />
              <div className="absolute inset-1 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-sm ring-2 ring-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Main Title & Reassurance */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Behandler din bestilling...
              </h3>
              <p className="text-xs text-slate-500">
                Vennligst vent mens vi registrerer ordren trygt i systemet.
              </p>
            </div>

            {/* Stepped live status feedback */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>
                    {processingStep === 0 && 'Oppretter kryptert tilkobling (SSL)...'}
                    {processingStep === 1 && 'Registrerer ordre & tildeler ordrenummer...'}
                    {processingStep >= 2 && 'Klargjør ordrebekreftelse...'}
                  </span>
                </span>
                <span className="text-blue-600 font-mono text-[11px] font-bold">
                  {processingStep === 0 ? '35%' : processingStep === 1 ? '75%' : '98%'}
                </span>
              </div>

              {/* Smooth Animated Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: processingStep === 0 ? '35%' : processingStep === 1 ? '75%' : '98%'
                  }}
                />
              </div>

              {/* Step checklist items */}
              <div className="pt-1 space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <Check className={`w-3.5 h-3.5 ${processingStep >= 0 ? 'text-emerald-600 font-bold' : 'text-slate-300'}`} />
                  <span className={processingStep >= 0 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    Sikker overføring og kryptering
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className={`w-3.5 h-3.5 ${processingStep >= 1 ? 'text-emerald-600 font-bold' : 'text-slate-300'}`} />
                  <span className={processingStep >= 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    Registrerer NFC/QR-koder for {formData.companyName || 'bedriften'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className={`w-3.5 h-3.5 ${processingStep >= 2 ? 'text-emerald-600 font-bold' : 'text-slate-300'}`} />
                  <span className={processingStep >= 2 ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    Genererer ordrebekreftelse og kvittering
                  </span>
                </div>
              </div>
            </div>

            {/* Order Snapshot & Reassurance */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 border-t border-slate-100 pt-3">
              <span>Totalsum: <strong className="text-slate-800 font-mono">{total} kr</strong></span>
              <span className="flex items-center space-x-1 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Ikke lukk vinduet</span>
              </span>
            </div>
          </div>
        </div>
      )}

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
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
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

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs max-w-md mx-auto space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">Bestillingssammendrag:</span>
                <span className="font-mono text-blue-600 font-bold">#{orderId}</span>
              </div>
              <p className="text-slate-600">Bedrift: <strong className="text-slate-800">{formData.companyName}</strong> ({formData.contactPerson})</p>
              {formData.orgNumber && (
                <p className="text-slate-600">Org.nr: <span className="font-mono">{formData.orgNumber}</span></p>
              )}
              <p className="text-slate-600">Levering: {formData.address}, {formData.postalCode} {formData.city}</p>
              
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-[11px] space-y-1">
                <p className="font-semibold text-emerald-950">Betalingsform:</p>
                <p className="text-emerald-800 font-semibold">
                  💳 Kortbetaling / Vipps (Trygg betaling)
                </p>
              </div>

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
                  <span>Totalsum:</span>
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
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors min-h-[44px] flex items-center justify-center touch-manipulation"
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
                    Klar for <strong>Stripe Checkout, Kort & Vipps</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStripeConfig(!showStripeConfig)}
                  className="text-[11px] font-semibold text-blue-700 underline p-1 touch-manipulation"
                >
                  {showStripeConfig ? 'Skjul felt' : 'Stripe-innstillinger'}
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
                    Lim inn din offentlige Stripe Payment Link her for direkte kortomdirigering. La stå tom for testmodus.
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

              {/* Security Banner */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] flex items-center space-x-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>SSL/TLS 256-bit kryptert bestilling · Ingen sensitive kortopplysninger lagres</span>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs flex items-center space-x-2 text-red-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

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
                      maxLength={12}
                      value={formData.orgNumber}
                      onChange={(e) => setFormData({ ...formData, orgNumber: e.target.value })}
                      placeholder="9 siffer (f.eks. 987 654 321)"
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

              {/* Step 2: URL Programming Section with «Finn min Google Review-lenke» Visual Guide */}
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs sm:text-[11px] font-bold text-slate-800">
                        Google Review-lenke (for Bordskilt):
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowGoogleGuide(!showGoogleGuide)}
                        className="inline-flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-bold underline touch-manipulation"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showGoogleGuide ? 'Skjul veileder' : 'Finn min Google-lenke (3 steg)'}</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      required={hasReviewProducts}
                      value={formData.googleReviewUrl || ''}
                      onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                      placeholder="https://g.page/r/.../review eller f.eks. 'Café Sentrum Oslo'"
                      className="w-full text-base sm:text-xs py-3 px-3.5 sm:py-2.5 sm:px-3 bg-white border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 min-h-[44px]"
                    />

                    {/* 3-Step Visual Guide Component */}
                    {showGoogleGuide && (
                      <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm space-y-3.5 animate-in fade-in duration-200 text-xs">
                        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                          <span className="font-extrabold text-blue-900 flex items-center space-x-1.5 text-xs sm:text-sm">
                            <span>📍</span>
                            <span>3 enkle steg for å finne anmeldelseslenken din:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowGoogleGuide(false)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            aria-label="Lukk veileder"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-slate-700">
                          {/* Steg 1 */}
                          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
                              <span>Søk på bedriften</span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Søk opp ditt eget bedriftsnavn på Google (eller logg inn på Google Business Profile).
                            </p>
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(formData.companyName ? `${formData.companyName} google anmeldelser` : 'min bedrift google anmeldelser')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-700 hover:underline pt-1"
                            >
                              <Search className="w-3 h-3" />
                              <span>Søk på Google ↗</span>
                            </a>
                          </div>

                          {/* Steg 2 */}
                          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">2</span>
                              <span>«Be om anmeldelser»</span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Klikk på knappen «Be om anmeldelser» eller stjerne-ikonet i din bedriftsprofil.
                            </p>
                            <span className="inline-block text-[10px] bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 font-semibold">
                              ⭐ Få flere anmeldelser
                            </span>
                          </div>

                          {/* Steg 3 */}
                          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-blue-900 font-bold">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">3</span>
                              <span>Kopiér & lim inn</span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Kopiér den korte lenken (f.eks. <span className="font-mono text-[10px]">g.page/r/...</span>) og lim inn i feltet her.
                            </p>
                            {formData.googleReviewUrl && (
                              <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                                <Check className="w-3 h-3" />
                                <span>Lenke lagt inn!</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Snarvei og trygg fallback */}
                        <div className="p-2.5 bg-amber-50/90 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                          <p className="font-bold flex items-center space-x-1">
                            <span>💡</span>
                            <span>Finner du ikke lenken akkurat nå? Ingen problem!</span>
                          </p>
                          <p className="text-amber-800">
                            Skriv bare inn bedriftsnavnet og byen din i feltet (f.eks. «{formData.companyName || 'Ditt Firma'} Oslo»). Vår ungdomsbedrift søker opp og koder inn din offisielle, direkte Google-lenke helt gratis før vi sender brikkene!
                          </p>
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowGoogleGuide(false)}
                            className="text-xs text-blue-700 hover:text-blue-900 font-semibold px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Lukk veileder
                          </button>
                        </div>
                      </div>
                    )}

                    {!showGoogleGuide && (
                      <div className="p-2.5 bg-white/90 rounded-lg border border-blue-200/60 text-[11px] sm:text-[10px] text-slate-600 flex items-center justify-between">
                        <span>💡 Tips: Klikk «Finn min Google-lenke» ovenfor hvis du ikke har lenken klar.</span>
                        {formData.googleReviewUrl && formData.googleReviewUrl.startsWith('http') && sanitizeSafeUrl(formData.googleReviewUrl) && (
                          <a
                            href={sanitizeSafeUrl(formData.googleReviewUrl) || undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 font-bold hover:underline flex items-center space-x-1 shrink-0 ml-2"
                          >
                            <span>Test lenke</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
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

              {/* Step 4: Betaling (Kort & Vipps) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    4. Betaling
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Trygg betaling
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Kort / Vipps</p>
                        <p className="text-[11px] text-slate-500">Visa, Mastercard og Vipps</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      0 kr gebyr
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Rask og sikker betaling uten abonnement. Etter fullført bestilling kodes og kvalitetstestes dine NFC- og QR-produkter før de sendes direkte med Posten.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="sticky bottom-0 z-20 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg sm:shadow-none">
              <div className="flex items-center justify-between w-full sm:w-auto sm:block">
                <p className="text-xs text-slate-500">Totalsum å betale:</p>
                <div className="flex items-baseline space-x-1.5">
                  <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">{total} kr</p>
                  <span className="text-[11px] text-slate-500">inkl. frakt</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="w-1/3 sm:w-auto px-4 py-3 sm:py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-semibold text-xs rounded-xl transition-colors min-h-[44px] flex items-center justify-center touch-manipulation"
                >
                  Avbryt
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-2/3 sm:w-auto px-7 py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 touch-manipulation min-h-[44px] active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Behandler bestilling...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {stripePaymentLink ? 'Gå til betaling' : 'Fullfør bestilling'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
