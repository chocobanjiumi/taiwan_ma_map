'use client';

import { TAIWAN_CITIES } from '@/lib/cities';

interface CitySelectorProps {
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
}

export default function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        城市 / 縣市
      </h4>
      <select
        value={selectedCity || ''}
        onChange={(e) => onCityChange(e.target.value || null)}
        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">全台灣</option>
        {TAIWAN_CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
