'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { formatTooman } from '@/utils/currency';
import { TRACKING_STEPS, getCurrentStepIndex } from '@/lib/orderTrackingSteps';

const POLL_INTERVAL_MS = 10_000;

const STATUS_LABELS = {
  placed: 'ثبت سفارش',
  confirmed: 'تایید سفارش',
  processing: 'در حال پردازش',
  completed: 'تکمیل شده',
  rejected: 'رد شده',
  pending_docs: 'در انتظار مدارک',
  in_review: 'در حال بررسی',
  needs_resubmit: 'نیاز به ارسال مجدد',
  approved: 'تایید شده',
  in_progress: 'در دست اقدام',
  delivered: 'تحویل داده شده',
};
/** Status options shown in the filter dropdown (simplified list) */
const STATUS_FILTER_OPTIONS = ['placed', 'confirmed', 'processing', 'completed', 'rejected'];
const ADMIN_STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'completed', 'rejected'];

const STATUS_BADGE_CLASSES = {
  placed: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  processing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  pending_docs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  needs_resubmit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const STATUS_DOT_CLASSES = {
  placed: 'bg-slate-400',
  confirmed: 'bg-blue-500',
  processing: 'bg-amber-400',
  in_progress: 'bg-indigo-500',
  completed: 'bg-green-500',
  delivered: 'bg-emerald-500',
  rejected: 'bg-red-500',
  pending_docs: 'bg-yellow-400',
  in_review: 'bg-blue-500',
  needs_resubmit: 'bg-orange-400',
  approved: 'bg-emerald-500',
};

const SERVICE_NAMES = {
  upwork_verification: 'ساخت اکانت اپورک + احراز هویت',
  account_optimization: 'مشاوره بهینه‌سازی اکانت',
  paypal_account: 'اکانت پی پال',
};

function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function formatDateTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return `${d.toLocaleDateString('fa-IR')}، ${d.toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function buildStatusPieGradient(ordersByStatus) {
  const entries = Object.entries(ordersByStatus || {}).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (!total) return 'conic-gradient(#e5e7eb 0deg 360deg)';

  let current = 0;
  const parts = [];

  entries.forEach(([status, value]) => {
    const fraction = value / total;
    const start = current;
    const end = current + fraction * 360;

    const colorMap = {
      placed: '#64748b',
      confirmed: '#3b82f6',
      processing: '#f59e0b',
      in_progress: '#6366f1',
      completed: '#22c55e',
      delivered: '#10b981',
      rejected: '#ef4444',
      pending_docs: '#fbbf24',
      in_review: '#3b82f6',
      needs_resubmit: '#fb923c',
      approved: '#10b981',
    };

    const color = colorMap[status] || '#6b7280';
    parts.push(`${color} ${start}deg ${end}deg`);
    current = end;
  });

  return `conic-gradient(${parts.join(', ')})`;
}

function formatChartDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  return d.toLocaleDateString('fa-IR', { month: '2-digit', day: '2-digit' });
}

export default function AdminOrdersPage() {
  const { user, loading, showSkeleton } = useRequireAuth({
    allowedRoles: ['admin'],
  });
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    status: '',
    from: '',
    to: '',
    userQuery: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const debouncedUserQuery = useDebouncedValue(filters.userQuery, 400);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // ---------------------------
  // Orders loader (filters/pagination dependent)
  // ---------------------------
  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;

    const loadOrders = async (isBackground = false) => {
      if (!isBackground) {
        setLoadingOrders(true);
        setOrdersError(null);
      }

      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        };

        if (filters.status) params.status = filters.status;
        if (filters.from) {
          const d = new DateObject({ date: filters.from, format: 'YYYY/MM/DD', calendar: persian });
          params.from = new Date(d.toDate().setHours(0, 0, 0, 0)).toISOString();
        }
        if (filters.to) {
          const d = new DateObject({ date: filters.to, format: 'YYYY/MM/DD', calendar: persian });
          params.to = new Date(d.toDate().setHours(23, 59, 59, 999)).toISOString();
        }
        if (debouncedUserQuery) params.userQuery = debouncedUserQuery;

        const ordersRes = await api.getAdminOrders(params);
        if (cancelled) return;

        const nextOrders = ordersRes.data.orders || [];
        const nextPagination = ordersRes.data.pagination || pagination;

        setOrders(nextOrders);
        setPagination(nextPagination);
        setLastUpdated(new Date());

        // اگر سفارشی انتخاب شده، بعد از رفرش جدول هم highlight باقی بماند
        if (selectedOrder?._id) {
          const stillExists = nextOrders.some((o) => o._id === selectedOrder._id);
          if (!stillExists) {
            // انتخاب را نگه می‌داریم، ولی جدول شاید دیگر آن را در این صفحه نداشته باشد
            // (برای UX بهتر می‌توانید پیام نمایش دهید)
          }
        }
      } catch (e) {
        if (cancelled) return;
        setOrdersError(e?.message || 'خطا در بارگذاری سفارشات');
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };

    loadOrders(false);

    // Poll orders only when tab is visible
    const id = setInterval(() => {
      if (!document.hidden) loadOrders(true);
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    loading,
    pagination.page,
    pagination.limit,
    filters.status,
    filters.from,
    filters.to,
    debouncedUserQuery,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // ---------------------------
  // Stats loader (NOT dependent on filters)
  // ---------------------------
  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;

    const loadStats = async () => {
      try {
        setStatsError(null);
        const statsRes = await api.getAdminStats();
        if (cancelled) return;
        setStats(statsRes.data);
      } catch (e) {
        if (cancelled) return;
        setStatsError(e?.message || 'خطا در بارگذاری آمار');
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    loadStats();
    const id = setInterval(() => {
      if (!document.hidden) loadStats();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [user, loading]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value) || 20;
    setPagination((prev) => ({ ...prev, limit: value, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field !== 'sortBy' && field !== 'sortOrder') {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const toggleSort = (field) => {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' };
      }
      return {
        ...prev,
        sortBy: field,
        sortOrder: field === 'status' ? 'asc' : 'desc',
      };
    });
  };

  const loadOrderDetails = async (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setSelectedOrderDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    setNewStatus(order.status || '');
    setAdminNote(order.adminNote || '');

    try {
      const res = await api.request(`/admin/orders/${order._id}`);
      setSelectedOrderDetails(res.data);
      setNewStatus(res.data.order.status || '');
      setAdminNote(res.data.order.adminNote || '');
    } catch (e) {
      setDetailsError(e?.message || 'خطا در دریافت جزئیات سفارش');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdatingStatus(true);
    try {
      await api.updateOrderStatus(selectedOrder._id, {
        status: newStatus,
        adminNote: adminNote || '',
      });

      showToast('وضعیت سفارش با موفقیت به‌روزرسانی شد', 'success');

      // Refresh order details and list
      await loadOrderDetails(selectedOrder);

      // Trigger orders list refresh by changing page state
      setPagination((prev) => ({ ...prev }));
    } catch (e) {
      showToast(e?.message || 'خطا در به‌روزرسانی وضعیت سفارش', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const ordersByStatus = useMemo(
    () => (stats ? stats.ordersByStatus || {} : {}),
    [stats],
  );

  const revenueByDay = useMemo(
    () => (stats ? stats.revenueByDay || [] : []),
    [stats],
  );

  const statusPieStyle = useMemo(
    () => ({ backgroundImage: buildStatusPieGradient(ordersByStatus) }),
    [ordersByStatus],
  );

  const revenueChartData = useMemo(
    () =>
      (revenueByDay || []).map((item) => ({
        dateLabel: formatChartDate(item.date),
        درآمد: item.revenueToman || 0,
      })),
    [revenueByDay],
  );

  const totalRevenue = stats?.revenueToman || 0;
  const realTimeLabel = lastUpdated
    ? `آخرین به‌روزرسانی: ${lastUpdated.toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`
    : 'در حال اتصال به سرور...';

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.status) chips.push({ key: 'status', label: `وضعیت: ${STATUS_LABELS[filters.status] || filters.status}` });
    if (filters.from) chips.push({ key: 'from', label: `از: ${filters.from}` });
    if (filters.to) chips.push({ key: 'to', label: `تا: ${filters.to}` });
    if (filters.userQuery) chips.push({ key: 'userQuery', label: `جستجو: ${filters.userQuery}` });
    return chips;
  }, [filters]);

  if (loading || showSkeleton) {
    return <DashboardSkeleton />;
  }

  if (!user) return null;

  const statVariants = { hidden: { opacity: 0, y: 12 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) };
  const rowVariants = { hidden: { opacity: 0 }, show: (i) => ({ opacity: 1, transition: { delay: i * 0.02 } }) };

  return (
    <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20" data-testid="admin-orders-page">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              مدیریت سفارشات
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              مشاهده، فیلتر و پیگیری لحظه‌ای سفارشات کاربران.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span>به‌روزرسانی خودکار هر ۱۰ ثانیه</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{realTimeLabel}</span>
          </div>
        </motion.div>

        {(statsError || ordersError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
          >
            {ordersError || statsError}
          </motion.div>
        )}

        <motion.div
          className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {[
            { label: 'کل سفارشات', value: stats?.ordersTotal ?? 0, loading: statsLoading, icon: ChartBarIcon, color: 'indigo' },
            { label: 'در انتظار بررسی', value: stats?.pendingOrInReview ?? 0, loading: statsLoading, icon: ClockIcon, color: 'amber' },
            { label: 'تکمیل‌شده', value: stats?.completed ?? 0, loading: statsLoading, icon: CheckCircleIcon, color: 'green' },
            { label: 'مجموع درآمد (تومان)', value: formatTooman(totalRevenue), loading: statsLoading, icon: BanknotesIcon, color: 'gray', isText: true },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={statVariants}
                custom={i}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className={`mt-1 text-xl font-bold ${stat.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' : stat.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {stat.loading ? '—' : stat.value}
                    </p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3"
        >
          <div className="xl:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                روند درآمد (۱۴ روز اخیر)
              </h2>
            </div>
            {revenueChartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-500" />
                    <YAxis tick={{ fontSize: 11 }} stroke="currentColor" className="text-gray-500" tickFormatter={(v) => v.toLocaleString('fa-IR')} />
                    <Tooltip formatter={(v) => [v.toLocaleString('fa-IR') + ' تومان', 'درآمد']} contentStyle={{ borderRadius: 8 }} />
                    <Bar dataKey="درآمد" radius={[4, 4, 0, 0]} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">هنوز داده کافی برای نمایش روند درآمد وجود ندارد.</p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">وضعیت سفارشات</h2>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner" style={statusPieStyle} />
              <div className="flex-1 space-y-1">
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                  const count = ordersByStatus[key] || 0;
                  if (!count) return null;
                  return (
                    <div key={key} className="flex items-center justify-between text-xs font-normal text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[key] || 'bg-gray-400'}`} />
                        <span>{label}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
                {Object.keys(ordersByStatus || {}).length === 0 && (
                  <p className="text-xs font-normal text-gray-500 dark:text-gray-400">سفارشی برای نمایش وجود ندارد.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">فیلترها و جدول سفارشات</h2>
          </div>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                فیلتر وضعیت
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">همه وضعیت‌ها</option>
                {STATUS_FILTER_OPTIONS.map((value) => (
                  <option key={value} value={value}>{STATUS_LABELS[value]}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="userQuery" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                جستجوی کاربر (ایمیل / موبایل)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
                </span>
                <input
                  id="userQuery"
                  type="text"
                  value={filters.userQuery}
                  onChange={(e) => handleFilterChange('userQuery', e.target.value)}
                  placeholder="مثال: user@example.com یا 09..."
                  className="block w-full rounded-md border border-gray-300 bg-white py-1.5 pr-9 pl-3 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="from" className="text-xs font-medium text-gray-600 dark:text-gray-300">از تاریخ</label>
              <DatePicker
                value={filters.from ? new DateObject({ date: filters.from, format: 'YYYY/MM/DD', calendar: persian }) : undefined}
                onChange={(d) => handleFilterChange('from', d ? d.format() : '')}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                placeholder="انتخاب تاریخ"
                calendarPosition="bottom-right"
                containerClassName="w-full"
                inputClass="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="to" className="text-xs font-medium text-gray-600 dark:text-gray-300">تا تاریخ</label>
              <DatePicker
                value={filters.to ? new DateObject({ date: filters.to, format: 'YYYY/MM/DD', calendar: persian }) : undefined}
                onChange={(d) => handleFilterChange('to', d ? d.format() : '')}
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                placeholder="انتخاب تاریخ"
                calendarPosition="bottom-right"
                containerClassName="w-full"
                inputClass="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="limit" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                تعداد در هر صفحه
              </label>
              <select
                id="limit"
                value={pagination.limit}
                onChange={handleLimitChange}
                className="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-700 dark:bg-gray-900/60 dark:text-gray-200"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={() => handleFilterChange(chip.key, '')}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 ease-out"
                    aria-label="حذف فیلتر"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/60">
                <tr>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400">شناسه سفارش</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">کاربر</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">سرویس</th>

                  <th
                    className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => toggleSort('status')}
                  >
                    وضعیت
                    {filters.sortBy === 'status' && (
                      <span className="mr-1 text-2xs align-middle">
                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>

                  <th
                    className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none"
                    onClick={() => toggleSort('amount')}
                  >
                    مبلغ
                    {filters.sortBy === 'amount' && (
                      <span className="mr-1 text-2xs align-middle">
                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>

                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">وضعیت پرداخت</th>

                  <th
                    className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none hidden xl:table-cell"
                    onClick={() => toggleSort('createdAt')}
                  >
                    تاریخ ایجاد
                    {filters.sortBy === 'createdAt' && (
                      <span className="mr-1 text-2xs align-middle">
                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>

                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">آخرین تغییر</th>
                  <th className="px-2 md:px-3 py-1.5 md:py-2 text-right font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900/40 dark:divide-gray-700">
                {loadingOrders ? (
                  <tr>
                    <td colSpan={9} className="px-2 md:px-3 py-4 md:py-6 text-center text-xs font-normal text-gray-500 dark:text-gray-400">
                      در حال بارگذاری سفارشات...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-2 md:px-3 py-4 md:py-6 text-center text-xs font-normal text-gray-500 dark:text-gray-400">
                      سفارشی مطابق فیلترهای فعلی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="show"
                      custom={idx}
                      onClick={() => loadOrderDetails(order)}
                      className={[
                        'cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/40',
                        selectedOrder?._id === order._id ? 'bg-indigo-50/60 dark:bg-indigo-900/30' : '',
                      ].join(' ')}
                    >
                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 font-mono text-[9px] md:text-[11px] text-gray-700 dark:text-gray-200">
                        <span className="hidden sm:inline">{order._id}</span>
                        <span className="sm:hidden">{order._id?.slice(-6)}</span>
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-gray-700 dark:text-gray-200 hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.userId?.name || 'بدون نام'}</span>
                          <span className="text-[9px] md:text-[11px] text-gray-500 dark:text-gray-400">
                            {order.userId?.email || order.userId?.phone || '—'}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-gray-700 dark:text-gray-200 hidden md:table-cell">
                        {SERVICE_NAMES[order.service] || order.service}
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 md:px-2 py-0.5 text-[9px] md:text-[11px] font-medium ${STATUS_BADGE_CLASSES[order.status] ||
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                        >
                          <span className="hidden sm:inline">{STATUS_LABELS[order.status] || order.status}</span>
                          <span className="sm:hidden">{(STATUS_LABELS[order.status] || order.status).split(' ')[0]}</span>
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-gray-700 dark:text-gray-200">
                        {formatTooman(order.priceToman || 0)}
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-emerald-700 dark:text-emerald-300 hidden lg:table-cell">
                        {order.paymentStatus
                          ? order.paymentStatus
                          : 'پرداخت شده'}
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                        {formatDateTime(order.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                        {formatDateTime(order.updatedAt)}
                      </td>

                      <td className="whitespace-nowrap px-2 py-2 text-left md:px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            loadOrderDetails(order);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-transparent bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/50"
                        >
                          <EyeIcon className="h-3.5 w-3.5" aria-hidden />
                          جزئیات
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs text-gray-600 dark:text-gray-300">
              <div>
                صفحه {pagination.page} از {pagination.pages} (مجموع {pagination.total} سفارش)
              </div>

              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="rounded-r-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 ease-out"
                >
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                  disabled={pagination.page === pagination.pages}
                  className="rounded-l-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 ease-out"
                >
                  بعدی
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              جزئیات سفارش و مدارک
            </h2>
          </div>

          {!selectedOrder && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              برای مشاهده جزئیات کامل، یکی از سفارشات را از جدول بالا انتخاب کنید.
            </p>
          )}

          {selectedOrder && detailsLoading && (
            <p className="text-xs text-gray-500 dark:text-gray-400">در حال بارگذاری جزئیات سفارش...</p>
          )}

          {detailsError && (
            <div className="mt-2 rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {detailsError}
            </div>
          )}

          {selectedOrder && selectedOrderDetails && (
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs text-gray-700 dark:text-gray-200">
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                    اطلاعات سفارش
                  </h3>

                  <p>
                    <span className="font-medium">شناسه:</span>{' '}
                    <span className="font-mono text-[11px]">{selectedOrderDetails.order._id}</span>
                  </p>

                  <p><span className="font-medium">سرویس:</span> {SERVICE_NAMES[selectedOrderDetails.order.service] || selectedOrderDetails.order.service}</p>
                  <p><span className="font-medium">مبلغ:</span> {formatTooman(selectedOrderDetails.order.priceToman || 0)}</p>
                  <p>
                    <span className="font-medium">وضعیت:</span>{' '}
                    {STATUS_LABELS[selectedOrderDetails.order.status] || selectedOrderDetails.order.status}
                  </p>
                  <p><span className="font-medium">ایجاد شده در:</span> {formatDateTime(selectedOrderDetails.order.createdAt)}</p>
                  <p><span className="font-medium">آخرین تغییر:</span> {formatDateTime(selectedOrderDetails.order.updatedAt)}</p>

                  {selectedOrderDetails.order.adminNote && (
                    <p><span className="font-medium">یادداشت ادمین:</span> {selectedOrderDetails.order.adminNote}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                    اطلاعات کاربر
                  </h3>
                  <p><span className="font-medium">نام:</span> {selectedOrderDetails.order.userId?.name || 'بدون نام'}</p>
                  <p><span className="font-medium">ایمیل:</span> {selectedOrderDetails.order.userId?.email || '—'}</p>
                  <p><span className="font-medium">موبایل:</span> {selectedOrderDetails.order.userId?.phone || '—'}</p>
                  <p><span className="font-medium">نقش:</span> {selectedOrderDetails.order.userId?.role || 'user'}</p>
                </div>
              </div>

              {/* Order step indicator (active step highlighted) */}
              {selectedOrderDetails.order.status !== 'rejected' && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
                    مراحل سفارش (وضعیت فعلی)
                  </h3>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    {TRACKING_STEPS.filter((s) => s.key !== 'rejected').map((step, idx) => {
                      const currentIdx = getCurrentStepIndex(selectedOrderDetails.order.status);
                      const isDone = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <span
                          key={step.key}
                          className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${
                            isCurrent
                              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                              : isDone
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Update Status Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  تغییر وضعیت سفارش
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="newStatus" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      وضعیت جدید
                    </label>
                    <select
                      id="newStatus"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="block w-full rounded-md border-gray-300 bg-white py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    >
                      {ADMIN_STATUS_OPTIONS.map((value) => (
                        <option key={value} value={value}>{STATUS_LABELS[value] ?? value}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="adminNote" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      یادداشت ادمین (اختیاری)
                    </label>
                    <textarea
                      id="adminNote"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      placeholder="توضیحات یا یادداشت برای این سفارش..."
                      className="block w-full rounded-md border-gray-300 bg-white py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus || !newStatus}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200 ease-out"
                  >
                    {updatingStatus ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی وضعیت'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
