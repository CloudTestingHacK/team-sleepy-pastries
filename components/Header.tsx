

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-butter shadow-md py-4 px-6 flex flex-col items-center justify-center">
      <Link href="/" passHref legacyBehavior>
        <a className="flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brown-700 rounded transition">
          <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute top-0 left-0 pointer-events-none select-none">
              <defs>
                <path id="circlePath" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
              </defs>
              <text fill="#7c4700" fontSize="16" fontWeight="bold">
                <textPath href="#circlePath" startOffset="0" textLength="300">
                  THE ROLLING SCONE • THE ROLLING SCONE •
                </textPath>
              </text>
            </svg>
            <Image
              src="/pastry_crawl_logo.png"
              alt="The Rolling Scone Logo"
              width={80}
              height={80}
              className="rounded-full shadow"
              priority
            />
          </div>
        </a>
      </Link>
      <span className="text-sm italic text-brown-700 mt-2">Life is what you bake it.</span>
    </header>
  );
}
