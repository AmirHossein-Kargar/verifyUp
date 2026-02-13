'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import LoginSkeleton from '@/app/components/LoginSkeleton';

const ErrorText = ({ children }) => (children ? <p className="mt-2 text-xs text-red-500">{children}</p> : null);

export default function LoginPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { user, loading, login } = useAuth();

  const redirectTimerRef = useRef(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: { email: '', password: '', remember: false },
  });

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [user, loading, router]);

  const onSubmit = async (data) => {
    try {
      setIsRedirecting(true); // Show skeleton immediately

      const response = await api.login({
        email: data.email,
        password: data.password,
      });

      if (response.data?.user) login(response.data.user);

      showToast(response.message || 'ورود با موفقیت انجام شد', 'success');

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => {
        router.replace('/dashboard');
      }, 900);
    } catch (error) {
      setIsRedirecting(false); // Hide skeleton on error
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Login error:', error);
      }
      const message =
        (error && Array.isArray(error.errors) && error.errors[0]) ||
        error.message ||
        'خطا در ورود به حساب کاربری';
      showToast(message, 'error');
    }
  };

  if (loading || user) return null;

  if (isRedirecting) return <LoginSkeleton />;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={toast.duration} />}

      <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
        <div className="flex min-h-screen items-center justify-center p-4 sm:pt-20">
          <motion.div
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 select-none"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                ورود به حساب کاربری
              </h1>

              {/* EMAIL */}
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  ایمیل شما
                </label>

                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="example@company.com"
                  {...register('email', {
                    required: 'ایمیل الزامی است',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'فرمت ایمیل معتبر نیست' },
                  })}
                />

                <ErrorText>{errors.email?.message}</ErrorText>
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  رمز عبور شما
                </label>

                <input
                  id="password"
                  type="password"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="•••••••••"
                  {...register('password', {
                    required: 'رمز عبور الزامی است',
                    minLength: { value: 8, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' },
                  })}
                />

                <ErrorText>{errors.password?.message}</ErrorText>
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="mb-6 flex items-center justify-between">
                <label htmlFor="checkbox-remember" className="flex items-center gap-2">
                  <input
                    id="checkbox-remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    {...register('remember')}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-300">مرا به خاطر بسپار</span>
                </label>

                {/* اگر صفحه forgot ندارید، اینو موقت حذف کنید یا مسیر درست بذارید */}
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-700 hover:text-indigo-800 dark:text-indigo-400"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <motion.button
                type="submit"
                className="mb-4 w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'در حال ورود...' : 'ورود به حساب کاربری'}
              </motion.button>

              <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                ثبت‌ نام نکرده‌ اید؟{' '}
                <Link href="/signup" className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-400">
                  ایجاد حساب کاربری
                </Link>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
