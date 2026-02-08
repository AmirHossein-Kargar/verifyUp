export default function CartSkeleton() {
    return (
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 sm:p-8 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <div className="flex flex-col items-center justify-center text-center">
                    {/* Icon Skeleton */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 animate-pulse"></div>

                    {/* Title Skeleton */}
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 mb-2 animate-pulse"></div>

                    {/* Description Skeleton */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-56 mb-6 animate-pulse"></div>

                    {/* Button Skeleton */}
                    <div className="w-full h-11 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
