export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
