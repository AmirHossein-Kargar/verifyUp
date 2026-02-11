'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatTooman } from '@/utils/currency';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pendingCheckout');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.orderPayload) {
        setPending(parsed);
      }
    } catch (e) {
      console.warn('Failed to read pendingCheckout:', e);
    }
  }, []);

  const price = useMemo(
    () => (pending?.item?.price ? pending.item.price : 0),
    [pending],
  );

  const handleCancel = () => {
    window.localStorage.removeItem('pendingCheckout');
    showToast('پرداخت لغو شد. سفارشی ایجاد نشد.', 'info');
    router.push('/services');
  };

  const handleMockPaymentSuccess = async () => {
    if (!pending?.orderPayload) {
      showToast('سفارش معتبری برای پرداخت یافت نشد.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      showToast('در حال نهایی‌سازی سفارش...', 'info', 2000);

      // در حالت واقعی این نقطه بعد از تأیید درگاه پرداخت (وبهوک) فراخوانی می‌شود
      const response = await api.createPaidOrder(pending.orderPayload);

      window.localStorage.removeItem('pendingCheckout');
      showToast(response.message || 'پرداخت با موفقیت انجام شد و سفارش ثبت شد', 'success');
      router.push('/dashboard/orders');
    } catch (error) {
      const message =
        (error && Array.isArray(error.errors) && error.errors[0]) ||
        error.message ||
        'خطا در نهایی‌سازی سفارش پس از پرداخت';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!pending) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center space-y-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              سفارشی برای پرداخت یافت نشد
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              لطفاً ابتدا از صفحه خدمات پلن موردنظر خود را انتخاب کنید.
            </p>
            <button
              type="button"
              onClick={() => router.push('/services')}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              بازگشت به خدمات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white text-center">
          مرحله پرداخت (آزمایشی)
        </h1>

        <div className="mb-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">پلن انتخابی:</span>{' '}
            {pending.item?.title || 'نامشخص'}
          </p>
          <p>
            <span className="font-medium">مبلغ قابل پرداخت:</span>{' '}
            {formatTooman(price)}
          </p>
        </div>

        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          در نسخه واقعی، در این مرحله به درگاه پرداخت هدایت می‌شوید. در این نسخه
          آزمایشی، روی «پرداخت موفق» کلیک کنید تا سفارش به عنوان پرداخت‌شده ایجاد شود.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={handleMockPaymentSuccess}
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-800"
          >
            {submitting ? 'در حال نهایی‌سازی...' : 'پرداخت موفق (شبیه‌سازی)'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            لغو پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}

