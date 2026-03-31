import React from 'react';

interface Step3Props {
  value: number;
  onChange: (v: number) => void;
}

export default function Step3MaxDistance({ value, onChange }: Step3Props) {
  return (
    <div>
      <label htmlFor="maxDistance" className="block text-lg font-semibold mb-2">
        Max distance from starting location (km)
      </label>
      <input
        id="maxDistance"
        type="range"
        min={1}
        max={42}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-butter focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400"
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={42}
      />
      <div className="flex justify-between text-sm mt-1">
        <span>1 km</span>
        <span>42 km</span>
      </div>
      <div className="mt-2 text-brown-900 font-bold">{value} km</div>
      <p className="mt-2 text-brown-700 italic">Let's roll! How many kilometers can you handle?</p>
    </div>
  );
}
