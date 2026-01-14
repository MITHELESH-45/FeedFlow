"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface MapboxPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapboxPicker({
  onLocationSelect,
  initialLat = 40.7128,
  initialLng = -74.006,
}: MapboxPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel position to approximate lat/lng
    // This is a simplified calculation for demo purposes
    const lat = initialLat + ((rect.height / 2 - y) / rect.height) * 0.05;
    const lng = initialLng + ((x - rect.width / 2) / rect.width) * 0.05;
    
    setMarkerPosition({ x, y, lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-700 relative">
      {/* Background map image using OpenStreetMap tiles */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gray-900 cursor-crosshair relative"
        onClick={handleMapClick}
        style={{
          backgroundImage: `url(https://tile.openstreetmap.org/12/${Math.floor((initialLng + 180) * (2 ** 12 / 360))}/${Math.floor((1 - Math.log(Math.tan(initialLat * Math.PI / 180) + 1 / Math.cos(initialLat * Math.PI / 180)) / Math.PI) / 2 * (2 ** 12))}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) brightness(0.4) contrast(1.2)',
        }}
      >
        {/* Grid overlay for better visual */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5" />
        
        {/* Instructions */}
        {!markerPosition && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-900/90 backdrop-blur-sm px-6 py-4 rounded-lg border border-gray-700">
              <MapPin className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="text-white text-sm font-semibold text-center">Click to select location</p>
            </div>
          </div>
        )}
        
        {/* Marker */}
        {markerPosition && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${markerPosition.x}px`,
              top: `${markerPosition.y}px`,
            }}
          >
            <div className="relative">
              <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500/50 rounded-full animate-ping" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

