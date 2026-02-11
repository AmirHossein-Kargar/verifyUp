'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatTooman } from '@/utils/currency';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useLocalOrders } from '@/hooks/useLocalOrders';

const STATUS_BADGES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال انجام',
    pending: 'در انتظار',
    cancelled: 'لغو شده',
};

export default function OrdersPage() {
    const { user, loading, showSkeleton } = useRequireAuth();
    const orders = useLocalOrders();

    if (loading || showSkeleton) return <DashboardSkeleton sidebarOpen={false} />;
    if (!user) return null;

    return (
        <div dir="rtl">
            <DashboardNavbar user={user} />
            <DashboardSidebar />

            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <div className="w-full">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>

                                <p className="text-gray-600 dark:text-gray-400 mb-4">هنوز سفارشی ثبت نشده است</p>

                                <Link href="/services" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                    سفارش جدید
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const badge = STATUS_BADGES[order.status] || STATUS_BADGES.pending;
                                const text = STATUS_TEXT[order.status] || 'نامشخص';

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {order.logo && (
                                                    <Image
                                                        src={order.logo}
                                                        alt={order.title}
                                                        width={48}
                                                        height={48}
                                                        className="object-contain"
                                                    />
                                                )}

                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{order.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{order.date}</p>

                                                    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${badge}`}>
                                                        {text}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatTooman(order.price)}
                                                </p>

                                                {order.options && (
                                                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                        {order.options.connection && (
                                                            <p>اتصال: {order.options.connection === 'residential' ? 'IP Residential' : 'VPS'}</p>
                                                        )}

                                                        {order.options.simType && (
                                                            <p>
                                                                سیمکارت:{' '}
                                                                {order.options.simType === 'physical'
                                                                    ? 'فیزیکی'
                                                                    : order.options.simType === 'virtual'
                                                                        ? 'مجازی'
                                                                        : 'دارم'}
                                                            </p>
                                                        )}

                                                        {order.options.country && <p>کشور: {order.options.country}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
