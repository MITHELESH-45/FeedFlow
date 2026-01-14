import { z } from "zod";

/**
 * Shared schema for Donor - Donate page
 */
export const insertFoodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  foodType: z.enum(["cooked", "packaged", "fresh"]),
  quantity: z.string().min(1, "Quantity is required"),
  imageUrl: z.string().url().optional(),
  pickupAddress: z.string().min(1, "Pickup address is required"),

  // added during submit
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  donorId: z.number().optional(),
});
