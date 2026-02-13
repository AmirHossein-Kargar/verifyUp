'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU_ITEMS = [
    {
        name: 'داشبورد',
        href: '/dashboard',
        match: '/dashboard',
        icon: (
            <svg className="w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
            </svg>
        ),
    },
    {
        name: 'سفارشات من',
        href: '/dashboard/orders',
        match: '/dashboard/orders',
        icon: (
            <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
            </svg>
        ),
        badgeKey: 'ordersCount',
    },
    {
        name: 'خدمات',
        href: '/services',
        match: '/services',
        icon: (
            <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
            </svg>
        ),
        badge: 'Pro',
        badgeType: 'pro',
    },
    {
        name: 'پروفایل',
        href: '/dashboard/profile',
        match: '/dashboard/profile',
        icon: (
            <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ),
    },
];

export default function DashboardSidebar({ ordersCount = 0 }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isItemActive = (item) => {
        // Exact match
        if (pathname === item.match) {
            return true;
        }

        // For dashboard root, only match exact path
        if (item.match === '/dashboard') {
            return pathname === '/dashboard';
        }

        // For other items, check if pathname starts with match + '/'
        return pathname.startsWith(item.match + '/');
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-900 dark:text-white bg-transparent border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg ms-3 mt-3 text-sm p-2 focus:outline-none inline-flex sm:hidden"
            >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                id="dashboard-sidebar"
                className={`fixed top-14 right-0 z-40 w-64 h-[calc(100vh-3.5rem)] transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <ul className="space-y-2 font-medium">
                        {MENU_ITEMS.map((item) => {
                            const active = isItemActive(item);
                            const badgeValue = item.badgeKey === 'ordersCount' ? ordersCount : null;
                            const showBadge = typeof badgeValue === 'number' && badgeValue > 0;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-2 py-1.5 rounded-lg group ${active
                                            ? 'text-indigo-600 dark:text-indigo-400 bg-gray-100 dark:bg-gray-700'
                                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>

                                        {showBadge && (
                                            <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-red-800 bg-red-100 border border-red-300 rounded-full">
                                                {badgeValue > 99 ? '99+' : badgeValue}
                                            </span>
                                        )}

                                        {item.badgeType === 'pro' && (
                                            <span className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs font-medium px-1.5 py-0.5 rounded-sm">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </aside>
        </>
    );
}
