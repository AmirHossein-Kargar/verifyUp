export default function PrivacySkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-8"></div>

                <div className="space-y-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>

                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-8 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4/5"></div>

                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mt-8 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}
