export interface Task {
  id: string;
  foodId: string;
  foodName: string;
  foodDescription: string;
  quantity: number;
  unit: string;
  status: "assigned" | "accepted" | "picked_up" | "reached_ngo" | "completed" | "cancelled";
  volunteerId: string | null;
  volunteerName?: string;
  donorId: string;
  donorName: string;
  donorPhone?: string;
  donorAddress: string;
  donorLat: number;
  donorLng: number;
  ngoId: string;
  ngoName: string;
  ngoPhone?: string;
  ngoAddress: string;
  ngoLat: number;
  ngoLng: number;
  assignedAt: string | null;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  reachedNgoAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockTasks: Task[] = [
  {
    id: "1",
    foodId: "1",
    foodName: "Fresh Vegetables",
    foodDescription: "Assorted fresh vegetables including tomatoes, carrots, and lettuce",
    quantity: 50,
    unit: "kg",
    status: "assigned",
    volunteerId: "3",
    volunteerName: "Bob Johnson",
    donorId: "1",
    donorName: "John Doe",
    donorPhone: "+1 234-567-8900",
    donorAddress: "123 Main St, Downtown",
    donorLat: 40.7128,
    donorLng: -74.0060,
    ngoId: "2",
    ngoName: "Hope Foundation",
    ngoPhone: "+1 234-567-8901",
    ngoAddress: "456 Community Ave, Uptown",
    ngoLat: 40.7580,
    ngoLng: -73.9855,
    assignedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
    pickedUpAt: null,
    reachedNgoAt: null,
    completedAt: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    foodId: "2",
    foodName: "Fresh Bread",
    foodDescription: "Whole wheat bread from local bakery",
    quantity: 20,
    unit: "loaves",
    status: "accepted",
    volunteerId: "3",
    volunteerName: "Bob Johnson",
    donorId: "1",
    donorName: "John Doe",
    donorPhone: "+1 234-567-8900",
    donorAddress: "789 Bakery Lane, Midtown",
    donorLat: 40.7489,
    donorLng: -73.9680,
    ngoId: "2",
    ngoName: "Shelter Aid",
    ngoPhone: "+1 234-567-8902",
    ngoAddress: "321 Shelter St, Downtown",
    ngoLat: 40.7282,
    ngoLng: -74.0776,
    assignedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    pickedUpAt: null,
    reachedNgoAt: null,
    completedAt: null,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    foodId: "3",
    foodName: "Canned Goods",
    foodDescription: "Various canned vegetables and soups",
    quantity: 100,
    unit: "cans",
    status: "completed",
    volunteerId: "3",
    volunteerName: "Bob Johnson",
    donorId: "1",
    donorName: "John Doe",
    donorPhone: "+1 234-567-8900",
    donorAddress: "999 Market St, South End",
    donorLat: 40.7047,
    donorLng: -74.0134,
    ngoId: "2",
    ngoName: "Food Bank Central",
    ngoPhone: "+1 234-567-8903",
    ngoAddress: "555 Relief Rd, North Side",
    ngoLat: 40.7831,
    ngoLng: -73.9712,
    assignedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    pickedUpAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reachedNgoAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

