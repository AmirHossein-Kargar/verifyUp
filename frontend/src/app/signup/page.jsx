'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ErrorText = ({ children }) => (children ? <p className="mt-2 text-xs text-red-500">{children}</p> : null);

export default function SignupPage() {
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();
    const { user, loading, login } = useAuth();

    const redirectTimerRef = useRef(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onChange',
        defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
    });

    const passwordValue = watch('password');
    const [showPasswordPopover, setShowPasswordPopover] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperLower: false,
        hasSymbol: false,
        hasLongPassword: false,
        strength: 0,
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

    useEffect(() => {
        if (!passwordValue) {
            setPasswordStrength({ hasMinLength: false, hasUpperLower: false, hasSymbol: false, hasLongPassword: false, strength: 0 });
            return;
        }

        const hasMinLength = passwordValue.length >= 6;
        const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(passwordValue);
        const hasSymbol = /[#$&!@%^*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
        const hasLongPassword = passwordValue.length >= 12;

        let strength = 0;
        if (hasMinLength) strength++;
        if (hasUpperLower) strength++;
        if (hasSymbol) strength++;
        if (hasLongPassword) strength++;

        setPasswordStrength({ hasMinLength, hasUpperLower, hasSymbol, hasLongPassword, strength });
    }, [passwordValue]);

    const onSubmit = async (data) => {
        try {
            const response = await api.register({ name: data.name, email: data.email, password: data.password });

            if (response.data?.user) login(response.data.user);

            showToast(response.message || 'ثبت‌ نام با موفقیت انجام شد', 'success');

            if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
            redirectTimerRef.current = setTimeout(() => {
                router.replace('/dashboard');
            }, 900);
        } catch (error) {
            showToast(error.message || 'خطا در ثبت‌ نام', 'error');
        }
    };

    if (loading || user) return null;

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
                                ثبت‌ نام در سایت
                            </h1>

                            {/* NAME */}
                            <div className="mb-4">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    نام و نام خانوادگی
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="نام خود را وارد کنید"
                                    {...register('name', { required: 'نام و نام خانوادگی الزامی است', minLength: { value: 3, message: 'حداقل ۳ کاراکتر وارد کنید' } })}
                                />
                                <ErrorText>{errors.name?.message}</ErrorText>
                            </div>

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
                                    رمز عبور
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        placeholder="•••••••••"
                                        onFocus={() => setShowPasswordPopover(true)}
                                        onBlur={() => setShowPasswordPopover(false)}
                                        {...register('password', {
                                            required: 'رمز عبور الزامی است',
                                            minLength: { value: 6, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
                                            pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'رمز عبور باید حداقل یک حرف و یک عدد داشته باشد' },
                                        })}
                                    />

                                    {showPasswordPopover && (
                                        <div className="absolute left-0 top-full z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">راهنمای قدرت رمز عبور</h3>

                                            <div className="mb-3 grid grid-cols-4 gap-2">
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 1 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 2 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 3 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 4 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                            </div>

                                            <p className="mb-2">پیشنهاد می‌شود:</p>
                                            <ul className="space-y-1">
                                                <li className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${passwordStrength.hasUpperLower ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    ترکیب حروف بزرگ و کوچک
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${passwordStrength.hasSymbol ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    استفاده از یک نماد (#$&)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${passwordStrength.hasLongPassword ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                    رمز عبور طولانی‌تر (حداقل ۱۲ کاراکتر)
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <ErrorText>{errors.password?.message}</ErrorText>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="mb-4">
                                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    تکرار رمز عبور
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="•••••••••"
                                    {...register('confirmPassword', {
                                        required: 'تکرار رمز عبور الزامی است',
                                        validate: (value) => value === passwordValue || 'رمز عبور و تکرار آن یکسان نیستند',
                                    })}
                                />
                                <ErrorText>{errors.confirmPassword?.message}</ErrorText>
                            </div>

                            {/* TERMS */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        id="checkbox-terms"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                                        {...register('terms', {
                                            validate: (v) => v === true || 'برای ادامه باید قوانین را بپذیرید',
                                        })}
                                    />

                                    <label
                                        htmlFor="checkbox-terms"
                                        className="text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        قوانین و مقررات را میپذیرم{' '}
                                        <Link
                                            href="/terms"
                                            className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-400"
                                        >
                                            (مشاهده)
                                        </Link>
                                    </label>
                                </div>

                                <ErrorText>{errors.terms?.message}</ErrorText>
                            </div>

                            <motion.button
                                type="submit"
                                className="mb-4 w-full rounded-lg bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? 'در حال ارسال...' : 'ثبت‌ نام'}
                            </motion.button>

                            <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                                قبلاً ثبت‌ نام کرده‌ اید؟{' '}
                                <Link href="/login" className="text-indigo-700 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    ورود به حساب
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
