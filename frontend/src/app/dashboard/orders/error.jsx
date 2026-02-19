'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function OrdersError({ error, reset }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Orders error:', error);
    }
  }, [error]);

  return (
    <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          خطا در بارگذاری سفارشات
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          در دریافت لیست سفارشات مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            تلاش مجدد
          </button>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  );
}
