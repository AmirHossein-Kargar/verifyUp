'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const ErrorText = ({ children }) =>
    children ? (
        <p className="mt-2 text-xs text-red-500">{children}</p>
    ) : null;

export default function SignupPage() {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange", // تغییر از onTouched به onChange برای نمایش لحظه‌ای خطاها
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        }
    });

    const passwordValue = watch("password");

    const onSubmit = async (data) => {
        console.log("FORM DATA:", data);
    }


    return (
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

                            <input
                                type="password"
                                id="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                placeholder="•••••••••"
                                {...register("password", {
                                    required: "رمز عبور الزامی است",
                                    minLength: {
                                        value: 8,
                                        message: "رمز عبور باید حداقل ۸ کاراکتر باشد",
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                                        message: "رمز عبور باید حداقل یک حرف و یک عدد داشته باشد",
                                    },
                                })}
                            />

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
    );
}