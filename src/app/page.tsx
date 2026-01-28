"use client";

import React from 'react';

import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts, BRANDS } from '@/constants';
import { Product } from '@/types';
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";
import { ShieldCheck, Truck, Crown, Lock } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    // ... (rest of the component)

    // Scroll down to the collection banner part


    React.useEffect(() => {
        async function loadProducts() {
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        }
        loadProducts();
    }, []);

    const bestSellers = products.filter(p => p.category === 'homme').slice(0, 4);
    const exclusivePacks = products.filter(p => p.category === 'pack').slice(0, 4);
    const bestSellersFemme = products.filter(p => p.category === 'femme').slice(0, 4);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="animate-pulse text-black font-serif text-2xl tracking-widest">
                    Pure Perfumes...
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/assets/hero.jpg"
                        alt="Luxury background"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative text-center text-white px-4 md:px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-3xl md:text-7xl font-serif mb-4 md:mb-6"
                    >
                        Parfums d'Exception
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-xs md:text-xl tracking-widest mb-8 md:mb-10 uppercase font-light"
                    >
                        Parfums de caractère & décantés premium.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <Link
                            href="/collections/all"
                            className="inline-block px-8 py-3 md:px-10 md:py-4 border border-white text-xs md:text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Voir Nos Parfums
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Marquee */}
            <div className="bg-black py-4 overflow-hidden border-y border-white/20">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="text-white text-[10px] font-bold tracking-[0.4em] mx-8 uppercase">
                            Qualité Garantie Toujours
                        </span>
                    ))}
                </div>
            </div>

            {/* Best Sellers Homme */}
            <section className="py-16 md:py-24 px-4 md:px-6 lg:px-24">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-[9px] md:text-[10px] text-gray-500 tracking-[0.3em] uppercase block mb-2">Nos décantés les plus appréciés par les hommes.</span>
                    <h2 className="text-2xl md:text-4xl font-serif italic font-bold uppercase tracking-tight">Best Sellers Homme</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {bestSellers.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 md:mt-12 text-center">
                    <Link href="/collections/homme" className="inline-block px-8 py-3 bg-black text-white text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Voir Tous
                    </Link>
                </div>
            </section>

            {/* Collection Categories Banner */}
            <section className="grid grid-cols-1 md:grid-cols-3">
                {[
                    { title: "PARFUMS HOMMES", img: "/assets/hommes.jpg", href: "/collections/homme" },
                    { title: "PARFUMS FEMMES", img: "/assets/femmes2.jpg", href: "/collections/femme" },
                    { title: "PACK", img: "/assets/pak.jpg", href: "/collections/complet" }
                ].map((item, idx) => (
                    <Link href={item.href} key={idx} className="relative h-[300px] md:h-[600px] overflow-hidden group cursor-pointer block">
                        <img
                            src={item.img}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt={item.title}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="px-6 py-2 md:px-8 md:py-3 border border-white text-white text-xs md:text-sm tracking-widest uppercase backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all">
                                {item.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Best Sellers Femme */}
            <section className="py-16 md:py-24 px-4 md:px-6 lg:px-24 bg-white">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-[9px] md:text-[10px] text-gray-500 tracking-[0.3em] uppercase block mb-2">Nos décantés les plus appréciés par les femmes.</span>
                    <h2 className="text-2xl md:text-4xl font-serif italic font-bold uppercase tracking-tight">Best Sellers Femme</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {bestSellersFemme.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 md:mt-12 text-center">
                    <Link href="/collections/femme" className="inline-block px-8 py-3 bg-black text-white text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Voir Tous
                    </Link>
                </div>
            </section>



            {/* Brands Section */}
            <section className="relative z-10 py-10 md:py-16 border-t border-gray-100 overflow-hidden bg-white">
                <InfiniteSlider gap={20} duration={30} className="w-full">
                    {['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg', '7.svg'].map((logo, i) => (
                        <img
                            key={i}
                            src={`/assets/brands-logo/${logo}`}
                            alt={`Brand ${i + 1}`}
                            className="h-6 md:h-10 w-auto grayscale opacity-40 hover:opacity-100 transition-all duration-300"
                        />
                    ))}
                </InfiniteSlider>
            </section>

            {/* Features / Why Choose Us Section - Styled like Product Page */}
            <section className="py-12 md:py-20 bg-black text-white">
                <div className="container mx-auto px-6 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Qualité Premium</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
                                    Ingrédients de haute qualité
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Livraison</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
                                    Express 24/48h partout au Maroc
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Premium</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
                                    Une sélection de niche exclusive
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="bg-white/10 p-3 rounded-lg">
                                <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-1">Sécurité</h3>
                                <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
                                    Paiement sécurisé à la livraison
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-6 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
                        <div className="flex justify-center mb-4">
                            <div className="border border-black/10 py-1 px-4 rounded-full text-xs font-medium uppercase tracking-widest text-gray-500">Avis Clients</div>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-center mb-6">
                            Ce qu'ils disent de nous
                        </h2>
                        <p className="text-center text-gray-600 leading-relaxed">
                            Découvrez les expériences de nos clients passionnés de parfums.
                        </p>
                    </div>

                    <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                        <TestimonialsColumn
                            testimonials={[
                                {
                                    text: "Une découverte incroyable. Les décantés sont parfaits pour tester avant d'acheter le grand format. La livraison à Casablanca était super rapide.",
                                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
                                    name: "Sarah Benali",
                                    role: "Casablanca",
                                },
                                {
                                    text: "Qualité exceptionnelle garantie. J'ai commandé le pack découverte homme et je suis bluffé par la présentation et le soin apporté au colis.",
                                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
                                    name: "Karim Idrissi",
                                    role: "Rabat",
                                },
                                {
                                    text: "Service client au top ! Ils m'ont conseillé un parfum selon mes goûts et c'était exactement ce que je cherchais. Je recommande vivement.",
                                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
                                    name: "Leila Tazi",
                                    role: "Marrakech",
                                }
                            ]}
                            duration={15}
                        />
                        <TestimonialsColumn
                            testimonials={[
                                {
                                    text: "Enfin un site fiable pour les parfums de niche au Maroc. Les prix sont corrects et la qualité est au rendez-vous. Merci AG Fragrance !",
                                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
                                    name: "Omar Kabbaj",
                                    role: "Tanger",
                                },
                                {
                                    text: "J'adore le concept des packs coffrets. C'est idéal pour offrir. Ma femme a adoré le coffret sélection femme. À très bientôt pour une autre commande.",
                                    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
                                    name: "Youssef El Amrani",
                                    role: "Agadir",
                                },
                                {
                                    text: "Navigation fluide, commande simple, et réception en 48h. Rien à dire, c'est pro. Les parfums sentent divinement bon.",
                                    image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=150",
                                    name: "Noura Chraibi",
                                    role: "Fès",
                                }
                            ]}
                            className="hidden md:block"
                            duration={19}
                        />
                        <TestimonialsColumn
                            testimonials={[
                                {
                                    text: "Je suis un collectionneur et je trouve ici des pépites qu'on ne voit pas ailleurs. L'emballage protège parfaitement les bouteilles.",
                                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
                                    name: "Mehdi Berrada",
                                    role: "Casablanca",
                                },
                                {
                                    text: "Une expérience de luxe du début à la fin. Le site est beau, le service est impeccable. C'est ma nouvelle référence parfum.",
                                    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
                                    name: "Sofia Alami",
                                    role: "Rabat",
                                },
                                {
                                    text: "Les descriptions des notes olfactives sont très précises, ça aide vraiment à choisir sans sentir. Pas déçu de mon achat !",
                                    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
                                    name: "Amine Zahidi",
                                    role: "Meknès",
                                }
                            ]}
                            className="hidden lg:block"
                            duration={17}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
