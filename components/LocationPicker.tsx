"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

function LocationMarker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<any>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!position) return null;

  return <Marker position={position} />;
}

export default function LocationPicker({
  onLocationSelect,
  initialLat = 40.7128,
  initialLng = -74.006,
}: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Fix Leaflet icon issue
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 bg-gray-900/30 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10">
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
