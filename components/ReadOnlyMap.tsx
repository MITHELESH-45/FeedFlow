 "use client";

import { MapPin, Navigation2 } from "lucide-react";

interface ReadOnlyMapProps {
  pickupLocation: { lat: number; lng: number };
  dropLocation: { lat: number; lng: number };
  pickupLabel?: string;
  dropLabel?: string;
}

export default function ReadOnlyMap({ 
  pickupLocation, 
  dropLocation, 
  pickupLabel = "Pickup", 
  dropLabel = "Drop" 
}: ReadOnlyMapProps) {
  // Calculate center point between pickup and drop
  const centerLat = (pickupLocation.lat + dropLocation.lat) / 2;
  const centerLng = (pickupLocation.lng + dropLocation.lng) / 2;
  
  const locations = [
    { ...pickupLocation, label: pickupLabel, color: "teal" as const },
    { ...dropLocation, label: dropLabel, color: "blue" as const }
  ];

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-700 relative">
      {/* Background map image */}
      <div
        className="w-full h-full bg-gray-900 relative"
        style={{
          backgroundImage: `url(https://tile.openstreetmap.org/12/${Math.floor((centerLng + 180) * (2 ** 12 / 360))}/${Math.floor((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * (2 ** 12))}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(80%) brightness(0.5) contrast(1.1)',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-900/40" />
        
        {/* Location Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto px-8">
            {locations.map((location, index) => {
              // Position markers vertically spaced
              const topPosition = 20 + (index * 60);
              const markerColor = location.color === "teal" ? "text-teal-500" : "text-blue-500";
              const bgColor = location.color === "teal" ? "bg-teal-500/20" : "bg-blue-500/20";
              const borderColor = location.color === "teal" ? "border-teal-500/50" : "border-blue-500/50";
              
              return (
                <div
                  key={index}
                  className="absolute left-1/2 transform -translate-x-1/2"
                  style={{ top: `${topPosition}%` }}
                >
                  <div className={`${bgColor} ${borderColor} border-2 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2`}>
                    <MapPin className={`w-5 h-5 ${markerColor}`} fill="currentColor" />
                    <span className="text-white text-sm font-semibold whitespace-nowrap">
                      {location.label}
                    </span>
                  </div>
                  {index < locations.length - 1 && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 flex flex-col items-center mt-2">
                      <Navigation2 className="w-4 h-4 text-gray-400 rotate-180" />
                      <div className="w-0.5 h-8 bg-gray-600 mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Read-only indicator */}
        <div className="absolute bottom-3 right-3 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-gray-700">
          <p className="text-gray-400 text-xs font-medium">Read-only Map</p>
        </div>
      </div>
    </div>
  );
}
