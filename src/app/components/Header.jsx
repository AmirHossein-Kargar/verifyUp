import Link from "next/link";
import ThemeToggle from "./ThemeToggle";


export default function Header() {
    return <header className="fixed top-4 right-1/2 translate-x-1/2 w-[95%] max-w-7xl z-50" dir="rtl">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ل</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-semibold text-base hidden sm:block">لوگو</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-5">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">خانه</Link>
                    <Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">ویژگی‌ها</Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">درباره ما</Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">تماس با ما</Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button className="btn-ghost hidden sm:block text-xs py-1.5 px-2.5">ورود</button>
                    <button className="btn-default text-xs py-1.5 px-2.5">ثبت نام</button>
                </div>
            </div>
        </div>
    </header>

}