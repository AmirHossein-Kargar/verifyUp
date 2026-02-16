'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { formatTooman } from '@/utils/currency';

const POLL_INTERVAL_MS = 10_000;

const STATUS_LABELS = {
  pending_docs: 'در انتظار مدارک',
  in_review: 'در حال بررسی',
  needs_resubmit: 'نیاز به ارسال مجدد',
  approved: 'تایید شده',
  rejected: 'رد شده',
  completed: 'تکمیل شده',
};

const STATUS_BADGE_CLASSES = {
  pending_docs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  in_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  needs_resubmit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const STATUS_DOT_CLASSES = {
  pending_docs: 'bg-yellow-400',
  in_review: 'bg-blue-500',
  needs_resubmit: 'bg-orange-400',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  completed: 'bg-green-500',
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
      pending_docs: '#fbbf24',
      in_review: '#3b82f6',
      needs_resubmit: '#fb923c',
      approved: '#10b981',
      rejected: '#ef4444',
      completed: '#22c55e',
    };

    const color = colorMap[status] || '#6b7280';
    parts.push(`${color} ${start}deg ${end}deg`);
    current = end;
  });

  return `conic-gradient(${parts.join(', ')})`;
}

function buildRevenueLinePoints(revenueByDay) {
  if (!revenueByDay || revenueByDay.length === 0) return '';
  const width = 320;
  const height = 120;

  const max = revenueByDay.reduce(
    (m, item) => Math.max(m, item.revenueToman || 0),
    0,
  );
  if (max === 0) return '';

  const n = revenueByDay.length;
  return revenueByDay
    .map((item, index) => {
      const x = n === 1 ? width / 2 : (index / (n - 1)) * width;
      const y = height - ((item.revenueToman || 0) / max) * height;
      return `${x},${y}`;
    })
    .join(' ');
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
        if (filters.from) params.from = new Date(filters.from).toISOString();
        if (filters.to) params.to = new Date(filters.to).toISOString();
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

  const resetFilters = () => {
    setFilters({
      status: '',
      from: '',
      to: '',
      userQuery: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const revenueLinePoints = useMemo(
    () => buildRevenueLinePoints(revenueByDay),
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

  return (
    <>
      <AdminNavbar user={user} />
      <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
        <div className="p-3 md:p-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                مدیریت سفارشات
              </h1>
              <p className="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                مشاهده، فیلتر و پیگیری لحظه‌ای سفارشات کاربران.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>به‌روزرسانی خودکار هر ۱۰ ثانیه</span>
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{realTimeLabel}</span>
            </div>
          </div>

          {(statsError || ordersError) && (
            <div className="rounded-md bg-red-50 p-2 md:p-3 text-[10px] md:text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300 mb-4">
              {ordersError || statsError}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5">
              <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">کل سفارشات</p>
              <p className="text-xl md:text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {statsLoading ? '—' : stats?.ordersTotal ?? 0}
              </p>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5">
              <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">در انتظار مدارک / بررسی</p>
              <p className="text-xl md:text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {statsLoading ? '—' : stats?.pendingOrInReview ?? 0}
              </p>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5">
              <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">تکمیل‌شده / تایید شده</p>
              <p className="text-xl md:text-2xl font-semibold text-green-600 dark:text-green-400">
                {statsLoading ? '—' : stats?.completed ?? 0}
              </p>
            </div>

            <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5">
              <p className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">مجموع درآمد (تومان)</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {statsLoading ? '—' : formatTooman(totalRevenue)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
                  روند درآمد (۱۴ روز اخیر)
                </h2>
              </div>

              {revenueLinePoints ? (
                <div className="w-full overflow-x-auto">
                  <svg viewBox="0 0 320 120" className="w-full h-24 md:h-32" role="img" aria-label="نمودار خطی درآمد">
                    <polyline fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="2" points={revenueLinePoints} />
                  </svg>
                </div>
              ) : (
                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">هنوز داده کافی برای نمایش روند درآمد وجود ندارد.</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5 flex flex-col gap-3 md:gap-4">
              <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">وضعیت سفارشات</h2>

              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner" style={statusPieStyle} />
                <div className="flex-1 space-y-1">
                  {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const count = ordersByStatus[key] || 0;
                    if (!count) return null;
                    return (
                      <div key={key} className="flex items-center justify-between text-[10px] md:text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[key] || 'bg-gray-400'}`} />
                          <span>{label}</span>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                  {Object.keys(ordersByStatus || {}).length === 0 && (
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">سفارشی برای نمایش وجود ندارد.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4 mb-4 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 md:gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 w-full">
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
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="userQuery" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    جستجوی کاربر (ایمیل / موبایل)
                  </label>
                  <input
                    id="userQuery"
                    type="text"
                    value={filters.userQuery}
                    onChange={(e) => handleFilterChange('userQuery', e.target.value)}
                    placeholder="مثال: user@example.com یا 09..."
                    className="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="from" className="text-xs font-medium text-gray-600 dark:text-gray-300">از تاریخ</label>
                  <input
                    id="from"
                    type="date"
                    value={filters.from}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                    className="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="to" className="text-xs font-medium text-gray-600 dark:text-gray-300">تا تاریخ</label>
                  <input
                    id="to"
                    type="date"
                    value={filters.to}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                    className="block w-full rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="limit" className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    تعداد در هر صفحه
                  </label>
                  <select
                    id="limit"
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="block w-28 rounded-md border-gray-300 bg-white py-1.5 text-xs text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-9 mt-5 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  پاک کردن همه
                </button>
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
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      aria-label="حذف فیلتر"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-[10px] md:text-xs">
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
                      <td colSpan={9} className="px-2 md:px-3 py-4 md:py-6 text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        در حال بارگذاری سفارشات...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-2 md:px-3 py-4 md:py-6 text-center text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                        سفارشی مطابق فیلترهای فعلی یافت نشد.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => loadOrderDetails(order)}
                        className={[
                          'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40',
                          selectedOrder?._id === order._id ? 'bg-indigo-50/60 dark:bg-indigo-900/30' : '',
                        ].join(' ')}
                      >
                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 font-mono text-[9px] md:text-[11px] text-gray-700 dark:text-gray-200">
                          <span className="hidden sm:inline">{order._id}</span>
                          <span className="sm:hidden">{order._id?.slice(-6)}</span>
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-200 hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.userId?.name || 'بدون نام'}</span>
                            <span className="text-[9px] md:text-[11px] text-gray-500 dark:text-gray-400">
                              {order.userId?.email || order.userId?.phone || '—'}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-200 hidden md:table-cell">
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

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-200">
                          {formatTooman(order.priceToman || 0)}
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-emerald-700 dark:text-emerald-300 hidden lg:table-cell">
                          {order.paymentStatus
                            ? order.paymentStatus
                            : 'پرداخت شده'}
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                          {formatDateTime(order.createdAt)}
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                          {formatDateTime(order.updatedAt)}
                        </td>

                        <td className="whitespace-nowrap px-2 md:px-3 py-1.5 md:py-2 text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadOrderDetails(order);
                            }}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-50 px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                          >
                            جزئیات
                          </button>
                        </td>
                      </tr>
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
                    className="rounded-r-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    قبلی
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                    className="rounded-l-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4 md:p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              جزئیات سفارش و مدارک
            </h2>

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
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
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
                      className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    >
                      {updatingStatus ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی وضعیت'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
