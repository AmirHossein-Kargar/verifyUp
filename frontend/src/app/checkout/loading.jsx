export default function CheckoutLoading() {
  return (
    <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    </div>
  );
}
