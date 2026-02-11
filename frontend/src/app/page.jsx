import HomeClient from './HomeClient';
import MotionSection from './MotionSection';
import StepCard from './components/StepCard';
import FAQ from './components/FAQ';

const steps = [
  {
    step: '۱',
    title: 'ثبت‌ نام',
    description: 'با ایمیل و رمز عبور خود در سیستم ثبت‌ نام کنید و حساب کاربری خود را ایجاد نمایید.',
    icon: (
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    step: '۲',
    title: 'ثبت سفارش',
    description: 'سفارش احراز هویت خود را ثبت کنید و اطلاعات موردنیاز را در فرم وارد نمایید.',
    icon: (
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M5.617 2.076a1 1 0 0 1 1.09.217L8 3.586l1.293-1.293a1 1 0 0 1 1.414 0L12 3.586l1.293-1.293a1 1 0 0 1 1.414 0L16 3.586l1.293-1.293A1 1 0 0 1 19 3v18a1 1 0 0 1-1.707.707L16 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L12 20.414l-1.293 1.293a1 1 0 0 1-1.414 0L8 20.414l-1.293 1.293A1 1 0 0 1 5 21V3a1 1 0 0 1 .617-.924ZM9 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    step: '۳',
    title: 'ارسال مدارک',
    description: 'مدارک هویتی خود را آپلود کنید و منتظر تأیید نهایی از طرف تیم آپورک باشید.',
    icon: (
      <svg
        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600 dark:text-indigo-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="bg-white dark:bg-gray-900" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
        {/* Hero */}
        <HomeClient />

        {/* Steps */}
        <MotionSection className="mx-auto max-w-6xl px-2 sm:px-4" delay={0.15}>
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            مراحل احراز هویت
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {steps.map((s, index) => (
              <div key={s.step} className={index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <StepCard step={s.step} title={s.title} description={s.description} icon={s.icon} index={index} />
              </div>
            ))}
          </div>
        </MotionSection>

        {/* FAQ */}
        <MotionSection delay={0.25}>
          <FAQ />
        </MotionSection>
      </div>
    </main>
  );
}
