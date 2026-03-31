import React from 'react';

interface Step2Props {
  value: number;
  onChange: (v: number) => void;
  error?: string | null;
}

export default function Step2NumberOfStops({ value, onChange, error }: Step2Props) {
  return (
    <div>
      <label htmlFor="numberOfStops" className="block text-lg font-semibold mb-2">
        Number of Pastry Stops
      </label>
      <input
        id="numberOfStops"
        type="number"
        min={1}
        className="w-24 p-3 rounded border border-brown-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 text-center"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'numberOfStops-error' : undefined}
      />
      <p className="mt-2 text-brown-700 italic">You're the apple of my pie, how many bakeries?</p>
      {error && (
        <p id="numberOfStops-error" className="text-red-600 mt-2" role="alert">{error}</p>
      )}
    </div>
  );
}
