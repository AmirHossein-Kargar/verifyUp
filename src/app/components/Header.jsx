'use client';

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import CartIcon from "./CartIcon";


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return <header className="fixed top-2 sm:top-4 right-1/2 translate-x-1/2 w-[96%] sm:w-[95%] max-w-7xl z-50" dir="rtl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-2.5">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-base sm:text-lg">ل</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">لوگو</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4 lg:gap-5">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm whitespace-nowrap">خانه</Link>
                    <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm whitespace-nowrap">سرویس ها</Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm whitespace-nowrap">تماس با ما</Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm whitespace-nowrap">درباره ما</Link>
                </nav>

                {/* Right Side - Auth Buttons & Menu */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <CartIcon />
                    <ThemeToggle />
                    <Link href="/login" className="btn-ghost hidden sm:block text-xs py-1.5 px-2.5 whitespace-nowrap">ورود</Link>
                    <Link href="/register" className="btn-default hidden xs:block text-xs py-1.5 px-2.5 whitespace-nowrap">ثبت نام</Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col items-center gap-1">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all text-sm py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium"
                        >
                            خانه
                        </Link>
                        <Link
                            href="/features"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all text-sm py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium"
                        >
                            سرویس ها
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all text-sm py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium"
                        >
                            تماس با ما
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full text-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all text-sm py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 font-medium"
                        >
                            درباره ما
                        </Link>

                        {/* Mobile Auth Buttons */}
                        <div className="xs:hidden flex flex-col items-center gap-2 w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-ghost w-full text-sm py-2.5 px-4 font-medium"
                            >
                                ورود
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-default w-full text-sm py-2.5 px-4 font-medium"
                            >
                                ثبت نام
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    </header>

}