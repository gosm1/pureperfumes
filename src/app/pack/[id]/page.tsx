"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProducts } from '@/constants';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Truck, CreditCard, Plus, Minus, Gift, Heart, Sparkles, Star, ShieldCheck, Package, RotateCcw, Clock, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

export default function PackPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [expandedDetail, setExpandedDetail] = useState<string | null>('perfume');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [timeUntilDeadline, setTimeUntilDeadline] = useState('');

    // Variant selections
    const [ringSize, setRingSize] = useState<number | null>(null);
    const [selectedPerfume, setSelectedPerfume] = useState('');
    const [customPerfume, setCustomPerfume] = useState('');
    const [loveLetter, setLoveLetter] = useState(false);
    const [recipientName, setRecipientName] = useState('');
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const router = useRouter();
    const { addToCart, setIsCartOpen } = useCart();

    useEffect(() => {
        async function load() {
            const products = await getProducts();
            const found = products.find(p => p.id === id);
            if (found) {
                setProduct(found);
                setRelated(products.filter(p => p.id !== id && p.category === 'pack').slice(0, 4));
            }
            setLoading(false);
        }
        load();
    }, [id]);

    // Valentine's delivery countdown
    useEffect(() => {
        const updateCountdown = () => {
            const deadline = new Date('2026-02-12T23:59:59');
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                if (days > 0) {
                    setTimeUntilDeadline(`${days}j ${hours}h`);
                } else {
                    setTimeUntilDeadline(`${hours}h ${minutes}m`);
                }
            } else {
                setTimeUntilDeadline('');
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 30000);
        return () => clearInterval(interval);
    }, []);

    // Validation logic
    const isValid = ringSize !== null &&
        selectedPerfume !== '' &&
        (selectedPerfume !== 'other' || customPerfume.trim() !== '');

    const handleAddToCart = () => {
        if (product && isValid) {
            const customization = {
                ringSize: ringSize!,
                perfumeType: selectedPerfume,
                customPerfumeName: selectedPerfume === 'other' ? customPerfume : undefined,
                loveLetterEnabled: loveLetter,
                loveLetterRecipientName: loveLetter ? recipientName : undefined
            };
            addToCart(product, quantity, customization);
        }
    };

    const handleBuyNow = () => {
        if (product && isValid) {
            const customization = {
                ringSize: ringSize!,
                perfumeType: selectedPerfume,
                customPerfumeName: selectedPerfume === 'other' ? customPerfume : undefined,
                loveLetterEnabled: loveLetter,
                loveLetterRecipientName: loveLetter ? recipientName : undefined
            };
            addToCart(product, quantity, customization);
            setIsCartOpen(false);
            router.push('/checkout');
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE9E9 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 80%, rgba(217, 119, 119, 0.1) 0%, transparent 50%)`
                }}></div>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2" style={{ borderTopColor: '#8B1538' }}></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-serif mb-4">Pack introuvable</h1>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    const rating = {
        average: 4.9,
        total: 46,
        distribution: [
            { stars: 5, percentage: 85 },
            { stars: 4, percentage: 12 },
            { stars: 3, percentage: 2 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 0 }
        ]
    };

    const stockRemaining = 8 + Math.floor(Math.random() * 8);

    // Floating hearts animation
    const FloatingHeart = ({ delay }: { delay: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 100, x: Math.random() * 100 - 50 }}
            animate={{
                opacity: [0, 0.3, 0],
                y: -200,
                x: Math.random() * 100 - 50,
            }}
            transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 5
            }}
            className="absolute text-rose-300"
            style={{ left: `${Math.random() * 100}%`, bottom: 0 }}
        >
            <Heart size={16} fill="currentColor" />
        </motion.div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE9E9 50%, #FFF0F0 100%)' }}>
            {/* Romantic Background Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-30" style={{
                backgroundImage: `
                    radial-gradient(circle at 10% 20%, rgba(139, 21, 56, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(217, 119, 119, 0.08) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)
                `
            }}></div>

            {/* Subtle floating particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <FloatingHeart key={i} delay={i * 1.5} />
                ))}
            </div>

            {/* Soft glow spots */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%)' }}></div>
            <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139, 21, 56, 0.3) 0%, transparent 70%)' }}></div>

            {/* Hero Section */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.theme || product.images[0]})` }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(139, 21, 56, 0.4) 0%, rgba(217, 119, 119, 0.3) 100%)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                {/* Elegant sparkles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            color: '#D4AF37'
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.3,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    >
                        <Sparkles size={12} />
                    </motion.div>
                ))}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="mb-4 inline-block px-4 py-1.5 rounded-full border border-white/40 backdrop-blur-sm" style={{ background: 'rgba(212, 175, 55, 0.2)' }}>
                            <div className="flex items-center gap-2">
                                <Heart size={14} fill="currentColor" className="text-rose-200" />
                                <span className="text-xs tracking-[0.3em] uppercase font-light">Saint-Valentin 2026</span>
                                <Heart size={14} fill="currentColor" className="text-rose-200" />
                            </div>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-center mb-3 sm:mb-4 px-4"
                            style={{
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD6E0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {product.name}
                        </motion.h1>
                        <p className="text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.25em] uppercase opacity-90 font-light px-4" style={{ color: '#D4AF37' }}>
                            Édition Love Exclusive
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="relative z-10 -mt-16 sm:-mt-24 lg:-mt-32 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-16 max-w-[1400px] mx-auto">
                <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-12 border border-rose-100/50" style={{
                    boxShadow: '0 25px 50px -12px rgba(139, 21, 56, 0.15)'
                }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-12 sm:mb-16 lg:mb-24">
                        {/* Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square flex items-center justify-center overflow-hidden rounded-2xl group" style={{
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)',
                                border: '1px solid rgba(212, 175, 55, 0.2)',
                                boxShadow: '0 10px 40px -10px rgba(139, 21, 56, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                            }}>
                                {/* Gold corner accents */}
                                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: '#D4AF37' }}></div>
                                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: '#D4AF37' }}></div>
                                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: '#D4AF37' }}></div>
                                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: '#D4AF37' }}></div>

                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={product.images[selectedImageIndex]}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </AnimatePresence>

                                {/* Luxury badge */}
                                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold tracking-wider" style={{
                                    background: 'linear-gradient(135deg, rgba(139, 21, 56, 0.9) 0%, rgba(127, 29, 29, 0.9) 100%)',
                                    color: '#FFFFFF',
                                    boxShadow: '0 4px 15px rgba(139, 21, 56, 0.4)'
                                }}>
                                    <div className="flex items-center gap-1.5">
                                        <Gift size={12} />
                                        VALENTINE GIFT
                                    </div>
                                </div>

                                {product.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2 z-10" style={{
                                        background: 'rgba(139, 21, 56, 0.8)',
                                        border: '1px solid rgba(212, 175, 55, 0.3)'
                                    }}>
                                        <div className="flex space-x-1">
                                            {product.images.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 rounded-full transition-all ${i === selectedImageIndex ? 'w-6 bg-[#D4AF37]' : 'w-1.5 bg-white/40'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium text-white">{selectedImageIndex + 1} / {product.images.length}</span>
                                    </div>
                                )}
                            </div>

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImageIndex(i)}
                                            className="aspect-square rounded-lg cursor-pointer transition-all overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F8 100%)',
                                                border: i === selectedImageIndex ? '2px solid #D4AF37' : '2px solid rgba(212, 175, 55, 0.2)',
                                                boxShadow: i === selectedImageIndex ? '0 4px 15px rgba(212, 175, 55, 0.3)' : undefined
                                            }}
                                        >
                                            <img src={img} className="w-full h-full object-contain p-2" alt={`View ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                                                fill={star <= Math.floor(rating.average) ? '#D4AF37' : 'none'}
                                                style={{ color: star <= Math.floor(rating.average) ? '#D4AF37' : '#E5E7EB' }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium" style={{ color: '#8B1538' }}>
                                        {rating.average} ({rating.total} avis vérifiés)
                                    </span>
                                </div>

                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-2 sm:mb-3 uppercase tracking-tight leading-tight" style={{
                                    background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 50%, #D4AF37 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {product.name}
                                </h1>

                                <p className="text-sm sm:text-base leading-snug mb-2" style={{ color: '#6B7280', lineHeight: '1.5' }}>
                                    Un parfum intemporel associé à un bijou élégant — conçu pour lui faire ressentir votre amour.
                                </p>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                    <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B1538' }}>
                                        {product.price.toFixed(2)} DH
                                    </span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-base sm:text-lg text-gray-400 line-through">{product.originalPrice.toFixed(2)} DH</span>
                                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)' }}>
                                                SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-b py-4 sm:py-5" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}></div>
                                    <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider" style={{ color: '#8B1538' }}>
                                        L'Histoire d'Amour
                                    </h3>
                                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}></div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    {product.description || "Une composition envoûtante qui capture l'essence même de la passion. Créée pour les moments intimes et les déclarations d'amour, cette fragrance sophistiquée révèle un univers olfactif romantique et captivant."}
                                </p>
                            </div>

                            {/* Variant Selection */}
                            <div className="space-y-3 sm:space-y-4">
                                {/* Ring Size Selector */}
                                <div className="border rounded-xl p-4 sm:p-5" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', background: 'rgba(255, 255, 255, 0.5)' }}>
                                    <label className="block font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3" style={{ color: '#8B1538' }}>
                                        Taille de bague
                                    </label>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-2">
                                        {[6, 7, 8, 9, 10, 11, 12].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setRingSize(size)}
                                                className="h-11 sm:h-12 rounded-lg font-medium text-sm transition-all"
                                                style={{
                                                    background: ringSize === size ? 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)' : '#FFFFFF',
                                                    border: ringSize === size ? '2px solid #8B1538' : '2px solid rgba(212, 175, 55, 0.3)',
                                                    color: ringSize === size ? '#FFFFFF' : '#8B1538',
                                                    boxShadow: ringSize === size ? '0 4px 12px rgba(139, 21, 56, 0.3)' : 'none'
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-xs underline hover:no-underline transition-all"
                                        style={{ color: '#D4AF37' }}
                                    >
                                        <span className="hidden sm:inline">Pas sûr? Consultez notre guide des tailles</span>
                                        <span className="sm:hidden">Guide des tailles</span>
                                    </button>
                                </div>

                                {/* Perfume Selector */}
                                <div className="border rounded-xl p-4 sm:p-5" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', background: 'rgba(255, 255, 255, 0.5)' }}>
                                    <label className="block font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3" style={{ color: '#8B1538' }}>
                                        Votre parfum
                                    </label>
                                    <select
                                        value={selectedPerfume}
                                        onChange={(e) => setSelectedPerfume(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg text-sm transition-all"
                                        style={{
                                            border: '2px solid rgba(212, 175, 55, 0.3)',
                                            color: selectedPerfume ? '#1F2937' : '#9CA3AF',
                                            background: '#FFFFFF'
                                        }}
                                    >
                                        <option value="" disabled>Sélectionnez un parfum</option>
                                        <optgroup label="Choix Populaires">
                                            <option value="miss-dior">Miss Dior</option>
                                            <option value="jadore">J'adore</option>
                                            <option value="la-vie-est-belle">La Vie Est Belle</option>
                                        </optgroup>
                                        <option value="other">Autre (tapez votre choix)</option>
                                    </select>

                                    {selectedPerfume === 'other' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 space-y-2"
                                        >
                                            <input
                                                type="text"
                                                value={customPerfume}
                                                onChange={(e) => setCustomPerfume(e.target.value)}
                                                placeholder="Tapez le nom du parfum"
                                                className="w-full px-4 py-3 rounded-lg text-sm"
                                                style={{ border: '2px solid rgba(212, 175, 55, 0.3)' }}
                                            />
                                            <p className="text-xs" style={{ color: '#6B7280' }}>
                                                Nous confirmerons la disponibilité avant expédition
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Love Letter Option */}
                                <div className="border rounded-xl p-4 sm:p-5" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', background: 'rgba(255, 255, 255, 0.5)' }}>
                                    <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={loveLetter}
                                            onChange={(e) => setLoveLetter(e.target.checked)}
                                            className="w-5 h-5 rounded transition-all"
                                            style={{
                                                accentColor: '#8B1538',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span className="text-xs sm:text-sm font-medium group-hover:text-opacity-80 transition-all" style={{ color: '#1F2937' }}>
                                            Lettre d'amour <span className="hidden sm:inline">(gratuit)</span>
                                        </span>
                                    </label>

                                    {loveLetter && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 space-y-2"
                                        >
                                            <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B1538' }}>
                                                Nom du destinataire
                                            </label>
                                            <input
                                                type="text"
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value.slice(0, 30))}
                                                placeholder="ex. Sarah"
                                                maxLength={30}
                                                className="w-full px-4 py-3 rounded-lg text-sm"
                                                style={{ border: '2px solid rgba(212, 175, 55, 0.3)' }}
                                            />
                                            <p className="text-xs" style={{ color: '#6B7280' }}>
                                                Imprimé à l'intérieur du coffret cadeau • {recipientName.length}/30 caractères
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 sm:space-x-3 border rounded-lg w-fit" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-rose-50 transition-colors"
                                >
                                    <Minus className="w-4 h-4" style={{ color: '#8B1538' }} />
                                </button>
                                <span className="font-semibold text-sm sm:text-base min-w-[24px] sm:min-w-[30px] text-center" style={{ color: '#8B1538' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-rose-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" style={{ color: '#8B1538' }} />
                                </button>
                            </div>

                            {/* Validation Error */}
                            {!isValid && (ringSize !== null || selectedPerfume !== '') && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-4 py-3 rounded-lg text-xs"
                                    style={{ background: 'rgba(139, 21, 56, 0.1)', color: '#8B1538' }}
                                >
                                    {!ringSize && '⚠️ Veuillez sélectionner une taille de bague. '}
                                    {!selectedPerfume && '⚠️ Veuillez choisir un parfum. '}
                                    {selectedPerfume === 'other' && !customPerfume.trim() && '⚠️ Veuillez saisir le nom du parfum.'}
                                </motion.div>
                            )}

                            <div className="space-y-2 sm:space-y-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isValid}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 uppercase tracking-wide text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg relative overflow-hidden group"
                                    style={{
                                        background: isValid ? 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)' : '#F3F4F6',
                                        border: isValid ? '2px solid #8B1538' : '2px solid #D1D5DB',
                                        color: isValid ? '#8B1538' : '#9CA3AF',
                                        cursor: isValid ? 'pointer' : 'not-allowed',
                                        opacity: isValid ? 1 : 0.6
                                    }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Gift size={18} />
                                        Ajouter au Panier Cadeau
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-red-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!isValid}
                                    className="w-full py-3 sm:py-4 px-4 sm:px-6 uppercase tracking-wide text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg shadow-xl relative overflow-hidden group"
                                    style={{
                                        background: isValid ? 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)' : '#D1D5DB',
                                        color: '#FFFFFF',
                                        cursor: isValid ? 'pointer' : 'not-allowed',
                                        opacity: isValid ? 1 : 0.6
                                    }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Heart size={18} fill="currentColor" />
                                        Offrir l'Amour Maintenant
                                    </span>
                                </button>

                                <p className="text-xs text-center" style={{ color: '#8B1538' }}>
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Livré avant la Saint-Valentin
                                </p>
                            </div>

                            {/* Urgency & Scarcity */}
                            <div className="flex flex-col gap-2 border-t pt-3 sm:pt-4" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                {stockRemaining <= 15 && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#8B1538' }}>
                                        <Package className="w-4 h-4" />
                                        <span>Plus que <strong>{stockRemaining} coffrets</strong> disponibles pour la Saint-Valentin</span>
                                    </div>
                                )}
                                {timeUntilDeadline && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: '#D4AF37' }}>
                                        <Clock className="w-4 h-4" />
                                        <span>Commandez dans <strong>{timeUntilDeadline}</strong> pour une livraison avant le 14 février</span>
                                    </div>
                                )}
                            </div>

                            {/* Why This Gift Works */}
                            <div className="border rounded-xl p-4 sm:p-5 mt-4 sm:mt-6" style={{
                                borderColor: 'rgba(139, 21, 56, 0.2)',
                                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)'
                            }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2 mb-4" style={{ color: '#8B1538' }}>
                                    <Heart size={16} fill="#8B1538" style={{ color: '#8B1538' }} />
                                    Pourquoi ce cadeau fonctionne
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            <ShieldCheck className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Conçu pour la Saint-Valentin</p>
                                            <p className="text-xs text-gray-600">Design romantique et exclusif</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            <Gift className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Coffret luxe prêt-cadeau</p>
                                            <p className="text-xs text-gray-600">Aucun emballage supplémentaire nécessaire</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            <Heart className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Bijou ajustable</p>
                                            <p className="text-xs text-gray-600">Pas de stress de taille</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5">
                                            <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: '#1F2937' }}>Édition limitée</p>
                                            <p className="text-xs text-gray-600">Exclusivité Saint-Valentin 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Product Details */}
                            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider" style={{ color: '#8B1538' }}>
                                    Détails du Coffret
                                </h3>

                                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                    <button
                                        onClick={() => setExpandedDetail(expandedDetail === 'perfume' ? null : 'perfume')}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-rose-50/30 transition-colors"
                                    >
                                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>Le Parfum</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedDetail === 'perfume' ? 'rotate-180' : ''}`}
                                            style={{ color: '#8B1538' }}
                                        />
                                    </button>
                                    {expandedDetail === 'perfume' && (
                                        <div className="px-4 pb-4 pt-2 space-y-3 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8B1538' }}>Choix de parfum</p>
                                                <div className="space-y-1 text-xs text-gray-700">
                                                    <p>vous pouvez choisir parmi un large choix de fragrances avec plus de 250+ parfums</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8B1538' }}>Caractéristiques</p>
                                                <p className="text-xs text-gray-700">Parfum romantique et sensuel, parfait pour les occasions spéciales. Tenue: 6-8h. Sillage modéré à intense.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                    <button
                                        onClick={() => setExpandedDetail(expandedDetail === 'jewelry' ? null : 'jewelry')}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-rose-50/30 transition-colors"
                                    >
                                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>Le Bijou</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedDetail === 'jewelry' ? 'rotate-180' : ''}`}
                                            style={{ color: '#8B1538' }}
                                        />
                                    </button>
                                    {expandedDetail === 'jewelry' && (
                                        <div className="px-4 pb-4 pt-2 space-y-3 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8B1538' }}>Matériau & Finition</p>
                                                <p className="text-xs text-gray-700">Acier inoxydable plaqué or 18k. Finition polie miroir. Hypoallergénique et résistant à l'eau.</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8B1538' }}>Symbolisme</p>
                                                <p className="text-xs text-gray-700">Design en forme de cœur entrelacé, symbolisant l'amour éternel et l'union des âmes. Taille ajustable (16-20cm).</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                    <button
                                        onClick={() => setExpandedDetail(expandedDetail === 'packaging' ? null : 'packaging')}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-rose-50/30 transition-colors"
                                    >
                                        <span className="font-medium text-sm" style={{ color: '#1F2937' }}>L'Emballage</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedDetail === 'packaging' ? 'rotate-180' : ''}`}
                                            style={{ color: '#8B1538' }}
                                        />
                                    </button>
                                    {expandedDetail === 'packaging' && (
                                        <div className="px-4 pb-4 pt-2 space-y-3 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                            <p className="text-xs text-gray-700">
                                                Coffret rigide premium aux couleurs de la Saint-Valentin (bordeaux & or).
                                                Inclut une carte de message romantique personnalisable et un ruban en satin.
                                                Prêt à offrir, aucun emballage supplémentaire nécessaire.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Customer Testimonials */}
                            <div className="mt-4 sm:mt-6 border rounded-xl p-4 sm:p-5" style={{
                                borderColor: 'rgba(212, 175, 55, 0.3)',
                                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F9 100%)'
                            }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2 mb-4" style={{ color: '#8B1538' }}>
                                    <Star size={16} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                                    Avis de nos clients
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {[
                                        { name: 'Mehdi K.', review: 'Elle était sans voix quand elle l\'a ouvert. Le bijou est magnifique et le parfum sent divinement bon. Meilleur cadeau de Saint-Valentin ever!', rating: 5, tag: 'Cadeau Saint-Valentin' },
                                        { name: 'Yasmine B.', review: 'Mon copain m\'a offert ce coffret et j\'ai adoré ! L\'attention portée aux détails, l\'emballage luxueux... tout est parfait.', rating: 5, tag: 'Cadeau Saint-Valentin' },
                                        { name: 'Omar L.', review: 'Qualité premium, livraison rapide. Ma femme était très émue. Je recommande les yeux fermés pour la Saint-Valentin.', rating: 5, tag: 'Cadeau Saint-Valentin' }
                                    ].map((testimonial, idx) => (
                                        <div key={idx} className="pb-4 border-b last:border-b-0" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3" fill={i < testimonial.rating ? '#D4AF37' : 'none'} style={{ color: i < testimonial.rating ? '#D4AF37' : '#E5E7EB' }} />
                                                ))}
                                                <span className="ml-2 text-xs font-medium" style={{ color: '#8B1538' }}>{testimonial.name}</span>
                                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139, 21, 56, 0.1)', color: '#8B1538' }}>{testimonial.tag}</span>
                                            </div>
                                            <p className="text-xs text-gray-700 leading-relaxed">{testimonial.review}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: '#8B1538' }}>
                                    <HelpCircle size={16} />
                                    Questions Fréquentes
                                </h3>

                                {[
                                    { q: 'Est-ce prêt-cadeau ?', a: 'Oui ! Le coffret arrive dans un emballage luxe avec carte de message romantique. Aucun emballage supplémentaire nécessaire.' },
                                    { q: 'Et si elle n\'aime pas le parfum ?', a: 'Échange gratuit dans les 14 jours. Le parfum est universellement apprécié avec des notes florales et vanillées douces.' },
                                    { q: 'Arrivera-t-il avant la Saint-Valentin ?', a: 'Oui, si commandé avant le 12 février à 23h59. Livraison express 24-48h garantie.' },
                                    { q: 'Puis-je retourner ou échanger ?', a: 'Retours acceptés sous 14 jours. Échange du bijou possible si taille non adaptée.' },
                                    { q: 'Le bijou est-il hypoallergénique ?', a: 'Oui, acier inoxydable plaqué or 18k, sans nickel. Parfait pour peaux sensibles.' }
                                ].map((faq, idx) => (
                                    <div key={idx} className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === `faq-${idx}` ? null : `faq-${idx}`)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-rose-50/30 transition-colors text-left"
                                        >
                                            <span className="font-medium text-sm" style={{ color: '#1F2937' }}>{faq.q}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform shrink-0 ml-2 ${expandedFaq === `faq-${idx}` ? 'rotate-180' : ''}`}
                                                style={{ color: '#8B1538' }}
                                            />
                                        </button>
                                        {expandedFaq === `faq-${idx}` && (
                                            <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                                <p className="text-xs text-gray-700">{faq.a}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Final Reassurance */}
                            <div className="mt-4 sm:mt-6 text-center py-4 sm:py-5 border-t border-b" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Heart size={18} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                                    <Heart size={14} fill="#8B1538" style={{ color: '#8B1538' }} />
                                    <Heart size={18} fill="#D4AF37" style={{ color: '#D4AF37' }} />
                                </div>
                                <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                                    Choisi par des centaines de personnes pour rendre la Saint-Valentin inoubliable
                                </p>
                            </div>

                            <div className="border rounded-xl p-4 sm:p-5" style={{
                                borderColor: 'rgba(212, 175, 55, 0.3)',
                                background: 'linear-gradient(135deg, #FFF9F9 0%, #FFFFFF 100%)'
                            }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2 mb-4" style={{ color: '#8B1538' }}>
                                    <Sparkles size={16} style={{ color: '#D4AF37' }} />
                                    Services Premium
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 21, 56, 0.1)' }}>
                                            <Gift className="w-5 h-5" style={{ color: '#8B1538' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#8B1538' }}>Emballage Luxe</p>
                                            <p className="text-xs text-gray-600">Offert</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                            <CreditCard className="w-5 h-5" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#8B1538' }}>Paiement Sécurisé</p>
                                            <p className="text-xs text-gray-600">À la livraison</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 21, 56, 0.1)' }}>
                                            <Truck className="w-5 h-5" style={{ color: '#8B1538' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#8B1538' }}>Livraison Express</p>
                                            <p className="text-xs text-gray-600">24-48h garantie</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                            <Heart className="w-5 h-5" fill="#D4AF37" style={{ color: '#D4AF37' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#8B1538' }}>Carte Personnalisée</p>
                                            <p className="text-xs text-gray-600">Message d'amour</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Packs */}
                    {related.length > 0 && (
                        <section>
                            <div className="flex items-center justify-center gap-3 mb-12">
                                <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }}></div>
                                <h2 className="text-3xl font-serif uppercase tracking-tight" style={{
                                    background: 'linear-gradient(135deg, #8B1538 0%, #D4AF37 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    Collection Valentine
                                </h2>
                                <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }}></div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {related.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Size Guide Modal */}
            <AnimatePresence>
                {showSizeGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
                        onClick={() => setShowSizeGuide(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                            style={{ border: '2px solid rgba(212, 175, 55, 0.3)' }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-serif" style={{ color: '#8B1538' }}>
                                    Guide des Tailles de Bague
                                </h3>
                                <button
                                    onClick={() => setShowSizeGuide(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors"
                                >
                                    <span className="text-2xl" style={{ color: '#8B1538' }}>×</span>
                                </button>
                            </div>

                            <div className="space-y-4 text-sm text-gray-700">
                                <div>
                                    <h4 className="font-semibold mb-2" style={{ color: '#8B1538' }}>
                                        Comment mesurer votre doigt
                                    </h4>
                                    <ol className="space-y-2 list-decimal list-inside">
                                        <li>Enroulez un fil autour de la base de votre doigt</li>
                                        <li>Marquez l'endroit où le fil se chevauche</li>
                                        <li>Mesurez la longueur du fil en mm</li>
                                        <li>Consultez le tableau ci-dessous</li>
                                    </ol>
                                </div>

                                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                    <table className="w-full text-xs">
                                        <thead style={{ background: 'rgba(139, 21, 56, 0.05)' }}>
                                            <tr>
                                                <th className="p-2 text-left" style={{ color: '#8B1538' }}>Taille</th>
                                                <th className="p-2 text-left" style={{ color: '#8B1538' }}>Circonférence (mm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { size: 6, circ: '51.8' },
                                                { size: 7, circ: '54.4' },
                                                { size: 8, circ: '57.0' },
                                                { size: 9, circ: '59.5' },
                                                { size: 10, circ: '62.1' },
                                                { size: 11, circ: '64.6' },
                                                { size: 12, circ: '67.2' }
                                            ].map(({ size, circ }) => (
                                                <tr key={size} className="border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}>
                                                    <td className="p-2 font-medium">{size}</td>
                                                    <td className="p-2">{circ} mm</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                                    <p className="text-xs" style={{ color: '#8B1538' }}>
                                        💡 <strong>Astuce:</strong> Si vous êtes entre deux tailles, choisissez la plus grande pour plus de confort.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="w-full mt-6 py-3 px-6 rounded-lg font-medium transition-all"
                                style={{ background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)', color: '#FFFFFF' }}
                            >
                                Compris
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
