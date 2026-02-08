'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import StepCard from './components/StepCard';
import FAQ from './components/FAQ';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const steps = [
    {
      step: '۱',
      title: 'ثبت نام',
      description: 'با ایمیل و رمز عبور خود در سیستم ثبت نام کنید و حساب کاربری خود را ایجاد نمایید',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      step: '۲',
      title: 'ثبت سفارش',
      description: 'سفارش احراز هویت خود را ثبت کنید و اطلاعات مورد نیاز را در فرم وارد نمایید',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      step: '۳',
      title: 'ارسال مدارک',
      description: 'مدارک هویتی خود را آپلود کنید و منتظر تایید نهایی از طرف تیم آپورک باشید',
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center" dir="rtl">
      <div className="w-full">
        {/* Hero Section */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            احراز هویت آپورک، <span className="text-indigo-600 dark:text-indigo-500">ساده و مطمئن</span>
          </motion.h1>
          <motion.p
            className="mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl font-normal text-gray-500 px-4 sm:px-8 md:px-16 xl:px-48 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            از ثبت‌ نام تا تأیید نهایی هویت در آپورک، کنار شما هستیم تا بدون ریسک و مشکل شروع به کار کنید
          </motion.p>

          {/* Stacked Avatars with Badge */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex -space-x-4 rtl:space-x-reverse">
              <motion.div
                className="relative w-10 h-10 border-2 border-white dark:border-gray-800 rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                <Image
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="کاربر"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                className="relative w-10 h-10 border-2 border-white dark:border-gray-800 rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                <Image
                  src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                  alt="کاربر"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                className="relative w-10 h-10 border-2 border-white dark:border-gray-800 rounded-full overflow-hidden"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                <Image
                  src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  alt="کاربر"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </motion.div>
              <motion.a
                className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 dark:bg-gray-600 border-2 border-white dark:border-gray-800 rounded-full hover:bg-gray-600 dark:hover:bg-gray-500"
                href="#"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                +99
              </motion.a>
            </div>
            <motion.span
              className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              بیش از ۱۰۰ کاربر فعال
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {!loading && (
              user ? (
                <Link href="/dashboard" className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 transition-all hover:scale-105">
                  داشبورد
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0l4 4M1 5l4-4" />
                  </svg>
                </Link>
              ) : (
                <Link href="/signup" className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 transition-all hover:scale-105">
                  شروع کنید
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0l4 4M1 5l4-4" />
                  </svg>
                </Link>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Steps Section */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <motion.h2
            className="mb-8 sm:mb-10 md:mb-12 text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            مراحل احراز هویت
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, index) => (
              <div key={index} className={index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <StepCard
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
}
