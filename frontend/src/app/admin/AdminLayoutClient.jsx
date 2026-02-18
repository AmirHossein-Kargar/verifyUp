'use client';

import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/app/components/BottomNav';

const ADMIN_MENU_ITEMS = [
    {
        name: 'پنل ادمین',
        href: '/admin',
        icon: (
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h7m4 0h7M4 7h4m8 0h4M4 17h10m2 0h4" />
            </svg>
        ),
    },
    {
        name: 'سفارشات',
        href: '/admin/orders',
        icon: (
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
            </svg>
        ),
    },
];

export default function AdminLayoutClient({ children }) {
    const { user } = useAuth();

    return (
        <>
            {children}
            {user && <BottomNav items={ADMIN_MENU_ITEMS} />}
        </>
    );
}
