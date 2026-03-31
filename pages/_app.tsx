import './globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/Header';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-full flex flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
