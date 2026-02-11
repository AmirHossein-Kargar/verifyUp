'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeClient() {
  const { user, loading } = useAuth();
  const reduce = useReducedMotion();

  const fadeUp = reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.section
      className="mx-auto mb-12 max-w-4xl text-center sm:mb-16 md:mb-20"
      {...fadeUp}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="mb-4 px-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        احراز هویت آپورک، <span className="text-indigo-600 dark:text-indigo-500">ساده و مطمئن</span>
      </motion.h1>

      <motion.p
        className="mb-6 px-4 text-base font-normal text-gray-500 dark:text-gray-400 sm:mb-8 sm:px-8 sm:text-lg md:px-16 lg:text-xl xl:px-48"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        از ثبت‌ نام تا تأیید نهایی هویت در آپورک، کنار شما هستیم تا بدون ریسک و مشکل شروع به کار کنید.
      </motion.p>

      {/* Avatars */}
      <motion.div
        className="mb-6 flex items-center justify-center gap-3 sm:mb-8"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="flex -space-x-4 rtl:space-x-reverse">
          {[
            'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
            'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
            'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
          ].map((src) => (
            <div
              key={src}
              className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
            >
              <Image src={src} alt="کاربر" fill sizes="40px" className="object-cover" />
            </div>
          ))}

          <a
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500"
            href="#"
          >
            +99
          </a>
        </div>

        <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
          بیش از ۱۰۰ کاربر فعال
        </span>
      </motion.div>

      {/* CTA */}
      {!loading && (
        <Link
          href={user ? '/dashboard' : '/signup'}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 sm:text-base"
        >
          {user ? 'داشبورد' : 'شروع کنید'}
          <svg className="mr-2 h-3 w-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0l4 4M1 5l4-4" />
          </svg>
        </Link>
      )}
    </motion.section>
  );
}
