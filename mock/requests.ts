export interface Request {
  id: string;
  foodId: string;
  ngoId: string;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  requestedAt: string;
  updatedAt: string;
}

export const mockRequests: Request[] = [
  {
    id: "1",
    foodId: "1",
    ngoId: "2",
    quantity: 30,
    status: "pending",
    requestedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    foodId: "2",
    ngoId: "2",
    quantity: 15,
    status: "approved",
    requestedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


