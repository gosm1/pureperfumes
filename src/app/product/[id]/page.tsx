"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Truck, RotateCcw, CreditCard, Plus, Minus, BadgePercent, ShieldCheck, Star, ChevronLeft, Snowflake, Leaf, Sun, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/constants';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

export default function ProductDetail() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { addToCart, setIsCartOpen } = useCart();

    React.useEffect(() => {
        async function loadData() {
            const products = await getProducts();
            const foundProduct = products.find(p => p.id === id);
            setProduct(foundProduct || products[0]);
            setRelated(products.filter(p => p.id !== (foundProduct?.id || id)).slice(0, 4));
            setLoading(false);
        }
        loadData();
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

    if (loading || !product) {
        return (
            <div className="pt-40 pb-24 px-6 lg:px-24 flex items-center justify-center min-h-[600px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
            </div>
        );
    }

    // Mock rating data
    const rating = {
        average: 4.5,
        total: 50,
        distribution: [
            { stars: 5, percentage: 70 },
            { stars: 4, percentage: 20 },
            { stars: 3, percentage: 6 },
            { stars: 2, percentage: 2 },
            { stars: 1, percentage: 2 }
        ]
    };

    return (
        <div className="pt-28 lg:pt-40 pb-16 lg:pb-24 px-4 lg:px-24">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm mb-8">
                <button onClick={() => router.push('/')} className="flex items-center text-gray-500 hover:text-black transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Home</span>
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500">Products</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
                {/* Gallery */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-white border border-gray-100 flex items-center justify-center overflow-hidden rounded-lg group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImageIndex}
                                src={product.images[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = offset.x; // horizontal swipe distance
                                    if (swipe < -50) {
                                        // Swipe left (next)
                                        setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
                                    } else if (swipe > 50) {
                                        // Swipe right (prev)
                                        setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
                                    }
                                }}
                            />
                        </AnimatePresence>
                        {/* Image Counter */}
                        {product.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 z-10">
                                <div className="flex space-x-1">
                                    {product.images.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === selectedImageIndex ? 'bg-white w-4' : 'bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium">{selectedImageIndex + 1} / {product.images.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-3 gap-2 sm:gap-3">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImageIndex(i)}
                                    className={`aspect-square bg-white border-2 rounded-lg cursor-pointer transition-all overflow-hidden group ${i === selectedImageIndex
                                        ? 'border-black shadow-md'
                                        : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        className={`w-full h-full object-contain transition-all ${i === selectedImageIndex ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                                            }`}
                                        alt={`${product.name} view ${i + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-6">
                    <div>
                        {/* Star Rating */}
                        <div className="flex items-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.floor(rating.average)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-none text-gray-300'
                                        }`}
                                />
                            ))}
                            <span className="text-sm text-gray-600">({rating.total} avis)</span>
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-serif mb-3 uppercase tracking-tight leading-tight">{product.name}</h1>
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-3xl font-bold text-black">dh {product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">dh {product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="border-t border-b border-gray-200 py-4">
                        <button className="w-full flex items-center justify-between text-left group">
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Description</h3>
                        </button>
                        <p className="text-gray-600 text-sm leading-relaxed mt-3">
                            {product.description || "Une fragrance aromatique fougère pour homme. Lancée en 2015, cette création sophistiquée révèle un univers olfactif complexe et captivant."}
                        </p>
                    </div>

                    {/* Main Notes - Pyramid of Composition */}
                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Pyramide de composition</h3>
                            <span className="text-gray-400 text-xs">ⓘ</span>
                        </div>
                        <div className="space-y-2">
                            {(product.notes || ['Fresh Spicy', 'Amber', 'Citrus', 'Aromatic', 'Musky', 'Woody', 'Lavender', 'Herbal', 'Warm-Spicy']).map((note, idx) => {
                                // Precise semantic color mapping based on user guide
                                const getNoteColor = (noteName: string) => {
                                    const name = noteName.toLowerCase();

                                    // 🍨 GOURMAND & SWEET
                                    if (name.includes('vanilla') || name.includes('vanille')) return { bg: '#F5F5DC', border: '#E8E8C8', text: '#5D5D3C' }; // Beige / Cream
                                    if (name.includes('caramel')) return { bg: '#C68E17', border: '#A67310', text: '#FFFFFF' }; // Golden Brown
                                    if (name.includes('honey') || name.includes('miel')) return { bg: '#FFC30B', border: '#E0A800', text: '#5C4300' }; // Amber / Warm Gold
                                    if (name.includes('chocolate') || name.includes('cocoa') || name.includes('chocolat') || name.includes('cacao')) return { bg: '#3B2F2F', border: '#2A1F1F', text: '#FFFFFF' }; // Dark Brown
                                    if (name.includes('almond') || name.includes('amande')) return { bg: '#EADDCA', border: '#DCC3A8', text: '#5E4B35' }; // Light Beige / Sand
                                    if (name.includes('coffee') || name.includes('café')) return { bg: '#4B3621', border: '#362415', text: '#FFFFFF' }; // Espresso Brown
                                    if (name.includes('tonka')) return { bg: '#E1C699', border: '#D1B07A', text: '#58421F' }; // Warm beige/brown

                                    // 🌳 WOODY
                                    if (name.includes('sandalwood') || name.includes('santal')) return { bg: '#D2B48C', border: '#C19D6F', text: '#FFFFFF' }; // Creamy Tan
                                    if (name.includes('cedar') || name.includes('cèdre')) return { bg: '#A52A2A', border: '#8A2020', text: '#FFFFFF' }; // Reddish Brown
                                    if (name.includes('oud') || name.includes('aoud')) return { bg: '#2B2117', border: '#17110C', text: '#FFFFFF' }; // Dark Brown / Almost Black
                                    if (name.includes('vetiver')) return { bg: '#556B2F', border: '#425424', text: '#FFFFFF' }; // Olive Green / Earthy Brown
                                    if (name.includes('patchouli')) return { bg: '#3E3226', border: '#292119', text: '#FFFFFF' }; // Dark Green / Brown
                                    if (name.includes('wood') || name.includes('bois')) return { bg: '#8B5A2B', border: '#704822', text: '#FFFFFF' }; // General Wood

                                    // 🌸 FLORAL
                                    if (name.includes('rose')) return { bg: '#FFC0CB', border: '#FF91A4', text: '#8B0000' }; // Pink / Red
                                    if (name.includes('jasmine') || name.includes('jasmin')) return { bg: '#FFFFF0', border: '#F0F0D8', text: '#66664D' }; // White / Soft Yellow
                                    if (name.includes('orange blossom') || name.includes('fleur d\'oranger') || name.includes('neroli')) return { bg: '#FFF5EE', border: '#FFE4D5', text: '#8B4500' }; // White + Touch of Orange
                                    if (name.includes('ylang')) return { bg: '#FFD700', border: '#DBB800', text: '#665500' }; // Golden Yellow
                                    if (name.includes('iris')) return { bg: '#B6B6B4', border: '#9E9E9C', text: '#FFFFFF' }; // Lavender / Powdery Grey
                                    if (name.includes('violet') || name.includes('violette')) return { bg: '#8F00FF', border: '#7300D1', text: '#FFFFFF' }; // Violet Purple
                                    if (name.includes('lavender') || name.includes('lavande')) return { bg: '#E6E6FA', border: '#CFCFCF', text: '#4B0082' }; // Lavender
                                    if (name.includes('peony') || name.includes('pivoine')) return { bg: '#FFC0CB', border: '#FF91A4', text: '#8B0000' }; // Light Pink
                                    if (name.includes('floral')) return { bg: '#FFB7C5', border: '#FF99AC', text: '#8B0000' }; // General Floral

                                    // 🍋 CITRUS
                                    if (name.includes('bergamot') || name.includes('bergamote')) return { bg: '#ADFF2F', border: '#8FDE0B', text: '#406600' }; // Yellow-Green
                                    if (name.includes('lemon') || name.includes('citron')) return { bg: '#FFF700', border: '#DDD600', text: '#666300' }; // Bright Yellow
                                    if (name.includes('orange') && !name.includes('blossom')) return { bg: '#FFA500', border: '#DB8D00', text: '#FFFFFF' }; // Orange
                                    if (name.includes('grapefruit') || name.includes('pamplemousse')) return { bg: '#FF7F50', border: '#E36436', text: '#FFFFFF' }; // Coral / Pink
                                    if (name.includes('citrus') || name.includes('agrume')) return { bg: '#FFD700', border: '#DBB800', text: '#665500' }; // General Citrus

                                    // 🌿 FRESH / GREEN
                                    if (name.includes('mint') || name.includes('menthe')) return { bg: '#98FF98', border: '#7DDE7D', text: '#005400' }; // Bright Green
                                    if (name.includes('basil') || name.includes('basilic')) return { bg: '#006400', border: '#004700', text: '#FFFFFF' }; // Deep Green
                                    if (name.includes('green tea') || name.includes('thé vert')) return { bg: '#98FB98', border: '#7FDE7F', text: '#004700' }; // Pale Green
                                    if (name.includes('fresh') || name.includes('frais') || name.includes('green') || name.includes('vert')) return { bg: '#228B22', border: '#196919', text: '#FFFFFF' }; // Forest Green
                                    if (name.includes('herbal') || name.includes('herbs')) return { bg: '#556B2F', border: '#425424', text: '#FFFFFF' }; // Herbal Green

                                    // 🌫️ RESINOUS / AMBER
                                    if (name.includes('amber') || name.includes('ambre')) return { bg: '#FFBF00', border: '#DBA400', text: '#5E4600' }; // Golden Amber
                                    if (name.includes('benzoin')) return { bg: '#A0522D', border: '#854223', text: '#FFFFFF' }; // Caramel Brown
                                    if (name.includes('myrrh') || name.includes('myrrhe')) return { bg: '#8B4513', border: '#6E360F', text: '#FFFFFF' }; // Dark Amber
                                    if (name.includes('incense') || name.includes('encens')) return { bg: '#708090', border: '#5A6775', text: '#FFFFFF' }; // Smoky Grey
                                    if (name.includes('resin')) return { bg: '#CD853F', border: '#B07134', text: '#FFFFFF' }; // Amber Resin

                                    // 🧴 MUSKS & MODERN
                                    if (name.includes('white musk') || name.includes('musc blanc')) return { bg: '#F2F3F4', border: '#DCDDDE', text: '#666666' }; // Soft White
                                    if (name.includes('musk') || name.includes('musc')) return { bg: '#D2B48C', border: '#B99C76', text: '#FFFFFF' }; // Beige / Tan
                                    if (name.includes('ambroxan')) return { bg: '#C0C0C0', border: '#A6A6A6', text: '#4D4D4D' }; // Metallic Grey
                                    if (name.includes('cashmeran')) return { bg: '#8B8589', border: '#706B6E', text: '#FFFFFF' }; // Soft Brown-Grey
                                    if (name.includes('leather') || name.includes('cuir')) return { bg: '#8B4500', border: '#6E3600', text: '#FFFFFF' }; // Brown Leather

                                    // 🌶️ SPICY
                                    if (name.includes('spicy') || name.includes('spice') || name.includes('épic')) return { bg: '#8B0000', border: '#660000', text: '#FFFFFF' }; // Warm Spice Red
                                    if (name.includes('pepper') || name.includes('poivre')) return { bg: '#4A4A4A', border: '#333333', text: '#FFFFFF' }; // Pepper Black/Grey
                                    if (name.includes('cinnamon') || name.includes('cannelle')) return { bg: '#D2691E', border: '#B55A19', text: '#FFFFFF' }; // Cinnamon

                                    // 🍇 FRUITY
                                    if (name.includes('fruit') || name.includes('berry') || name.includes('baie')) return { bg: '#DDA0DD', border: '#C086C0', text: '#4B0082' }; // Plum / Berry
                                    if (name.includes('apple') || name.includes('pomme')) return { bg: '#FF4500', border: '#D63900', text: '#FFFFFF' }; // Red Apple
                                    if (name.includes('peach') || name.includes('pêche')) return { bg: '#FFDAB9', border: '#E6C3A3', text: '#5C4023' }; // Peach
                                    if (name.includes('lyche') || name.includes('litchi')) return { bg: '#F8C3CD', border: '#E0AAB4', text: '#5C2E36' }; // Lychee Pink

                                    // 💧 AQUATIC
                                    if (name.includes('aqua') || name.includes('marine') || name.includes('ocean')) return { bg: '#00FFFF', border: '#00D6D6', text: '#005C5C' }; // Water Blue

                                    // 🌰 AROMATIC
                                    if (name.includes('aromatic') || name.includes('aromatique')) return { bg: '#00A86B', border: '#008C59', text: '#FFFFFF' }; // Jade / Emerald

                                    // Default
                                    return { bg: '#E5E5E5', border: '#D4D4D4', text: '#404040' }; // Neutral Gray
                                };

                                // Calculate width - first notes get more prominence
                                const widths = ['100%', '95%', '90%', '85%', '80%', '75%', '70%', '65%', '60%'];

                                const style = getNoteColor(note);

                                return (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 border border-gray-300 shrink-0"></div>
                                        <div className="flex-1">
                                            <div
                                                className="border rounded-full px-4 py-2 transition-all flex items-center"
                                                style={{
                                                    width: widths[idx] || '60%',
                                                    backgroundColor: style.bg,
                                                    borderColor: style.border,
                                                }}
                                            >
                                                <span
                                                    className="text-sm font-medium"
                                                    style={{ color: style.text }}
                                                >
                                                    {note}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Seasons */}
                    {product.seasons && (
                        <div className="border-b border-gray-200 pb-6">
                            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5">Saisons</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: 'hiver',
                                        val: product.seasons.winter,
                                        Icon: Snowflake,
                                        bgColor: 'rgba(120, 214, 240, 0.3)', // #78D6F0 light
                                        barColor: '#78D6F0',
                                        textColor: 'text-sky-600'
                                    },
                                    {
                                        label: 'printemps',
                                        val: product.seasons.spring,
                                        Icon: Leaf,
                                        bgColor: 'rgba(201, 238, 192, 0.3)', // #C9EEC0 light
                                        barColor: '#C9EEC0',
                                        textColor: 'text-green-600'
                                    },
                                    {
                                        label: 'été',
                                        val: product.seasons.summer,
                                        Icon: Sun,
                                        bgColor: 'rgba(252, 244, 135, 0.3)', // #FCF487 light
                                        barColor: '#FCF487',
                                        textColor: 'text-yellow-600'
                                    },
                                    {
                                        label: 'automne',
                                        val: product.seasons.fall,
                                        Icon: Cloud,
                                        bgColor: 'rgba(249, 190, 110, 0.3)', // #F9BE6E light
                                        barColor: '#F9BE6E',
                                        textColor: 'text-orange-600'
                                    }
                                ].map((s, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="rounded-full p-3 mb-2" style={{ backgroundColor: s.bgColor }}>
                                            <s.Icon className={`w-6 h-6 ${s.textColor}`} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-700 mb-2 capitalize">{s.label}</span>
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{ width: `${s.val}%`, backgroundColor: s.barColor }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Actions */}
                    <div className="flex items-center space-x-3 border border-gray-300 rounded w-fit">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-base min-w-[30px] text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-4 px-6 bg-white text-black border-2 border-black uppercase tracking-wide text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 rounded"
                        >
                            Ajouter au panier
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="w-full py-4 px-6 bg-black text-white uppercase tracking-wide text-sm font-semibold hover:bg-gray-800 transition-all duration-300 rounded shadow-lg"
                        >
                            Acheter maintenant
                        </button>
                    </div>

                    {/* Delivery Options */}
                    <div className="border border-gray-200 rounded-lg p-5">
                        <button className="w-full flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Options de livraison</h3>
                            <ChevronLeft className="w-4 h-4 transform rotate-90" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="bg-gray-100 p-2 rounded">
                                    <BadgePercent className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Réduction</p>
                                    <p className="text-xs text-gray-500">Remise 10%</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-gray-100 p-2 rounded">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Paiement</p>
                                    <p className="text-xs text-gray-500">Paiement à la livraison</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-gray-100 p-2 rounded">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Délai de livraison</p>
                                    <p className="text-xs text-gray-500">3–4 jours ouvrables</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-gray-100 p-2 rounded">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Retour & Garantie</p>
                                    <p className="text-xs text-gray-500">Retour facile 7 jours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating & Reviews */}
            <section className="mb-24 border-t border-gray-100 pt-16">
                <h2 className="text-3xl font-serif uppercase tracking-tight mb-12">Notes & Avis</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Rating Summary */}
                    <div>
                        <div className="flex items-end space-x-3 mb-6">
                            <span className="text-5xl lg:text-7xl font-bold leading-none">{rating.average}</span>
                            <span className="text-xl lg:text-2xl text-gray-400 pb-2">/5</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= Math.floor(rating.average)
                                        ? 'fill-amber-400 text-amber-400'
                                        : star - rating.average < 1
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-none text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">({rating.total} Nouveaux avis)</p>

                        {/* Rating Distribution */}
                        <div className="mt-8 space-y-3">
                            {rating.distribution.map((item) => (
                                <div key={item.stars} className="flex items-center space-x-4">
                                    <span className="text-sm font-medium w-4">{item.stars}</span>
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-400 transition-all duration-500"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review Form */}
                    <div className="flex flex-col justify-center">
                        <h3 className="text-2xl font-serif uppercase tracking-tight mb-4">Donnez votre avis</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Partagez votre expérience avec d'autres clients
                        </p>
                        <button className="w-full py-4 px-6 bg-white text-black border-2 border-black uppercase tracking-wide text-sm font-semibold hover:bg-black hover:text-white transition-all duration-300 rounded">
                            Écrire un avis client
                        </button>
                    </div>
                </div>
            </section>

            {/* Recommendations */}
            <section>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <span className="text-xs text-black font-bold uppercase tracking-wider mb-2 block">Suggestions</span>
                        <h2 className="text-3xl font-serif uppercase tracking-tight">Complétez votre collection</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {related.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </section>
        </div>
    );
}
