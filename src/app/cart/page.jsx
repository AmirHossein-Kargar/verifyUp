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
                    <h5 className="h5 mb-2 text-heading">سبد خرید شما خالی است</h5>
                    <p className="text-sm text-body mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌ اید</p>
                    <Link
                        href="/services"
                        className="btn-default w-full"
                    >
                        بازگشت به فروشگاه
                    </Link>
                </div>
            </div>
        </div>
    );
}
