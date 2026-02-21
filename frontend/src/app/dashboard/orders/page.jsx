'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatTooman } from '@/utils/currency';
import OrdersSkeleton from '@/components/skeletons/OrdersSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/useToast';
import { useOrderEvents } from '@/hooks/useOrderEvents';
import OrderTrackingStepper from '../components/OrderTrackingStepper';

const STATUS_BADGES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    pending_docs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال بررسی',
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [liveOrder, setLiveOrder] = useState(null);
    const [orderUpdates, setOrderUpdates] = useState({});

    const handleOrderUpdate = useCallback((payload) => {
        if (payload?.type !== 'ORDER_STATUS_UPDATED' || !payload?.order) return;
        const order = payload.order;
        setLiveOrder(order);
        setOrderUpdates((prev) => ({ ...prev, [order._id]: order }));
        refetch();
    }, [refetch]);

    useOrderEvents(handleOrderUpdate);

    const displayOrder =
        selectedOrder?._id === liveOrder?._id
            ? { ...selectedOrder, ...liveOrder }
            : selectedOrder;

    const orderWithLive = (order) => {
        const live = orderUpdates[order._id];
        return live ? { ...order, ...live } : order;
    };

    if (authLoading || showSkeleton) return <OrdersSkeleton count={3} />;
    if (ordersLoading) return <OrdersSkeleton count={orders?.length || 4} />;
    if (!user) return null;

    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20">
            <div className="p-3 md:p-4 max-w-7xl mx-auto">
                <div className="mb-4 md:mb-6 text-center">
                    <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white md:text-2xl">سفارشات من</h1>
                </div>

                {error && (
                    <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm font-normal text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200 leading-relaxed md:mb-4 md:p-3">
                        خطا در دریافت سفارشات. لطفاً بعداً دوباره تلاش کنید.
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12" data-testid="orders-empty">
                        <div className="text-center">
                            <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>

                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed mb-3 md:mb-4">هنوز سفارشی ثبت نشده است</p>

                            <Link href="/services" className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 md:px-4 transition-colors duration-200 ease-out">
                                سفارش جدید
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 md:space-y-4" data-testid="orders-list">
                            {orders.map((order) => {
                                const orderToShow = orderWithLive(order);
                                const uiStatusKey = STATUS_MAP[orderToShow.status] || 'pending';
                                const badge = STATUS_BADGES[uiStatusKey] || STATUS_BADGES.pending;
                                const text = STATUS_TEXT[uiStatusKey] || orderToShow.status;

                                const createdAt = orderToShow.createdAt ? new Date(orderToShow.createdAt) : null;
                                const dateText = createdAt
                                    ? createdAt.toLocaleDateString('fa-IR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                    })
                                    : '';

                                // Get service configuration
                                const serviceConfig = SERVICE_CONFIG[orderToShow.service] || SERVICE_CONFIG.upwork_verification;

                                const isSelected = selectedOrder?._id === orderToShow._id;
                                return (
                                    <div
                                        key={orderToShow._id}
                                        data-testid="order-item"
                                        data-order-id={orderToShow._id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setSelectedOrder(orderToShow)}
                                        onKeyDown={(e) => e.key === 'Enter' && setSelectedOrder(orderToShow)}
                                        className={`bg-white dark:bg-gray-800 border rounded-lg p-3 md:p-5 transition-all duration-200 ease-out cursor-pointer ${isSelected
                                            ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                                            <div className="flex items-start gap-3 md:gap-4">
                                                {serviceConfig.logo ? (
                                                    <Image
                                                        src={serviceConfig.logo}
                                                        alt={serviceConfig.title}
                                                        width={40}
                                                        height={40}
                                                        className="object-contain md:w-12 md:h-12"
                                                    />
                                                ) : serviceConfig.icon ? (
                                                    <div className="shrink-0 scale-75 md:scale-100">
                                                        {serviceConfig.icon}
                                                    </div>
                                                ) : null}

                                                <div>
                                                    <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white mb-1 md:text-base">
                                                        {serviceConfig.title}
                                                    </h3>
                                                    {dateText && (
                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed mb-1 md:mb-2" data-testid="order-item-date">
                                                            تاریخ ثبت: {dateText}
                                                        </p>
                                                    )}

                                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded md:px-2.5 ${badge}`} data-testid="order-item-status">
                                                        {text}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right">
                                                <p className="text-base font-bold leading-tight text-gray-900 dark:text-white md:text-lg" data-testid="order-item-total">
                                                    {formatTooman(orderToShow.priceToman || 0)}
                                                </p>

                                                {orderToShow.adminNote && (
                                                    <p className="mt-1 text-xs font-normal text-gray-600 dark:text-gray-400 leading-relaxed md:mt-2">
                                                        یادداشت ادمین: {orderToShow.adminNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step-by-step tracking: only show after user clicks an order (not on first load/refresh) */}
                        {selectedOrder && (
                            <div className="mt-6" data-testid="order-tracking-detail">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    وضعیت سفارش (به‌روز لحظه‌ای)
                                </h2>
                                <OrderTrackingStepper order={displayOrder} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
