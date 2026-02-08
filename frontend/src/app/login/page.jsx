'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const ErrorText = ({ children }) =>
    children ? (
        <p className="mt-2 text-xs text-red-500">{children}</p>
    ) : null;

export default function LoginPage() {
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();
    const { user, loading, login } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        }
    });

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const onSubmit = async (data) => {
        try {
            const response = await api.login({
                email: data.email,
                password: data.password,
            });

            // Update auth context with user data
            if (response.data?.user) {
                login(response.data.user);
            }

            showToast(response.message || 'ورود با موفقیت انجام شد', 'success');

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            showToast(error.message || 'خطا در ورود به حساب کاربری', 'error');
        }
    }

    // Show loading or nothing while checking auth
    if (loading) {
        return null;
    }

    // Don't render login form if user is already logged in
    if (user) {
        return null;
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                    duration={toast.duration}
                />
            )}
            <div className="min-h-screen flex flex-col" dir="rtl">
                <div className="flex-1 flex items-center justify-center p-4 sm:pt-20">
                    <motion.div
                        className="w-full max-w-md bg-neutral-primary-soft p-6 sm:p-8 border border-default rounded-base shadow-lg select-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">ورود به حساب کاربری</h5>

                            <div className="mb-3 sm:mb-4">
                                <label htmlFor="email" className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    ایمیل شما
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    placeholder="example@company.com"
                                    {...register("email", {
                                        required: "ایمیل الزامی است",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "فرمت ایمیل معتبر نیست",
                                        },
                                    })}
                                />

                                <ErrorText>{errors.email?.message}</ErrorText>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    رمز عبور شما
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    placeholder="•••••••••"
                                    {...register("password", {
                                        required: "رمز عبور الزامی است",
                                        minLength: {
                                            value: 6,
                                            message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                                        },
                                    })}
                                />

                                <ErrorText>{errors.password?.message}</ErrorText>
                            </div>

                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <label className="flex items-center">
                                    <input
                                        id="checkbox-remember"
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        {...register("remember")}
                                    />
                                    <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">مرا به خاطر بسپار</span>
                                </label>
                                <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                                    فراموشی رمز عبور؟
                                </Link>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 mb-3 sm:mb-4"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? "در حال ورود..." : "ورود به حساب کاربری"}
                            </motion.button>

                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                                ثبت نام نکرده‌ اید؟ <Link href="/signup" className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-400 transition-colors">ایجاد حساب کاربری</Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
