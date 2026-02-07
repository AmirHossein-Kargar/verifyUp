'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.getMe();
                setUser(response.data.user);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        try {
            await api.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                داشبورد کاربری
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                خوش آمدید، {user?.email || user?.phone}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            خروج از حساب
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            اطلاعات کاربری
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">ایمیل:</span> {user?.email || 'ندارد'}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">شماره تلفن:</span> {user?.phone || 'ندارد'}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">نقش:</span> {user?.role === 'admin' ? 'مدیر' : 'کاربر'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            سفارشات من
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            شما هنوز سفارشی ثبت نکرده‌اید
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            خدمات
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            برای مشاهده خدمات به صفحه خدمات مراجعه کنید
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
