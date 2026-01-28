"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';


const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/collections/all?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[80]">
        {/* Top Banner */}
        <div className="bg-black text-white text-[10px] sm:text-xs py-2 text-center font-medium tracking-widest uppercase">
          Votre Nouvelle Destination Parfum
        </div>

        {/* Main Nav */}
        <nav className={`transition-all duration-300 px-6 lg:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wider uppercase">
            <Link href="/" className="hover:text-gray-600 transition-colors">Accueil</Link>
            <Link href="/collections/packs" className="hover:text-gray-600 transition-colors">Les Packs</Link>
            <Link href="/collections/homme" className="hover:text-gray-600 transition-colors">Homme</Link>
            <Link href="/collections/femme" className="hover:text-gray-600 transition-colors">Femme</Link>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-20 lg:w-56 lg:h-56">
              <Image
                src="/assets/logo black.png"
                alt="Pure perfumes"
                fill
                className="object-contain transition-opacity duration-300"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center space-x-5">
            <Search
              className="w-5 h-5 cursor-pointer text-black hover:text-gray-600 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            />
            <div
              className="relative cursor-pointer group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 text-black group-hover:text-gray-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-4/5 bg-white z-[95] p-8 flex flex-col space-y-8 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-end">
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col space-y-6">
                  <Link href="/" className="text-xl font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                  <Link href="/collections/packs" className="text-xl font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Les Packs</Link>
                  <Link href="/collections/homme" className="text-xl font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Parfums Homme</Link>
                  <Link href="/collections/femme" className="text-xl font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Parfums Femme</Link>
                  <Link href="/collections/coffrets" className="text-xl font-bold uppercase tracking-widest hover:text-gray-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Coffrets Cadeaux</Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black/90 z-[100] z-50 flex items-start justify-center pt-32 px-6">
            <div className="w-full max-w-3xl relative">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un parfum..."
                  className="w-full bg-transparent border-b-2 border-white/50 text-white text-3xl md:text-5xl font-serif py-4 focus:outline-none focus:border-white placeholder:text-white/30"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  <Search className="w-8 h-8" />
                </button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Recherches populaires</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Le male', 'Kayali', 'tom ford', 'naxos'].map(term => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        window.location.href = `/collections/all?search=${term}`;
                      }}
                      className="px-4 py-2 border border-white/20 rounded-full text-white/70 hover:bg-white hover:text-black transition-all text-xs uppercase tracking-wider"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
