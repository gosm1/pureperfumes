"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Truck, CheckCircle, ChevronLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Checkout() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isOrdered, setIsOrdered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        otherCity: '',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Save order to Supabase
            const { error } = await supabase.from('orders').insert([{
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone: formData.phone,
                city: formData.city === 'autre' ? formData.otherCity : formData.city,
                other_city: formData.city === 'autre' ? formData.otherCity : null,
                address: formData.address,
                cart_items: cart,
                total_price: totalPrice,
                status: 'pending'
            }]);

            if (error) {
                console.error('Erreur lors de la sauvegarde de la commande:', error);
                alert('Erreur lors de la création de la commande. Veuillez réessayer.');
                setIsSubmitting(false);
                return;
            }

            // Order saved successfully

            // Send Telegram Notification
            try {
                await fetch('/api/telegram/notify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        phone: formData.phone,
                        city: formData.city,
                        otherCity: formData.otherCity,
                        address: formData.address,
                        cartItems: cart,
                        totalPrice: totalPrice
                    })
                });
            } catch (err) {
                console.error('Failed to send telegram notification:', err);
                // Don't block the UI for this
            }

            setIsOrdered(true);
            clearCart();
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur lors de la création de la commande. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0 && !isOrdered) {
        return (
            <div className="pt-40 pb-24 px-6 text-center">
                <h2 className="text-2xl font-serif mb-6">Votre panier est vide</h2>
                <Link href="/" className="inline-block px-8 py-3 bg-black text-white text-xs uppercase tracking-widest">
                    Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 lg:px-24 bg-[#fafafa] min-h-screen">
            <AnimatePresence>
                {isOrdered ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto mt-20 p-12 bg-white text-center shadow-2xl rounded-sm"
                    >
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-serif mb-4">Merci pour votre commande !</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Votre commande a été reçue avec succès. Nous vous contacterons par téléphone sous peu pour confirmer l'expédition.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-bold"
                        >
                            Retour à la boutique
                        </button>
                    </motion.div>
                ) : (
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-7">
                            <Link href="/" className="flex items-center text-gray-400 text-xs uppercase tracking-widest mb-8 hover:text-black transition-colors">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Retour
                            </Link>

                            <h1 className="text-3xl font-serif mb-12 uppercase tracking-tighter">Informations de Livraison</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Prénom</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                                            placeholder="Jean"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nom</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                                            placeholder="Dupont"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Téléphone (WhatsApp de préférence)</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm font-mono"
                                        placeholder="06 00 00 00 00"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ville</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="">Sélectionnez votre ville</option>
                                        <option value="casablanca">Casablanca</option>
                                        <option value="rabat">Rabat</option>
                                        <option value="marrakech">Marrakech</option>
                                        <option value="tanger">Tanger</option>
                                        <option value="agadir">Agadir</option>
                                        <option value="fes">Fès</option>
                                        <option value="meknes">Meknès</option>
                                        <option value="oujda">Oujda</option>
                                        <option value="kenitra">Kénitra</option>
                                        <option value="tetouan">Tétouan</option>
                                        <option value="sale">Salé</option>
                                        <option value="mohammedia">Mohammedia</option>
                                        <option value="temara">Témara</option>
                                        <option value="autre">Autre...</option>
                                    </select>
                                    {formData.city === 'autre' && (
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm mt-2 animate-in fade-in slide-in-from-top-2"
                                            placeholder="Précisez votre ville"
                                            value={formData.otherCity}
                                            onChange={e => setFormData({ ...formData, otherCity: e.target.value })}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Adresse Complète</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-black outline-none transition-colors text-sm"
                                        placeholder="Numéro de rue, quartier..."
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="p-6 bg-gray-50 border border-gray-200 space-y-4">
                                    <div className="flex items-center space-x-3 text-black">
                                        <CreditCard className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Paiement à la livraison</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Le paiement s'effectue en espèces directement auprès du livreur au moment de la réception de votre colis.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Traitement...' : `Confirmer ma commande - ${totalPrice.toFixed(2)} dh`}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary Column */}
                        <div className="lg:col-span-5">
                            <div className="bg-white p-8 sticky top-32 border border-gray-200 shadow-lg">
                                <h2 className="text-xl font-serif mb-8 uppercase tracking-tighter">Votre Commande</h2>

                                <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2 mb-8 border-b border-gray-100 pb-8">
                                    {cart.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex gap-4">
                                            <div className="w-20 h-24 bg-gray-50 flex-shrink-0 border border-gray-200 overflow-hidden rounded-sm">
                                                <img
                                                    src={item.images?.[0] || '/placeholder.png'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1">{item.name}</h4>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.brand}</p>

                                                {item.customization && (
                                                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1 text-[10px] text-gray-600">
                                                        {item.customization.ringSize && (
                                                            <div>✦ Taille: {item.customization.ringSize}</div>
                                                        )}
                                                        {item.customization.perfumeType && (
                                                            <div>
                                                                ✦ Parfum: {item.customization.perfumeType === 'other'
                                                                    ? item.customization.customPerfumeName
                                                                    : item.customization.perfumeType}
                                                            </div>
                                                        )}
                                                        {item.customization.loveLetterEnabled && (
                                                            <div>💌 Pour: {item.customization.loveLetterRecipientName}</div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-[10px] font-medium text-gray-500">Qté: {item.quantity}</span>
                                                    <span className="text-xs font-bold">{(item.price * item.quantity).toFixed(2)} dh</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Sous-total</span>
                                        <span className="font-medium">{totalPrice.toFixed(2)} dh</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Livraison</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-green-600 font-bold uppercase text-[10px]">Gratuite</span>
                                            <span className="text-[8px] text-gray-400 uppercase tracking-widest">Promotionnelle</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-6 border-t border-gray-200">
                                        <span className="font-serif italic">Total à payer</span>
                                        <span className="text-black">{totalPrice.toFixed(2)} dh</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center space-x-3 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                                    <Truck className="w-4 h-4" />
                                    <span>Expédié sous 24h/48h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
