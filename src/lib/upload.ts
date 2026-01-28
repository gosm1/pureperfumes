import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

export async function checkStorageConfiguration() {
    try {
        console.log('Checking storage configuration...');
        const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);

        if (error) {
            console.error('Bucket check error:', error);
            if (error.message.includes('not found')) {
                return { success: false, message: `Bucket '${BUCKET_NAME}' introuvable. Avez-vous créé le bucket ?` };
            }
            return { success: false, message: `Erreur d'accès au bucket: ${error.message}` };
        }

        if (!data.public) {
            return { success: false, message: `Le bucket '${BUCKET_NAME}' n'est pas public. Veuillez cocher "Public bucket" dans Supabase.` };
        }

        return { success: true, message: 'Configuration du bucket OK !' };
    } catch (err: any) {
        console.error('Storage check failed:', err);
        return { success: false, message: `Erreur inattendue: ${err.message}` };
    }
}

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
        }

        // Get public URL - using getPublicUrl which returns the data object
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        console.log('Generated public URL:', data.publicUrl);
        return data.publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

/**
 * Delete a product image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteProductImage(url: string): Promise<void> {
    try {
        // Extract file path from URL
        const urlParts = url.split(`/${BUCKET_NAME}/`);
        if (urlParts.length < 2) {
            throw new Error('Invalid image URL');
        }
        const filePath = urlParts[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
}

/**
 * Get public URL for a stored image
 * @param path - The storage path of the image
 * @returns The public URL
 */
export function getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);
    return publicUrl;
}
