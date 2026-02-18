import MotionDiv from '../components/MotionDiv';

// Static page - can be cached for 1 hour
export const revalidate = 3600;

export const metadata = {
    title: 'شرایط و قوانین',
    description: 'شرایط و قوانین استفاده از خدمات وریفای آپ - پلتفرم تخصصی احراز هویت آپورک',
    keywords: ['شرایط استفاده', 'قوانین', 'وریفای آپ', 'احراز هویت آپورک'],
    openGraph: {
        title: 'شرایط و قوانین | وریفای آپ',
        description: 'شرایط و قوانین استفاده از خدمات وریفای آپ',
        type: 'website',
    },
    alternates: {
        canonical: 'https://verifyup.ir/terms',
    },
};

export default function TermsPage() {
    return (
        <main className="bg-white dark:bg-gray-900" dir="rtl">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
                {/* Header */}
                <MotionDiv
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mx-auto mb-10 max-w-3xl text-center"
                >
                    <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                        شرایط و <span className="text-indigo-600 dark:text-indigo-500">قوانین</span>
                    </h1>
                    <p className="text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400 sm:text-lg">
                        لطفاً قبل از استفاده از خدمات وریفای آپ، شرایط و قوانین زیر را با دقت مطالعه فرمایید.
                    </p>
                </MotionDiv>

                {/* Terms Content */}
                <section className="mx-auto max-w-5xl">
                    <MotionDiv
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.15 }}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8"
                    >
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                                    شرایط و قوانین استفاده از خدمات وریفای آپ
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    آخرین به‌روزرسانی: بهمن 1404
                                </p>
                            </div>

                            {/* Introduction */}
                            <div>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    ما در وریفای آپ تلاش می‌کنیم خدمات را با شفافیت کامل، مسئولیت‌پذیری و احترام به کاربران ارائه دهیم. لطفاً پیش از ثبت سفارش، موارد زیر را با دقت مطالعه فرمایید.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۱. پذیرش شرایط
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    ثبت سفارش در وریفای آپ به منزله مطالعه و پذیرش کامل این شرایط است. هدف ما ایجاد همکاری شفاف و حرفه‌ای با کاربران می‌باشد.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۲. ماهیت خدمات
                                </h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    خدمات ما شامل:
                                </p>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>مشاوره و راهنمایی تخصصی در فرآیند احراز هویت</li>
                                    <li>آماده‌سازی زیرساخت فنی (VPS سه‌ماهه، سیم‌کارت، راهنمایی ساخت حساب)</li>
                                    <li>پشتیبانی در روند تکمیل مراحل موردنیاز</li>
                                </ul>
                                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    می‌باشد.
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    وریفای آپ هیچ‌گونه ارتباط سازمانی یا نمایندگی رسمی با پلتفرم‌هایی مانند Upwork ندارد و تصمیم نهایی درباره تأیید یا رد حساب، کاملاً توسط پلتفرم مربوطه اتخاذ می‌شود.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۳. محرمانگی و امنیت اطلاعات
                                </h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    اعتماد شما سرمایه اصلی ماست.
                                </p>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>تمامی مدارک و اطلاعات ارسالی صرفاً برای ارائه خدمات استفاده می‌شود.</li>
                                    <li>اطلاعات کاربران نزد ما محرمانه باقی می‌ماند.</li>
                                    <li>دسترسی به اطلاعات محدود و کنترل‌شده است.</li>
                                    <li>در صورت درخواست رسمی مراجع قضایی، مطابق قانون عمل خواهد شد.</li>
                                </ul>
                            </div>

                            {/* Section 4 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۴. مسئولیت کاربر
                                </h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    برای ارائه بهترین نتیجه، همکاری و صداقت کاربر ضروری است.
                                </p>
                                <p className="mb-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    کاربر متعهد می‌شود:
                                </p>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>اطلاعات واقعی و متعلق به خود ارائه دهد</li>
                                    <li>از خدمات در چارچوب قوانین استفاده کند</li>
                                    <li>امنیت حساب و اطلاعات تحویلی را حفظ نماید</li>
                                </ul>
                                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    در صورت ارائه اطلاعات نادرست یا استفاده غیرقانونی از خدمات، مسئولیت کامل بر عهده کاربر خواهد بود.
                                </p>
                            </div>

                            {/* Section 5 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۵. عدم تضمین نتیجه نهایی
                                </h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    با توجه به اینکه تصمیم‌گیری نهایی در اختیار پلتفرم مقصد است:
                                </p>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>تضمینی برای تأیید نهایی حساب وجود ندارد</li>
                                    <li>تضمینی برای عدم محدودیت یا مسدودسازی آینده وجود ندارد</li>
                                </ul>
                                <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    ما متعهد به انجام صحیح و حرفه‌ای خدمات هستیم، اما نتیجه نهایی وابسته به سیاست‌های پلتفرم مربوطه می‌باشد.
                                </p>
                            </div>

                            {/* Section 6 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۶. شرایط مالی و بازگشت وجه
                                </h3>
                                <p className="mb-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    به دلیل اینکه:
                                </p>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>خدمات بلافاصله پس از ثبت سفارش آغاز می‌شود</li>
                                    <li>زیرساخت اختصاصی (VPS، سیم‌کارت و سایر ملزومات) تهیه می‌گردد</li>
                                    <li>هزینه‌ها عملیاتی و مصرف‌شده هستند</li>
                                </ul>
                                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                                    امکان لغو سفارش یا بازگشت وجه پس از ثبت و شروع فرآیند وجود ندارد.
                                </p>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    لطفاً پیش از ثبت سفارش، با آگاهی کامل تصمیم‌گیری فرمایید.
                                </p>
                            </div>

                            {/* Section 7 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۷. زیرساخت VPS و سیم‌کارت
                                </h3>
                                <ul className="mr-5 list-disc space-y-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    <li>VPS به‌صورت دوره سه‌ماهه ارائه می‌شود.</li>
                                    <li>پس از پایان دوره، تمدید آن بر عهده کاربر است.</li>
                                    <li>هرگونه استفاده خارج از چارچوب قانونی از زیرساخت ارائه‌شده، مسئولیت مستقیم کاربر خواهد بود.</li>
                                </ul>
                            </div>

                            {/* Section 8 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۸. حق توقف خدمات
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    در صورت مشاهده تخلف، سوءاستفاده، یا ارائه اطلاعات غیرواقعی، وریفای آپ این حق را دارد که خدمات را متوقف کند.
                                </p>
                            </div>

                            {/* Section 9 */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                                    ۹. به‌روزرسانی شرایط
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    ممکن است این شرایط در طول زمان به‌روزرسانی شود. ادامه استفاده از خدمات به منزله پذیرش نسخه جدید خواهد بود.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                    ارتباط با پشتیبانی
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
                                    در صورت هرگونه سؤال یا ابهام، تیم پشتیبانی آماده پاسخگویی است. ما شفافیت را اصل همکاری می‌دانیم.
                                </p>
                            </div>
                        </div>
                    </MotionDiv>
                </section>
            </div>
        </main>
    );
}
