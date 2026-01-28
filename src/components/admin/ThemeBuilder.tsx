"use client";

import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '@/types';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/ImageUpload";
// import { Switch } from "@/components/ui/switch"; // Removed as we use custom Toggle

// Fallback for missing Switch component if not present
const Toggle = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) => (
    <div
        onClick={() => onCheckedChange(!checked)}
        className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-black' : 'bg-gray-200'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
);

interface Props {
    config?: ThemeConfig;
    onChange: (config: ThemeConfig) => void;
}

const DEFAULT_CONFIG: ThemeConfig = {
    colors: {
        primary: '#000000',
        secondary: '#ffffff',
        background: '#ffffff',
        text: '#000000',
        accent: '#D4AF37',
        buttonBg: '#000000',
        buttonText: '#ffffff',
        cardBg: '#f9f9f9'
    },
    typography: {
        fontFamily: 'Inter',
        headingSize: 'text-5xl',
        bodySize: 'text-base'
    },
    visuals: {
        overlayOpacity: 0.3,
        buttonShape: 'rounded',
        gradientOverlay: true,
        backgroundImage: ''
    },
    content: {
        ctaText: 'Acheter Maintenant',
        tagline: '',
        features: ['Livraison Gratuite', 'Authenticité Garantie']
    }
};

export default function ThemeBuilder({ config, onChange }: Props) {
    const [theme, setTheme] = useState<ThemeConfig>(() => {
        // Deep merge config with defaults safely
        if (!config) return DEFAULT_CONFIG;

        return {
            colors: { ...DEFAULT_CONFIG.colors, ...(config.colors || {}) },
            typography: { ...DEFAULT_CONFIG.typography, ...(config.typography || {}) },
            visuals: { ...DEFAULT_CONFIG.visuals, ...(config.visuals || {}) },
            content: { ...DEFAULT_CONFIG.content, ...(config.content || {}) }
        };
    });

    useEffect(() => {
        if (!config) {
            // Only reset if completely missing, otherwise assume external updates might be partial
            // But usually parent state is truth
            onChange(DEFAULT_CONFIG);
        } else {
            // Re-merge if props update from outside
            setTheme({
                colors: { ...DEFAULT_CONFIG.colors, ...(config.colors || {}) },
                typography: { ...DEFAULT_CONFIG.typography, ...(config.typography || {}) },
                visuals: { ...DEFAULT_CONFIG.visuals, ...(config.visuals || {}) },
                content: { ...DEFAULT_CONFIG.content, ...(config.content || {}) }
            });
        }
    }, [config]);

    const update = (section: keyof ThemeConfig, key: string, value: any) => {
        const newTheme = {
            ...theme,
            [section]: {
                ...theme[section],
                [key]: value
            }
        };
        setTheme(newTheme);
        onChange(newTheme);
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50/50">
            <h3 className="text-lg font-semibold mb-4">Éditeur de Thème Pack</h3>

            <Tabs defaultValue="visuals" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="visuals">Visuel</TabsTrigger>
                    <TabsTrigger value="colors">Couleurs</TabsTrigger>
                    <TabsTrigger value="typo">Style</TabsTrigger>
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                </TabsList>

                <TabsContent value="visuals" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Image de fond (Héros)</Label>
                        <ImageUpload
                            images={theme.visuals.backgroundImage ? [theme.visuals.backgroundImage] : []}
                            onChange={(imgs) => update('visuals', 'backgroundImage', imgs[0] || '')}
                            maxImages={1}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Opacité du calque noir (0-1)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={theme.visuals.overlayOpacity}
                                onChange={(e) => update('visuals', 'overlayOpacity', parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2 flex flex-col justify-end pb-2">
                            <Label className="mb-2">Dégradé progressif</Label>
                            <Toggle
                                checked={theme.visuals.gradientOverlay}
                                onCheckedChange={(v) => update('visuals', 'gradientOverlay', v)}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { k: 'primary', l: 'Couleur Primaire' },
                            { k: 'secondary', l: 'Couleur Secondaire' },
                            { k: 'background', l: 'Fond de page' },
                            { k: 'text', l: 'Couleur Texte' },
                            { k: 'accent', l: 'Couleur Accent (Or/Rouge)' },
                            { k: 'cardBg', l: 'Fond des Cartes' },
                            { k: 'buttonBg', l: 'Bouton Fond' },
                            { k: 'buttonText', l: 'Bouton Texte' },
                        ].map((c) => (
                            <div key={c.k} className="space-y-1">
                                <Label className="text-xs">{c.l}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-12 h-8 p-0 border-0"
                                        value={theme.colors[c.k as keyof typeof theme.colors] || '#000000'}
                                        onChange={(e) => update('colors', c.k, e.target.value)}
                                    />
                                    <Input
                                        type="text"
                                        className="h-8 text-xs font-mono"
                                        value={theme.colors[c.k as keyof typeof theme.colors]}
                                        onChange={(e) => update('colors', c.k, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="typo" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Police (Google Fonts Name)</Label>
                            <Input
                                placeholder="ex: Playfair Display"
                                value={theme.typography.fontFamily}
                                onChange={(e) => update('typography', 'fontFamily', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Forme Boutons</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={theme.visuals.buttonShape}
                                onChange={(e) => update('visuals', 'buttonShape', e.target.value)}
                            >
                                <option value="rounded">Arrondis (Standard)</option>
                                <option value="pill">Pilule (Ronds)</option>
                                <option value="square">Carrés</option>
                            </select>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Slogan (Tagline)</Label>
                        <Input
                            value={theme.content.tagline || ''}
                            onChange={(e) => update('content', 'tagline', e.target.value)}
                            placeholder="ex: L'amour en flacon"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Texte Bouton Action</Label>
                        <Input
                            value={theme.content.ctaText || 'Acheter'}
                            onChange={(e) => update('content', 'ctaText', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Arguments (Features)</Label>
                            <button
                                type="button"
                                className="text-xs underline"
                                onClick={() => update('content', 'features', [...(theme.content.features || []), 'New Feature'])}
                            >
                                + Ajouter
                            </button>
                        </div>
                        {theme.content.features?.map((f, i) => (
                            <div key={i} className="flex gap-2">
                                <Input
                                    value={f}
                                    onChange={(e) => {
                                        const newF = [...(theme.content.features || [])];
                                        newF[i] = e.target.value;
                                        update('content', 'features', newF);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="text-red-500 font-bold px-2"
                                    onClick={() => {
                                        const newF = theme.content.features?.filter((_, idx) => idx !== i);
                                        update('content', 'features', newF);
                                    }}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
