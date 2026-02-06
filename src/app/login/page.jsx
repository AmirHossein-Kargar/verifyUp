'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

const ErrorText = ({ children }) =>
    children ? (
        <p className="mt-2 text-xs text-red-500">{children}</p>
    ) : null;

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        }
    });

    const onSubmit = async (data) => {
        console.log("LOGIN DATA:", data);
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:pt-20 overflow-hidden" dir="rtl">
            <div className="w-full max-w-md bg-neutral-primary-soft p-6 sm:p-8 border border-default rounded-base shadow-lg select-none">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h5 className="h5 mb-4 sm:mb-6 text-center">ورود به حساب کاربری</h5>

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
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "فرمت ایمیل معتبر نیست",
                                },
                            })}
                        />

                        <ErrorText>{errors.email?.message}</ErrorText>
                    </div>

                    <div className="mb-3 sm:mb-4">
                        <label htmlFor="password" className="block mb-1.5 sm:mb-2 text-sm font-medium text-heading">
                            رمز عبور شما
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
                            })}
                        />

                        <ErrorText>{errors.password?.message}</ErrorText>
                    </div>

                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <label className="flex items-center">
                            <input
                                id="checkbox-remember"
                                type="checkbox"
                                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                                {...register("remember")}
                            />
                            <span className="mr-2 text-sm font-medium text-heading">مرا به خاطر بسپار</span>
                        </label>
                        <Link href="#" className="text-sm font-medium text-fg-brand">
                            فراموشی رمز عبور؟
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn-default w-full mb-3 sm:mb-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "در حال ورود..." : "ورود به حساب کاربری"}
                    </button>

                    <div className="text-sm font-medium text-body text-center">
                        ثبت نام نکرده‌ اید؟ <Link href="/signup" className="text-fg-brand">ایجاد حساب کاربری</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
