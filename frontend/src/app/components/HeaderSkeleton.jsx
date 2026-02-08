export default function HeaderSkeleton() {
    return (
        <header className="fixed top-2 sm:top-4 right-1/2 translate-x-1/2 w-[96%] sm:w-[95%] max-w-7xl z-50" dir="rtl">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-2.5">
                <div className="flex items-center justify-between">
                    {/* Logo Skeleton */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div className="w-12 h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>

                    {/* Desktop Navigation Skeleton */}
                    <nav className="hidden md:flex items-center gap-4 lg:gap-5">
                        <div className="w-10 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-14 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                        <div className="w-14 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </nav>

                    {/* Right Side Skeleton */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Cart Icon Skeleton */}
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>

                        {/* Theme Toggle Skeleton */}
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>

                        {/* Auth Buttons Skeleton */}
                        <div className="hidden sm:block w-12 h-7 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                        <div className="hidden xs:block w-16 h-7 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>

                        {/* Mobile Menu Button Skeleton */}
                        <div className="md:hidden w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </header>
    );
}
