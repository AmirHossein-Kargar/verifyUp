'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
    const [extensions, setExtensions] = useState([]);
    const [bottomNavs, setBottomNavs] = useState([]);

    useEffect(() => {
        // Check for bottom navigation elements
        const checkBottomNavs = () => {
            // Find all fixed bottom elements
            const fixedBottoms = document.querySelectorAll('.fixed');
            const bottomNavs = Array.from(fixedBottoms).filter(el => {
                const style = window.getComputedStyle(el);
                return style.bottom !== 'auto' && style.bottom !== '';
            });

            const found = bottomNavs.map(nav => {
                const isOurs = nav.className.includes('bg-white') || nav.className.includes('dark:bg-gray-800');
                return {
                    classes: nav.className,
                    isOurs: isOurs,
                    html: nav.outerHTML.substring(0, 300),
                    computedBottom: window.getComputedStyle(nav).bottom
                };
            });
            setBottomNavs(found);
        };

        // Run after a delay to let everything load
        setTimeout(checkBottomNavs, 1000);

        // Also check for browser extensions
        const checkExtensions = () => {
            const scripts = Array.from(document.querySelectorAll('script')).filter(s =>
                s.src && !s.src.includes('localhost') && !s.src.includes('127.0.0.1')
            );
            setExtensions(scripts.map(s => s.src));
        };

        setTimeout(checkExtensions, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 pb-24">
            <div className="max-w-4xl mx-auto" dir="rtl">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    صفحه تشخیص مشکل
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        راهنمای تشخیص
                    </h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p>1. اگر bottom navigation با کلاس‌های زیر را می‌بینید، از افزونه مرورگر است:</p>
                        <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">
                            bg-neutral-primary-soft, tooltip, rounded-full
                        </code>

                        <p>2. bottom navigation ما باید این کلاس‌ها را داشته باشد:</p>
                        <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">
                            bg-white dark:bg-gray-800 border-t
                        </code>

                        <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-4">
                            برای حل مشکل:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>تمام افزونه‌های مرورگر را غیرفعال کنید</li>
                            <li>صفحه را در حالت ناشناس (Incognito) باز کنید</li>
                            <li>یا از مرورگر دیگری استفاده کنید</li>
                        </ul>
                    </div>
                </div>

                {extensions.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-6 border border-yellow-200 dark:border-yellow-800">
                        <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200 mb-4">
                            ⚠️ اسکریپت‌های خارجی یافت شد!
                        </h2>
                        <p className="text-yellow-800 dark:text-yellow-300 mb-3">
                            {extensions.length} اسکریپت خارجی در صفحه شما یافت شد. این‌ها احتمالاً از افزونه‌های مرورگر هستند:
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {extensions.map((ext, i) => (
                                <code key={i} className="block bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded text-xs">
                                    {ext}
                                </code>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        المان‌های Bottom Navigation یافت شده:
                    </h2>
                    {bottomNavs.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">در حال بررسی...</p>
                    ) : (
                        <div className="space-y-4">
                            {bottomNavs.map((nav, index) => (
                                <div key={index} className={`border rounded p-4 ${nav.isOurs
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-sm font-bold ${nav.isOurs ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                            }`}>
                                            {nav.isOurs ? '✅ Bottom Nav ما' : '❌ Bottom Nav خارجی (از افزونه)'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                        موقعیت: {nav.computedBottom}
                                    </p>
                                    <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto">
                                        {nav.classes}
                                    </code>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Our actual bottom nav */}
            <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid h-16 grid-cols-4 gap-2">
                            <div className="inline-flex flex-col items-center justify-center py-2 text-indigo-600 dark:text-indigo-400">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                                </svg>
                                <span className="text-xs mt-1">داشبورد</span>
                            </div>
                            <div className="inline-flex flex-col items-center justify-center py-2 text-gray-500 dark:text-gray-400">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z" />
                                </svg>
                                <span className="text-xs mt-1">سفارشات</span>
                            </div>
                            <div className="inline-flex flex-col items-center justify-center py-2 text-gray-500 dark:text-gray-400">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                                </svg>
                                <span className="text-xs mt-1">خدمات</span>
                            </div>
                            <div className="inline-flex flex-col items-center justify-center py-2 text-gray-500 dark:text-gray-400">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <span className="text-xs mt-1">پروفایل</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
