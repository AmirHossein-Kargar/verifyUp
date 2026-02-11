'use client';

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export default function LayoutClient({ children }) {
    const pathname = usePathname();
    const hideFooter = pathname === '/cart';
    const isDashboardLike = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    return (
        <CartProvider>
            {/* Floating Header - hide on dashboard & admin */}
            {!isDashboardLike && <Header />}
            {/* Main Content with padding for fixed header */}
            <main className={isDashboardLike ? '' : 'pt-24'}>
                {children}
            </main>
            {/* Footer - hide on cart, dashboard and admin */}
            {!hideFooter && !isDashboardLike && <Footer />}
        </CartProvider>
    );
}
