'use client';

import { useEffect, useState } from 'react';
import DashboardNavbar from '@/app/components/DashboardNavbar';
import AdminSidebar from '@/app/components/AdminSidebar';
import DashboardSkeleton from '@/app/components/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';
import { formatTooman } from '@/utils/currency';

export default function AdminDashboardPage() {
  const { user, loading, showSkeleton } = useRequireAuth({
    allowedRoles: ['admin'],
  });

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    if (!user || loading) return;

    let cancelled = false;

    const loadStats = async () => {
      try {
        setStatsError(null);
        const res = await api.getAdminStats();
        if (cancelled) return;
        setStats(res.data);
      } catch (e) {
        if (cancelled) return;
        setStatsError(e?.message || 'خطا در دریافت آمار');
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Failed to load admin stats:', e);
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  if (loading || showSkeleton) {
    return <DashboardSkeleton sidebarOpen={false} />;
  }

  if (!user) return null;

  const totalRevenue = stats?.revenueToman || 0;

  return (
    <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <DashboardNavbar user={user} />
      <AdminSidebar />

      <div className="p-4 sm:mr-64 sm:p-6 mt-14">
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                پنل مدیریت
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                نظارت و مدیریت سفارشات، مدارک و کاربران.
              </p>
            </div>
          </div>

          {statsError && (
            <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {statsError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    کل سفارشات
                  </p>
                  <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                    {statsLoading ? '—' : stats?.ordersTotal ?? 0}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    در انتظار مدارک / بررسی
                  </p>
                  <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                    {statsLoading ? '—' : stats?.pendingOrInReview ?? 0}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    سفارشات تکمیل‌شده
                  </p>
                  <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    {statsLoading ? '—' : stats?.completed ?? 0}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    مجموع درآمد (تومان)
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {statsLoading ? '—' : formatTooman(totalRevenue)}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-6-6h12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              فعالیت‌ها
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              بخش‌ های مدیریت سفارشات، بررسی مدارک و جزئیات بیشتر از طریق منوی سمت راست در دسترس است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
