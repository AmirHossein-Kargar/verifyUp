'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar({ isOpen = true }) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'داشبورد',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                </svg>
            )
        },
        {
            name: 'سفارشات من',
            href: '/dashboard/orders',
            icon: (
                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                </svg>
            ),
            badge: '2'
        },
        {
            name: 'خدمات',
            href: '/dashboard/services',
            icon: (
                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                </svg>
            )
        },
        {
            name: 'پروفایل',
            href: '/dashboard/profile',
            icon: (
                <svg className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            )
        },
    ];

    return (
        <aside
            id="dashboard-sidebar"
            className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform duration-300 -translate-x-full sm:translate-x-0 ${!isOpen ? 'sm:translate-x-full' : ''
                }`}
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-s border-gray-200 dark:border-gray-700">
                <Link href="/" className="flex items-center pe-2.5 mb-5">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center me-3">
                        <span className="text-white font-bold text-lg">و</span>
                    </div>
                    <span className="self-center text-lg text-gray-900 dark:text-white font-semibold whitespace-nowrap">VerifyUp</span>
                </Link>
                <ul className="space-y-2 font-medium">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-2 py-1.5 rounded-lg group ${isActive
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                                    {item.badge && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 ms-2 text-xs font-medium text-white bg-indigo-600 rounded-full">
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
    );
}
