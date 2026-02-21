'use client';

import { useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { useOrderEvents } from '@/hooks/useOrderEvents';
import { formatTooman } from '@/utils/currency';
import {
    ShoppingBagIcon,
    ClockIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

const STATUS_BADGE_CLASSES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    pending_docs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال انجام / بررسی',
    pending: 'در انتظار بررسی',
    pending_docs: 'در انتظار دریافت مدارک',
    cancelled: 'لغو شده',
};

const STATUS_MAP = {
    placed: 'pending',
    confirmed: 'active',
    processing: 'active',
    in_progress: 'active',
    pending_docs: 'pending_docs',
    in_review: 'active',
    needs_resubmit: 'active',
    approved: 'completed',
    completed: 'completed',
    delivered: 'completed',
    rejected: 'cancelled',
};

export default function DashboardClient({ user }) {
    const { orders, loading: ordersLoading, refetch } = useOrders();
    const [orderUpdates, setOrderUpdates] = useState({});

    const handleOrderUpdate = useCallback((payload) => {
        if (payload?.type !== 'ORDER_STATUS_UPDATED' || !payload?.order) return;
        const order = payload.order;
        setOrderUpdates((prev) => ({ ...prev, [order._id]: order }));
        refetch();
    }, [refetch]);

    useOrderEvents(handleOrderUpdate);

    const orderWithLive = useCallback((order) => {
        const live = orderUpdates[order._id];
        return live ? { ...order, ...live } : order;
    }, [orderUpdates]);

    const stats = useMemo(() => {
        if (!orders || orders.length === 0) {
            return {
                total: 0,
                active: 0,
                completed: 0,
                cancelled: 0,
                totalSpent: 0,
            };
        }

        const liveOrders = orders.map(orderWithLive);

        return {
            total: liveOrders.length,
            active: liveOrders.filter(o => {
                const status = STATUS_MAP[o.status];
                return status === 'active' || status === 'pending' || status === 'pending_docs';
            }).length,
            completed: liveOrders.filter(o => STATUS_MAP[o.status] === 'completed').length,
            cancelled: liveOrders.filter(o => STATUS_MAP[o.status] === 'cancelled').length,
            totalSpent: liveOrders.reduce((sum, o) => sum + (o.priceToman || 0), 0),
        };
    }, [orders, orderWithLive]);

    const latestOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        return [...orders]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 3)
            .map(orderWithLive);
    }, [orders, orderWithLive]);

    if (ordersLoading) {
        return (
            <div className="w-full space-y-4">
                {/* Header Skeleton */}
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </div>
                    ))}
                </div>

                {/* Orders Table Skeleton */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    <div className="p-5 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4" data-testid="dashboard-content">
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total Orders */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">کل سفارشات</span>
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <ShoppingBagIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">تعداد کل سفارشات ثبت شده</p>
                </div>

                {/* Active Orders */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">در حال انجام</span>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.active}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">سفارشات در حال پردازش</p>
                </div>

                {/* Completed Orders */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">تکمیل شده</span>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.completed}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">سفارشات تکمیل شده</p>
                </div>

                {/* Total Spent */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">مجموع هزینه</span>
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <CurrencyDollarIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatTooman(stats.totalSpent)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">کل مبلغ پرداخت شده</p>
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
                        <DocumentTextIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
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
                                    const statusText = STATUS_TEXT[statusKey] || order.status;
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
