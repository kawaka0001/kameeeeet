interface ErrorDisplayProps {
  message: string;
}

/**
 * Error display component
 */
export function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
}
