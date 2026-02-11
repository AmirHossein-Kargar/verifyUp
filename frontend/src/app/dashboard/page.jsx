'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLocalOrders } from '@/hooks/useLocalOrders';

export default function DashboardPage() {
    const { user, loading, showSkeleton } = useRequireAuth();
    const { getCartCount } = useCart();
    const orders = useLocalOrders();

    const counts = useMemo(() => {
        let completed = 0;
        let active = 0;
        for (const o of orders) {
            if (o?.status === 'completed') completed++;
            else if (o?.status === 'active') active++;
        }
        return { completed, active };
    }, [orders]);

    const stats = useMemo(
        () => [
            {
                title: 'در انتظار بررسی',
                value: getCartCount(),
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                ),
                color: 'text-orange-600 dark:text-orange-400',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            },
            {
                title: 'سفارشات تکمیل شده',
                value: counts.completed,
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
                color: 'text-green-600 dark:text-green-400',
                bgColor: 'bg-green-50 dark:bg-green-900/20',
            },
            {
                title: 'سفارشات فعال',
                value: counts.active,
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
                color: 'text-blue-600 dark:text-blue-400',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            },
        ],
        [counts, getCartCount]
    );

    const quickActions = useMemo(
        () => [
            { title: 'خدمات', href: '/services' },
            { title: 'سبد خرید', href: '/cart' },
            { title: 'سفارشات من', href: '/dashboard/orders' },
            { title: 'پروفایل', href: '/dashboard/profile' },
        ],
        []
    );

    if (loading || showSkeleton) return <DashboardSkeleton sidebarOpen={false} />;
    if (!user) return null;

    return (
        <div dir="rtl">
            <DashboardNavbar user={user} />
            <DashboardSidebar />

            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <div className="w-full">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            خوش آمدید، {user?.name || 'کاربر'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">به داشبورد کاربری خود خوش آمدید</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                    </div>
                                    <div className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.color}`}>{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">دسترسی سریع</h3>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((a) => (
                                <Link
                                    key={a.href}
                                    href={a.href}
                                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-sm font-medium text-gray-900 dark:text-white text-center">{a.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
