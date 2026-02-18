'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTooman } from '@/utils/currency';
import { useToast } from '@/hooks/useToast';
import { buildOrderPayloadFromItem } from '@/utils/orderPayload';

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, clearCart, isLoaded } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const redirectTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const totalPrice = useMemo(() => getCartTotal(), [getCartTotal, cart]);
  const itemsCount = cart.length;

  const handleCheckout = useCallback(async () => {
    if (!user) {
      showToast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => {
        router.replace('/login');
      }, 1200);

      return;
    }

    if (cart.length === 0) {
      showToast('سبد خرید خالی است', 'warning');
      return;
    }

    // برای جریان پرداخت، فقط اولویت را به پلن اصلی می‌دهیم و به مرحله پرداخت هدایت می‌کنیم
    const mainItem = cart[0];
    const payload = buildOrderPayloadFromItem(mainItem);
    window.localStorage.setItem(
      'pendingCheckout',
      JSON.stringify({
        item: mainItem,
        orderPayload: payload,
      }),
    );

    showToast('در حال انتقال به مرحله پرداخت...', 'info');
    router.push('/checkout');
  }, [user, cart, showToast, router]);

  const handleRemoveItem = useCallback(
    (itemId) => {
      removeFromCart(itemId);
      showToast('محصول از سبد خرید حذف شد', 'success');
    },
    [removeFromCart, showToast]
  );

  const handleClearCart = useCallback(() => {
    clearCart();
    showToast('سبد خرید خالی شد', 'success');
  }, [clearCart, showToast]);

  if (!isLoaded || authLoading) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <svg className="mb-4 h-20 w-20 text-gray-400 sm:h-24 sm:w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              سبد خرید شما خالی است
            </h1>
            <p className="mb-6 text-sm text-gray-700 dark:text-gray-400">
              هنوز محصولی به سبد خرید اضافه نکرده‌ اید
            </p>

            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              مشاهده خدمات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">سبد خرید</h1>

          <button
            type="button"
            onClick={handleClearCart}
            className="self-start text-sm font-medium text-red-600 transition-colors duration-200 ease-out hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 sm:self-auto"
          >
            پاک کردن همه
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  {(item.logo || item.icon) && (
                    <div className="shrink-0">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center">{item.icon}</div>
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                      {item.title}
                    </h3>

                    {item.options && (
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                        {item.options.connection && (
                          <p>
                            <span className="font-medium">سرویس اتصال:</span>{' '}
                            {item.options.connection === 'residential' ? 'IP Residential' : 'VPS'}
                          </p>
                        )}
                        {item.options.bill && (
                          <p>
                            <span className="font-medium">قبض تأیید آدرس:</span> بله
                          </p>
                        )}
                        {item.options.simType && (
                          <p>
                            <span className="font-medium">نوع سیم‌کارت:</span>{' '}
                            {item.options.simType === 'physical'
                              ? 'فیزیکی'
                              : item.options.simType === 'virtual'
                                ? 'مجازی'
                                : 'دارم'}
                          </p>
                        )}
                        {item.options.country && (
                          <p>
                            <span className="font-medium">کشور:</span> {item.options.country}
                          </p>
                        )}
                      </div>
                    )}

                    <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                      {formatTooman(item.price)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-red-600 transition-colors duration-200 ease-out hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                    aria-label="حذف محصول"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:sticky lg:top-28">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                خلاصه سفارش
              </h2>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                  <span>تعداد محصولات:</span>
                  <span>{itemsCount}</span>
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white sm:text-lg">
                  <span>مجموع:</span>
                  <span>{formatTooman(totalPrice)}</span>
                </div>
              </div>

              {!user && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200 sm:text-sm">
                    برای تکمیل خرید باید وارد حساب کاربری خود شوید
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                className="mb-3 w-full rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                {user ? 'تکمیل خرید' : 'ورود و تکمیل خرید'}
              </button>

              <Link
                href="/services"
                className="block w-full text-center text-sm font-medium text-indigo-700 transition-colors duration-200 ease-out hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-400"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
