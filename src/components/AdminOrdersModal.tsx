import React, { useState, useEffect } from 'react';
import { OrderRecord, OrderStatus, OrderChecklist } from '../types';
import {
  getStoredOrders,
  updateOrderStatus,
  updateOrderChecklist,
  deleteOrder,
  formatAddressForPosten,
  generateCustomerShippingEmail,
  getCustomerShippingEmailSubject,
  getCustomerShippingEmailBody,
  saveOrder,
  exportOrdersToCsv
} from '../utils/orders';
import {
  X,
  Package,
  ExternalLink,
  Copy,
  Check,
  Send,
  Trash2,
  Lock,
  Search,
  Truck,
  PlusCircle,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
  Mail,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  Download,
  Printer,
  Scissors,
  CheckSquare,
  Square,
  Building2,
  Phone,
  QrCode,
  RotateCcw
} from 'lucide-react';
import {
  verifyAdminPin,
  recordFailedAttempt,
  resetFailedAttempts,
  getLockoutRemainingSeconds,
  isSessionValid,
  setAdminSession,
  clearAdminSession,
  sanitizeSafeUrl
} from '../utils/security';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'guide'>('orders');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [previewOrder, setPreviewOrder] = useState<OrderRecord | null>(null);
  const [packingSlipOrder, setPackingSlipOrder] = useState<OrderRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customEmailBody, setCustomEmailBody] = useState<string>('');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (isSessionValid()) {
        setIsAuthenticated(true);
      }
      const remaining = getLockoutRemainingSeconds();
      setLockoutSeconds(remaining);
      loadOrders();
    }
  }, [isOpen]);

  // Handle ESC key to dismiss submodals or main modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (packingSlipOrder) {
          setPackingSlipOrder(null);
        } else if (previewOrder) {
          setPreviewOrder(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, packingSlipOrder, previewOrder, onClose]);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutSeconds]);

  const loadOrders = () => {
    const list = getStoredOrders();
    setOrders(list);
    const trackingMap: Record<string, string> = {};
    list.forEach((o) => {
      trackingMap[o.orderId] = o.trackingNumber || '';
    });
    setTrackingInputs(trackingMap);
  };

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const isValid = await verifyAdminPin(pinInput);
    if (isValid) {
      resetFailedAttempts();
      setAdminSession();
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
      setRemainingAttempts(null);
    } else {
      const res = recordFailedAttempt();
      setPinError(true);
      if (res.isLocked) {
        setLockoutSeconds(res.lockoutSeconds);
      } else {
        setRemainingAttempts(res.remainingAttempts);
      }
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus, trackingInputs[orderId]);
    setOrders(updated);
  };

  const handleToggleChecklist = (orderId: string, step: keyof OrderChecklist) => {
    const order = orders.find((o) => o.orderId === orderId);
    const current = order?.checklist || {
      programmedChip: false,
      qrTested: false,
      packed: false,
      shipped: false
    };
    const nextVal = !current[step];
    const updated = updateOrderChecklist(orderId, { [step]: nextVal });
    setOrders(updated);

    // If shipped is ticked and status was not 'sendt', update status to 'sendt'
    if (step === 'shipped' && nextVal && order && order.status !== 'sendt') {
      const statusUpdated = updateOrderStatus(orderId, 'sendt', trackingInputs[orderId]);
      setOrders(statusUpdated);
    }
  };

  const handleTrackingBlur = (orderId: string) => {
    const tracking = trackingInputs[orderId];
    const order = orders.find((o) => o.orderId === orderId);
    if (order && tracking !== order.trackingNumber) {
      const updated = updateOrderStatus(orderId, order.status, tracking);
      setOrders(updated);
    }
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm(`Er du sikker på at du vil slette ordre #${orderId}?`)) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
    }
  };

  const handleCopyAddress = (order: OrderRecord) => {
    const formatted = formatAddressForPosten(order.customer);
    navigator.clipboard.writeText(formatted);
    setCopiedId(order.orderId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyEmailTemplate = (order: OrderRecord) => {
    const subject = getCustomerShippingEmailSubject(order);
    const body = getCustomerShippingEmailBody(order);
    const fullText = `Emne: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEmailId(order.orderId);
    setTimeout(() => setCopiedEmailId(null), 2500);
  };

  const handleOpenPreview = (order: OrderRecord) => {
    setPreviewOrder(order);
    setCustomEmailBody(getCustomerShippingEmailBody(order));
  };

  const handleCopyField = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddSampleOrder = () => {
    const sampleId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;
    const sampleOrder: OrderRecord = {
      orderId: sampleId,
      createdAt: new Date().toISOString(),
      status: 'ny',
      items: [
        {
          product: {
            id: 'google-stand-acrylic',
            name: 'Google Review Bordskilt (Akryl)',
            shortDescription: 'Frittstående hvitt akryl L-skilt',
            price: 299,
            type: 'stand',
            chipType: 'NXP NTAG216',
            material: 'Hvit formstøpt akryl',
            dimensions: '12.75 × 7.6 cm',
            compatibility: 'Universal',
            features: []
          },
          quantity: 2,
          targetUrl: 'https://g.page/r/example/review'
        },
        {
          product: {
            id: 'menu-card-nfc',
            name: 'Meny-kort (NFC & QR)',
            shortDescription: 'Dobbelsidig sort kontaktløst bordkort',
            price: 99,
            type: 'menu',
            chipType: 'NXP NTAG216',
            material: 'Matt forsterket PVC',
            dimensions: '8.55 × 5.4 cm',
            compatibility: 'Universal',
            features: []
          },
          quantity: 3,
          targetUrl: 'https://kafe-nordic.no/meny'
        }
      ],
      subtotal: 895,
      discountAmount: 89,
      shippingFee: 0,
      total: 806,
      customer: {
        companyName: 'Kafé & Bistro Nordic AS',
        orgNumber: '923456789',
        contactPerson: 'Erik Johansen',
        email: 'post@kafenordic.no',
        phone: '92345678',
        address: 'Storgata 24',
        postalCode: '0184',
        city: 'Oslo',
        googleReviewUrl: 'https://g.page/r/example/review',
        menuUrl: 'https://kafe-nordic.no/meny',
        paymentMethod: 'vipps_card'
      },
      checklist: {
        programmedChip: true,
        qrTested: true,
        packed: false,
        shipped: false
      }
    };
    saveOrder(sampleOrder);
    loadOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderId.toLowerCase().includes(q) ||
      o.customer.companyName.toLowerCase().includes(q) ||
      o.customer.contactPerson.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q)
    );
  });

  const newOrdersCount = orders.filter((o) => o.status === 'ny').length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 touch-manipulation"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold">Admin: Ordre- & Driftskontroll</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                  UB INTERN
                </span>
                {isAuthenticated && (
                  <span className="hidden sm:inline-flex items-center space-x-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Sikker sesjon</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Kvalitetskontroll, pakkesedler, Excel-eksport og Posten-sporing
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Logg ut av adminpanel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logg ut</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              aria-label="Lukk adminpanel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center space-y-6 my-auto max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Adgangskontroll for Ungdomsbedriften</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tast inn PIN-koden for å administrere bestillinger, skrive ut pakkesedler og eksportere regnskap.
              </p>
            </div>

            {lockoutSeconds > 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                <div className="flex items-center justify-center space-x-1 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Sikkerhetssperre aktivert</span>
                </div>
                <p>For mange feilforsøk. Vent {lockoutSeconds} sekunder før neste forsøk.</p>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                maxLength={8}
                disabled={lockoutSeconds > 0}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Skriv inn 4-sifret PIN-kode"
                className={`w-full text-center text-xl tracking-widest font-mono py-3 px-4 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  pinError ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-300'
                }`}
              />

              {pinError && lockoutSeconds === 0 && (
                <p className="text-xs text-red-600 font-semibold animate-in fade-in">
                  Feil PIN-kode. {remainingAttempts !== null && `Gjenværende forsøk: ${remainingAttempts}`}
                </p>
              )}

              <button
                type="submit"
                disabled={lockoutSeconds > 0 || !pinInput.trim()}
                className={`w-full py-3 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 touch-manipulation min-h-[44px] ${
                  lockoutSeconds > 0 || !pinInput.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Lås opp ordreoversikt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors min-h-[44px] flex items-center justify-center touch-manipulation"
              >
                Avbryt / Tilbake til butikken
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sikret med SHA-256 kryptering og automatisk brute force-vern</span>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Stats Bar & Tabs */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Bestillinger ({orders.length})</span>
                  {newOrdersCount > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {newOrdersCount} nye
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'guide' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Driftsveileder (Guide)</span>
                </button>
              </div>

              {/* Action Buttons: Export to Excel/CSV & Add sample */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportOrdersToCsv(orders)}
                  disabled={orders.length === 0}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                  title="Last ned alle salg ferdig formatert til Excel / CSV for Fiken eller Ungt Entreprenørskap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Eksporter til Excel / CSV</span>
                </button>

                <button
                  onClick={handleAddSampleOrder}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  title="Legg til en eksempelordre for å teste flyten"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">+ Test-ordre</span>
                </button>
              </div>
            </div>

            {activeTab === 'guide' ? (
              /* Step-by-Step Fulfillment Guide for Youth Enterprise */
              <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Slik håndterer du en bestilling fra A til Å:</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Følg kvalitetskontrollen (Brikke $\to$ QR $\to$ Pakket $\to$ Sendt) for å sikre 100% feilfrie leveranser.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Step 1 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">1</span>
                      <span>1. Programmer brikken (NFC Tools)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Gå til bestillingen og klikk <strong>«Test lenke ↗»</strong> for å verifisere lenken. Åpne gratisappen <strong>NFC Tools</strong> $\to$ <em>Write</em> $\to$ <em>Add record</em> $\to$ <em>Custom URL</em> $\to$ Hold mobilen inntil brikken. Huk av i sjekklisten!
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">2</span>
                      <span>2. Kvalitetstest QR og NFC med mobil</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Lukk NFC Tools og test brikken og den trykte QR-koden med vanlig mobilkamera/NFC. Sjekk at Google-anmeldelsen eller menyen åpner seg direkte. Huk av i sjekklisten!
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">3</span>
                      <span>3. Skriv ut pakkeseddel & adresselapp</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Trykk <strong>«Pakkeseddel & Adresselapp»</strong> på ordren for å skrive ut A4-arket. Klipp ut den ferdige adresseetiketten for Posten og klistre på boblekonvolutten. Legg følgeseddelen oppi pakken. Huk av for Pakket!
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">4</span>
                      <span>4. Send pakken & oppdater kunden</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Lever pakken i postkassen eller hos Post i Butikk. Lim inn sporingsnummeret i feltet, og trykk <strong>«Kopier ferdig e-postmal»</strong> for å sende oppdatering til kunden!
                    </p>
                  </div>
                </div>

                {/* Accounting box */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Regnskap og rapportering for Ungt Entreprenørskap</span>
                  </div>
                  <p className="text-xs text-emerald-900">
                    Bruk knappen <strong>«Eksporter til Excel / CSV»</strong> øverst til høyre når som helst. Filen inneholder alle salg, mva/delsummer, betalingsformer (Kort vs EHF) og sjekklistestatus – perfekt for regnskapsrapporten til fylkesmesterskapet og Fiken!
                  </p>
                </div>
              </div>
            ) : (
              /* Orders List */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search & Filters */}
                <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0 bg-white">
                  {/* Search */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Søk bedrift, ordrenr, by..."
                      className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        statusFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Alle ({orders.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('ny')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        statusFilter === 'ny'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Nye ({orders.filter((o) => o.status === 'ny').length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('behandles')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        statusFilter === 'behandles'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                      }`}
                    >
                      Under koding
                    </button>
                    <button
                      onClick={() => setStatusFilter('sendt')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        statusFilter === 'sendt'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      Sendt med Posten
                    </button>
                    <button
                      onClick={() => setStatusFilter('fullfort')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        statusFilter === 'fullfort'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Lukkede / Fullførte ({orders.filter((o) => o.status === 'fullfort').length})
                    </button>
                  </div>
                </div>

                {/* Orders Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <Package className="w-10 h-10 mx-auto stroke-1" />
                      <p className="text-sm font-semibold">Ingen bestillinger funnet</p>
                      <p className="text-xs">
                        Når kunder bestiller i nettbutikken vil de dukke opp automatisk her!
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isNew = order.status === 'ny';
                      const isInvoice = order.customer.paymentMethod === 'invoice_ehf';
                      const checklist = order.checklist || {
                        programmedChip: false,
                        qrTested: false,
                        packed: false,
                        shipped: false
                      };
                      const completedCount = [
                        checklist.programmedChip,
                        checklist.qrTested,
                        checklist.packed,
                        checklist.shipped
                      ].filter(Boolean).length;

                      return (
                        <div
                          key={order.orderId}
                          className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all space-y-4 ${
                            isNew ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
                          }`}
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div className="flex items-center space-x-3">
                              <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                                #{order.orderId}
                              </span>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {order.customer.companyName}
                                  </h4>
                                  {order.status === 'fullfort' ? (
                                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300">
                                      ✅ Lukket ordre
                                    </span>
                                  ) : isInvoice ? (
                                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                      EHF Faktura
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                      Kort / Vipps
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(order.createdAt).toLocaleString('no-NO')}</span>
                                </p>
                              </div>
                            </div>

                            {/* Status Selector & Actions */}
                            <div className="flex items-center space-x-2">
                              <label className="text-xs text-slate-500 hidden sm:inline">Status:</label>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                                  order.status === 'ny'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : order.status === 'behandles'
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : order.status === 'sendt'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                    : 'bg-slate-100 text-slate-900 border-slate-300'
                                }`}
                              >
                                <option value="ny">🟡 Ny bestilling</option>
                                <option value="behandles">🔵 Under koding</option>
                                <option value="sendt">🟢 Sendt med Posten</option>
                                <option value="fullfort">✅ Lukket / Fullført</option>
                              </select>

                              {/* Quick Close / Reopen Order Button */}
                              {order.status === 'fullfort' ? (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(order.orderId, 'sendt')}
                                  className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center space-x-1 transition-colors"
                                  title="Gjenåpne bestilling"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                                  <span className="hidden sm:inline">Gjenåpne</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(order.orderId, 'fullfort')}
                                  className="px-2.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center space-x-1 transition-colors shadow-xs"
                                  title="Lukk og fullfør bestillingen"
                                >
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="hidden sm:inline">Lukk ordre</span>
                                </button>
                              )}

                              {/* Packing Slip Print Button */}
                              <button
                                type="button"
                                onClick={() => setPackingSlipOrder(order)}
                                className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center space-x-1 transition-colors"
                                title="Generer A4-pakkeseddel og klippeklar adresseetikett for Posten"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-700" />
                                <span className="hidden md:inline">Pakkeseddel</span>
                              </button>

                              <button
                                onClick={() => handleDelete(order.orderId)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Slett ordre"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Quality Control Checklist Box */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 font-bold text-slate-800">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                <span>Kvalitetskontroll (UB Driftsrutine)</span>
                              </div>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                completedCount === 4
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-200/80 text-slate-700'
                              }`}>
                                {completedCount === 4 ? '🎉 4/4 Klar til kunde!' : `${completedCount}/4 fullført`}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {/* Step 1: Chip Programmed */}
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(order.orderId, 'programmedChip')}
                                className={`p-2 rounded-lg border text-left transition-all flex items-start space-x-2 touch-manipulation ${
                                  checklist.programmedChip
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {checklist.programmedChip ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                                <div className="text-[11px] leading-tight">
                                  <p className="font-bold">1. Brikke programmert</p>
                                  <p className="text-[10px] text-slate-500">NFC Tools app</p>
                                </div>
                              </button>

                              {/* Step 2: QR Tested */}
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(order.orderId, 'qrTested')}
                                className={`p-2 rounded-lg border text-left transition-all flex items-start space-x-2 touch-manipulation ${
                                  checklist.qrTested
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {checklist.qrTested ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                                <div className="text-[11px] leading-tight">
                                  <p className="font-bold">2. QR/NFC testet</p>
                                  <p className="text-[10px] text-slate-500">Skannet med mobil</p>
                                </div>
                              </button>

                              {/* Step 3: Packed */}
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(order.orderId, 'packed')}
                                className={`p-2 rounded-lg border text-left transition-all flex items-start space-x-2 touch-manipulation ${
                                  checklist.packed
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {checklist.packed ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                                <div className="text-[11px] leading-tight">
                                  <p className="font-bold">3. Pakket i konvolutt</p>
                                  <p className="text-[10px] text-slate-500">Med pakkeseddel</p>
                                </div>
                              </button>

                              {/* Step 4: Shipped */}
                              <button
                                type="button"
                                onClick={() => handleToggleChecklist(order.orderId, 'shipped')}
                                className={`p-2 rounded-lg border text-left transition-all flex items-start space-x-2 touch-manipulation ${
                                  checklist.shipped
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {checklist.shipped ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-400" />
                                  )}
                                </div>
                                <div className="text-[11px] leading-tight">
                                  <p className="font-bold">4. Sendt med Posten</p>
                                  <p className="text-[10px] text-slate-500">Post i Butikk / kasse</p>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Order Body Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                            {/* Column 1: Customer & Address */}
                            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                                  Kunde & Levering
                                </span>
                                <button
                                  onClick={() => handleCopyAddress(order)}
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                  title="Kopier adresse ferdig for Posten.no"
                                >
                                  {copiedId === order.orderId ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700">Kopiert!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Kopier for Posten</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="font-semibold text-slate-900">{order.customer.contactPerson}</p>
                              {order.customer.orgNumber && (
                                <p className="text-slate-500 text-[11px]">Org.nr: {order.customer.orgNumber}</p>
                              )}
                              <p className="text-slate-600">{order.customer.address}</p>
                              <p className="text-slate-600">{order.customer.postalCode} {order.customer.city}</p>
                              
                              {isInvoice && (
                                <div className="p-2 bg-blue-100/60 rounded border border-blue-200 text-[11px] text-blue-900 space-y-0.5 mt-1">
                                  <p className="font-bold">Fakturadetaljer (14 dager):</p>
                                  {order.customer.invoiceReference && (
                                    <p>Ref: <span className="font-mono">{order.customer.invoiceReference}</span></p>
                                  )}
                                  <p>Faktura-mottak: {order.customer.invoiceEmail || order.customer.email}</p>
                                </div>
                              )}

                              <div className="pt-1 text-slate-500 border-t border-slate-200/60 mt-1 space-y-0.5">
                                <p>Tlf: <a href={`tel:${order.customer.phone}`} className="text-blue-600 hover:underline">{order.customer.phone}</a></p>
                                <p>E-post: <a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:underline">{order.customer.email}</a></p>
                              </div>
                            </div>

                            {/* Column 2: URLs to be programmed */}
                            <div className="space-y-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200/60">
                              <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block">
                                Lenker som skal kodes
                              </span>

                              {order.customer.googleReviewUrl ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">Google Review:</span>
                                    {sanitizeSafeUrl(order.customer.googleReviewUrl) ? (
                                      <a
                                        href={sanitizeSafeUrl(order.customer.googleReviewUrl)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                                      >
                                        <span>Test lenke</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-normal">Tekst-oppslag</span>
                                    )}
                                  </div>
                                  <p className="p-1.5 bg-white rounded border border-blue-200 text-slate-800 font-mono text-[11px] truncate select-all">
                                    {order.customer.googleReviewUrl}
                                  </p>
                                </div>
                              ) : null}

                              {order.customer.menuUrl ? (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">Digital Meny:</span>
                                    {sanitizeSafeUrl(order.customer.menuUrl) ? (
                                      <a
                                        href={sanitizeSafeUrl(order.customer.menuUrl)!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-amber-700 hover:text-amber-900 font-semibold flex items-center space-x-1"
                                      >
                                        <span>Test lenke</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-normal">Tekst-oppslag</span>
                                    )}
                                  </div>
                                  <p className="p-1.5 bg-white rounded border border-amber-200 text-slate-800 font-mono text-[11px] truncate select-all">
                                    {order.customer.menuUrl}
                                  </p>
                                </div>
                              ) : null}

                              {!order.customer.googleReviewUrl && !order.customer.menuUrl && (
                                <p className="text-slate-500 italic">Ingen spesifiserte lenker (standard oppsett).</p>
                              )}
                            </div>

                            {/* Column 3: Items Ordered & Total */}
                            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                              <div>
                                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                                  Artikler ({order.items.reduce((s, i) => s + i.quantity, 0)} stk)
                                </span>
                                <ul className="space-y-1">
                                  {order.items.map((i, idx) => (
                                    <li key={idx} className="flex justify-between text-slate-700">
                                      <span className="font-medium">{i.quantity}x {i.product.name}</span>
                                      <span className="font-mono font-semibold">{i.product.price * i.quantity} kr</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-2 border-t border-slate-200 text-slate-900 font-bold flex justify-between items-baseline">
                                <span>Total (inkl. frakt):</span>
                                <span className="font-mono text-sm text-blue-600">{order.total} kr</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Footer: Posten Tracking & Update Customer */}
                          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 p-2.5 rounded-xl">
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <Truck className="w-4 h-4 text-slate-500 shrink-0" />
                              <label className="text-xs font-semibold text-slate-700 shrink-0">
                                Posten Sporingsnr:
                              </label>
                              <input
                                type="text"
                                value={trackingInputs[order.orderId] || ''}
                                onChange={(e) =>
                                  setTrackingInputs({ ...trackingInputs, [order.orderId]: e.target.value })
                                }
                                onBlur={() => handleTrackingBlur(order.orderId)}
                                placeholder="F.eks. 3702..."
                                className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono w-full sm:w-48 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                              <button
                                type="button"
                                onClick={() => handleCopyEmailTemplate(order)}
                                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                                  copiedEmailId === order.orderId
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                                }`}
                                title="Kopierer ferdig e-postmal direkte til utklippstavlen så du kan lime inn i Gmail/Outlook"
                              >
                                {copiedEmailId === order.orderId ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-white" />
                                    <span>✓ E-postmal kopiert!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Kopier ferdig e-postmal</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPreview(order)}
                                className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                                title="Vis eller tilpass e-postmalen før sending"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-600" />
                                <span>Vis / Tilpass mal</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Packing Slip & Shipping Label Modal (Printable A4) */}
        {packingSlipOrder && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPackingSlipOrder(null);
              }
            }}
            className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto touch-manipulation"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] flex flex-col overflow-y-auto">
              {/* Modal Top Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Utskrift: Pakkeseddel & Adresselapp for Posten
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ordre #{packingSlipOrder.orderId} · Klar for A4-utskrift og boblekonvolutt
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Skriv ut nå (A4)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPackingSlipOrder(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    aria-label="Lukk pakkeseddel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Document Area */}
              <div id="packing-slip-content" className="space-y-6 text-slate-900 bg-white p-2">
                {/* Header: Company & Order info */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-black tracking-tight text-blue-600">NFC REVIEW UB</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                        UNGDOMSBEDRIFT
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Tilknyttet Ungt Entreprenørskap</p>
                    <p className="text-xs text-slate-600">Kontakt: Leon.aabak@gmail.com</p>
                  </div>

                  <div className="text-right">
                    <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">
                      PAKKESEDDEL & FØLGESEDDEL
                    </h2>
                    <p className="text-sm font-mono font-bold text-blue-600">#{packingSlipOrder.orderId}</p>
                    <p className="text-xs text-slate-500">
                      Dato: {new Date(packingSlipOrder.createdAt).toLocaleDateString('no-NO')}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">
                      Betaling: {packingSlipOrder.customer.paymentMethod === 'invoice_ehf' ? 'Bedriftsfaktura / EHF (14 dg)' : 'Kort / Vipps (Betalt)'}
                    </p>
                  </div>
                </div>

                {/* CUTOUT SHIPPING LABEL FOR POSTEN (KLIPPEKLAR ADRESSEETIKETT) */}
                <div className="p-4 border-2 border-dashed border-slate-400 rounded-xl bg-slate-50/70 relative">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                    <span className="flex items-center space-x-1.5 font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                      <Scissors className="w-4 h-4 text-slate-700" />
                      <span>KLIPP LANGS DENNE LINJEN OG LIM PÅ BOBLEKONVOLUTT (POSTEN)</span>
                    </span>
                    <span className="font-mono text-[10px]">NORGEPOST / A-POST / SPORING</span>
                  </div>

                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mottaker */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MOTTAKER:</p>
                      <p className="text-base font-black text-slate-950">{packingSlipOrder.customer.companyName}</p>
                      <p className="text-xs font-semibold text-slate-800">Att: {packingSlipOrder.customer.contactPerson}</p>
                      <p className="text-sm font-medium text-slate-900">{packingSlipOrder.customer.address}</p>
                      <p className="text-base font-black text-slate-950">
                        {packingSlipOrder.customer.postalCode} {packingSlipOrder.customer.city}
                      </p>
                      <p className="text-xs text-slate-600 pt-1">
                        Tlf: {packingSlipOrder.customer.phone}
                      </p>
                    </div>

                    {/* Avsender */}
                    <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4 text-xs text-slate-600">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AVSENDER:</p>
                      <p className="font-bold text-slate-800">NFC Review UB (Ungdomsbedrift)</p>
                      <p>v/ Leon Åbak</p>
                      <p>E-post: Leon.aabak@gmail.com</p>
                      <p className="pt-1 text-[11px] font-semibold text-blue-700">
                        Innhold: NFC Google Anmeldelseskort / Bordskilt
                      </p>
                      {packingSlipOrder.trackingNumber && (
                        <p className="font-mono text-[11px] font-bold text-slate-800">
                          Sporing: {packingSlipOrder.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROGRAMMING SPECIFICATION (FOR PRODUSERENDE ELEVER/VERKSTED) */}
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-900 text-xs">
                    <span className="flex items-center space-x-1.5">
                      <QrCode className="w-4 h-4 text-blue-700" />
                      <span>PROGRAMMERINGS- OG KVALITETSKONTROLL</span>
                    </span>
                    <span className="text-[11px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                      Chip: NXP NTAG216 (888 bytes)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 pt-1">
                    {packingSlipOrder.customer.googleReviewUrl && (
                      <div className="p-2 bg-white rounded border border-blue-200">
                        <span className="font-bold text-slate-900 block text-[11px]">Google Review URL (Bordskilt):</span>
                        <span className="font-mono text-[10px] break-all text-blue-700 font-medium">
                          {packingSlipOrder.customer.googleReviewUrl}
                        </span>
                      </div>
                    )}
                    {packingSlipOrder.customer.menuUrl && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <span className="font-bold text-slate-900 block text-[11px]">Meny URL (Menykort):</span>
                        <span className="font-mono text-[10px] break-all text-amber-800 font-medium">
                          {packingSlipOrder.customer.menuUrl}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ORDER ITEMS TABLE */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">
                    Varer som skal pakkes:
                  </h4>
                  <table className="w-full text-left border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="p-2.5 font-bold w-12 text-center">Sjekk</th>
                        <th className="p-2.5 font-bold">Varebeskrivelse</th>
                        <th className="p-2.5 font-bold w-20 text-center">Antall</th>
                        <th className="p-2.5 font-bold w-24 text-right">Enhetspris</th>
                        <th className="p-2.5 font-bold w-24 text-right">Sum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packingSlipOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200 text-slate-800">
                          <td className="p-2.5 text-center">
                            <span className="inline-block w-4 h-4 border-2 border-slate-400 rounded-xs"></span>
                          </td>
                          <td className="p-2.5">
                            <p className="font-bold text-slate-900">{item.product.name}</p>
                            <p className="text-[10px] text-slate-500">{item.product.material} · {item.product.dimensions}</p>
                          </td>
                          <td className="p-2.5 text-center font-bold font-mono text-sm">{item.quantity} stk</td>
                          <td className="p-2.5 text-right font-mono">{item.product.price} kr</td>
                          <td className="p-2.5 text-right font-mono font-bold">{item.product.price * item.quantity} kr</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200">
                        <td colSpan={4} className="p-2 text-right text-slate-600">Delsum:</td>
                        <td className="p-2 text-right font-mono font-semibold">{packingSlipOrder.subtotal} kr</td>
                      </tr>
                      {packingSlipOrder.discountAmount > 0 && (
                        <tr>
                          <td colSpan={4} className="p-2 text-right text-emerald-700 font-semibold">Bulk deal rabatt:</td>
                          <td className="p-2 text-right font-mono font-bold text-emerald-700">-{packingSlipOrder.discountAmount} kr</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={4} className="p-2 text-right text-slate-600">Frakt (Posten):</td>
                        <td className="p-2 text-right font-mono font-semibold">
                          {packingSlipOrder.shippingFee === 0 ? '0 kr (Gratis)' : `${packingSlipOrder.shippingFee} kr`}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-slate-900 font-black text-sm text-slate-900">
                        <td colSpan={4} className="p-2.5 text-right">Total:</td>
                        <td className="p-2.5 text-right font-mono text-blue-600">{packingSlipOrder.total} kr</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* SIGN-OFF & UB GREETING */}
                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                      Tusen takk for at du støtter NFC Review Ungdomsbedrift!
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Vi håper disse skiltene gir bedriften din en jevn strøm av nye 5-stjerners anmeldelser.
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-[10px] text-slate-500 w-full sm:w-56">
                    <p className="font-bold text-slate-700">Kvalitetskontrollert av:</p>
                    <div className="h-6 border-b border-slate-300 my-1"></div>
                    <p>Dato / Signatur</p>
                  </div>
                </div>
              </div>

              {/* Bottom Print Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5 print:hidden">
                <button
                  type="button"
                  onClick={() => setPackingSlipOrder(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Lukk
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Skriv ut pakkeseddel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Template Preview & Customization Popup */}
        {previewOrder && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPreviewOrder(null);
              }
            }}
            className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 touch-manipulation"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Ferdig e-postmal for ordre #{previewOrder.orderId}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kopier feltene eller hele malen og lim rett inn i e-postprogrammet ditt (Gmail, Outlook osv.)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewOrder(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
                  aria-label="Lukk forhåndsvisning"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recipient */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">1. Mottaker (Kundens e-post):</label>
                  <button
                    type="button"
                    onClick={() => handleCopyField(previewOrder.customer.email, 'email')}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'email' ? 'Kopiert!' : 'Kopier e-post'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={previewOrder.customer.email}
                  className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg select-all"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">2. Emnefelt:</label>
                  <button
                    type="button"
                    onClick={() => handleCopyField(getCustomerShippingEmailSubject(previewOrder), 'subject')}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedField === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'subject' ? 'Kopiert!' : 'Kopier emne'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={getCustomerShippingEmailSubject(previewOrder)}
                  className="w-full text-xs font-medium p-2.5 bg-slate-50 border border-slate-200 rounded-lg select-all text-slate-900"
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1 flex-1 flex flex-col min-h-[170px]">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">3. E-posttekst (kan redigeres):</label>
                  <button
                    type="button"
                    onClick={() => handleCopyField(customEmailBody, 'body')}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                  >
                    {copiedField === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'body' ? 'Kopiert!' : 'Kopier tekst'}</span>
                  </button>
                </div>
                <textarea
                  value={customEmailBody}
                  onChange={(e) => setCustomEmailBody(e.target.value)}
                  className="w-full flex-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-sans leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={8}
                />
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <a
                  href={generateCustomerShippingEmail(previewOrder)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Eller åpne direkte i e-postprogram</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const full = `Emne: ${getCustomerShippingEmailSubject(previewOrder)}\n\n${customEmailBody}`;
                      handleCopyField(full, 'full');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    {copiedField === 'full' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>✓ Hele malen er kopiert!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopier hele e-postmalen</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewOrder(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Lukk
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
