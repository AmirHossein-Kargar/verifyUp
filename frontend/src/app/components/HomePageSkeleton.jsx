export default function HomePageSkeleton() {
    return (
        <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16 flex items-center justify-center animate-pulse" dir="rtl">
            <div className="w-full">
                {/* Hero Section Skeleton */}
                <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 md:mb-20">
                    {/* Heading Skeleton */}
                    <div className="mb-4 sm:mb-6 px-4 flex flex-col items-center gap-3">
                        <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4"></div>
                        <div className="h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-300 dark:bg-gray-700 rounded-lg w-2/3"></div>
                    </div>

                    {/* Paragraph Skeleton */}
                    <div className="mb-6 sm:mb-8 px-4 sm:px-8 md:px-16 xl:px-48 flex flex-col items-center gap-2">
                        <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                        <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-600 rounded w-4/6"></div>
                    </div>

                    {/* Button Skeleton */}
                    <div className="flex justify-center">
                        <div className="h-10 sm:h-12 w-32 sm:w-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                </div>

                {/* Steps Section Skeleton */}
                <div className="max-w-6xl mx-auto px-2 sm:px-4">
                    {/* Section Title Skeleton */}
                    <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center">
                        <div className="h-8 sm:h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 sm:w-80"></div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Card 1 */}
                        <div className="h-full w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="h-6 sm:h-7 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="space-y-2 w-full">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mx-auto"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 mx-auto"></div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="h-full w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                            <div className="h-6 sm:h-7 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                            <div className="space-y-2 w-full">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mx-auto"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 mx-auto"></div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="h-full w-full p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                                <div className="h-6 sm:h-7 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                <div className="space-y-2 w-full">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/6 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
