"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProducts } from '@/constants';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Truck, CreditCard, Plus, Minus, Gift, Heart, Sparkles, Star } from 'lucide-react';
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

    const handleAddToCart = () => {
        if (product) addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart(product, quantity);
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
        total: 127,
        distribution: [
            { stars: 5, percentage: 85 },
            { stars: 4, percentage: 12 },
            { stars: 3, percentage: 2 },
            { stars: 2, percentage: 1 },
            { stars: 1, percentage: 0 }
        ]
    };

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
            <div className="relative h-[70vh] w-full overflow-hidden">
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
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-center mb-4"
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
                        <p className="text-sm md:text-lg tracking-[0.25em] uppercase opacity-90 font-light" style={{ color: '#D4AF37' }}>
                            Édition Love Exclusive
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="relative z-10 -mt-32 pb-24 px-4 sm:px-8 lg:px-24">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 lg:p-12 max-w-[1400px] mx-auto border border-rose-100/50" style={{
                    boxShadow: '0 25px 50px -12px rgba(139, 21, 56, 0.15)'
                }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
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
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className="w-5 h-5"
                                                fill={star <= Math.floor(rating.average) ? '#D4AF37' : 'none'}
                                                style={{ color: star <= Math.floor(rating.average) ? '#D4AF37' : '#E5E7EB' }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#8B1538' }}>
                                        {rating.average} ({rating.total} avis vérifiés)
                                    </span>
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-serif mb-4 uppercase tracking-tight leading-tight" style={{
                                    background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 50%, #D4AF37 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {product.name}
                                </h1>

                                <p className="text-lg italic mb-4" style={{ color: '#9CA3AF' }}>
                                    L'essence de l'amour éternel
                                </p>

                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="text-4xl font-bold" style={{ color: '#8B1538' }}>
                                        {product.price.toFixed(2)} DH
                                    </span>
                                    {product.originalPrice && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through">{product.originalPrice.toFixed(2)} DH</span>
                                            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)' }}>
                                                SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-b py-6" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}></div>
                                    <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: '#8B1538' }}>
                                        L'Histoire d'Amour
                                    </h3>
                                    <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }}></div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {product.description || "Une composition envoûtante qui capture l'essence même de la passion. Créée pour les moments intimes et les déclarations d'amour, cette fragrance sophistiquée révèle un univers olfactif romantique et captivant."}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3 border rounded-lg w-fit" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}>
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-rose-50 transition-colors"
                                >
                                    <Minus className="w-4 h-4" style={{ color: '#8B1538' }} />
                                </button>
                                <span className="font-semibold text-base min-w-[30px] text-center" style={{ color: '#8B1538' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-rose-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" style={{ color: '#8B1538' }} />
                                </button>
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full py-4 px-6 uppercase tracking-wide text-sm font-semibold transition-all duration-300 rounded-lg relative overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)',
                                        border: '2px solid #8B1538',
                                        color: '#8B1538'
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
                                    className="w-full py-4 px-6 uppercase tracking-wide text-sm font-semibold transition-all duration-300 rounded-lg shadow-xl relative overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B1538 0%, #A0153E 100%)',
                                        color: '#FFFFFF'
                                    }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Heart size={18} fill="currentColor" />
                                        Offrir l'Amour Maintenant
                                    </span>
                                </button>
                            </div>

                            <div className="border rounded-xl p-5" style={{
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
        </div>
    );
}
