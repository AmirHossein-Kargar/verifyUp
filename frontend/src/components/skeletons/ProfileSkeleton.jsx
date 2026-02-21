export default function ProfileSkeleton() {
    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 h-screen pt-20 pb-16 overflow-hidden">
            <div className="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-full overflow-y-auto">
                {/* Header Skeleton */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch min-h-0">
                    {/* Profile Summary Card - Right in RTL (col 3) */}
                    <div className="lg:col-start-3 lg:col-span-1 order-1 lg:order-1 flex min-h-0">
                        <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden min-h-0">
                            <div className="p-6 sm:p-8 flex flex-col flex-1 items-center">
                                {/* Avatar */}
                                <div className="mb-6 flex justify-center shrink-0">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ring-4 ring-white dark:ring-gray-800 shadow-lg"></div>
                                </div>

                                {/* Upload Button */}
                                <div className="w-full mb-6">
                                    <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3"></div>
                                </div>

                                {/* User Info */}
                                <div className="w-full flex-1 min-h-0 flex flex-col justify-center">
                                    <div className="space-y-3">
                                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="w-full mt-auto">
                                    <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card - Left in RTL (col 1-2) */}
                    <div className="lg:col-start-1 lg:col-span-2 order-2 lg:order-2 flex min-h-0">
                        <div className="flex flex-col w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden min-h-0">
                            <div className="p-6 sm:p-8 flex flex-col flex-1 min-h-0">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-5 flex-1 overflow-y-auto">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                            <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-auto shrink-0">
                                    <div className="h-11 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                    <div className="h-11 w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
