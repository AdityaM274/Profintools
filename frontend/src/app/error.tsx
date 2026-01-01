'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="bg-red-500/10 p-6 rounded-3xl mb-8">
                <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-secondary max-w-md mb-8">
                We encountered an unexpected error. Our team has been notified.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="btn-primary flex items-center gap-2"
            >
                <RefreshCcw className="w-4 h-4" /> Try again
            </button>
        </div>
    );
}
