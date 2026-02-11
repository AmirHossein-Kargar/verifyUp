'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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

function prettyFileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت'];
    if (bytes === 0) return '0 بایت';
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value < 10 ? 1 : 0)} ${sizes[i]}`;
}

function PassportUploadArea({
    orderId,
    file,
    onFileChange,
    onUpload,
    isUploading,
}) {
    const [isDragging, setIsDragging] = useState(false);

    const fileLabel = useMemo(() => {
        if (!file) return 'فایلی انتخاب نشده است';
        return `${file.name} (${prettyFileSize(file.size)})`;
    }, [file]);

    const handleFileInputChange = (e) => {
        const newFile = e.target.files?.[0] || null;
        onFileChange(newFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0] || null;
        if (droppedFile) {
            onFileChange(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only reset when leaving the container, not children
        if (e.currentTarget.contains(e.relatedTarget)) return;
        setIsDragging(false);
    };

    return (
        <div className="mt-4 space-y-3">
            <label
                htmlFor={`file_input_${orderId}`}
                className="block text-xs font-medium text-gray-900 dark:text-white"
            >
                آپلود تصویر پاسپورت
            </label>

            <motion.label
                htmlFor={`file_input_${orderId}`}
                className={[
                    'relative flex flex-col items-center justify-center w-full px-4 py-5',
                    'rounded-lg border-2 border-dashed cursor-pointer transition-all',
                    'bg-gray-50 dark:bg-gray-800/60',
                    isDragging
                        ? 'border-indigo-500 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-900/40'
                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700/80',
                    isUploading ? 'opacity-80' : '',
                ].join(' ')}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16"
                            />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            فایل پاسپورت را اینجا بکشید و رها کنید
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-300">
                            یا کلیک کنید و فایل را انتخاب کنید
                        </p>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-300 line-clamp-1 max-w-full">
                        {fileLabel}
                    </p>
                </div>

                <input
                    id={`file_input_${orderId}`}
                    type="file"
                    className="hidden"
                    onChange={handleFileInputChange}
                />

                {isUploading && (
                    <div className="mt-3 w-full">
                        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-l from-indigo-500 via-indigo-400 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-500"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                    ease: 'easeInOut',
                                }}
                            />
                        </div>
                    </div>
                )}
            </motion.label>

            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-300">
                فرمت مجاز: تصویر (JPG، PNG) یا PDF، حداکثر ۱۰ مگابایت.
            </p>

            <button
                type="button"
                onClick={onUpload}
                disabled={isUploading}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
            >
                {isUploading && (
                    <svg
                        className="w-4 h-4 ms-1 animate-spin"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                )}
                <span className="ms-1">
                    {isUploading ? 'در حال آپلود...' : 'آپلود فایل'}
                </span>
            </button>
        </div>
    );
}

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

                                const handleFileChange = (file) => {
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
                                                    <PassportUploadArea
                                                        orderId={order._id}
                                                        file={fileMap[order._id]}
                                                        onFileChange={handleFileChange}
                                                        onUpload={handleUpload}
                                                        isUploading={uploadingId === order._id}
                                                    />
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
