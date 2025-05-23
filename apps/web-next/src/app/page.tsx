'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Rectangle } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl:       'leaflet/dist/images/marker-icon.png',
  shadowUrl:     'leaflet/dist/images/marker-shadow.png',
});

type Point = { lat: number; lng: number };
type ProcessResponse = {
  centroid: Point;
  bounds: { north: number; south: number; east: number; west: number };
};

export default function HomePage() {
  const [inputs, setInputs] = useState<Point[]>([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState('');

  const addPoint = () => {
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    if (!isNaN(la) && !isNaN(ln)) {
      setInputs([...inputs, { lat: la, lng: ln }]);
      setLat('');
      setLng('');
      setError('');
    } else {
      setError('Enter valid numbers');
    }
  };

  const submit = async () => {
    if (!inputs.length) {
      setError('Add at least one point');
      return;
    }
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: inputs }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Geo Processor</h1>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="border p-1"
        />
        <button
          onClick={addPoint}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Add Point
        </button>
      </div>

      <ul className="list-disc pl-5">
        {inputs.map((p, i) => (
          <li key={i}>
            {p.lat}, {p.lng}
          </li>
        ))}
      </ul>

      <button
        onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Compute
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="h-96">
          <MapContainer
            center={[result.centroid.lat, result.centroid.lng]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[result.centroid.lat, result.centroid.lng]} />
            <Rectangle
              bounds={[
                [result.bounds.south, result.bounds.west],
                [result.bounds.north, result.bounds.east],
              ]}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
