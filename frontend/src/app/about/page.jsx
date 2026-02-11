// app/about/page.jsx
import MotionDiv from './MotionDiv';

export const metadata = {
    title: 'درباره وریفای آپ',
    description: 'پلتفرم تخصصی برای کمک به احراز هویت کاربران ایرانی در آپورک',
};

const features = [
    {
        title: 'احراز هویت سریع و قابل‌ اعتماد',
        description: "فرآیند های ما به‌گونه‌ ای طراحی شده‌ اند که احراز هویت کاربران در کوتاه‌ ترین زمان ممکن و با بالاترین نرخ موفقیت انجام شود، بدون اتلاف وقت و مراحل پیچیده.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
            </svg>
        ),
    },
    {
        title: 'امنیت و محرمانگی اطلاعات',
        description: 'حفظ امنیت اطلاعات کاربران اولویت اصلی ماست. تمامی داده‌ ها با رعایت استاندارد های امنیتی و محرمانگی مدیریت میشوند و هیچ اطلاعاتی خارج از چارچوب تعیین‌ شده استفاده نخواهد شد.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
            </svg>
        ),
    },
    {
        title: 'پشتیبانی حرفه‌ ای و مستمر',
        description: 'تیم پشتیبانی وریفای‌ آپ در تمام مراحل کنار شماست؛ از مشاورهٔ اولیه تا تکمیل نهایی احراز هویت و حتی پس از آن، پاسخگوی سوالات و نیاز های شما خواهیم بود.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M7 9h5m3 0h2M7 12h2m3 0h5M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.616a1 1 0 0 0-.67.257l-2.88 2.592A.5.5 0 0 1 8 18.477V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
            </svg>
        ),
    },
    {
        title: 'قیمت‌ گذاری شفاف',
        description: 'ما معتقدیم خدمات حرفه‌ ای باید با قیمت‌ گذاری شفاف و منطقی ارائه شوند. هزینه‌ ها از ابتدا مشخص هستند و هیچ مبلغ پنهانی در فرآیند وجود ندارد.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
            </svg>
        ),
    },
];

export default function AboutPage() {
    return (
        <main className="bg-white dark:bg-gray-900" dir="rtl">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
                {/* Header (Flowbite typography style) */}
                <MotionDiv
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mx-auto mb-10 max-w-3xl text-center"
                >
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                        درباره <span className="text-indigo-600 dark:text-indigo-500">وریفای آپ</span>
                    </h1>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 sm:text-lg">
                        وریفای آپ یک پلتفرم تخصصی برای کمک به احراز هویت کاربران ایرانی در پلتفرم آپورک است.
                        ما فرآیند تأیید هویت را ساده‌ تر، سریع‌ تر و امن‌ تر میکنیم تا بتوانید بدون دغدغه در آپورک فعالیت کنید.
                    </p>
                </MotionDiv>

                {/* Features (Flowbite card pattern) */}
                <section className="mx-auto mb-10 max-w-6xl">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f, idx) => (
                            <MotionDiv
                                key={f.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.45, delay: idx * 0.06 }}
                                whileHover={{ y: -2 }}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:bg-gray-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                                    {f.icon}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    {f.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    {f.description}
                                </p>
                            </MotionDiv>
                        ))}
                    </div>
                </section>

                {/* Mission (Flowbite content block) */}
                <section className="mx-auto max-w-6xl">
                    <MotionDiv
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.15 }}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8"
                    >
                        <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            ماموریت ما
                        </h2>

                        <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                            ماموریت وریفای‌ آپ فراهم‌ کردن مسیری امن، قابل‌ اعتماد و حرفه‌ ای برای کاربران ایرانی است تا بتوانند بدون محدودیت و نگرانی، در پلتفرم‌ های بین‌المللی فعالیت کنند.
                        </p>

                        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                            ما میدانیم که فرآیند احراز هویت برای بسیاری از کاربران میتواند پیچیده و زمان‌ بر باشد. به همین دلیل، با استفاده از تجربهٔ تیم تخصصی خود، این مسیر را ساده سازی کرده‌ ایم تا کاربران بتوانند با اطمینان خاطر و در کوتاه‌ ترین زمان ممکن، احراز هویت خود را با موفقیت انجام دهند.
                        </p>

                    </MotionDiv>
                </section>
            </div>
        </main>
    );
}
