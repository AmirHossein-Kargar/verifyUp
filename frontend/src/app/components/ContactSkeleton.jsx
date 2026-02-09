export default function ContactSkeleton() {
    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16" dir="rtl">
            <div className="max-w-6xl mx-auto">
                {/* Header Skeleton */}
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto"></div>
                </div>

                {/* Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 max-w-xs w-full mx-auto p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm animate-pulse"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 mb-6 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
                                <div className="flex gap-3 w-full mt-4">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Info Skeleton */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
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
