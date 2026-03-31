import React from 'react';
import { useRouter } from 'next/router';

// Mock bakery data generator
function generatePastryRoute(address: string, stops: number, distance: number) {
  // Dummy bakeries for demo
  const bakeries = [
    { name: 'Crust & Crumb', address: '123 Scone St', specialty: 'Scone' },
    { name: 'Butter Bliss', address: '456 Croissant Ave', specialty: 'Croissant' },
    { name: 'Dough Re Mi', address: '789 Danish Rd', specialty: 'Danish' },
    { name: 'The Flaky Tart', address: '101 Puff Ln', specialty: 'Tart' },
    { name: 'Sweet Roll Society', address: '202 Brioche Blvd', specialty: 'Brioche' },
    { name: 'Pie in the Sky', address: '303 Pie Pl', specialty: 'Pie' },
  ];
  // Repeat bakeries if needed
  const route = [];
  for (let i = 0; i < stops; i++) {
    route.push(bakeries[i % bakeries.length]);
  }
  return route;
}

function getQueryParam(router, key: string, fallback: any) {
  if (router.query && router.query[key]) {
    if (typeof fallback === 'number') return Number(router.query[key]);
    return router.query[key];
  }
  return fallback;
}

export default function RouteResults() {
  const router = useRouter();
  // Fallbacks for demo/testing
  const startAddress = getQueryParam(router, 'startAddress', '123 Main St');
  const numberOfStops = getQueryParam(router, 'numberOfStops', 3);
  const maxDistance = getQueryParam(router, 'maxDistance', 5);

  const bakeries = generatePastryRoute(startAddress, numberOfStops, maxDistance);
  const caloriesIn = numberOfStops * 400;
  const caloriesBurned = maxDistance * 60;

  // Google Maps Directions URL
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddress)}&destination=${encodeURIComponent(bakeries[bakeries.length-1].address)}&waypoints=${bakeries.slice(0, -1).map(b => encodeURIComponent(b.address)).join('|')}`;

  return (
    <section className="max-w-2xl mx-auto bg-white/80 rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-brown-900">Your Pastry Crawl Route</h2>
      <p className="mb-6 text-brown-700 italic">We hope you’re bready for this adventure!</p>
      {/* Calorie Calculator */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center">
        <div className="flex-1 bg-butter rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-brown-900">{caloriesIn}</div>
          <div className="text-brown-800">Estimated Calories In</div>
        </div>
        <div className="flex-1 bg-butter rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-brown-900">{caloriesBurned}</div>
          <div className="text-brown-800">Estimated Calories Burned</div>
        </div>
      </div>
      <div className="mb-8 text-center">
        <span className="inline-block bg-butter-dark text-brown-900 px-4 py-2 rounded-full font-semibold shadow">Guilt-O-Meter: {caloriesIn - caloriesBurned} net calories</span>
      </div>
      {/* Bakery List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2 text-brown-900">Bakery Stops</h3>
        <ul className="space-y-4">
          {bakeries.map((bakery, idx) => (
            <li key={idx} className="bg-cream rounded-lg p-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold text-brown-900">{bakery.name}</div>
                <div className="text-brown-800">{bakery.address}</div>
                <div className="text-brown-700 italic">Specialty: {bakery.specialty}</div>
              </div>
              <div className="mt-2 sm:mt-0 text-brown-700">Stop #{idx + 1}</div>
            </li>
          ))}
        </ul>
      </div>
      {/* Map Integration */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2 text-brown-900">Route Map</h3>
        {/*
          Developer Note:
          Option A (default): Uses a Google Maps Directions URL to open the route in a new tab.
          Option B (upgrade): Integrate @react-google-maps/api for an embedded map. Requires API key and setup.
          To upgrade, replace this section with a Map component and update the implementation plan.
        */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-butter hover:bg-butter-dark text-brown-900 font-semibold py-3 px-6 rounded-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 min-w-[120px] min-h-[48px] text-lg"
        >
          Open Route in Google Maps
        </a>
      </div>
    </section>
  );
}
