import { MetadataRoute } from 'next'
import { getProducts } from '@/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await getProducts()

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `https://pureperfumes.vercel.app/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }))

    return [
        {
            url: 'https://pureperfumes.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://pureperfumes.vercel.app/collections/homme',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://pureperfumes.vercel.app/collections/femme',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...productEntries,
    ]
}
