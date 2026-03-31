import * as React from "react";
import { useState, useRef, useEffect } from "react";

interface Step1Props {
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
}

// Fetch address suggestions from OpenStreetMap Nominatim API, UK only, limit by radius using viewbox for postcodes
async function fetchAddressSuggestions(
  query: string,
): Promise<{ suggestions: string[]; error?: string }> {
  if (query.length < 3) return { suggestions: [] };
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}$/i;
  let url = "";
  // Helper to get lat/lon for a postcode using postcodes.io
  async function getLatLonForPostcode(
    postcode: string,
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (
        data.status === 200 &&
        data.result &&
        data.result.latitude &&
        data.result.longitude
      ) {
        return { lat: data.result.latitude, lon: data.result.longitude };
      }
      return null;
    } catch {
      return null;
    }
  }

  if (postcodeRegex.test(query.trim())) {
    // Limit radius: use a small bounding box (e.g. ±0.01 degrees ~1km)
    const latLon = await getLatLonForPostcode(query.trim());
    if (latLon) {
      const delta = 0.01; // ~1km
      const viewbox = [
        latLon.lon - delta,
        latLon.lat - delta,
        latLon.lon + delta,
        latLon.lat + delta,
      ].join(",");
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(query.trim())}&countrycodes=gb&format=json&addressdetails=1&namedetails=1&extratags=1&limit=50&viewbox=${viewbox}&bounded=1`;
    } else {
      // fallback to normal postcode search if lat/lon lookup fails
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(query.trim())}&countrycodes=gb&format=json&addressdetails=1&namedetails=1&extratags=1&limit=50`;
    }
  } else {
    url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&namedetails=1&extratags=1&limit=50&countrycodes=gb`;
  }
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      return {
        suggestions: [],
        error: "Address lookup failed. Please try again later.",
      };
    }
    let data;
    try {
      data = await res.json();
    } catch (err) {
      return {
        suggestions: [],
        error: "Service is busy or unavailable. Please try again later.",
      };
    }
    if (!Array.isArray(data)) {
      return {
        suggestions: [],
        error: "Unexpected response from address service.",
      };
    }
    const lowerQuery = query.trim().toLowerCase();
    return {
      suggestions: data
        .filter(
          (item: any) =>
            item.address &&
            (item.address.country_code === "gb" ||
              item.display_name.toLowerCase().includes("united kingdom")) &&
            item.display_name.toLowerCase().includes(lowerQuery),
        )
        .map((item: any) => {
          if (item.namedetails && item.namedetails.name) {
            return `${item.namedetails.name}, ${item.display_name}`;
          }
          return item.display_name;
        }),
    };
  } catch {
    return {
      suggestions: [],
      error: "Network error. Please check your connection.",
    };
  }
}

export default function Step1StartAddress({
  value,
  onChange,
  error,
}: Step1Props) {
  // UK postcode regex (covers most valid formats)
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}$/i;
  const [touched, setTouched] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only trigger lookup when a valid, complete postcode is entered
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    onChange(val);
    setTouched(false);
    setLookupError(null);
    setSuggestions([]);
    // Only lookup if the postcode is valid and complete (no trailing space, length 5-8)
    if (
      postcodeRegex.test(val.trim()) &&
      val.trim().length >= 5 &&
      val.trim().length <= 8
    ) {
      setLoading(true);
      fetchAddressSuggestions(val.trim()).then((res) => {
        setLoading(false);
        setSuggestions(res.suggestions);
        if (res.error) setLookupError(res.error);
      });
    }
  };

  // Show error if not valid postcode and input is touched
  const showError = touched && !postcodeRegex.test(value.trim());

  return (
    <div className="relative">
      {(error || showError || lookupError) && (
        <p
          id="startAddress-error"
          className="text-red-600 mb-2"
          role="alert"
          aria-live="assertive"
        >
          {error
            ? error
            : lookupError
              ? lookupError
              : "Please enter a valid UK postcode (e.g. SW1A 1AA)"}
        </p>
      )}
      <label
        htmlFor="startAddress"
        className="block text-lg font-semibold mb-2"
      >
        Start Postcode
      </label>
      <input
        id="startAddress"
        type="text"
        className="w-full p-3 rounded border border-brown-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 tracking-widest uppercase"
        value={value}
        onChange={handleChange}
        aria-required="true"
        aria-invalid={!!error || showError || !!lookupError}
        aria-describedby={
          error || showError || lookupError ? "startAddress-error" : undefined
        }
        autoFocus
        autoComplete="off"
        ref={inputRef}
        maxLength={8}
        placeholder="e.g. SW1A 1AA"
        onBlur={() => setTouched(true)}
      />
      {loading && (
        <p className="text-brown-700 italic mt-2">Looking up postcode...</p>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-white border border-brown-700 rounded shadow mt-1 max-h-56 overflow-auto">
          {suggestions.map((s, i) => (
            <li key={s + i} className="px-4 py-2 text-brown-900 bg-white">
              {s}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-brown-700 italic">
        Enter your starting UK postcode (e.g. SW1A 1AA).
      </p>
    </div>
  );
}
