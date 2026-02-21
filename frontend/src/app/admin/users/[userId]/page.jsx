'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api, getProfileImageUrl } from '@/lib/api';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminUserProfilePage() {
  const params = useParams();
  const userId = params?.userId;
  const { user: authUser, loading: authLoading, showSkeleton } = useRequireAuth({ allowedRoles: ['admin'] });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser || !userId) {
      if (!userId && authUser) setError('آدرس کاربر نامعتبر است');
      setLoading(false);
      return;
    }
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getAdminUser(userId);
        if (cancelled) return;
        const userData = res?.data?.user ?? res?.user ?? null;
        setUser(userData);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'خطا در بارگذاری پروفایل');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [authUser, userId]);

  if (authLoading || showSkeleton) return <DashboardSkeleton />;
  if (!authUser) return null;

  if (loading && !user) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20">
        <div className="p-4 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 pt-24 pb-20 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error || 'کاربر یافت نشد'}
          </div>
          <Link href="/admin/users" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden />
            بازگشت به لیست کاربران
          </Link>
        </div>
      </div>
    );
  }

  const profileImageUrl = user.profileImage ? getProfileImageUrl(user.profileImage, null) : null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-24 pb-20 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link
          href="/admin/users"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          بازگشت به لیست کاربران
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex flex-col items-start gap-4 border-b border-gray-200 p-6 sm:flex-row dark:border-gray-700">
            {profileImageUrl ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 shrink-0">
                <Image
                  src={profileImageUrl}
                  alt={user.name || 'پروفایل'}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500 dark:text-gray-400 shrink-0">
                {(user.name || user.email || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name || 'بدون نام'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {user.email || '—'}
              </p>
              <span className={`inline-flex mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                {user.role === 'admin' ? 'ادمین' : 'کاربر'}
              </span>
            </div>
          </div>

          <dl className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">نام</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{user.name || '—'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">ایمیل</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0" dir="ltr">{user.email || '—'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">موبایل</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0" dir="ltr">{user.phone || '—'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">آدرس</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{user.address || '—'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">نقش</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{user.role === 'admin' ? 'ادمین' : 'کاربر'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">تایید ایمیل</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{user.emailVerified ? 'بله' : 'خیر'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">تایید موبایل</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{user.phoneVerified ? 'بله' : 'خیر'}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">تاریخ عضویت</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{formatDate(user.createdAt)}</dd>
            </div>
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 w-28">آخرین به‌روزرسانی</dt>
              <dd className="text-sm text-gray-900 dark:text-white mt-0.5 sm:mt-0">{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </div>
  );
}
