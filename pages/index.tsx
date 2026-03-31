import Link from 'next/link';

export default function Home() {
  return (
    <section className="max-w-xl mx-auto text-center bg-white/80 rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-3xl font-extrabold mb-4 text-brown-900">Welcome to The Rolling Scone!</h2>
      <p className="mb-6 text-lg text-brown-800">
        Like a pub crawl, but sweeter. Swap the pints for pastries and the hangovers for sugar rushes!
      </p>
      <p className="mb-8 text-brown-700 italic">We’re on a roll with pastry puns. Don’t flake out!</p>
      <Link href="/crawl-setup" passHref legacyBehavior>
        <a
          className="inline-block bg-butter hover:bg-butter-dark text-brown-900 font-semibold py-4 px-8 rounded-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 transition min-w-[120px] min-h-[48px] text-lg"
          aria-label="Start your pastry crawl setup"
        >
          Butter me up
        </a>
      </Link>
    </section>
  );
}
