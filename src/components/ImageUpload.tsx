"use client";

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadProductImage, deleteProductImage } from '@/lib/upload';

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length === 0) {
            alert('Veuillez déposer des fichiers image uniquement');
            return;
        }

        if (images.length + files.length > maxImages) {
            alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
            return;
        }

        await uploadFiles(files);
    }, [images.length, maxImages]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter(file =>
            file.type.startsWith('image/')
        );

        if (files.length === 0) return;

        if (images.length + files.length > maxImages) {
            alert(`Vous ne pouvez télécharger que ${maxImages} images maximum`);
            return;
        }

        await uploadFiles(files);
        e.target.value = '';
    }, [images.length, maxImages]);

    const uploadFiles = async (files: File[]) => {
        setUploading(true);
        try {
            console.log('Uploading files:', files.length);
            const uploadPromises = files.map(file => uploadProductImage(file));
            const urls = await Promise.all(uploadPromises);
            console.log('Uploaded URLs:', urls);
            onChange([...images, ...urls]);
        } catch (error) {
            alert('Erreur lors du téléchargement des images');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (index: number) => {
        const imageUrl = images[index];
        try {
            // Only delete from storage if it's a Supabase URL
            if (imageUrl.includes('supabase')) {
                await deleteProductImage(imageUrl);
            }
            onChange(images.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting image:', error);
            // Still remove from list even if deletion fails
            onChange(images.filter((_, i) => i !== index));
        }
    };

    const runDiagnostics = async () => {
        const { checkStorageConfiguration } = await import('@/lib/upload');
        const result = await checkStorageConfiguration();
        if (!result.success) {
            alert(`⚠️ PROBLÈME DE CONFIGURATION:\n${result.message}`);
        } else {
            alert('✅ Configuration Storage validée !');
        }
    };

    return (
        <div className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading || images.length >= maxImages}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                        {uploading ? 'Téléchargement en cours...' : 'Glissez-déposez des images ici'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        ou cliquez pour sélectionner ({images.length}/{maxImages})
                    </p>
                </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteImage(index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                    Principal
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && !uploading && (
                <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Aucune image téléchargée</p>
                    <Button
                        type="button"
                        variant="link"
                        className="mt-2 text-xs text-amber-600"
                        onClick={runDiagnostics}
                    >
                        Problème d'upload ? Tester la configuration
                    </Button>
                </div>
            )}
        </div>
    );
}
