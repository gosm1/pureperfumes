"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { Search, Plus, Edit, Trash2, Save, LogOut, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "@/components/ImageUpload";
import ThemeBuilder from "@/components/admin/ThemeBuilder";

export default function AdminDashboard() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_authenticated');
        if (!isAuth) {
            router.push('/admin-login');
            return;
        }
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            setProducts(data?.map((item: any) => ({
                id: item.id,
                name: item.name,
                brand: item.brand,
                price: Number(item.price),
                originalPrice: item.original_price ? Number(item.original_price) : undefined,
                images: item.images || [],
                tag: item.tag,
                category: item.category,
                description: item.description,
                notes: item.notes || [],
                seasons: item.seasons || { winter: 50, spring: 50, summer: 50, fall: 50 },
                theme: item.theme,
                theme_config: item.theme_config
            })) || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_authenticated');
        router.push('/admin-login');
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsCreating(false);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct({
            id: '',
            name: '',
            brand: 'AGFRAGRANCES',
            price: 0,
            images: [],
            category: 'homme',
            notes: [],
            seasons: { winter: 50, spring: 50, summer: 50, fall: 50 }
        });
        setIsCreating(true);
        setDialogOpen(true);
    };

    const filtered = products.filter(p =>
        p.category !== 'pack' && (
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredPacks = products.filter(p =>
        p.category === 'pack' && (
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-2xl font-serif font-bold">Admin Dashboard</h1>
                        <Badge variant="secondary" className="font-mono text-xs hidden sm:inline-flex">v2.0</Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                        <TabsTrigger value="orders">Commandes</TabsTrigger>
                        <TabsTrigger value="products">Produits</TabsTrigger>
                        <TabsTrigger value="packs">Packs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <OrdersManager />
                    </TabsContent>

                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Catalogue Produits</CardTitle>
                                        <CardDescription>Gérez votre collection de parfums ({filtered.length})</CardDescription>
                                    </div>
                                    <Button onClick={handleCreate}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nouveau Parfum
                                    </Button>
                                </div>
                                <div className="relative max-w-sm mt-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher un parfum..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Image</TableHead>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Marque</TableHead>
                                                <TableHead>Catégorie</TableHead>
                                                <TableHead>Prix</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell>
                                                        <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                                                    </TableCell>
                                                    <TableCell className="font-medium whitespace-nowrap">{product.name}</TableCell>
                                                    <TableCell>{product.brand}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{product.category}</Badge>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">{product.price} DH</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {filtered.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        Aucun produit trouvé
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="packs">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Gestion des Packs</CardTitle>
                                        <CardDescription>Gérez vos pages de packs ({filteredPacks.length})</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        setSelectedProduct({
                                            id: '',
                                            name: '',
                                            brand: 'AGFRAGRANCES',
                                            price: 0,
                                            images: [],
                                            category: 'pack',
                                            theme: '',
                                            description: ''
                                        });
                                        setIsCreating(true);
                                        setDialogOpen(true);
                                    }}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nouveau Pack
                                    </Button>
                                </div>
                                <div className="relative max-w-sm mt-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher un pack..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Image</TableHead>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Thème</TableHead>
                                                <TableHead>Prix</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPacks.map((pack) => (
                                                <TableRow key={pack.id}>
                                                    <TableCell>
                                                        <img src={pack.images[0]} alt={pack.name} className="w-16 h-16 rounded-lg object-cover" />
                                                    </TableCell>
                                                    <TableCell className="font-medium whitespace-nowrap">{pack.name}</TableCell>
                                                    <TableCell>{pack.theme || '-'}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{pack.price} DH</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pack)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {filteredPacks.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        Aucun pack trouvé
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isCreating
                                ? (selectedProduct?.category === 'pack' ? 'Nouveau Pack' : 'Nouveau Parfum')
                                : (selectedProduct?.category === 'pack' ? 'Modifier le Pack' : 'Modifier le Parfum')}
                        </DialogTitle>
                        <DialogDescription>
                            {isCreating ? 'Ajoutez un nouveau parfum à votre collection' : 'Modifiez les détails du parfum'}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <EditForm
                            product={selectedProduct}
                            isNew={isCreating}
                            isPack={selectedProduct.category === 'pack'}
                            onSave={() => {
                                loadProducts();
                                setDialogOpen(false);
                            }}
                            onCancel={() => setDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

import { Order, OrderStatus } from '@/types';
import { Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

function OrdersManager() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
        // Customize real-time subscription here if needed
        const channel = supabase
            .channel('orders-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                loadOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: OrderStatus) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        loadOrders();
    };

    const deleteOrder = async () => {
        if (!orderToDelete) return;
        try {
            await supabase.from('orders').delete().eq('id', orderToDelete.id);
            setOrderToDelete(null);
            loadOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Erreur lors de la suppression de la commande');
        }
    };

    const getStatusBadge = (status: OrderStatus) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            confirmed: "bg-blue-100 text-blue-800 border-blue-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200"
        };
        const labels = {
            pending: "En attente",
            confirmed: "Confirmée",
            shipped: "Expédiée",
            delivered: "Livrée",
            cancelled: "Annulée"
        };
        return <Badge variant="outline" className={styles[status]}>{labels[status]}</Badge>;
    };

    if (loading) return <div className="text-center py-10">Chargement des commandes...</div>;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Commandes</CardTitle>
                    <CardDescription>Gérez les commandes clients en temps réel</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Ville</TableHead>
                                    <TableHead>Articles</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                            <br />
                                            {new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-sm whitespace-nowrap">{order.first_name} {order.last_name}</div>
                                            <div className="text-xs text-muted-foreground whitespace-nowrap">{order.phone}</div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">{order.city === 'autre' ? order.other_city : order.city}</TableCell>
                                        <TableCell>
                                            <div className="text-xs space-y-1 min-w-[150px]">
                                                {order.cart_items.map((item: any, i: number) => (
                                                    <div key={i}>{item.quantity}x {item.name}</div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold whitespace-nowrap">{order.total_price} DH</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    className="text-xs border rounded p-1 bg-white"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                                                >
                                                    <option value="pending">En attente</option>
                                                    <option value="confirmed">Confirmée</option>
                                                    <option value="shipped">Expédiée</option>
                                                    <option value="delivered">Livrée</option>
                                                    <option value="cancelled">Annulée</option>
                                                </select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => setOrderToDelete(order)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la commande ?</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la commande de {orderToDelete?.first_name} {orderToDelete?.last_name} ?<br />
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setOrderToDelete(null)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={deleteOrder}>
                            Supprimer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function EditForm({ product, isNew, isPack, onSave, onCancel }: {
    product: Product;
    isNew: boolean;
    isPack?: boolean;
    onSave: () => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<Product>(product);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(product);
    }, [product]);

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                name: form.name,
                brand: form.brand,
                price: form.price,
                original_price: form.originalPrice,
                images: form.images,
                tag: form.tag,
                category: form.category,
                description: form.description,
                notes: isPack ? null : form.notes,
                seasons: isPack ? null : form.seasons,
                theme: isPack ? form.theme : null,
                theme_config: isPack ? form.theme_config : null
            };

            if (isNew) {
                await supabase.from('products').insert([data]);
            } else {
                await supabase.from('products').update(data).eq('id', form.id);
            }
            onSave();
        } catch (err: any) {
            alert('Erreur: ' + err.message);
        }
        setSaving(false);
    };

    const deleteProduct = async () => {
        if (!confirm('Supprimer ce produit?')) return;
        await supabase.from('products').delete().eq('id', form.id);
        onSave();
    };

    return (
        <form onSubmit={save} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Informations</TabsTrigger>
                    <TabsTrigger value="media">Images {isPack ? '' : '& Notes'}</TabsTrigger>
                    {!isPack && <TabsTrigger value="seasons">Saisons</TabsTrigger>}
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom du parfum</Label>
                            <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marque</Label>
                            <Input id="brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Prix (DH)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={form.price || ''}
                                onChange={e => {
                                    const val = parseFloat(e.target.value);
                                    setForm({ ...form, price: isNaN(val) ? 0 : val });
                                }}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice">Prix Original (optionnel)</Label>
                            <Input
                                id="originalPrice"
                                type="number"
                                step="0.01"
                                value={form.originalPrice || ''}
                                onChange={e => {
                                    const val = parseFloat(e.target.value);
                                    setForm({ ...form, originalPrice: isNaN(val) ? undefined : val });
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <select id="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="homme">Homme</option>
                                <option value="femme">Femme</option>
                                <option value="pack">Pack</option>
                                <option value="coffret">Coffret</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tag">Tag (optionnel)</Label>
                            <Input id="tag" value={form.tag || ''} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="ECONOMISEZ 80.00 DH" />
                        </div>
                    </div>
                    {isPack && (
                        <>
                            <div className="space-y-2 col-span-full border-b pb-4 mb-4">
                                <Label htmlFor="theme">Image de fond Par Défaut (Fallback)</Label>
                                <ImageUpload
                                    images={form.theme ? [form.theme] : []}
                                    onChange={(images) => setForm({ ...form, theme: images[0] || '' })}
                                    maxImages={1}
                                />
                            </div>

                            <div className="col-span-full mt-4">
                                <ThemeBuilder
                                    config={form.theme_config}
                                    onChange={(cfg) => setForm({ ...form, theme_config: cfg })}
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea id="description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} />
                    </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                    <div className="space-y-2">
                        <Label>Images du Parfum</Label>
                        <ImageUpload
                            images={form.images}
                            onChange={(images) => setForm({ ...form, images })}
                            maxImages={5}
                        />
                    </div>
                    {!isPack && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Notes Olfactives</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, notes: [...(form.notes || []), ''] })}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter
                                </Button>
                            </div>
                            {form.notes?.map((note, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input value={note} onChange={e => {
                                        const notes = [...(form.notes || [])];
                                        notes[i] = e.target.value;
                                        setForm({ ...form, notes });
                                    }} />
                                    <Button type="button" variant="destructive" size="icon" onClick={() => setForm({ ...form, notes: form.notes?.filter((_, idx) => idx !== i) })}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {!isPack && (
                    <TabsContent value="seasons" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {[{ k: 'winter', l: 'Hiver ❄️' }, { k: 'spring', l: 'Printemps 🌸' }, { k: 'summer', l: 'Été ☀️' }, { k: 'fall', l: 'Automne 🍂' }].map(s => (
                                <div key={s.k} className="space-y-2">
                                    <Label htmlFor={s.k}>{s.l}</Label>
                                    <Input id={s.k} type="number" min="0" max="100" value={form.seasons?.[s.k as keyof typeof form.seasons] || 50} onChange={e => setForm({ ...form, seasons: { ...form.seasons!, [s.k]: parseInt(e.target.value) } })} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                )}
            </Tabs >

            <div className="flex justify-between pt-4 border-t">
                {!isNew && (
                    <Button type="button" variant="destructive" onClick={deleteProduct}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                    </Button>
                )}
                <div className="flex gap-3 ml-auto">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                </div>
            </div>
        </form >
    );
}
