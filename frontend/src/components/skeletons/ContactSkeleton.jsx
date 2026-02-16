export default function ContactSkeleton() {
    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto"></div>
                </div>

                {/* Contact Info Skeleton */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                        {/* Profile Skeleton */}
                        <div className="flex flex-col items-center mb-8 animate-pulse">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                        </div>

                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-6"></div>

                        {/* Cards Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="w-full space-y-2">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
