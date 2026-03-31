
import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import Header from '../../components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Rolling Scone',
  description: 'A Pastry Crawl Generator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-yellow-50 text-brown-900 ${inter.className}`}>
    
        <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
