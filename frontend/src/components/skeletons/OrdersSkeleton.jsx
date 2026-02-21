export default function OrdersSkeleton({ count = 4 }) {
    return (
        <div dir="rtl" className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-20">
            <div className="p-3 md:p-4 max-w-7xl mx-auto">
                {/* Page Title Skeleton */}
                <div className="mb-4 md:mb-6 text-center">
                    <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                </div>

                {/* Orders List Skeleton */}
                <div className="space-y-3 md:space-y-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-5 animate-pulse"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                                {/* Left side - Icon and content */}
                                <div className="flex items-start gap-3 md:gap-4 flex-1">
                                    {/* Icon placeholder */}
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 dark:bg-gray-700 rounded shrink-0"></div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
                                    </div>
                                </div>

                                {/* Right side - Price */}
                                <div className="text-left sm:text-right">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
