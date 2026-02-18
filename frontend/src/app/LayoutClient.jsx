'use client';

import dynamic from "next/dynamic";
import { CartProvider } from "@/contexts/CartContext";

// Dynamically import Header and Footer to avoid SSR hydration issues
const Header = dynamic(() => import("./components/Header"), { ssr: false });
const Footer = dynamic(() => import("./components/Footer"), { ssr: false });

export default function LayoutClient({ children }) {
    return (
        <CartProvider>
            {/* Header - always show */}
            <Header />

            {/* Main Content with padding for fixed header */}
            <main className="pt-24">
                {children}
            </main>

            {/* Footer - conditional rendering handled inside Footer component */}
            <Footer />
        </CartProvider>
    );
}
