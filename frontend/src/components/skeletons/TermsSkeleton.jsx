export default function TermsSkeleton() {
    return (
        <main className="bg-white dark:bg-gray-900" dir="rtl">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
                {/* Header Skeleton */}
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <div className="mb-4 h-10 w-3/4 mx-auto animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-12"></div>
                    <div className="h-6 w-full mx-auto animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Content Skeleton */}
                <section className="mx-auto max-w-5xl">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
                        <div className="space-y-6">
                            {[...Array(7)].map((_, idx) => (
                                <div key={idx}>
                                    <div className="mb-3 h-7 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                                <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                                <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
