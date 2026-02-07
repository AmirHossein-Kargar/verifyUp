'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 m-4" dir="rtl">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" className="flex items-center mb-4 sm:mb-0 gap-2 group">
                        <motion.div
                            className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center"
                            whileHover={{
                                scale: 1.1,
                                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -6px rgba(99, 102, 241, 0.5)"
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <span className="text-white font-bold text-lg">ل</span>
                        </motion.div>
                        <motion.span
                            className="text-gray-900 dark:text-white self-center text-2xl font-semibold whitespace-nowrap group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                            whileHover={{
                                scale: 1.05
                            }}
                            transition={{ duration: 0.2 }}
                        >
                            لوگو
                        </motion.span>
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-600 dark:text-gray-300 sm:mb-0 gap-4 md:gap-6">
                        <motion.li whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/about" className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">درباره ما</Link>
                        </motion.li>
                        <motion.li whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/privacy" className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">حریم خصوصی</Link>
                        </motion.li>
                        <motion.li whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/terms" className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">قوانین و مقررات</Link>
                        </motion.li>
                        <motion.li whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Link href="/contact" className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">تماس با ما</Link>
                        </motion.li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-600 dark:text-gray-400 sm:text-center">
                    © {new Date().getFullYear()}{' '}
                    <motion.span className="inline-block" whileHover={{ scale: 1.05 }}>
                        <Link href="/" className="transition-colors duration-300 hover:text-indigo-600 dark:hover:text-indigo-400">لوگو</Link>
                    </motion.span>
                    . تمامی حقوق محفوظ است.
                </span>
            </div>
        </footer>
    );
}
