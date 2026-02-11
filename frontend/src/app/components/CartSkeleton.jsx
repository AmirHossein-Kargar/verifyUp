export default function CartSkeleton() {
  return (
    <div className="min-h-[calc(100vh-20rem)] p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="mx-auto max-w-6xl animate-pulse">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart Items Skeleton */}
          <div className="space-y-4 lg:col-span-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="h-16 w-16 rounded bg-gray-200 dark:bg-gray-700" />

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Remove button */}
                  <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>

              <div className="mt-6 h-11 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
