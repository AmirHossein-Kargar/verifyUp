export default function SignupSkeleton() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900" dir="rtl">
            <div className="flex min-h-screen items-center justify-center p-4 sm:pt-20">
                <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8 select-none">
                    {/* Title */}
                    <div className="mb-6 h-8 w-44 mx-auto rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />

                    {/* NAME */}
                    <div className="mb-4">
                        <div className="mb-2 h-4 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        <div className="h-[42px] w-full rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse" />
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4">
                        <div className="mb-2 h-4 w-24 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        <div className="h-[42px] w-full rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse" />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4">
                        <div className="mb-2 h-4 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        <div className="h-[42px] w-full rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse" />
                        <div className="mt-2 h-3 w-28 rounded bg-transparent" />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-4">
                        <div className="mb-2 h-4 w-28 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        <div className="h-[42px] w-full rounded-lg bg-gray-200 dark:bg-gray-600 animate-pulse" />
                    </div>

                    {/* TERMS */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 w-56 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mb-4 h-11 w-full rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />

                    {/* FOOTER */}
                    <div className="h-4 w-64 mx-auto rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
