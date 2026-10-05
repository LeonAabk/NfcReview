import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, targetUrl?: string) => void;
  onRemoveItem: (productId: string, targetUrl?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 600;
  const STANDARD_SHIPPING_FEE = 59;
  const DISCOUNT_THRESHOLD = 3;
  const DISCOUNT_PERCENT = 10;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Volume discount calculation (10% if 3+ items)
  const hasVolumeDiscount = totalQuantity >= DISCOUNT_THRESHOLD;
  const discountAmount = hasVolumeDiscount ? Math.round((subtotal * DISCOUNT_PERCENT) / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;

  // Free shipping based on subtotal or discounted subtotal
  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const remainingForDiscount = Math.max(0, DISCOUNT_THRESHOLD - totalQuantity);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Handlekurv</h2>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono tabular-nums">
                {totalQuantity} varer
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Lukk handlekurv"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Discount Notification Banner */}
          {items.length > 0 && (
            <div className={`px-6 py-2.5 text-xs border-b ${
              hasVolumeDiscount
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-blue-50/80 border-blue-200/80 text-blue-900'
            }`}>
              {hasVolumeDiscount ? (
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center space-x-1.5">
                    <span>🎉</span>
                    <span>10% kvantumsrabatt aktivert ({totalQuantity} varer i kurven)</span>
                  </span>
                  <span className="font-bold text-emerald-700 font-mono tabular-nums">
                    Sparer {discountAmount} kr
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>
                    Kjøp <strong>{remainingForDiscount} vare{remainingForDiscount > 1 ? 'r' : ''}</strong> til for å få <strong>10% rabatt</strong> på hele ordren!
                  </span>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-white px-2 py-0.5 rounded">
                    3+ STK
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Free Shipping Progress bar */}
          {items.length > 0 && (
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-semibold">Gratis frakt oppnådd!</span>
                  ) : (
                    <span>
                      Kjøp for <strong>{remainingForFreeShipping} kr</strong> til for fri frakt
                    </span>
                  )}
                </span>
                <span className="font-mono text-[11px] text-slate-500">Mål: 600 kr</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Handlekurven din er tom</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Velg Google Review Bordskilt eller Meny-kort for å komme i gang.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Utforsk produkter
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.targetUrl || 'standard'}-${idx}`}
                  className="flex space-x-4 p-3 bg-slate-50/70 border border-slate-200 rounded-xl"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0 text-xs font-mono">
                    {item.product.type === 'menu' ? 'MENY' : 'SKILT'}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.targetUrl)}
                          className="text-slate-400 hover:text-red-600 p-0.5 transition-colors ml-2"
                          title="Fjern vare"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.targetUrl && (
                        <p className="text-[11px] text-blue-600 font-medium truncate mt-0.5">
                          Lenke: {item.targetUrl}
                        </p>
                      )}

                      <p className="text-xs font-bold text-slate-800 font-mono mt-1">
                        {item.product.price} kr
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.targetUrl)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                          aria-label="Reduser antall"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 font-mono tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.targetUrl)}
                          className="p-1 text-slate-500 hover:text-slate-800"
                          aria-label="Øk antall"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                        = {item.product.price * item.quantity} kr
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Delsum (ordinær pris):</span>
                  <span className={`font-mono ${hasVolumeDiscount ? 'line-through text-slate-400' : 'text-slate-900 font-semibold'}`}>
                    {subtotal} kr
                  </span>
                </div>

                {hasVolumeDiscount && (
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60">
                    <span className="flex items-center space-x-1">
                      <span>🏷️</span>
                      <span>Kvantumsrabatt (10% ved 3+ varer):</span>
                    </span>
                    <span className="font-mono tabular-nums">-{discountAmount} kr</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frakt (Posten Norge):</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {shippingFee === 0 ? 'Gratis' : `${shippingFee} kr`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Totalsum:</span>
                  <div className="text-right">
                    <span className="font-mono text-blue-600">{total} kr</span>
                    {hasVolumeDiscount && (
                      <p className="text-[10px] text-emerald-600 font-medium font-sans">
                        Inkluderer {discountAmount} kr i kvantumsrabatt
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {hasVolumeDiscount && (
                <div className="p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-200 text-center text-xs text-emerald-800 font-bold">
                  Du sparer {discountAmount} kr på denne bestillingen!
                </div>
              )}

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Gå til kassen med Stripe</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL kryptert via Stripe Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
