import React from 'react';

interface Step1Props {
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
}

export default function Step1StartAddress({ value, onChange, error }: Step1Props) {
  return (
    <div>
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
      />
      <p className="mt-2 text-brown-700 italic">Let's get ready to crumble. Enter your starting point.</p>
      {error && (
        <p id="startAddress-error" className="text-red-600 mt-2" role="alert">{error}</p>
      )}
    </div>
  );
}
