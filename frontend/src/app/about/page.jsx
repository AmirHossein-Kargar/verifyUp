'use client';

import { motion } from 'framer-motion';

export default function About() {
    const features = [
        {
            title: 'احراز هویت سریع',
            description: 'فرآیند احراز هویت ساده و سریع در کمتر از ۲۴ ساعت',
            icon: (
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                </svg>
            )
        },
        {
            title: 'امنیت بالا',
            description: 'حفاظت از اطلاعات شخصی شما با بالاترین استاندارد های امنیتی',
            icon: (
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
                </svg>
            )
        },
        {
            title: 'پشتیبانی ۲۴/۷',
            description: 'تیم پشتیبانی ما همیشه آماده کمک به شماست',
            icon: (
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
                </svg>
            )
        },
        {
            title: 'قیمت مناسب',
            description: 'خدمات با کیفیت با قیمت‌ های رقابتی و منصفانه',
            icon: (
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                        درباره <span className="text-indigo-600 dark:text-indigo-500">وریفای آپ</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
                        وریفای آپ یک پلتفرم تخصصی برای کمک به احراز هویت کاربران ایرانی در پلتفرم آپورک است.
                        ما فرآیند تأیید هویت را ساده‌تر، سریع‌ تر و امن‌ تر میکنیم تا بتوانید بدون دغدغه در آپورک فعالیت کنید.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 select-none"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div className="text-center">
                                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg">
                                        {feature.title}
                                    </h5>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mission Section */}
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                    >
                        <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            ماموریت ما
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            هدف ما کمک به کاربران ایرانی برای احراز هویت موفق در پلتفرم آپورک است.
                            ما میدانیم که فرآیند احراز هویت میتواند پیچیده و زمان‌بر باشد، به همین دلیل در کنار شما هستیم تا این مسیر را هموار تر کنیم.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                            با تجربه و تخصص تیم ما، شما می‌توانید با اطمینان خاطر و در کوتاه‌ ترین زمان ممکن، احراز هویت خود را در آپورک تکمیل کنید و به فعالیت‌ های خود ادامه دهید.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
