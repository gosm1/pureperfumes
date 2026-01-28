"use client";

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/constants';
import { Product } from '@/types';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function Collections() {
    const params = useParams();
    const searchParams = useSearchParams();
    const searchQuery = searchParams?.get('search')?.toLowerCase() || "";

    const category = params?.category as string;
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sortBy, setSortBy] = React.useState<'featured' | 'price-asc' | 'price-desc'>('featured');
    const [filterGender, setFilterGender] = React.useState<'all' | 'homme' | 'femme'>('all');
    const [isSortOpen, setIsSortOpen] = React.useState(false);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    React.useEffect(() => {
        async function loadProducts() {
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        }
        loadProducts();
    }, []);

    // Filter by category
    let filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category || (category === 'packs' && p.category === 'pack'));

    // Filter by Gender (Dropdown)
    if (filterGender !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filterGender);
    }

    // Filter by search query
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            (p.brand?.toLowerCase() || "").includes(searchQuery) ||
            (p.description?.toLowerCase() || "").includes(searchQuery)
        );
    }

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    const title = searchQuery ? `Recherche : "${searchQuery}"` : (category === 'packs' ? 'Les Packs' : category === 'homme' ? 'Homme' : category === 'femme' ? 'Femme' : 'Nos Parfums');

    if (loading) {
        return (
            <div className="pt-40 pb-24 px-6 lg:px-24 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 md:px-6 lg:px-24">
            <div className="text-center mb-8 md:mb-16">
                <p className="text-[9px] md:text-[10px] text-gray-500 tracking-widest uppercase mb-2">Accueil / Shop / {category}</p>
                <h1 className="text-2xl md:text-5xl font-serif uppercase tracking-tighter">{title}</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-y border-gray-100 py-4 md:py-6 gap-4">
                <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wide">{sortedProducts.length} produits trouvés</p>

                <div className="flex items-center space-x-4 md:space-x-6">
                    <div className="relative">
                        <button
                            onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                            className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-black hover:opacity-70 transition-opacity"
                        >
                            <span>Trier par</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        {isSortOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl z-20">
                                <button onClick={() => { setSortBy('featured'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${sortBy === 'featured' ? 'font-bold' : ''}`}>Nouveautés</button>
                                <button onClick={() => { setSortBy('price-asc'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${sortBy === 'price-asc' ? 'font-bold' : ''}`}>Prix croissant</button>
                                <button onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${sortBy === 'price-desc' ? 'font-bold' : ''}`}>Prix décroissant</button>
                            </div>
                        )}
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                            className="flex items-center space-x-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-black hover:opacity-70 transition-opacity"
                        >
                            <span>Filtrer</span>
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl z-20">
                                <button onClick={() => { setFilterGender('all'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${filterGender === 'all' ? 'font-bold' : ''}`}>Tout</button>
                                <button onClick={() => { setFilterGender('homme'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${filterGender === 'homme' ? 'font-bold' : ''}`}>Homme</button>
                                <button onClick={() => { setFilterGender('femme'); setIsFilterOpen(false); }} className={`w-full text-left px-4 py-3 text-[10px] md:text-xs uppercase tracking-wider hover:bg-gray-50 ${filterGender === 'femme' ? 'font-bold' : ''}`}>Femme</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {sortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50">
                    <p className="text-gray-500 font-serif text-xl">Aucun produit ne correspond à votre recherche.</p>
                </div>
            )}
        </div>
    );
}
