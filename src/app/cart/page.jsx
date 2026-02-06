'use client';

import Link from 'next/link';

export default function CartPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:pt-20 overflow-hidden" dir="rtl">
            <div className="w-full max-w-md bg-neutral-primary-soft p-6 sm:p-8 border border-default rounded-base shadow-lg select-none">
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
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">سبد خرید شما خالی است</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌ اید</p>
                    <Link
                        href="/services"
                        className="w-full inline-flex items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            </div>
        </div>
    );
}
