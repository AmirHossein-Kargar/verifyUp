'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { useOrderEvents } from '@/hooks/useOrderEvents';
import { formatTooman } from '@/utils/currency';
import OrderTrackingStepper from './OrderTrackingStepper';

const STATUS_BADGE = {
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
  completed_legacy: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

const STATUS_LABEL = {
  placed: 'ثبت سفارش',
  confirmed: 'تایید شده',
  processing: 'در حال پردازش',
  in_progress: 'در دست اقدام',
  completed: 'تکمیل شده',
  delivered: 'تحویل داده شده',
  rejected: 'رد شده',
  pending_docs: 'در انتظار مدارک',
  in_review: 'در حال بررسی',
  needs_resubmit: 'نیاز به ارسال مجدد',
  approved: 'تایید شده',
};

function getStatusLabel(s) {
  return STATUS_LABEL[s] || s;
}

function getStatusBadge(s) {
  return STATUS_BADGE[s] || STATUS_BADGE.placed;
}

export default function OrderTrackingSection(props) {
  const {
    orders: ordersProp,
    loading: loadingProp,
    orderUpdates: orderUpdatesProp,
    liveOrder: liveOrderProp,
  } = props;

  const isControlled = ordersProp !== undefined;
  const internalOrders = useOrders();
  const orders = isControlled ? ordersProp : (internalOrders.orders ?? []);
  const loading = isControlled ? (loadingProp ?? false) : internalOrders.loading;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [internalOrderUpdates, setInternalOrderUpdates] = useState({});
  const [internalLiveOrder, setInternalLiveOrder] = useState(null);

  const handleOrderUpdate = useCallback((payload) => {
    if (payload?.type !== 'ORDER_STATUS_UPDATED' || !payload?.order) return;
    const order = payload.order;
    setInternalLiveOrder(order);
    setInternalOrderUpdates((prev) => ({ ...prev, [order._id]: order }));
    if (!isControlled) internalOrders.refetch?.();
  }, [isControlled, internalOrders.refetch]);

  useOrderEvents(handleOrderUpdate);

  const effectiveOrderUpdates = isControlled ? (orderUpdatesProp ?? {}) : internalOrderUpdates;
  const effectiveLiveOrder = isControlled ? (liveOrderProp ?? null) : internalLiveOrder;

  const displayOrder =
    selectedOrder?._id === effectiveLiveOrder?._id
      ? { ...selectedOrder, ...effectiveLiveOrder }
      : selectedOrder;

  const orderWithLive = (order) => {
    const live = effectiveOrderUpdates[order._id];
    return live ? { ...order, ...live } : order;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base md:text-lg font-semibold leading-snug text-gray-900 dark:text-white">
          پیگیری سفارش
        </h2>
        <Link
          href="/dashboard/orders"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          همه سفارشات
        </Link>
      </div>

      {loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ) : !orders?.length ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            هنوز سفارشی ثبت نشده است.
          </p>
          <Link
            href="/services"
            className="mt-2 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            ثبت سفارش جدید
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="max-h-64 overflow-y-auto">
            {orders.map((order) => {
              const orderToShow = orderWithLive(order);
              const isSelected = selectedOrder?._id === orderToShow._id;
              const created = orderToShow.createdAt
                ? new Date(orderToShow.createdAt).toLocaleDateString('fa-IR', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
                : '—';

              return (
                <button
                  key={orderToShow._id}
                  type="button"
                  onClick={() => setSelectedOrder(orderToShow)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-right transition-colors ${isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  data-testid={`order-tracking-item-${orderToShow._id}`}
                >
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {orderToShow._id?.slice(-8)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatTooman(orderToShow.priceToman || 0)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {created}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                      orderToShow.status
                    )}`}
                  >
                    {getStatusLabel(orderToShow.status)}
                  </span>
                </button>
              );
            })}
          </div>

          {displayOrder && (
            <div className="p-4 md:p-5 border-t border-gray-200 dark:border-gray-700">
              <OrderTrackingStepper order={displayOrder} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
