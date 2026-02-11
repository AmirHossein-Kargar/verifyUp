export default function AboutSkeleton() {
  return (
    <main className="bg-white dark:bg-gray-900" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:py-16">
        {/* Header Skeleton */}
        <div className="mx-auto mb-10 max-w-3xl text-center animate-pulse">
          <div className="mx-auto mb-4 h-10 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-12 md:h-14" />
          <div className="mx-auto mb-2 h-5 w-11/12 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-6" />
          <div className="mx-auto h-5 w-9/12 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-6" />
        </div>

        {/* Features Grid Skeleton */}
        <section className="mx-auto mb-10 max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700" />

                <div className="mb-2 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section Skeleton */}
        <section className="mx-auto max-w-6xl">
          <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
            <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

              <div className="pt-2" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
