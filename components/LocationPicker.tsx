"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

// Component to handle map clicks
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface ViewState {
  center: [number, number];
  zoom: number;
  timestamp: number;
}

// Component to handle map view updates when viewState changes
function MapUpdater({ viewState }: { viewState: ViewState | null }) {
  const map = useMap();
  useEffect(() => {
    if (viewState) {
      map.setView(viewState.center, viewState.zoom);
    }
  }, [viewState, map]);
  return null;
}

function LocationMarker({ position }: { position: Coordinates | null }) {
  if (!position) return null;
  return <Marker position={[position.lat, position.lng]} />;
}

export default function LocationPicker({
  onLocationSelect,
  initialLat = 40.7128,
  initialLng = -74.006,
}: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);
  const [viewState, setViewState] = useState<ViewState | null>(null);
  const [markerPosition, setMarkerPosition] = useState<Coordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    const isDefaultLocation = initialLat === 40.7128 && initialLng === -74.006;

    if (!isDefaultLocation) {
      setViewState({
        center: [initialLat, initialLng],
        zoom: 15,
        timestamp: Date.now(),
      });
      setMarkerPosition({ lat: initialLat, lng: initialLng });
      setHasInitialized(true);
      return;
    }

    // Try GPS if location is default
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setViewState({
            center: [lat, lng],
            zoom: 15,
            timestamp: Date.now(),
          });
          setMarkerPosition({ lat, lng });
          onLocationSelect(lat, lng);
          setHasInitialized(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default
          setViewState({
            center: [initialLat, initialLng],
            zoom: 13,
            timestamp: Date.now(),
          });
          setHasInitialized(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      // No geolocation support, fallback
      setViewState({
        center: [initialLat, initialLng],
        zoom: 13,
        timestamp: Date.now(),
      });
      setHasInitialized(true);
    }
  }, [initialLat, initialLng, onLocationSelect, hasInitialized]);

  // Fix Leaflet icon issue
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);



  const handleMapSelect = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    // Don't move the map on click, just set the marker
    onLocationSelect(lat, lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );

      if (!res.ok) {
        setSearchError("Search failed. Please try again.");
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setSearchError("No places found for that search.");
        return;
      }

      const place = data[0];
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);

      setMarkerPosition({ lat, lng });
      setViewState({
        center: [lat, lng],
        zoom: 15,
        timestamp: Date.now()
      });
      onLocationSelect(lat, lng);
    } catch {
      setSearchError("Search error. Check your connection.");
    } finally {
      setIsSearching(false);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 bg-gray-900/30 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[340px] rounded-xl overflow-hidden border border-white/10 bg-gray-900/40 p-3 flex flex-col gap-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a place or address"
          className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>
      {searchError && <p className="text-xs text-red-400">{searchError}</p>}
      <div className="flex-1 rounded-lg overflow-hidden relative z-0">
        <MapContainer
          center={[initialLat, initialLng]} // Initial center only
          zoom={13} // Initial zoom only
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater viewState={viewState} />
          <ClickHandler onSelect={handleMapSelect} />
          <LocationMarker position={markerPosition} />
        </MapContainer>
      </div>
    </div>
  );
}
