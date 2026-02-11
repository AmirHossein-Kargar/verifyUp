'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTooman } from '@/utils/currency';
import { useToast } from '@/hooks/useToast';

export default function CartPage() {
    const { cart, removeFromCart, getCartTotal, clearCart, isLoaded } = useCart();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const handleCheckout = () => {
        // Check if user is logged in
        if (!user) {
            showToast('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push('/login');
            }, 1500);
            return;
        }

        // TODO: Implement checkout logic
        showToast('قابلیت پرداخت به زودی اضافه می‌شود', 'info');
    };

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
        showToast('محصول از سبد خرید حذف شد', 'success');
    };

    const handleClearCart = () => {
        clearCart();
        showToast('سبد خرید خالی شد', 'success');
    };

    // Show loading state
    if (!isLoaded || authLoading) {
        return (
            <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4">
                <div className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg select-none">
                    <div className="flex flex-col items-center justify-center text-center">
                        <svg
                            className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            سبد خرید شما خالی است
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-gray-400 mb-6">
                            هنوز محصولی به سبد خرید اضافه نکرده‌ اید
                        </p>
                        <Link
                            href="/services"
                            className="w-full inline-flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800 transition-colors"
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
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">سبد خرید</h1>
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium transition-colors self-start sm:self-auto"
                    >
                        پاک کردن همه
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Logo/Icon */}
                                    {(item.logo || item.icon) && (
                                        <div className="shrink-0">
                                            {item.logo ? (
                                                <Image
                                                    src={item.logo}
                                                    alt={item.title}
                                                    width={64}
                                                    height={64}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 flex items-center justify-center">{item.icon}</div>
                                            )}
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>

                                        {/* Options */}
                                        {item.options && (
                                            <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {item.options.connection && (
                                                    <p>
                                                        <span className="font-medium">سرویس اتصال:</span>{' '}
                                                        {item.options.connection === 'residential' ? 'IP Residential' : 'VPS'}
                                                    </p>
                                                )}
                                                {item.options.bill && (
                                                    <p>
                                                        <span className="font-medium">قبض تایید آدرس:</span> بله
                                                    </p>
                                                )}
                                                {item.options.simType && (
                                                    <p>
                                                        <span className="font-medium">نوع سیمکارت:</span>{' '}
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

                                        {/* Price */}
                                        <p className="mt-3 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                            {formatTooman(item.price)}
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                                        aria-label="حذف محصول"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 lg:sticky lg:top-28">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                                خلاصه سفارش
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    <span>تعداد محصولات:</span>
                                    <span>{cart.length}</span>
                                </div>
                                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span>مجموع:</span>
                                    <span>{formatTooman(getCartTotal())}</span>
                                </div>
                            </div>

                            {/* Show login message if not logged in */}
                            {!user && (
                                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                                        برای تکمیل خرید باید وارد حساب کاربری خود شوید
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                className="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-3 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800 mb-3 transition-colors"
                            >
                                {user ? 'تکمیل خرید' : 'ورود و تکمیل خرید'}
                            </button>

                            <Link
                                href="/services"
                                className="block w-full text-center text-indigo-700 hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-400 font-medium text-sm transition-colors"
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
