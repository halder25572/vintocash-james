'use client';

import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Title */}
        <h2 className="text-4xl font-bold text-black mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>

        {/* Suggestions */}
        <div className="mb-8 p-4 bg-zinc-900 rounded-lg border border-[#D93E39]/30 text-left">
          <p className="text-sm text-gray-300 mb-2 font-semibold">Suggestions:</p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Check the URL for typos</li>
            <li>Go back to the previous page</li>
            <li>Visit our homepage</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#D93E39] text-white font-semibold rounded-lg hover:bg-[#c13531] transition-colors duration-200"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-lg border border-[#D93E39]/30 hover:border-[#D93E39] transition-colors duration-200"
          >
            Go Back
          </button>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm text-gray-500">
          Still lost?{' '}
          <Link
            href="/contact"
            className="text-[#D93E39] hover:underline"
          >
            Contact Us
          </Link>
        </p>
      </div>
    </div>
  );
}