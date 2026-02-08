export default function DashboardSkeleton({ sidebarOpen = true }) {
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

            {/* Sidebar Skeleton */}
            <aside className={`fixed top-0 right-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} bg-white border-l border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}>
                <div className="h-full px-3 pb-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i}>
                                <div className="flex items-center p-2 rounded-lg">
                                    <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mr-3 animate-pulse"></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className={`p-4 mt-14 transition-all duration-300 ${sidebarOpen ? 'sm:mr-64' : 'sm:mr-0'}`}>
                {/* Toggle Button Skeleton */}
                <div
                    className="hidden sm:flex fixed top-20 z-30 items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    style={{ right: sidebarOpen ? '260px' : '16px' }}
                ></div>

                <div className="p-4 border border-gray-200 dark:border-gray-700 border-dashed rounded-lg">
                    {/* Welcome Section Skeleton */}
                    <div className="mb-6 text-center">
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                    </div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="h-9 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* User Info Card Skeleton */}
                    <div className="flex items-center justify-center h-48 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-4 animate-pulse"></div>
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity Skeleton */}
                    <div className="flex items-center justify-center h-48 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-3 animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                            <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                        </div>
                    </div>

                    {/* Bottom Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-center h-24 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
