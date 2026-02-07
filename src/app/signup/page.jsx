'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/Toast';
import { useState, useEffect } from 'react';

const ErrorText = ({ children }) =>
    children ? (
        <p className="mt-2 text-xs text-red-500">{children}</p>
    ) : null;

export default function SignupPage() {
    const router = useRouter();
    const { toast, showToast, hideToast } = useToast();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        }
    });

    const passwordValue = watch("password");
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperLower: false,
        hasSymbol: false,
        hasLongPassword: false,
        strength: 0
    });

    useEffect(() => {
        if (passwordValue) {
            const hasMinLength = passwordValue.length >= 6;
            const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(passwordValue);
            const hasSymbol = /[#$&!@%^*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue);
            const hasLongPassword = passwordValue.length >= 12;

            let strength = 0;
            if (hasMinLength) strength++;
            if (hasUpperLower) strength++;
            if (hasSymbol) strength++;
            if (hasLongPassword) strength++;

            setPasswordStrength({
                hasMinLength,
                hasUpperLower,
                hasSymbol,
                hasLongPassword,
                strength
            });
        } else {
            setPasswordStrength({
                hasMinLength: false,
                hasUpperLower: false,
                hasSymbol: false,
                hasLongPassword: false,
                strength: 0
            });
        }
    }, [passwordValue]);

    const onSubmit = async (data) => {
        try {
            const response = await api.register({
                email: data.email,
                password: data.password,
            });

            showToast(response.message || 'ثبت‌نام با موفقیت انجام شد', 'success');

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            showToast(error.message || 'خطا در ثبت‌نام', 'error');
        }
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
                            <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                                ثبت نام در سایت
                            </h5>

                            {/* NAME */}
                            <div className="mb-3 sm:mb-4">
                                <label htmlFor="name" className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    نام و نام خانوادگی
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    placeholder="نام خود را وارد کنید"
                                    {...register("name", {
                                        required: "نام و نام خانوادگی الزامی است",
                                        minLength: {
                                            value: 3,
                                            message: "حداقل ۳ کاراکتر وارد کنید",
                                        },
                                    })}
                                />

                                <ErrorText>{errors.name?.message}</ErrorText>
                            </div>

                            {/* EMAIL */}
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
                                            // ساده و کاربردی
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "فرمت ایمیل معتبر نیست",
                                        },
                                    })}
                                />

                                <ErrorText>{errors.email?.message}</ErrorText>
                            </div>

                            {/* PASSWORD */}
                            <div className="mb-3 sm:mb-4">
                                <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    رمز عبور
                                </label>

                                <div className="relative group">
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
                                            pattern: {
                                                value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                                                message: "رمز عبور باید حداقل یک حرف و یک عدد داشته باشد",
                                            },
                                        })}
                                    />

                                    {/* Password Strength Popover */}
                                    <div className="absolute z-10 p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-72 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg top-full mt-2 left-0">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                                باید حداقل ۶ کاراکتر داشته باشد
                                            </h3>
                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 1 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 2 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 3 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                                <div className={`h-1 rounded-full ${passwordStrength.strength >= 4 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            </div>
                                            <p className="mb-2">بهتر است داشته باشد:</p>
                                            <ul>
                                                <li className="flex items-center mb-1">
                                                    {passwordStrength.hasUpperLower ? (
                                                        <svg className="w-4 h-4 ml-1.5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 ml-1.5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                        </svg>
                                                    )}
                                                    حروف بزرگ و کوچک
                                                </li>
                                                <li className="flex items-center mb-1">
                                                    {passwordStrength.hasSymbol ? (
                                                        <svg className="w-4 h-4 ml-1.5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 ml-1.5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                        </svg>
                                                    )}
                                                    یک نماد (#$&)
                                                </li>
                                                <li className="flex items-center">
                                                    {passwordStrength.hasLongPassword ? (
                                                        <svg className="w-4 h-4 ml-1.5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 ml-1.5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                                        </svg>
                                                    )}
                                                    رمز عبور طولانی‌تر (حداقل ۱۲ کاراکتر)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <ErrorText>{errors.password?.message}</ErrorText>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="mb-3 sm:mb-4">
                                <label
                                    htmlFor="confirm-password"
                                    className="block mb-1.5 sm:mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    تکرار رمز عبور
                                </label>

                                <input
                                    type="password"
                                    id="confirm-password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                    placeholder="•••••••••"
                                    {...register("confirmPassword", {
                                        required: "تکرار رمز عبور الزامی است",
                                        validate: (value) =>
                                            value === passwordValue || "رمز عبور و تکرار آن یکسان نیستند",
                                    })}
                                />

                                <ErrorText>{errors.confirmPassword?.message}</ErrorText>
                            </div>

                            {/* TERMS */}
                            <div className="mb-3 sm:mb-4">
                                <div className="flex items-center">
                                    <input
                                        id="checkbox-terms"
                                        type="checkbox"
                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        {...register("terms", {
                                            validate: (v) => v === true || "برای ادامه باید قوانین را بپذیرید",
                                        })}
                                    />
                                    <label htmlFor="checkbox-terms" className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        قوانین و مقررات را می‌پذیرم
                                    </label>
                                </div>

                                <ErrorText>{errors.terms?.message}</ErrorText>
                            </div>

                            <motion.button
                                type="submit"
                                className="w-full text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 mb-3 sm:mb-4"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? "در حال ارسال..." : "ثبت نام"}
                            </motion.button>

                            <div className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
                                قبلاً ثبت نام کرده‌ اید؟{" "}
                                <Link href="/login" className="text-indigo-700 hover:text-indigo-800 dark:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
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