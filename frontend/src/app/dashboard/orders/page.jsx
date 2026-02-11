'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatTooman } from '@/utils/currency';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrders } from '@/hooks/useOrders';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

const STATUS_BADGES = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const STATUS_TEXT = {
    completed: 'تکمیل شده',
    active: 'در حال انجام',
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

export default function OrdersPage() {
    const { user, loading: authLoading, showSkeleton } = useRequireAuth();
    const { orders, loading: ordersLoading, error, refetch } = useOrders();
    const { showToast } = useToast();
    const [uploadingId, setUploadingId] = useState(null);
    const [fileMap, setFileMap] = useState({});

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

                                const isPendingDocs = order.status === 'pending_docs';

                                const handleFileChange = (e) => {
                                    const file = e.target.files?.[0];
                                    setFileMap((prev) => ({
                                        ...prev,
                                        [order._id]: file || null,
                                    }));
                                };

                                const handleUpload = async () => {
                                    const file = fileMap[order._id];
                                    if (!file) {
                                        showToast('لطفاً ابتدا فایل موردنظر را انتخاب کنید', 'warning');
                                        return;
                                    }

                                    const formData = new FormData();
                                    formData.append('file', file);
                                    // برای این پلن فقط پاسپورت لازم است
                                    formData.append('type', 'passport_front');

                                    try {
                                        setUploadingId(order._id);
                                        showToast('در حال آپلود فایل...', 'info', 2000);
                                        await api.uploadOrderDocument(order._id, formData);
                                        showToast('فایل با موفقیت آپلود شد', 'success');
                                        setFileMap((prev) => ({ ...prev, [order._id]: null }));
                                        await refetch();
                                    } catch (err) {
                                        const message =
                                            (err && Array.isArray(err.errors) && err.errors[0]) ||
                                            err.message ||
                                            'خطا در آپلود فایل';
                                        showToast(message, 'error');
                                    } finally {
                                        setUploadingId(null);
                                    }
                                };

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <Image
                                                    src="https://cdn.worldvectorlogo.com/logos/upwork-roundedsquare-1.svg"
                                                    alt="Upwork"
                                                    width={48}
                                                    height={48}
                                                    className="object-contain"
                                                />

                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        سفارش احراز هویت آپورک
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

                                                {order.requiredDocs && order.requiredDocs.length > 0 && (
                                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                        مدرک موردنیاز: پاسپورت
                                                    </p>
                                                )}

                                                {order.docsSummary && (
                                                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                        وضعیت مدارک: {order.docsSummary.accepted || 0} تایید شده،{' '}
                                                        {order.docsSummary.resubmit || 0} نیاز به ارسال مجدد
                                                    </p>
                                                )}

                                                {isPendingDocs && (
                                                    <div className="mt-4 space-y-2">
                                                        <label
                                                            htmlFor={`file_input_${order._id}`}
                                                            className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
                                                        >
                                                            آپلود تصویر پاسپورت
                                                        </label>
                                                        <input
                                                            id={`file_input_${order._id}`}
                                                            type="file"
                                                            className="cursor-pointer bg-neutral-secondary-medium border border-gray-300 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 shadow-sm"
                                                            onChange={handleFileChange}
                                                        />
                                                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-300">
                                                            فرمت مجاز: تصویر (JPG، PNG) یا PDF، حداکثر ۱۰ مگابایت.
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={handleUpload}
                                                            disabled={uploadingId === order._id}
                                                            className="mt-1 inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
                                                        >
                                                            {uploadingId === order._id ? 'در حال آپلود...' : 'آپلود فایل'}
                                                        </button>
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
