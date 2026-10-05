import React, { useState } from 'react';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Zone 1: Wordmark / Brand title (single text element) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="flex items-center space-x-2 text-xl font-bold tracking-tight text-slate-900 group"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-blue-700 transition-colors">
            ★
          </span>
          <span className="font-extrabold">NFC Review<span className="text-blue-600">.no</span></span>
        </a>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Hjem
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('how-it-works');
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Slik fungerer det
          </a>
          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('products');
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Produkter
          </a>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('simulator');
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Test simulator
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('faq');
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Spørsmål & Svar
          </a>
        </nav>

        {/* Zone 3: Primary Actions (Shopping Cart + Bestill nå CTA) */}
        <div className="flex items-center space-x-3">
          {/* Cart Icon with Live Counter */}
          <button
            onClick={onOpenCart}
            aria-label={`Handlekurv med ${cartCount} varer`}
            className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in-75 duration-150 tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Quick CTA */}
          <button
            onClick={() => handleLinkClick('products')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap"
          >
            <span>Bestill kort</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Åpne meny"
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <button
              onClick={() => handleLinkClick('home')}
              className="text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Hjem
            </button>
            <button
              onClick={() => handleLinkClick('how-it-works')}
              className="text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Slik fungerer det
            </button>
            <button
              onClick={() => handleLinkClick('products')}
              className="text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Produkter & Priser
            </button>
            <button
              onClick={() => handleLinkClick('simulator')}
              className="text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Test simulator
            </button>
            <button
              onClick={() => handleLinkClick('faq')}
              className="text-left py-2 px-2 rounded-lg hover:bg-slate-50"
            >
              Spørsmål & Svar
            </button>
          </nav>
          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('products')}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Se produkter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
