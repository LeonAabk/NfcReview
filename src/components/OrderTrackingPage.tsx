import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import { getStoredOrders, COMPANY_NAME, COMPANY_ORG_NR, COMPANY_ADDRESS, STORE_NOTIFICATION_EMAIL } from '../utils/orders';
import { fetchOrderFromFirestore } from '../utils/firestoreOrders';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Printer,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  QrCode
} from 'lucide-react';

interface OrderTrackingPageProps {
  orderId?: string;
  onBackToStore: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId: initialOrderId,
  onBackToStore
}) => {
  const [orderId, setOrderId] = useState<string>(() => {
    if (initialOrderId) return initialOrderId;
    const hash = window.location.hash;
    const match = hash.match(/#\/ordre\/([A-Za-z0-9_-]+)/);
    return match ? match[1] : '';
  });

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVippsNr, setCopiedVippsNr] = useState(false);
  const [copiedOrderRef, setCopiedOrderRef] = useState(false);

  const vippsNumber = localStorage.getItem('nfc_vipps_number') || '938823014';

  // Load order data (from localStorage first, then Firestore)
  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      // 1. Try local storage for instant render
      const localOrders = getStoredOrders();
      const foundLocal = localOrders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
      if (foundLocal && isMounted) {
        setOrder(foundLocal);
        setIsLoading(false);
      }

      // 2. Fetch fresh status from Firestore in skyen
      try {
        const remoteOrder = await fetchOrderFromFirestore(orderId);
        if (remoteOrder && isMounted) {
          setOrder(remoteOrder);
        }
      } catch (err) {
        console.warn('Kunne ikke hente fra Firestore:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleCopyLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Laster ordredetaljer...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Fant ikke ordren</h2>
          <p className="text-xs text-slate-600">
            Vi fant ingen registrert ordre med referanse <strong>#{orderId || 'ukjent'}</strong>. Sjekk at lenken er riktig eller kontakt oss.
          </p>
          <button
            type="button"
            onClick={onBackToStore}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
          >
            Tilbake til butikken
          </button>
        </div>
      </div>
    );
  }

  // Determine active step (0: Mottatt, 1: Brikke kodet, 2: Pakket/testet, 3: Sendt)
  const isProgrammed = !!order.checklist?.programmedChip;
  const isPacked = !!order.checklist?.packed && !!order.checklist?.qrTested;
  const isShipped = !!order.checklist?.shipped || order.status === 'sendt' || order.status === 'fullfort';

  const currentStep = isShipped ? 3 : isPacked ? 2 : isProgrammed ? 1 : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Print-only Invoice/Receipt Document (skjult på skjerm, 1-side A4 ved print) */}
      <div className="hidden print:block print:p-8 bg-white text-black font-sans leading-relaxed text-xs">
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black tracking-tight">{COMPANY_NAME}</h1>
            <p className="text-xs text-slate-700">Org.nr: <strong>{COMPANY_ORG_NR}</strong> (MVA-registrert UB)</p>
            <p className="text-xs text-slate-600">{COMPANY_ADDRESS}</p>
            <p className="text-xs text-slate-600">E-post: {STORE_NOTIFICATION_EMAIL}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm rounded">
              KVITTERING / ORDRE
            </span>
            <p className="font-mono font-bold text-sm mt-2">#{order.orderId}</p>
            <p className="text-xs text-slate-600">
              Dato: {new Date(order.createdAt).toLocaleDateString('no-NO')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-3 border border-slate-300 rounded">
            <p className="font-bold text-slate-900 text-xs mb-1">Leveres til:</p>
            <p className="font-bold">{order.customer.companyName}</p>
            <p>Att: {order.customer.contactPerson}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.postalCode} {order.customer.city}</p>
            <p>Tlf: {order.customer.phone} · {order.customer.email}</p>
            {order.customer.orgNumber && <p className="font-mono">Kunde org.nr: {order.customer.orgNumber}</p>}
          </div>

          <div className="p-3 border border-slate-300 rounded">
            <p className="font-bold text-slate-900 text-xs mb-1">Programmeringsspesifikasjon:</p>
            <p className="text-xs break-all">
              {order.customer.reviewInputMode === 'lookup'
                ? `Google Place ID: ${order.customer.googleLookupName || order.customer.companyName} (${order.customer.googleLookupCity || order.customer.city})`
                : (order.customer.googleReviewUrl || 'Kodes med direkte URL')}
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Kort-type: Flate Google Review NFC-kort m/ 3M™-feste
            </p>
            <p className="text-xs text-slate-600">
              Status: {isShipped ? 'Sendt med Posten' : 'Under klargjøring'}
            </p>
          </div>
        </div>

        <table className="w-full text-left text-xs mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-2">Varebeskrivelse</th>
              <th className="py-2 text-center">Antall</th>
              <th className="py-2 text-right">Enhetspris</th>
              <th className="py-2 text-right">Mva</th>
              <th className="py-2 text-right">Sum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 font-medium">{item.product.name}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right font-mono">{item.product.price} kr</td>
                <td className="py-2 text-right">Inkl.</td>
                <td className="py-2 text-right font-mono">{item.product.price * item.quantity} kr</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 border-slate-900 pt-3 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Delsum:</span>
              <span className="font-mono">{order.subtotal} kr</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between font-bold text-slate-800">
                <span>Rabatt:</span>
                <span className="font-mono">-{order.discountAmount} kr</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frakt (Posten):</span>
              <span className="font-mono">{order.shippingFee === 0 ? '0 kr (Fri frakt)' : `${order.shippingFee} kr`}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Betalingsmåte:</span>
              <span className="font-semibold">Vipps Bedrift</span>
            </div>
            <div className="flex justify-between font-black text-sm border-t border-slate-900 pt-1.5">
              <span>Totalsum (inkl. mva):</span>
              <span className="font-mono">{order.total} kr</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500">
          Tusen takk for at du støtter en norsk ungdomsbedrift! Aabakstudio Ungdomsbedrift · Org.nr: {COMPANY_ORG_NR}
        </div>
      </div>

      {/* Screen View (skjules ved utskrift) */}
      <div className="print:hidden">
        {/* Navigation Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
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

            <button
              type="button"
              onClick={handlePrintReceipt}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Skriv ut kvittering</span>
              <span className="sm:hidden">Kvittering</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
          {/* Success Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
                Bestilling bekreftet
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Takk for bestillingen, {order.customer.companyName}!
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                Ordrenummer <strong className="text-blue-600 font-mono">#{order.orderId}</strong> er registrert. Vi koder dine Google Review NFC-kort og sender pakken med Posten innen 24–48 timer.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center space-x-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Skriv ut kvittering (1 side)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center space-x-2 border border-slate-200"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Sporingslenke kopiert!' : 'Kopier sporingslenke'}</span>
              </button>
            </div>
          </div>

          {/* Vipps Betalingskort */}
          {order.checklist?.paid || order.status !== 'ny' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-xs text-emerald-900 shadow-xs">
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Innbetaling registrert via Vipps</p>
                  <p className="text-emerald-700 text-xs mt-0.5">
                    Takk! Betalingen er mottatt og ordren er godkjent for programmering hos Aabakstudio UB.
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0 hidden sm:inline-block">
                {order.total} kr betalt
              </span>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50/50 rounded-3xl p-6 sm:p-7 border-2 border-[#ff5b24] shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-200/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff5b24] text-white flex items-center justify-center font-black text-lg shadow-sm">
                    V
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      Betal med Vipps for å starte produksjonen
                    </h2>
                    <p className="text-xs text-slate-600">
                      Bruk Vipps-appen på mobilen din for å fullføre betalingen
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Beløp å betale:</span>
                  <span className="text-xl sm:text-2xl font-black text-[#ff5b24] font-mono">
                    {order.total} kr
                  </span>
                </div>
              </div>

              {/* Vipps betalingsinfo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-white rounded-xl border border-orange-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      1. VIPPSNUMMER (AABAKSTUDIO UB)
                    </span>
                    <span className="font-mono font-black text-base text-slate-900">
                      {vippsNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(vippsNumber);
                        setCopiedVippsNr(true);
                        setTimeout(() => setCopiedVippsNr(false), 2000);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-[#ff5b24] text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedVippsNr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedVippsNr ? 'Kopiert' : 'Kopier'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-orange-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      2. MELDING / ORDRENUMMER
                    </span>
                    <span className="font-mono font-black text-base text-blue-600">
                      {order.orderId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(order.orderId);
                        setCopiedOrderRef(true);
                        setTimeout(() => setCopiedOrderRef(false), 2000);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedOrderRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedOrderRef ? 'Kopiert' : 'Kopier'}</span>
                  </button>
                </div>
              </div>

              {/* Handlingsknapp for mobil */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="vipps://"
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-[#ff5b24] hover:bg-[#e04f1e] active:bg-[#c94317] text-white font-extrabold text-sm shadow-md shadow-[#ff5b24]/20 transition-all flex items-center justify-center space-x-2 text-center"
                >
                  <span>Åpne Vipps på mobilen</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-xs text-slate-500 text-center sm:text-left flex-1">
                  Tips: Husk å lime inn ordrenummeret <strong>{order.orderId}</strong> i Vipps så kobles innbetalingen din automatisk!
                </p>
              </div>
            </div>
          )}

          {/* 4-Step Live Tracking Progress */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Live ordrestatus
                </h2>
                <p className="text-xs text-slate-500">
                  Følg fremdriften på produksjon og sending av brikkene dine
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                #{order.orderId}
              </span>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 relative">
              {/* Step 1: Mottatt */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md ring-4 ring-emerald-100">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">1. Mottatt</p>
                  <p className="text-[11px] text-slate-500">Ordren er registrert</p>
                </div>
              </div>

              {/* Step 2: Koding */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                    currentStep >= 1
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-blue-100 text-blue-600 ring-4 ring-blue-50'
                  }`}
                >
                  {currentStep >= 1 ? <Check className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">2. Brikker kodes</p>
                  <p className="text-[11px] text-slate-500">
                    {currentStep >= 1 ? 'Ferdig programmert' : 'I produksjonskø'}
                  </p>
                </div>
              </div>

              {/* Step 3: Testet & Pakket */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                    currentStep >= 2
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep >= 2 ? <Check className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">3. Testet & Pakket</p>
                  <p className="text-[11px] text-slate-500">
                    {currentStep >= 2 ? 'Kvalitetssikret' : 'Venter på test'}
                  </p>
                </div>
              </div>

              {/* Step 4: Sendt */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                    currentStep >= 3
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">4. Sendt med Posten</p>
                  <p className="text-[11px] text-slate-500">
                    {currentStep >= 3 ? 'Underveis til deg' : 'Klargjøres for sending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Posten Tracking Banner if available */}
            {order.trackingNumber && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Pakken er levert til Posten!</p>
                    <p className="text-[11px] text-emerald-800 font-mono">
                      Sporingsnummer: {order.trackingNumber}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://sporing.posten.no/sporing/${order.trackingNumber.trim()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Åpne Posten sporing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Order Details & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Customer & Delivery Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Leveringsinformasjon</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400 block">Bedrift:</span>
                  <span className="font-bold text-slate-900 text-sm">{order.customer.companyName}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Kontaktperson:</span>
                  <span className="font-medium text-slate-800">{order.customer.contactPerson}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block">Leveringsadresse:</span>
                  <span className="font-medium text-slate-800">
                    {order.customer.address}, {order.customer.postalCode} {order.customer.city}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Google Review-kobling:</span>
                  <span className="font-mono text-blue-600 break-all text-[11px]">
                    {order.customer.reviewInputMode === 'lookup'
                      ? `Place ID: ${order.customer.googleLookupName || order.customer.companyName} (${order.customer.googleLookupCity || order.customer.city})`
                      : order.customer.googleReviewUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Items and Receipt */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Bestilte varer</span>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} stk
                </span>
              </h3>

              <div className="divide-y divide-slate-100 space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-2 pb-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">{item.quantity} stk à {item.product.price} kr</p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {item.product.price * item.quantity} kr
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Delsum:</span>
                  <span className="font-mono">{order.subtotal} kr</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Pakkegunst-rabatt:</span>
                    <span className="font-mono">-{order.discountAmount} kr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frakt (Posten):</span>
                  <span className="font-mono">
                    {order.shippingFee === 0 ? 'Gratis' : `${order.shippingFee} kr`}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>Totalsum:</span>
                  <span className="font-mono text-blue-600">{order.total} kr</span>
                </div>
                <span className="block text-[10px] text-slate-400 text-right">inkl. mva.</span>
              </div>
            </div>
          </div>

          {/* Need help footer card */}
          <div className="p-6 rounded-3xl bg-slate-100/80 border border-slate-200/80 text-center space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-900">
              Spørsmål om bestillingen din?
            </p>
            <p className="text-[11px]">
              Vi er en norsk ungdomsbedrift og hjelper deg gjerne. Send oss en e-post til{' '}
              <a href={`mailto:${STORE_NOTIFICATION_EMAIL}`} className="font-bold text-blue-600 hover:underline">
                {STORE_NOTIFICATION_EMAIL}
              </a>{' '}
              og oppgi ordrenummer <strong>#{order.orderId}</strong>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
