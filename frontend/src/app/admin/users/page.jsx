'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { api } from '@/lib/api';

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, loading, showSkeleton } = useRequireAuth({ allowedRoles: ['admin'] });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || loading) return;
    let cancelled = false;

    const load = async () => {
      setLoadingUsers(true);
      setError(null);
      try {
        const params = { page: pagination.page, limit: pagination.limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        const res = await api.getAdminUsers(params);
        if (cancelled) return;
        setUsers(res.data?.users || []);
        setPagination(res.data?.pagination || pagination);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'خطا در بارگذاری کاربران');
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user, loading, pagination.page, pagination.limit, debouncedSearch]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  if (loading || showSkeleton) return <DashboardSkeleton />;
  if (!user) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pt-24 pb-20 dark:bg-gray-900" data-testid="admin-users-page">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                مدیریت کاربران
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                مشاهده و جستجوی کاربران بر اساس نام، ایمیل یا شماره تماس.
              </p>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              جستجو (نام، ایمیل، موبایل)
            </label>
            <div className="relative max-w-md">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="h-5 w-5" aria-hidden />
              </span>
              <input
                id="user-search"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                placeholder="مثال: علی یا user@example.com یا 09..."
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/60">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">نام</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">ایمیل</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">موبایل</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">آدرس</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">نقش</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      کاربری یافت نشد.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {u.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {u.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300" dir="ltr">
                        {u.phone || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-[200px] truncate">
                        {u.address || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {u.role === 'admin' ? 'ادمین' : 'کاربر'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left">
                        <Link
                          href={`/admin/users/${u._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                        >
                          <EyeIcon className="h-4 w-4" aria-hidden />
                          مشاهده پروفایل
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <span>
                صفحه {pagination.page} از {pagination.pages} (مجموع {pagination.total} کاربر)
              </span>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="rounded-r-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-l-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  بعدی
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
