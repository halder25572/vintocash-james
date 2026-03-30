'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import OrbitSpinner from '@/components/loading/LoadingComponent';

export default function ErrorComponent({
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
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon with Orbit Spinner */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <OrbitSpinner />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-[#D93E39]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Error Title */}
                <h1 className="text-4xl font-bold text-white mb-4">
                    Oops! Something went wrong
                </h1>

                {/* Error Message */}
                <p className="text-gray-400 mb-8">
                    We encountered an unexpected error. Don&apos;t worry, it&apos;s not your fault.
                </p>

                {/* Error Details (in development) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-8 p-4 bg-zinc-900 rounded-lg border border-[#D93E39]/30 text-left">
                        <p className="text-sm text-gray-300 font-mono break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#D93E39] text-white font-semibold rounded-lg hover:bg-[#c13531] transition-colors duration-200"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-lg border border-[#D93E39]/30 hover:border-[#D93E39] transition-colors duration-200"
                    >
                        Go Home
                    </Link>
                </div>

                {/* Support Link */}
                <p className="mt-8 text-sm text-gray-500">
                    Need help?{' '}
                    <a
                        href="/contact"
                        className="text-[#D93E39] hover:underline"
                    >
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
    );
}