'use client';

import { CartProvider } from "@/contexts/CartContext";
import { ProfileImageProvider } from "@/contexts/ProfileImageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function LayoutClient({ children }) {
    return (
        <CartProvider>
            <ProfileImageProvider>
                <Header />
                <main className="pt-24">
                    {children}
                </main>
                <Footer />
            </ProfileImageProvider>
        </CartProvider>
    );
}
