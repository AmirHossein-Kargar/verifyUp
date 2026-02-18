'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { formatTooman } from '@/utils/currency';

const STATUS_BADGE_CLASSES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال انجام / بررسی',
    pending: 'در انتظار دریافت مدارک',
    cancelled: 'لغو شده',
};

const STATUS_MAP = {
    pending_docs: 'pending',
    in_review: 'active',
    needs_resubmit: 'active',
    approved: 'completed',
    completed: 'completed',
    rejected: 'cancelled',
};

export default function DashboardClient({ user }) {
    const { orders, loading: ordersLoading } = useOrders();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const latestOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        return [...orders]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);
    }, [orders]);

    if (ordersLoading || !mounted) {
        return (
            <div className="w-full space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6" data-testid="dashboard-content">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl" data-testid="dashboard-welcome">
                        خوش آمدید، {user?.name || 'کاربر'}
                    </h1>
                    <p className="mt-1 text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
                        وضعیت کلی سفارشات و فعالیت‌های خود را در این پنل مدیریت کنید.
                    </p>
                </div>
            </div>

            {/* Latest orders */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-base md:text-lg font-semibold leading-snug text-gray-900 dark:text-white">
                        آخرین سفارشات
                    </h2>
                    <Link
                        href="/dashboard/orders"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 ease-out"
                    >
                        مشاهده همه
                    </Link>
                </div>

                {latestOrders.length === 0 ? (
                    <div className="px-4 py-8 md:py-12 text-center">
                        <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed mb-3 md:mb-4">
                            هنوز سفارشی ثبت نشده است
                        </p>
                        <Link
                            href="/services"
                            className="inline-flex items-center px-3 md:px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 ease-out"
                        >
                            سفارش جدید
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm font-normal text-right text-gray-500 dark:text-gray-400 leading-relaxed">
                            <thead className="text-xs font-medium text-gray-700 uppercase tracking-wide bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                                        شناسه
                                    </th>
                                    <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                                        تاریخ
                                    </th>
                                    <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                                        وضعیت
                                    </th>
                                    <th scope="col" className="px-3 md:px-4 py-2 md:py-3">
                                        مبلغ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestOrders.map((order) => {
                                    const statusKey = STATUS_MAP[order.status] || 'pending';
                                    const badgeClass = STATUS_BADGE_CLASSES[statusKey] || STATUS_BADGE_CLASSES.pending;
                                    const statusText = STATUS_TEXT[statusKey] || STATUS_TEXT.pending;
                                    const createdAt = order.createdAt ? new Date(order.createdAt) : null;
                                    const dateText = createdAt
                                        ? createdAt.toLocaleDateString('fa-IR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        })
                                        : '-';

                                    return (
                                        <tr
                                            key={order._id}
                                            className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors duration-200 ease-out"
                                        >
                                            <td className="px-3 md:px-4 py-2 md:py-3 font-medium text-gray-900 dark:text-white">
                                                {order._id?.slice(-8) || '-'}
                                            </td>
                                            <td className="px-3 md:px-4 py-2 md:py-3">
                                                {dateText}
                                            </td>
                                            <td className="px-3 md:px-4 py-2 md:py-3">
                                                <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className="px-3 md:px-4 py-2 md:py-3 font-medium">
                                                {formatTooman(order.priceToman || 0)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
