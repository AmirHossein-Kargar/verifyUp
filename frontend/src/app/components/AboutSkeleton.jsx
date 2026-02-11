export default function AboutSkeleton() {
    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-10 sm:h-12 md:h-14 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mx-auto mb-4"></div>
                    <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-2"></div>
                    <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mx-auto"></div>
                </div>

                {/* Features Grid Skeleton */}
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="w-full space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Section Skeleton */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
