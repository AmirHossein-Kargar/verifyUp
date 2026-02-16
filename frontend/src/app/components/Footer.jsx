import Link from 'next/link';
import Image from 'next/image';
import MotionWrapper from './MotionWrapper';

export default function Footer() {
    return (
        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 m-4" dir="rtl">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" prefetch={true} className="flex items-center mb-4 sm:mb-0 gap-3">
                        <MotionWrapper
                            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                            style={{ filter: 'contrast(1.1) brightness(1.05) saturate(1.1)' }}
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -6px rgba(99, 102, 241, 0.5)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Image
                                src="/Logo.png"
                                alt="VerifyUp Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                                style={{
                                    imageRendering: '-webkit-optimize-contrast',
                                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                                }}
                            />
                        </MotionWrapper>
                        <span className="text-gray-900 dark:text-white text-2xl font-semibold whitespace-nowrap tracking-wider">
                            VerifyUp
                        </span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-300 sm:mb-0 gap-4 md:gap-6">
                        <MotionWrapper as="li" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/about" prefetch={true} className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">درباره ما</Link>
                        </MotionWrapper>
                        <MotionWrapper as="li" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/privacy" prefetch={true} className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">حریم خصوصی</Link>
                        </MotionWrapper>
                        <MotionWrapper as="li" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/terms" prefetch={true} className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">قوانین و مقررات</Link>
                        </MotionWrapper>
                        <MotionWrapper as="li" whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/contact" prefetch={true} className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">تماس با ما</Link>
                        </MotionWrapper>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-600 dark:text-gray-400 sm:text-center">
                    © {new Date().getFullYear()}{' '}
                    <MotionWrapper as="span" className="inline-block" whileHover={{ scale: 1.05 }}>
                        <Link href="/" prefetch={true} className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">VerifyUp</Link>
                    </MotionWrapper>
                    . تمامی حقوق محفوظ است.
                </span>
            </div>
        </footer>
    );
}
