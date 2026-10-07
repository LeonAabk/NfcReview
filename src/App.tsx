/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ProductList } from './components/ProductList';
import { LiveSimulator } from './components/LiveSimulator';
import { RoiCalculator } from './components/RoiCalculator';
import { FaqSection } from './components/FaqSection';
import { AboutUb } from './components/AboutUb';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TermsModal } from './components/TermsModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { calculateBulkDiscount, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from './utils/discount';

const CART_STORAGE_KEY = 'nfc_review_cart_v1';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | null>(null);

  // Sync cart changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Unable to persist cart to localStorage', err);
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantity = 1, targetUrl?: string) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && (item.targetUrl || '') === (targetUrl || '')
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity
        };
        return next;
      }

      return [...prev, { product, quantity, targetUrl }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, targetUrl?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, targetUrl);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (item.targetUrl || '') === (targetUrl || '')) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, targetUrl?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (item.targetUrl || '') === (targetUrl || ''))
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Pricing & Tiered Bulk Discount Logic
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const bulkDiscount = calculateBulkDiscount(totalItemsCount, subtotal);
  const hasVolumeDiscount = bulkDiscount.percent > 0;
  const discountAmount = bulkDiscount.amount;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingFee = cartItems.length === 0 ? 0 : discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = discountedSubtotal + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-900">
      {/* Top Banner: Ungdomsbedrift & Bulk deals notification */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[10px]">UB</span>
        <span>Stolt Norsk Ungdomsbedrift</span>
        <span className="text-slate-500 hidden sm:inline">·</span>
        <span className="hidden sm:inline">Fri frakt over {FREE_SHIPPING_THRESHOLD} kr</span>
        <span className="text-slate-500">·</span>
        <span>🔥 Bulk deals: 10% ved 3+ · 15% ved 5+ · 20% ved 10+</span>
      </div>

      {/* Main Navigation */}
      <Navbar
        cartCount={totalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />

      <main className={`flex-1 ${totalItemsCount > 0 ? 'pb-24 sm:pb-0' : ''}`}>
        {/* Hero Section */}
        <Hero
          onOrderClick={() => handleNavigate('products')}
          onSimulatorClick={() => handleNavigate('simulator')}
        />

        {/* Products Listing Grid */}
        <ProductList onAddToCart={handleAddToCart} />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* Dedicated Youth Enterprise (Ungdomsbedrift - UB) Section */}
        <AboutUb onOrderClick={() => handleNavigate('products')} />

        {/* Interactive NFC Tap Simulator */}
        <LiveSimulator />

        {/* B2B ROI Calculator */}
        <RoiCalculator onExploreProducts={() => handleNavigate('products')} />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => setActiveLegalModal('terms')}
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Sticky Floating Cart Bar */}
      {totalItemsCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="fixed bottom-4 inset-x-3 z-30 sm:hidden animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700/80 active:scale-[0.98] transition-transform touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItemsCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold leading-tight text-white">
                  Se handlekurv ({totalItemsCount})
                </p>
                <p className="text-[10px] text-slate-300 font-medium">
                  {hasVolumeDiscount ? `🎉 ${bulkDiscount.tierLabel} aktivert` : 'Trykk for å gå til kassen'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="font-mono text-xs font-bold text-white tabular-nums">{grandTotal} kr</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        total={grandTotal}
        onClearCart={handleClearCart}
      />

      {/* Legal & Terms Modal */}
      <TermsModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Admin Orders & Fulfillment Dashboard Modal */}
      <AdminOrdersModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
