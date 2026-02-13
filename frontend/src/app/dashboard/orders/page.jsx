'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatTooman } from '@/utils/currency';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/useToast';

const STATUS_BADGES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال بررسی',
    pending: 'در انتظار بررسی',
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

// Service configurations
const SERVICE_CONFIG = {
    upwork_verification: {
        title: 'ساخت اکانت اپورک + احراز هویت',
        logo: 'https://cdn.worldvectorlogo.com/logos/upwork-roundedsquare-1.svg',
    },
    account_optimization: {
        title: 'مشاوره بهینه‌سازی اکانت',
        icon: (
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
        ),
    },
    paypal_account: {
        title: 'اکانت پی پال',
        logo: '/paypal.svg',
    },
};

// Passport upload removed - admin manages order status directly

export default function OrdersPage() {
    const { user, loading: authLoading, showSkeleton } = useRequireAuth();
    const { orders, loading: ordersLoading, error, refetch } = useOrders();
    const { showToast } = useToast();

    if (authLoading || showSkeleton || ordersLoading) return <DashboardSkeleton sidebarOpen={false} />;
    if (!user) return null;

    return (
        <div dir="rtl">
            <DashboardNavbar user={user} />
            <DashboardSidebar ordersCount={orders.length} />

            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <div className="w-full">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سفارشات من</h1>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                            خطا در دریافت سفارشات. لطفاً بعداً دوباره تلاش کنید.
                        </div>
                    )}

                    {orders.length === 0 && !error ? (
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
                                const uiStatusKey = STATUS_MAP[order.status] || 'pending';
                                const badge = STATUS_BADGES[uiStatusKey] || STATUS_BADGES.pending;
                                const text = STATUS_TEXT[uiStatusKey] || 'نامشخص';

                                const createdAt = order.createdAt ? new Date(order.createdAt) : null;
                                const dateText = createdAt
                                    ? createdAt.toLocaleDateString('fa-IR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })
                                    : '';

                                // Get service configuration
                                const serviceConfig = SERVICE_CONFIG[order.service] || SERVICE_CONFIG.upwork_verification;

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {serviceConfig.logo ? (
                                                    <Image
                                                        src={serviceConfig.logo}
                                                        alt={serviceConfig.title}
                                                        width={48}
                                                        height={48}
                                                        className="object-contain"
                                                    />
                                                ) : serviceConfig.icon ? (
                                                    <div className="shrink-0">
                                                        {serviceConfig.icon}
                                                    </div>
                                                ) : null}

                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        {serviceConfig.title}
                                                    </h3>
                                                    {dateText && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            تاریخ ثبت: {dateText}
                                                        </p>
                                                    )}

                                                    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${badge}`}>
                                                        {text}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {formatTooman(order.priceToman || 0)}
                                                </p>

                                                {order.adminNote && (
                                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                        یادداشت ادمین: {order.adminNote}
                                                    </p>
                                                )}

                                                {order.docsSummary && (
                                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                        وضعیت مدارک: {order.docsSummary.accepted || 0} تایید شده،{' '}
                                                        {order.docsSummary.resubmit || 0} نیاز به ارسال مجدد
                                                    </p>
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
