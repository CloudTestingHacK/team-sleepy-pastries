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
    throw new Error("Invalid postcode");
  }
}

// Helper: Fetch bakeries from Overpass API
async function fetchBakeriesInRadius(
  lat: number,
  lng: number,
  radiusInMeters: number,
) {
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="bakery"](around:${radiusInMeters / 4},${lat},${lng});
    );
    out body;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.elements;
}

// Helper: Select N stops
function selectStops(allBakeries: any[], numStops: number) {
  return allBakeries.slice(0, numStops);
}

function getQueryParam(router, key: string, fallback: any) {
  if (router.query && router.query[key]) {
    if (typeof fallback === "number") return Number(router.query[key]);
    return router.query[key];
  }
  return fallback;
}

export default function RouteResults() {
  const router = useRouter();
  const startAddress = getQueryParam(router, "startAddress", "123 Main St");
  const numberOfStops = getQueryParam(router, "numberOfStops", 3);
  const maxDistance = getQueryParam(router, "maxDistance", 5);

  const [bakeries, setBakeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateRoute() {
      setLoading(true);
      setError(null);
      try {
        // 1. Geocode postcode to lat/lng
        const { lat, lng } = await getCoordinatesFromPostcode(startAddress);
        // 2. Fetch bakeries in radius (convert km to meters)
        const allBakeries = await fetchBakeriesInRadius(
          lat,
          lng,
          Number(maxDistance) * 1000,
        );
        // 3. Filter to N stops, handle not enough bakeries
        if (allBakeries.length === 0) {
          setBakeries([]);
          setError(
            "No bakeries found within the selected distance. Try increasing the distance or changing your starting location.",
          );
        } else if (allBakeries.length < Number(numberOfStops)) {
          setBakeries(allBakeries);
          setError(
            `Only ${allBakeries.length} baker${allBakeries.length === 1 ? "y" : "ies"} found within the selected distance. Showing all available stops.`,
          );
        } else {
          const selected = selectStops(allBakeries, Number(numberOfStops));
          setBakeries(selected);
        }
      } catch (err: any) {
        setError(err.message || "Failed to generate route");
      } finally {
        setLoading(false);
      }
    }
    generateRoute();
  }, [startAddress, numberOfStops, maxDistance]);

  const caloriesIn = numberOfStops * 400;
  const caloriesBurned = maxDistance * 60;

  // Google Maps Directions URL (if bakeries available)
  const mapsUrl =
    bakeries.length > 0
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddress)}&destination=${encodeURIComponent(bakeries[bakeries.length - 1].lat + "," + bakeries[bakeries.length - 1].lon)}&waypoints=${bakeries
          .slice(0, -1)
          .map((b) => encodeURIComponent(b.lat + "," + b.lon))
          .join("|")}`
      : "";

  return (
    <section className="max-w-2xl mx-auto bg-white/80 rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-brown-900">
        Your Pastry Crawl Route
      </h2>
      <p className="mb-6 text-brown-700 italic">
        We hope you’re bready for this adventure!
      </p>
      {/* Calorie Calculator */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center">
        <div className="flex-1 bg-butter rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-brown-900">{caloriesIn}</div>
          <div className="text-brown-800">Estimated Calories In</div>
        </div>
        <div className="flex-1 bg-butter rounded-lg p-4 text-center shadow">
          <div className="text-3xl font-bold text-brown-900">
            {caloriesBurned}
          </div>
          <div className="text-brown-800">Estimated Calories Burned</div>
        </div>
      </div>
      <div className="mb-8 text-center">
        <span className="inline-block bg-butter-dark text-brown-900 px-4 py-2 rounded-full font-semibold shadow">
          Guilt-O-Meter: {caloriesIn - caloriesBurned} net calories
        </span>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center text-brown-700 mb-8">
          Generating your pastry crawl route...
        </div>
      )}
      {error && (
        <div
          className={`text-center mb-8 ${bakeries.length === 0 ? "text-red-600" : "text-brown-700"}`}
        >
          {error}
        </div>
      )}

      {/* Bakery List */}
      {!loading && bakeries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 text-brown-900">
            Bakery Stops
          </h3>
          <ul className="space-y-4">
            {bakeries.map((bakery, idx) => (
              <li
                key={bakery.id || idx}
                className="bg-cream rounded-lg p-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-bold text-brown-900">
                    {bakery.tags?.name || "Unnamed Bakery"}
                  </div>
                  <div className="text-brown-800">
                    Lat: {bakery.lat}, Lon: {bakery.lon}
                  </div>
                  <div className="text-brown-700 italic">
                    {bakery.tags?.description || ""}
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-brown-700">
                  Stop #{idx + 1}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Map Integration */}
      {!loading && !error && bakeries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-2 text-brown-900">Route Map</h3>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-butter hover:bg-butter-dark text-brown-900 font-semibold py-3 px-6 rounded-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 min-w-[120px] min-h-[48px] text-lg"
          >
            Open Route in Google Maps
          </a>
        </div>
      )}
    </section>
  );
}
