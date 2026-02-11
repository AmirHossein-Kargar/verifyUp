export default function DashboardSkeleton({ sidebarOpen = false }) {
    return (
        <div dir="rtl">
            {/* Navbar Skeleton */}
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pr-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Skeleton */}
            <div className="p-4 sm:p-6 mt-14">
                <div className="md:flex gap-6">
                    {/* Vertical Tab Navigation Skeleton */}
                    <div className="md:w-48 mb-4 md:mb-0">
                        <ul className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <li key={i}>
                                    <div className="flex items-center px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mr-2 animate-pulse"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Content Area Skeleton */}
                    <div className="flex-1">
                        {/* Title Section Skeleton */}
                        <div className="mb-6 text-center">
                            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                        </div>

                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                        </div>
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions Card Skeleton */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
