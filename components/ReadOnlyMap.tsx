"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Leaflet
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <div style="transform: rotate(45deg); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;"></div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const pickupIcon = createCustomIcon("#14b8a6"); // teal-500
const dropIcon = createCustomIcon("#3b82f6"); // blue-500

interface ReadOnlyMapProps {
  pickupLocation: { lat: number; lng: number };
  dropLocation?: { lat: number; lng: number };
  pickupLabel?: string;
  dropLabel?: string;
}

// Component to fit map bounds
function MapBounds({ pickupLocation, dropLocation }: { pickupLocation: { lat: number; lng: number }; dropLocation?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (pickupLocation && dropLocation) {
      // Fit bounds to both locations
      const bounds = L.latLngBounds([pickupLocation, dropLocation]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupLocation) {
      // Center on single location
      map.setView([pickupLocation.lat, pickupLocation.lng], 13);
    }
  }, [map, pickupLocation, dropLocation]);

  return null;
}

export default function ReadOnlyMap({
  pickupLocation,
  dropLocation,
  pickupLabel = "Pickup",
  dropLabel = "Drop",
}: ReadOnlyMapProps) {
  // Validate coordinates
  if (!pickupLocation || typeof pickupLocation.lat !== "number" || typeof pickupLocation.lng !== "number") {
    return (
      <div className="w-full h-[300px] rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
        <p className="text-gray-400">Invalid pickup location data</p>
      </div>
    );
  }

  if (dropLocation && (typeof dropLocation.lat !== "number" || typeof dropLocation.lng !== "number")) {
    return (
      <div className="w-full h-[300px] rounded-lg bg-gray-800 flex items-center justify-center border border-gray-700">
        <p className="text-gray-400">Invalid drop location data</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={dropLocation ? [(pickupLocation.lat + dropLocation.lat) / 2, (pickupLocation.lng + dropLocation.lng) / 2] : [pickupLocation.lat, pickupLocation.lng]}
        zoom={dropLocation ? 12 : 13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds pickupLocation={pickupLocation} dropLocation={dropLocation} />
        <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
          <Popup>{pickupLabel}</Popup>
        </Marker>
        {dropLocation && (
          <Marker position={[dropLocation.lat, dropLocation.lng]} icon={dropIcon}>
            <Popup>{dropLabel}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
