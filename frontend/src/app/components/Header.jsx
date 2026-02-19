'use client';

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import CartIcon from "./CartIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { motion } from 'framer-motion';
import { api } from "@/lib/api";
import { useProfileImage } from "@/contexts/ProfileImageContext";


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const { displayUrl: profileImageDisplayUrl } = useProfileImage();
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [avatarImageError, setAvatarImageError] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setAvatarImageError(false);
    }, [profileImageDisplayUrl]);

    // Helper function to check if a route is active
    const isActiveRoute = (route) => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname?.startsWith(route);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return <header className="fixed top-2 sm:top-4 right-1/2 translate-x-1/2 w-[96%] sm:w-[95%] max-w-7xl z-50" dir="rtl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-2.5">
            <div className="flex items-center justify-between relative">
                {/* Logo */}
                <Link href="/" prefetch={true} className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center overflow-hidden"
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
                            priority
                        />
                    </motion.div>
                    <span className="text-base font-semibold text-gray-900 dark:text-white">
                        VerifyUp
                    </span>
                </Link>

                {/* Desktop Navigation - Centered */}
                <nav className="hidden md:flex items-center gap-4 lg:gap-5 absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/"
                        prefetch={true}
                        className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out ${isActiveRoute('/')
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        خانه
                    </Link>
                    <Link
                        href="/services"
                        prefetch={true}
                        className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out ${isActiveRoute('/services')
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        سرویس ها
                    </Link>
                    <Link
                        href="/contact"
                        prefetch={true}
                        className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out ${isActiveRoute('/contact')
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        تماس با ما
                    </Link>
                    <Link
                        href="/about"
                        prefetch={true}
                        className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-out ${isActiveRoute('/about')
                            ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        درباره ما
                    </Link>
                </nav>

                {/* Right Side - Auth Buttons & Menu */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <ThemeToggle />
                    <CartIcon />

                    {mounted && (
                        user ? (
                            // Logged in state - Show avatar dropdown
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    data-testid="user-menu-button"
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full cursor-pointer bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 ease-out overflow-hidden shrink-0"
                                >
                                    {profileImageDisplayUrl && !avatarImageError ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={profileImageDisplayUrl}
                                            src={profileImageDisplayUrl}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={() => {
                                                if (process.env.NODE_ENV !== "production") {
                                                    console.warn("[Header] Profile image failed to load:", profileImageDisplayUrl?.slice(0, 60));
                                                }
                                                setAvatarImageError(true);
                                            }}
                                        />
                                    ) : (
                                        user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
                                    )}
                                </button>

                                {/* Dropdown menu */}
                                {isUserDropdownOpen && (
                                    <div className="absolute left-0 top-10 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-44 animate-in fade-in duration-200">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-normal">
                                            <div className="font-medium text-gray-900 dark:text-white truncate">{user?.name || 'کاربر'}</div>
                                            <div className="truncate text-gray-500 dark:text-gray-400">{user?.email || user?.phone}</div>
                                        </div>
                                        <ul className="p-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <li>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                    className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md text-right transition-colors duration-200 ease-out"
                                                >
                                                    داشبورد
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/dashboard/profile"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                    className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md text-right transition-colors duration-200 ease-out"
                                                >
                                                    تنظیمات
                                                </Link>
                                            </li>
                                            {user?.role === 'admin' && (
                                                <li>
                                                    <Link
                                                        href="/admin"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                        className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-md text-right transition-colors duration-200 ease-out"
                                                    >
                                                        پنل ادمین
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <button
                                                    type="button"
                                                    data-testid="logout-button"
                                                    onClick={handleLogout}
                                                    className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-500 rounded-md text-right transition-colors duration-200 ease-out"
                                                >
                                                    خروج
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Logged out state
                            <>
                                <Link href="/login" prefetch={true} className="hidden sm:block text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 whitespace-nowrap transition-colors duration-200 ease-out">ورود</Link>
                                <Link href="/signup" prefetch={true} className="hidden xs:block text-sm font-medium text-white bg-indigo-700 rounded-lg px-3 py-1.5 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 whitespace-nowrap transition-colors duration-200 ease-out">ثبت نام</Link>
                            </>
                        )
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ease-out"
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
                            className={`w-full text-center text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-out ${isActiveRoute('/')
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            خانه
                        </Link>
                        <Link
                            href="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className={`w-full text-center transition-all duration-200 ease-out text-sm py-3 px-4 rounded-lg font-medium ${isActiveRoute('/services')
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            سرویس ها
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className={`w-full text-center transition-all duration-200 ease-out text-sm py-3 px-4 rounded-lg font-medium ${isActiveRoute('/contact')
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            تماس با ما
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className={`w-full text-center transition-all duration-200 ease-out text-sm py-3 px-4 rounded-lg font-medium ${isActiveRoute('/about')
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            درباره ما
                        </Link>

                        {/* Mobile Auth Buttons */}
                        {mounted && (
                            <div className="xs:hidden flex flex-col items-center gap-2 w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {user ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-sm font-medium text-white bg-indigo-700 rounded-lg px-5 py-2.5 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-colors duration-200 ease-out"
                                        >
                                            داشبورد
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg px-5 py-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200 ease-out"
                                        >
                                            تنظیمات
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg px-5 py-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200 ease-out"
                                            >
                                                پنل ادمین
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            data-testid="logout-button"
                                            onClick={handleLogout}
                                            className="w-full text-sm font-medium text-red-600 dark:text-red-500 bg-white border border-gray-300 rounded-lg px-5 py-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200 ease-out"
                                        >
                                            خروج
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg px-5 py-2.5 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors duration-200 ease-out"
                                        >
                                            ورود
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-sm font-medium text-white bg-indigo-700 rounded-lg px-5 py-2.5 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 transition-colors duration-200 ease-out"
                                        >
                                            ثبت نام
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </div>
    </header>

}