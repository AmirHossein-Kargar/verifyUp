'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatTooman } from '@/utils/currency';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [pending, setPending] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      showToast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
      router.push('/login');
      return;
    }

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
  }, [authLoading, user, router, showToast]);

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

    // Check if user is authenticated
    if (!user) {
      showToast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
      router.push('/login');
      return;
    }

    try {
      setSubmitting(true);
      showToast('در حال نهایی‌سازی سفارش...', 'info', 2000);

      console.log('User:', user);
      console.log('Sending order payload:', pending.orderPayload);

      // Ensure we have a fresh CSRF token
      await api.ensureCsrfToken();
      console.log('CSRF token ensured');

      // در حالت واقعی این نقطه بعد از تأیید درگاه پرداخت (وبهوک) فراخوانی می‌شود
      const response = await api.createPaidOrder(pending.orderPayload);

      console.log('Order response:', response);

      // Clear cart and pending checkout after successful order
      window.localStorage.removeItem('pendingCheckout');
      clearCart();

      showToast(response.message || 'پرداخت با موفقیت انجام شد و سفارش ثبت شد', 'success');

      // Small delay before redirect
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 500);
    } catch (error) {
      console.error('=== Order Creation Error ===');
      console.error('Error object:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Error status:', error?.status);
      console.error('Error message:', error?.message);
      console.error('Error errors:', error?.errors);
      console.error('========================');

      let message = 'خطا در نهایی‌سازی سفارش پس از پرداخت';

      if (error?.status === 401) {
        message = 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید';
        showToast(message, 'error');
        setTimeout(() => {
          window.localStorage.removeItem('pendingCheckout');
          router.push('/login');
        }, 1500);
        return;
      } else if (error?.status === 403) {
        message = 'خطای CSRF. لطفاً صفحه را رفرش کنید و دوباره تلاش کنید';
      } else if (error?.status === 429) {
        message = 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید';
      } else if (error?.message) {
        message = error.message;
      } else if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        message = error.errors[0];
      }

      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pending) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
              سفارشی برای پرداخت یافت نشد
            </h1>
            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
              لطفاً ابتدا از صفحه خدمات پلن موردنظر خود را انتخاب کنید.
            </p>
            <Link
              href="/services"
              className="mt-2 inline-block rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-colors duration-200 ease-out"
            >
              بازگشت به خدمات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h1 className="mb-4 text-xl font-bold leading-tight text-gray-900 dark:text-white text-center">
          مرحله پرداخت و ثبت سفارش
        </h1>

        <div className="mb-6 space-y-2 text-sm font-normal text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            <span className="font-medium">پلن انتخابی:</span>{' '}
            {pending.item?.title || 'نامشخص'}
          </p>
          <p>
            <span className="font-medium">مبلغ قابل پرداخت:</span>{' '}
            {formatTooman(price)}
          </p>
        </div>

        <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400 leading-relaxed">
          در نسخه واقعی، در این مرحله به درگاه پرداخت هدایت می‌شوید. در این نسخه
          آزمایشی، روی «پرداخت موفق» کلیک کنید تا سفارش پرداخت‌شده‌ای ایجاد شود که
          همچنان در انتظار ارسال مدارک شما خواهد بود.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="button"
            onClick={handleMockPaymentSuccess}
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white text-center hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-800 transition-colors duration-200 ease-out"
          >
            {submitting ? 'در حال نهایی‌سازی...' : 'پرداخت موفق (شبیه‌سازی)'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 text-center hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200 ease-out"
          >
            لغو پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}
