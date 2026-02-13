'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
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
    const { getCartCount } = useCart();
    const { orders, loading: ordersLoading } = useOrders();

    const counts = useMemo(() => {
        let awaitingDocs = 0;
        let inReview = 0;
        let completed = 0;

        for (const o of orders) {
            if (!o?.status) continue;

            if (o.status === 'pending_docs' || o.status === 'needs_resubmit') {
                awaitingDocs++;
            }

            if (o.status === 'in_review') {
                inReview++;
            }

            if (o.status === 'approved' || o.status === 'completed') {
                completed++;
            }
        }

        const active = awaitingDocs + inReview;

        return { awaitingDocs, inReview, completed, active };
    }, [orders]);

    const stats = useMemo(
        () => [
            {
                title: 'در انتظار دریافت مدارک / اقدام شما',
                value: counts.awaitingDocs,
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                ),
                color: 'text-yellow-600 dark:text-yellow-400',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            },
            {
                title: 'در حال بررسی توسط پشتیبانی',
                value: counts.inReview,
                icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-5.293-3.707a1 1 0 00-1.414 0L9 8.586 8.707 8.293a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                ),
                color: 'text-blue-600 dark:text-blue-400',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
                title: 'سفارشات تایید / تکمیل شده',
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
                color: 'text-indigo-600 dark:text-indigo-400',
                bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            },
        ],
        [counts]
    );

    const quickActions = useMemo(
        () => [
            { title: 'خدمات', href: '/services' },
            { title: 'سبد خرید', href: '/cart', badge: getCartCount() },
            { title: 'سفارشات من', href: '/dashboard/orders', badge: null },
            { title: 'پروفایل', href: '/dashboard/profile', badge: null },
        ],
        [getCartCount]
    );

    const latestOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        return [...orders]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);
    }, [orders]);

    if (ordersLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        خوش آمدید، {user?.name || 'کاربر'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        وضعیت کلی سفارشات و فعالیت‌های خود را در این پنل مدیریت کنید.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {stat.title}
                                </p>
                                <p className={`text-2xl font-semibold ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} ${stat.color}`}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                {/* Latest orders table */}
                <div className="xl:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                آخرین سفارشات
                            </h2>
                            <Link
                                href="/dashboard/orders"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                مشاهده همه
                            </Link>
                        </div>

                        {latestOrders.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                هنوز سفارشی ثبت نشده است.
                            </div>
                        ) : (
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                        <tr>
                                            <th scope="col" className="px-4 py-3">
                                                شناسه سفارش
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                تاریخ
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                وضعیت
                                            </th>
                                            <th scope="col" className="px-4 py-3">
                                                مبلغ
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestOrders.map((order) => {
                                            const statusKey = STATUS_MAP[order.status] || 'pending';
                                            const badgeClass =
                                                STATUS_BADGE_CLASSES[statusKey] ||
                                                STATUS_BADGE_CLASSES.pending;
                                            const statusText =
                                                STATUS_TEXT[statusKey] || STATUS_TEXT.pending;
                                            const createdAt = order.createdAt
                                                ? new Date(order.createdAt)
                                                : null;
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
                                                    className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                                                >
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                        {order._id?.slice(-8) || '-'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {dateText}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={[
                                                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                                badgeClass,
                                                            ].join(' ')}
                                                        >
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
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

                {/* Quick actions card */}
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            دسترسی سریع
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((a) => (
                                <Link
                                    key={a.href}
                                    href={a.href}
                                    className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2 py-3 text-xs font-medium text-gray-900 hover:bg-gray-100 hover:border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                >
                                    <span className="text-center">{a.title}</span>
                                    {typeof a.badge === 'number' && a.badge > 0 && (
                                        <span className="inline-flex items-center justify-center min-w-5 px-1.5 h-5 rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                                            {a.badge > 99 ? '99+' : a.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
