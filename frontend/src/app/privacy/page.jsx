import React from 'react';

// Static page - can be cached for 1 hour
export const revalidate = 3600;

export const metadata = {
    title: 'سیاست حفظ حریم خصوصی | وریفای آپ',
    description: 'سیاست حفظ حریم خصوصی وریفای آپ - حفاظت از اطلاعات کاربران',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    سیاست حفظ حریم خصوصی
                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                    آخرین به‌روزرسانی: بهمن ۱۴۰۳
                </p>

                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed">
                        در وریفای آپ، حفاظت از اطلاعات کاربران یک تعهد حرفه‌ای است. استفاده از خدمات ما به منزله پذیرش این سیاست می‌باشد.
                    </p>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                            اطلاعات دریافتی
                        </h2>
                        <p className="leading-relaxed">
                            ما تنها اطلاعات ضروری برای اجرای خدمات را دریافت می‌کنیم، از جمله اطلاعات هویتی، تماس و مدارک ارسالی توسط کاربر.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                            نحوه استفاده از اطلاعات
                        </h2>
                        <p className="leading-relaxed">
                            کلیه اطلاعات و مدارک دریافتی صرفاً در چارچوب اجرای خدمات مربوط به فرآیند فعالیت در پلتفرم Upwork استفاده می‌شود و برای هیچ هدف دیگری به کار نخواهد رفت.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                            محرمانگی
                        </h2>
                        <p className="leading-relaxed">
                            اطلاعات کاربران محرمانه باقی می‌ماند و در اختیار اشخاص ثالث قرار نخواهد گرفت.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                            امنیت و نگهداری
                        </h2>
                        <p className="leading-relaxed">
                            دسترسی به اطلاعات محدود و کنترل‌شده است و پس از اتمام فرآیند، داده‌های غیرضروری حذف می‌شوند. مسئولیت نگهداری اطلاعات حساب پس از تحویل نهایی بر عهده کاربر است.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
