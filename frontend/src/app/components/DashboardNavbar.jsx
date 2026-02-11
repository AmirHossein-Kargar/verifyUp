'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardNavbar({ user }) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await api.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const toggleSidebar = () => {
        const sidebar = document.getElementById('dashboard-sidebar');
        sidebar?.classList.toggle('translate-x-full');
    };

    return (
        <nav className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pr-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button
                            onClick={toggleSidebar}
                            type="button"
                            className="sm:hidden text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg text-sm p-2 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                            </svg>
                        </button>
                        <a href="/" className="flex ms-2 md:me-24">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center me-3">
                                <span className="text-white font-bold text-lg">و</span>
                            </div>
                            <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">VerifyUp</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3" ref={dropdownRef}>
                            <div>
                                <button
                                    type="button"
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>
                            </div>
                            {dropdownOpen && (
                                <div className="absolute left-0 top-12 z-50 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg w-44">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 text-center">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user?.name || user?.email || user?.phone || 'کاربر'}
                                        </p>
                                    </div>
                                    <ul className="p-2 text-sm text-gray-700 dark:text-gray-200 font-medium">
                                        <li>
                                            <a href="/dashboard" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                                داشبورد
                                            </a>
                                        </li>
                                        <li>
                                            <a href="/dashboard/profile" className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                                تنظیمات
                                            </a>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="inline-flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-right"
                                            >
                                                خروج
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
