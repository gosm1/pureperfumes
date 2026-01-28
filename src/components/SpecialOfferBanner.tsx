"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Gift, Heart, Sparkles } from 'lucide-react';
import { getActiveOffers } from '@/lib/offers';
import { SpecialOffer } from '@/types';

export default function SpecialOfferBanner() {
    const [offers, setOffers] = useState<SpecialOffer[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOffers() {
            const data = await getActiveOffers();
            setOffers(data);
            setLoading(false);
        }
        loadOffers();
    }, []);

    if (loading || offers.length === 0) return null;

    // Show highest priority offer
    const offer = offers[0];

    return (
        <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 border-b border-rose-200 overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE9ED 50%, #FFF0F3 100%)'
            }}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-2 left-10 text-rose-300">
                    <Heart size={20} fill="currentColor" />
                </div>
                <div className="absolute top-4 right-20 text-rose-300">
                    <Sparkles size={16} />
                </div>
                <div className="absolute bottom-3 left-1/4 text-rose-300">
                    <Heart size={14} fill="currentColor" />
                </div>
                <div className="absolute bottom-2 right-1/3 text-rose-300">
                    <Sparkles size={12} />
                </div>
            </div>

            <div className="relative container mx-auto px-4 md:px-6 lg:px-24">
                {/* Collapsed State */}
                <button
                    onClick={() => setExpandedId(expandedId === offer.id ? null : offer.id)}
                    className="w-full py-4 md:py-5 flex items-center justify-between gap-4 group"
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 md:p-2.5 rounded-lg shadow-md">
                            <Gift className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm md:text-base font-bold text-gray-900 tracking-tight">
                                {offer.title}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-600 mt-0.5">
                                {offer.summary}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline text-[10px] md:text-xs font-medium text-rose-600 uppercase tracking-wider">
                            {expandedId === offer.id ? 'Masquer' : 'Voir détails'}
                        </span>
                        <motion.div
                            animate={{ rotate: expandedId === offer.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/60 rounded-full p-1.5"
                        >
                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
                        </motion.div>
                    </div>
                </button>

                {/* Expanded State */}
                <AnimatePresence>
                    {expandedId === offer.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="pb-6 px-4 md:px-8 pt-2">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-rose-100 shadow-sm">
                                    <div className="prose prose-sm max-w-none">
                                        {offer.details ? (
                                            <div
                                                className="text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-line"
                                                dangerouslySetInnerHTML={{ __html: offer.details.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                            />
                                        ) : (
                                            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                                {offer.summary}
                                            </p>
                                        )}
                                    </div>

                                    {/* Validity dates */}
                                    <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between text-[10px] md:text-xs text-gray-500">
                                        <span>
                                            Valable jusqu'au {new Date(offer.end_date).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Offre limitée
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
