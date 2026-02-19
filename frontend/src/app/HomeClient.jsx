'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileImage } from '@/contexts/ProfileImageContext';

const PLACEHOLDER_AVATARS = [
  'https://flowbite.com/docs/images/people/profile-picture-5.jpg',
  'https://flowbite.com/docs/images/people/profile-picture-2.jpg',
  'https://flowbite.com/docs/images/people/profile-picture-3.jpg',
];

export default function HomeClient() {
  const { user, loading } = useAuth();
  const { displayUrl: profileImageDisplayUrl } = useProfileImage();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [userAvatarError, setUserAvatarError] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => setUserAvatarError(false), [profileImageDisplayUrl]);

  const reduce = mounted ? reduceMotion : false;
  const fadeUp = reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const showUserAvatar = user && (profileImageDisplayUrl ? !userAvatarError : true);
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  const userImageUrl = profileImageDisplayUrl ?? null;

  return (
    <motion.section
      className="mx-auto mb-12 max-w-4xl text-center sm:mb-16 md:mb-20"
      {...fadeUp}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="mb-4 px-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        احراز هویت آپورک، <span className="text-indigo-600 dark:text-indigo-500">ساده و مطمئن</span>
      </motion.h1>

      <motion.p
        className="mb-6 px-4 text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400 sm:mb-8 sm:px-8 sm:text-lg md:px-16 lg:text-xl xl:px-48"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        از ثبت‌ نام تا تأیید نهایی هویت در آپورک، کنار شما هستیم تا بدون ریسک و مشکل شروع به کار کنید.
      </motion.p>

      {/* Avatars: logged-in user first (when present), then placeholders, then +99 */}
      <motion.div
        className="mb-6 flex items-center justify-center gap-3 sm:mb-8"
        {...(reduce ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } })}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="flex -space-x-4 rtl:space-x-reverse">
          {showUserAvatar && (
            <div
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
              title={user?.name || 'شما'}
            >
              {userImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setUserAvatarError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-sm font-medium text-white">
                  {userInitial}
                </div>
              )}
            </div>
          )}
          {PLACEHOLDER_AVATARS.map((src) => (
            <div
              key={src}
              className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
            >
              <Image src={src} alt="کاربر" fill sizes="40px" className="object-cover" />
            </div>
          ))}

          <div
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-sm font-medium text-white dark:border-gray-800 dark:bg-gray-600"
          >
            +99
          </div>
        </div>

        <span className="rounded bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
          بیش از ۱۰۰ کاربر فعال
        </span>
      </motion.div>

      {/* CTA */}
      {!loading && (
        <Link
          href={user ? '/dashboard' : '/signup'}
          prefetch={true}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-700 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
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
