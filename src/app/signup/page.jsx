'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

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
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:pt-20 overflow-hidden" dir="rtl">
            <div className="w-full max-w-md bg-neutral-primary-soft p-6 sm:p-8 border border-default rounded-base shadow-lg select-none">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h5 className="text-xl sm:text-2xl font-semibold text-heading mb-4 sm:mb-6 text-center">
                        ثبت نام در سایت
                    </h5>

                    {/* NAME */}
                    <div className="mb-3 sm:mb-4">
                        <label htmlFor="name" className="block mb-1.5 sm:mb-2 text-sm font-medium text-heading">
                            نام و نام خانوادگی
                        </label>

                        <input
                            type="text"
                            id="name"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
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
                        <label htmlFor="email" className="block mb-1.5 sm:mb-2 text-sm font-medium text-heading">
                            ایمیل شما
                        </label>

                        <input
                            type="email"
                            id="email"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
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
                        <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-sm font-medium text-heading">
                            رمز عبور
                        </label>

                        <input
                            type="password"
                            id="password"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
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
                            className="block mb-1.5 sm:mb-2 text-sm font-medium text-heading"
                        >
                            تکرار رمز عبور
                        </label>

                        <input
                            type="password"
                            id="confirm-password"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
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
                                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                                {...register("terms", {
                                    validate: (v) => v === true || "برای ادامه باید قوانین را بپذیرید",
                                })}
                            />
                            <label htmlFor="checkbox-terms" className="mr-2 text-sm font-medium text-heading">
                                قوانین و مقررات را می‌پذیرم
                            </label>
                        </div>

                        <ErrorText>{errors.terms?.message}</ErrorText>
                    </div>

                    <button type="submit" className="btn-default w-full mb-3 sm:mb-4" disabled={isSubmitting}>
                        {isSubmitting ? "در حال ارسال..." : "ثبت نام"}
                    </button>

                    <div className="text-sm font-medium text-body text-center">
                        قبلاً ثبت نام کرده‌ اید؟{" "}
                        <Link href="/login" className="text-fg-brand">
                            ورود به حساب
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}