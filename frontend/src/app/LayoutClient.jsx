'use client';

import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LayoutClient({ children }) {
    const pathname = usePathname();
    const { isLoggingOut } = useAuth();
    const hideFooter = pathname === '/cart';
    const isDashboardLike = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

    // Debug log
    if (typeof window !== 'undefined') {
        console.log('LayoutClient - pathname:', pathname, 'isDashboardLike:', isDashboardLike);
    }

    return (
        <CartProvider>
            {/* Header - hide on dashboard and admin pages */}
            {!isDashboardLike && <Header />}

            {/* Main Content with padding for fixed header */}
            <main className={isDashboardLike ? '' : 'pt-24'}>
                {children}
            </main>

            {/* Footer - hide on cart, dashboard, admin, and during logout */}
            {!hideFooter && !isDashboardLike && !isLoggingOut && <Footer />}
        </CartProvider>
    );
}
