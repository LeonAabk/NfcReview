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
import { SocialProof } from './components/SocialProof';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TermsModal } from './components/TermsModal';

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

  // Pricing & Volume Discount Logic (10% discount when 3+ items are ordered)
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const hasVolumeDiscount = totalItemsCount >= 3;
  const discountAmount = hasVolumeDiscount ? Math.round((subtotal * 10) / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingFee = cartItems.length === 0 ? 0 : discountedSubtotal >= 600 ? 0 : 59;
  const grandTotal = discountedSubtotal + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-900">
      {/* Top Banner: Free shipping & Volume discount notification */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <span>🇳🇴 Kvantumsrabatt: Kjøp 3+ varer og få 10% rabatt</span>
        <span className="text-slate-500">·</span>
        <span>Fri frakt over 600 kr med Posten</span>
      </div>

      {/* Main Navigation */}
      <Navbar
        cartCount={totalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOrderClick={() => handleNavigate('products')}
          onSimulatorClick={() => handleNavigate('simulator')}
        />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* Products Listing Grid */}
        <ProductList onAddToCart={handleAddToCart} />

        {/* Interactive NFC Tap Simulator */}
        <LiveSimulator />

        {/* B2B ROI Calculator */}
        <RoiCalculator onExploreProducts={() => handleNavigate('products')} />

        {/* Social Proof & Testimonials */}
        <SocialProof />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => setActiveLegalModal('terms')}
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
      />

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
    </div>
  );
}
