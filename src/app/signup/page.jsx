import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-sm bg-neutral-primary-soft p-8 border border-default rounded-base shadow-lg select-none">
                <form action="#">
                    <h5 className="text-xl font-semibold text-heading mb-8 text-center">ثبت نام در سایت</h5>

                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-heading">
                            نام و نام خانوادگی
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
                            placeholder="نام خود را وارد کنید"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-heading">
                            ایمیل شما
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
                            placeholder="example@company.com"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-heading">
                            رمز عبور
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
                            placeholder="•••••••••"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-heading">
                            تکرار رمز عبور
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body select-text"
                            placeholder="•••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            id="checkbox-terms"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                        />
                        <label htmlFor="checkbox-terms" className="mr-2 text-sm font-medium text-heading">
                            قوانین و مقررات را می‌پذیرم
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-4"
                    >
                        ثبت نام
                    </button>

                    <div className="text-sm font-medium text-body text-center">
                        قبلاً ثبت نام کرده‌ اید؟ <Link href="/login" className="text-fg-brand">ورود به حساب</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
