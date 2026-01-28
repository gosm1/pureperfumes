"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const href = product.category === 'pack' ? `/pack/${product.id}` : `/product/${product.id}`;

  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden aspect-square bg-white border border-gray-100 mb-4">
        {product.tag && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 z-10 font-bold">
            {product.tag}
          </div>
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="text-center px-2">
        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">{product.brand}</p>
        <h3 className="text-xs md:text-sm font-medium mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors">{product.name}</h3>
        <p className="text-[10px] md:text-xs text-gray-500 mb-2">A partir de {product.price.toFixed(2)} dh</p>
        <div className="flex justify-center items-center space-x-2">
          <span className="text-xs md:text-sm font-bold text-black">{product.price.toFixed(2)} dh</span>
          {product.originalPrice && (
            <span className="text-[9px] md:text-[10px] text-gray-400 line-through">{product.originalPrice.toFixed(2)} dh</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
