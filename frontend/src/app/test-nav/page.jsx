'use client';

import Link from 'next/link';

export default function TestNavPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    تست Bottom Navigation
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    این صفحه فقط برای تست bottom navigation هست
                </p>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid h-16 grid-cols-4 gap-2">
                            <Link
                                href="/dashboard"
                                className="relative inline-flex flex-col items-center justify-center py-2 group transition-colors rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                                </svg>
                                <span className="text-xs mt-1">داشبورد</span>
                            </Link>

                            <Link
                                href="/dashboard/orders"
                                className="relative inline-flex flex-col items-center justify-center py-2 group transition-colors rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                                </svg>
                                <span className="text-xs mt-1">سفارشات</span>
                            </Link>

                            <Link
                                href="/services"
                                className="relative inline-flex flex-col items-center justify-center py-2 group transition-colors rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                </svg>
                                <span className="text-xs mt-1">خدمات</span>
                            </Link>

                            <Link
                                href="/dashboard/profile"
                                className="relative inline-flex flex-col items-center justify-center py-2 group transition-colors rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span className="text-xs mt-1">پروفایل</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
