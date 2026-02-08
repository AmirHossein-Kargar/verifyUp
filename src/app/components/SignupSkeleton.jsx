export default function SignupSkeleton() {
    return (
        <div className="min-h-screen flex flex-col" dir="rtl">
            <div className="flex-1 flex items-center justify-center p-4 sm:pt-20">
                <div className="w-full max-w-md bg-neutral-primary-soft p-6 sm:p-8 border border-default rounded-base shadow-lg">
                    {/* Title Skeleton */}
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-40 mx-auto mb-4 sm:mb-6 animate-pulse"></div>

                    {/* Name Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Email Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Password Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Confirm Password Field Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1.5 sm:mb-2 animate-pulse"></div>
                        <div className="h-11 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    </div>

                    {/* Terms Checkbox Skeleton */}
                    <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-11 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4 animate-pulse"></div>

                    {/* Footer Text Skeleton */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-52 mx-auto animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
