import React, { useState, useRef, useEffect } from 'react';

interface Step1Props {
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
}


// Fetch address suggestions from OpenStreetMap Nominatim API, UK only, include POIs/shops, and show all addresses for a given postcode
async function fetchAddressSuggestions(query: string): Promise<string[]> {
  if (query.length < 3) return [];
  // UK postcode regex (simple, covers most cases)
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}$/i;
  let url = '';
  if (postcodeRegex.test(query.trim())) {
    // If input is a postcode, use postalcode param for more granular address results
    url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(query.trim())}&countrycodes=gb&format=json&addressdetails=1&namedetails=1&extratags=1&limit=50`;
  } else {
    // Otherwise, normal search with a higher limit for substring matching
    url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&namedetails=1&extratags=1&limit=50&countrycodes=gb`;
  }
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Filter for UK and substring match in display_name
    const lowerQuery = query.trim().toLowerCase();
    return data
      .filter((item: any) =>
        item.address &&
        (item.address.country_code === 'gb' || item.display_name.toLowerCase().includes('united kingdom')) &&
        item.display_name.toLowerCase().includes(lowerQuery)
      )
      .map((item: any) => {
        // Prefer namedetails if available (shop, POI, etc.)
        if (item.namedetails && item.namedetails.name) {
          // Show "Shop/POI Name, Address"
          return `${item.namedetails.name}, ${item.display_name}`;
        }
        return item.display_name;
      });
  } catch {
    return [];
  }
}


export default function Step1StartAddress({ value, onChange, error }: Step1Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      setHighlighted(-1);
      return;
    }
    setLoading(true);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchAddressSuggestions(value).then(suggestions => {
        setSuggestions(suggestions);
        setShowDropdown(true);
        setHighlighted(-1);
        setLoading(false);
      });
    }, 300);
    // Cleanup
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [value]);

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      onChange(suggestions[highlighted]);
      setShowDropdown(false);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {error && (
        <p id="startAddress-error" className="text-red-600 mb-2" role="alert" aria-live="assertive">{error}</p>
      )}
      <label htmlFor="startAddress" className="block text-lg font-semibold mb-2">
        Start Address
      </label>
      <input
        id="startAddress"
        type="text"
        className="w-full p-3 rounded border border-brown-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'startAddress-error' : undefined}
        autoFocus
        autoComplete="off"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="address-suggestions"
        aria-activedescendant={highlighted >= 0 ? `suggestion-${highlighted}` : undefined}
        onFocus={() => value.length >= 3 && setShowDropdown(true)}
      />
      {showDropdown && (
        <ul
          id="address-suggestions"
          ref={dropdownRef}
          className="absolute z-10 left-0 right-0 bg-white border border-brown-700 rounded shadow mt-1 max-h-56 overflow-auto"
          role="listbox"
        >
          {loading && (
            <li className="px-4 py-2 text-brown-700 italic">Loading...</li>
          )}
          {!loading && suggestions.length === 0 && value.length >= 3 && (
            <li className="px-4 py-2 text-brown-700 italic">No addresses found</li>
          )}
          {!loading && suggestions.map((s, i) => (
            <li
              key={s}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={highlighted === i}
              className={`px-4 py-2 cursor-pointer ${highlighted === i ? 'bg-butter-dark text-brown-900' : 'bg-white text-brown-900'}`}
              onMouseDown={e => {
                e.preventDefault();
                onChange(s);
                setShowDropdown(false);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-brown-700 italic">Let's get ready to crumble. Enter your starting point.</p>
    </div>
  );
}
