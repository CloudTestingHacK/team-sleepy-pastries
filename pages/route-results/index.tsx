import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Helper: Geocode postcode to lat/lng using Postcodes.io
async function getCoordinatesFromPostcode(postcode: string) {
  const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 200) {
    return { lat: data.result.latitude, lng: data.result.longitude };
  } else {
    throw new Error("Invalid postcode. Please check your starting location.");
  }
}

// Helper: Fetch bakeries with a built-in RETRY mechanism
async function fetchBakeriesWithRetry(
  lat: number,
  lng: number,
  radiusInMeters: number,
  retries = 3,
  delay = 2000
) {
  const query = `
    [out:json][timeout:25];
    (node["shop"="bakery"](around:${radiusInMeters},${lat},${lng}););
    out body;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.remark && data.remark.includes("timeout")) throw new Error("Server timeout");
        return data.elements || [];
      }

      // If server is busy (429) or error (500+), we retry
      if (response.status === 429 || response.status >= 500) {
        console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      } else {
        throw new Error("Failed to fetch bakery data.");
      }
    } catch (err) {
      if (i === retries - 1) throw err; // Out of retries, throw the error
    }
    // Wait before next attempt
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

function getQueryParam(router: any, key: string, fallback: any) {
  if (router.query && router.query[key]) {
    if (typeof fallback === "number") return Number(router.query[key]);
    return router.query[key];
  }
  return fallback;
}

export default function RouteResults() {
  const router = useRouter();
  const startAddress = getQueryParam(router, "startAddress", "");
  const numberOfStops = getQueryParam(router, "numberOfStops", 3);
  const maxDistance = getQueryParam(router, "maxDistance", 5);

  const [bakeries, setBakeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!router.isReady || !startAddress) return;

    async function generateRoute() {
      setLoading(true);
      setError(null);
      try {
        const { lat, lng } = await getCoordinatesFromPostcode(startAddress);
        const radiusMeters = Number(maxDistance) * 1000;
        
        const allBakeries = await fetchBakeriesWithRetry(lat, lng, radiusMeters);
        
        if (allBakeries.length === 0) {
          setError("No bakeries found nearby. Try a larger radius!");
        } else {
          setBakeries(allBakeries.slice(0, Number(numberOfStops)));
        }
      } catch (err: any) {
        setError("The map server is very busy right now. Please refresh or try again in a minute.");
      } finally {
        setLoading(false);
      }
    }

    generateRoute();
  }, [router.isReady, startAddress, numberOfStops, maxDistance]);

  const caloriesIn = numberOfStops * 400;
  const caloriesBurned = maxDistance * 60;

  // Fixed Google Maps Link
  const mapsUrl = bakeries.length > 0 
    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddress)}&destination=${encodeURIComponent(bakeries[bakeries.length - 1].lat + "," + bakeries[bakeries.length - 1].lon)}&waypoints=${bakeries.slice(0, -1).map(b => b.lat + "," + b.lon).join("|")}&travelmode=walking`
    : "#";

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 border-t-4 border-orange-400">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Your Pastry Route</h2>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-bounce text-4xl mb-4">🥐</div>
          <p className="text-slate-600 font-medium">Scanning the area for fresh carbs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100 text-center">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <span className="block text-2xl font-bold text-amber-700">{caloriesIn}</span>
              <span className="text-xs uppercase text-amber-600 font-bold">Calories In</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <span className="block text-2xl font-bold text-blue-700">{caloriesBurned}</span>
              <span className="text-xs uppercase text-blue-600 font-bold">Calories Burned</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {bakeries.map((bakery, idx) => (
              <li key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-md border border-slate-100">
                <span className="bg-orange-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                <span className="font-semibold text-slate-700">{bakery.tags?.name || "Artisan Bakery"}</span>
              </li>
            ))}
          </ul>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Open in Google Maps
          </a>
        </>
      )}
    </section>
  );
}