import { useState } from "react";

type CreateFoodInput = {
  title: string;
  description?: string;
  foodType: "cooked" | "packaged" | "fresh";
  quantity: string;
  imageUrl?: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  donorId?: number;
};

export function useCreateFood() {
  const [isPending, setIsPending] = useState(false);

  const mutate = (
    data: CreateFoodInput,
    options?: { onSuccess?: () => void }
  ) => {
    setIsPending(true);

    // MOCK API — replace with real backend later
    setTimeout(() => {
      console.log("Food created:", data);
      setIsPending(false);
      options?.onSuccess?.();
    }, 1200);
  };

  return {
    mutate,
    isPending,
  };
}
