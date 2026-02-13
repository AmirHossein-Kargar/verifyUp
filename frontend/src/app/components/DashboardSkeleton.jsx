import HeaderSkeleton from './HeaderSkeleton';

export default function DashboardSkeleton({ sidebarOpen = false }) {
    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header Skeleton */}
            <HeaderSkeleton />

            {/* Sidebar Skeleton */}
            <aside className="fixed top-0 right-0 z-40 w-64 h-screen pt-24 transition-transform translate-x-full sm:translate-x-0 bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i}>
                                <div className="flex items-center p-2 rounded-lg">
                                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="p-4 sm:mr-64 sm:p-6 mt-14">
                <div className="w-full space-y-6">
                    {/* Title Section Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders Card Skeleton */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                        <div className="flex-1">
                                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
                                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
