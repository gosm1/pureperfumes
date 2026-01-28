import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Removed Playfair_Display
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://pureperfumes.vercel.app'),
    title: {
        template: '%s | Pure Perfumes',
        default: 'Pure Perfumes | Votre Destination Parfum au Maroc',
    },
    description: 'Découvrez notre collection exclusive de parfums de luxe, décants et coffrets cadeaux à Casablanca et partout au Maroc. Parfums de qualité et rares.',
    keywords: ['parfum maroc', 'parfumerie casablanca', 'parfum luxe', 'décant parfum', 'achat parfum ligne', 'pure perfumes'],
    authors: [{ name: 'Pure Perfumes' }],
    creator: 'Pure Perfumes',
    publisher: 'Pure Perfumes',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        title: 'Pure Perfumes | L\'Excellence du Parfum au Maroc',
        description: 'Parfums de niche, collections exclusives et coffrets de luxe. Livraison partout au Maroc.',
        url: 'https://pureperfumes.vercel.app/',
        siteName: 'Pure Perfumes',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Pure Perfumes Collection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pure Perfumes',
        description: 'Votre destination parfum de luxe au Maroc.',
        images: ['/twitter-image.jpg'],
    },
    other: {
        'geo.region': 'MA-06', // Casablanca-Settat
        'geo.placename': 'Casablanca',
        'geo.position': '33.5731; -7.5898', // Approximate Casablanca coord
        'ICBM': '33.5731, -7.5898',
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Pure Perfumes",
    "image": "https://pureperfumes.vercel.app/logo.png",
    "description": "Boutique de parfums de luxe et décants de qualité au Maroc.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Centre Ville",
        "addressLocality": "Casablanca",
        "addressRegion": "Casablanca-Settat",
        "postalCode": "20000",
        "addressCountry": "MA"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.5731,
        "longitude": -7.5898
    },
    "url": "https://pureperfumes.vercel.app/",
    "telephone": "+212000000000",
    "priceRange": "$$$"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${outfit.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased">
                <CartProvider>
                    <div className="min-h-screen bg-white text-black selection:bg-amber-100 selection:text-amber-900">
                        <ClientLayout>{children}</ClientLayout>
                    </div>
                </CartProvider>
            </body>
        </html>
    );
}
