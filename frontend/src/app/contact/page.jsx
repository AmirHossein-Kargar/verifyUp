import Image from 'next/image';
import MotionWrapper from '../components/MotionWrapper';

// Static page - can be cached for 1 hour
export const revalidate = 3600;

export const metadata = {
    title: 'تماس با ما',
    description: 'ارتباط با تیم پشتیبانی وریفای آپ از طریق تلفن، ایمیل و تلگرام. پاسخگویی سریع و حرفه‌ای در ساعات کاری.',
    keywords: ['تماس با وریفای آپ', 'پشتیبانی آپورک', 'شماره تماس', 'ایمیل پشتیبانی', 'تلگرام وریفای آپ'],
    openGraph: {
        title: 'تماس با ما | وریفای آپ',
        description: 'راه‌های ارتباطی با تیم پشتیبانی وریفای آپ - تلفن، ایمیل، تلگرام',
        type: 'website',
    },
    alternates: {
        canonical: 'https://verifyup.ir/contact',
    },
};

export default function Contact() {
    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <MotionWrapper
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                        پشتیبانی و <span className="text-indigo-600 dark:text-indigo-500">تماس با ما</span>
                    </h1>

                </MotionWrapper>

                {/* Contact Info */}
                <div className="max-w-6xl mx-auto">
                    <MotionWrapper
                        className="bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-8">
                            <MotionWrapper
                                className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full overflow-hidden ring-4 ring-indigo-100 dark:ring-indigo-900"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Image
                                    src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                                    alt="تیم پشتیبانی"
                                    fill
                                    sizes="(max-width: 640px) 96px, 112px"
                                    className="object-cover"
                                />
                            </MotionWrapper>
                            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white mb-2 sm:text-xl">
                                تیم پشتیبانی وریفای آپ
                            </h3>
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400 text-center mb-6 px-4 leading-relaxed">
                                آماده پاسخگویی به سوالات و راهنمایی شما در تمام مراحل
                            </p>
                        </div>

                        <h4 className="text-base font-semibold leading-snug text-gray-900 dark:text-white mb-6 text-center sm:text-lg">
                            اطلاعات تماس
                        </h4>

                        {/* Horizontal Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MotionWrapper
                                as="a"
                                href="tel:+989123456789"
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 ease-out cursor-pointer border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 select-none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18.427 14.768 17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 sm:text-base">تلفن تماس</h5>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed" dir="ltr">021-12345678</p>
                                </div>
                            </MotionWrapper>

                            <MotionWrapper
                                as="a"
                                href="mailto:support@verifyup.com"
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 ease-out cursor-pointer border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 select-none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth="2"
                                            d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 sm:text-base">ایمیل</h5>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed break-all">support@verifyup.com</p>
                                </div>
                            </MotionWrapper>

                            <MotionWrapper
                                as="a"
                                href="https://t.me/verifyup_support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 ease-out cursor-pointer border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 select-none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 sm:text-base">تلگرام</h5>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">verifyup_support</p>
                                </div>
                            </MotionWrapper>

                            <MotionWrapper
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 ease-out border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 select-none"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 sm:text-base">ساعات کاری</h5>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">شنبه تا پنجشنبه</p>
                                    <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">۹ صبح تا ۶ عصر</p>
                                </div>
                            </MotionWrapper>
                        </div>
                    </MotionWrapper>
                </div>
            </div>
        </div>
    );
}
