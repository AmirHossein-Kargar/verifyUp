'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';
import { formatTooman } from '@/utils/currency';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const statCards = [
  {
    key: 'orders',
    label: 'کل سفارشات',
    valueKey: 'ordersTotal',
    icon: ChartBarIcon,
    color: 'indigo',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    valueColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    key: 'pending',
    label: 'در انتظار بررسی',
    valueKey: 'pendingOrInReview',
    icon: ClockIcon,
    color: 'amber',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    valueColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'completed',
    label: 'تکمیل‌شده',
    valueKey: 'completed',
    icon: CheckCircleIcon,
    color: 'green',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    valueColor: 'text-green-600 dark:text-green-400',
  },
  {
    key: 'revenue',
    label: 'مجموع درآمد (تومان)',
    valueKey: 'revenueToman',
    icon: CurrencyDollarIcon,
    color: 'gray',
    iconBg: 'bg-gray-100 dark:bg-gray-700',
    iconColor: 'text-gray-600 dark:text-gray-300',
    valueColor: 'text-gray-900 dark:text-white',
    format: (v) => formatTooman(v ?? 0),
  },
];

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
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    loadStats();
    return () => { cancelled = true; };
  }, [user, loading]);

  if (loading || showSkeleton) return <DashboardSkeleton />;
  if (!user) return null;

  const totalRevenue = stats?.revenueToman ?? 0;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-20" data-testid="admin-panel">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header - Flowbite style */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            پنل مدیریت
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            نظارت و مدیریت سفارشات و کاربران.
          </p>
        </motion.div>

        {statsError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {statsError}
          </motion.div>
        )}

        {/* Stats grid - Flowbite card pattern */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            const raw = stats?.[card.valueKey];
            const value = card.format ? card.format(raw) : (statsLoading ? '—' : (raw ?? 0));

            return (
              <motion.div
                key={card.key}
                variants={item}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {card.label}
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${card.valueColor}`}>
                      {value}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick actions card - Flowbite */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <SparklesIcon className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                فعالیت‌ها
              </h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                مدیریت سفارشات و جزئیات از طریق منوی پایین در دسترس است.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
