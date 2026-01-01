export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  volunteerId: string | null;
  requestId: string;
  assignedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Pick up food from donor",
    description: "Collect vegetables from John Doe",
    status: "pending",
    volunteerId: null,
    requestId: "1",
    assignedAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Deliver food to NGO",
    description: "Deliver bread to local shelter",
    status: "in_progress",
    volunteerId: "3",
    requestId: "2",
    assignedAt: new Date().toISOString(),
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

