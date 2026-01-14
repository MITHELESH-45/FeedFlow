"use client";

import dynamic from "next/dynamic";

const LocationPickerDynamic = dynamic(
  () => import("./LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-700 bg-gray-900/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    ),
  }
);

interface LocationPickerWrapperProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function LocationPickerWrapper(props: LocationPickerWrapperProps) {
  return <LocationPickerDynamic {...props} />;
}
