export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 animate-pulse">
          <div className="h-9 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-3" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
