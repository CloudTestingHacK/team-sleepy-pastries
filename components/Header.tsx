
import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-butter shadow-md py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-brown-900">
        <Link href="/" passHref legacyBehavior>
          <a className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 rounded transition underline-offset-2 hover:underline">
            🥐 The Rolling Scone
          </a>
        </Link>
      </h1>
      <span className="text-sm italic text-brown-700">Life is what you bake it.</span>
    </header>
  );
}
