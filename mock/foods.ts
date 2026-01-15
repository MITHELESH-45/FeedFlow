export interface Food {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  status: "available" | "requested" | "approved" | "picked_up" | "completed" | "cancelled" | "expired";
  donorId: string;
  createdAt: string;
  updatedAt: string;
}

export const mockFoods: Food[] = [
  {
    id: "1",
    name: "Fresh Vegetables",
    description: "Assorted fresh vegetables",
    quantity: 50,
    unit: "kg",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "available",
    donorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bread",
    description: "Fresh bread from bakery",
    quantity: 20,
    unit: "loaves",
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "requested",
    donorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];








