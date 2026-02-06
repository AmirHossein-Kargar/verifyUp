'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'آپورک چیست؟',
            answer: 'آپورک یک پلتفرم فریلنسری آنلاین است که فریلنسر ها و کارفرمایان را به هم متصل میکند و امکان انجام پروژه‌ های مختلف را فراهم می‌ آورد.'
        },
        {
            question: 'چرا نیاز به احراز هویت است؟',
            answer: 'احراز هویت برای تضمین امنیت حساب کاربری شما و جلوگیری از سوء استفاده‌ های احتمالی ضروری است. همچنین برای استفاده از برخی سرویس‌ ها و خدمات، احراز هویت الزامی میباشد.'
        },
        {
            question: 'چه مدارکی برای احراز هویت نیاز است؟',
            answer: 'برای احراز هویت به پاسپورت معتبر، و در صورت نیاز مدارک تکمیلی دیگر نیاز خواهید داشت.'
        },
        {
            question: 'فرآیند احراز هویت چقدر طول میکشد؟',
            answer: 'معمولاً فرآیند بررسی و تایید مدارک بین 24 تا 48 ساعت کاری زمان میبرد. در صورت نیاز به بررسی بیشتر، از طریق ایمیل یا پیامک با شما تماس خواهیم گرفت.'
        },
        {
            question: 'آیا اطلاعات من امن است؟',
            answer: 'بله، تمامی اطلاعات شما با استفاده از پروتکل‌های امنیتی پیشرفته رمزنگاری شده و در سرورهای امن نگهداری می‌شود. ما به حریم خصوصی کاربران خود احترام میگذاریم.'
        }
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto mt-16 sm:mt-20 md:mt-24 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
        >
            <h2 className="mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white">
                سوالات متداول
            </h2>

            <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-4 sm:p-5 text-right bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                {faq.question}
                            </span>
                            <motion.svg
                                animate={{ rotate: openIndex === index ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 sm:p-5 pt-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
