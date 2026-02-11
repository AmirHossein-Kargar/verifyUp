'use client';

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "@/contexts/CartContext";

export default function LayoutClient({ children }) {
    const pathname = usePathname();
    const hideFooter = pathname === '/cart';
    const isDashboard = pathname?.startsWith('/dashboard');

    return (
        <CartProvider>
            {/* Floating Header - hide on dashboard */}
            {!isDashboard && <Header />}
            {/* Main Content with padding for fixed header */}
            <main className={isDashboard ? '' : 'pt-24'}>
                {children}
            </main>
            {/* Footer - hide on cart and dashboard */}
            {!hideFooter && !isDashboard && <Footer />}
        </CartProvider>
    );
}
