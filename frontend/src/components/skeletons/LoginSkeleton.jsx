export default function LoginSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
            <div className="flex min-h-screen items-center justify-center p-4 sm:pt-20">
                <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
                    {/* Title Skeleton */}
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-4 sm:mb-6 animate-pulse"></div>

                    {/* Email Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Password Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Remember & Forgot Password Skeleton */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4 animate-pulse"></div>

                    {/* Footer Text Skeleton */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-56 mx-auto animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
