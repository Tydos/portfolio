"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "react-feather";

/** Custom 404 page with home and browser-back actions. */
function ErrorPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-accent">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-ink-muted">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-full bg-accent px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent flex items-center gap-2 transition-colors"
          >
            <Home size={16} />
            Go back home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-ink hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}

export default ErrorPage;
