"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [secretKey, setSecretKey] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (secretKey === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
            sessionStorage.setItem('admin_authenticated', 'true');
            router.push('/admin');
        } else {
            setError('Clé secrète invalide');
            setSecretKey('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Admin Access</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-widest">Pure Perfumes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="secretKey" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Clé Secrète
                            </label>
                            <input
                                id="secretKey"
                                type="password"
                                value={secretKey}
                                onChange={(e) => {
                                    setSecretKey(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="Entrez la clé secrète"
                                autoFocus
                            />
                            {error && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 text-xs text-red-600 font-medium">
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <button type="submit"
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-black/20 active:scale-[0.98]">
                            Accéder au Dashboard
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <a href="/" className="text-xs text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
                            ← Retour au site
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
