import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  foodId: mongoose.Types.ObjectId;
  requestId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId | null;
  status: "assigned" | "accepted" | "picked_up" | "reached_ngo" | "completed" | "cancelled";
  assignedAt: Date | null;
  acceptedAt: Date | null;
  pickedUpAt: Date | null;
  reachedNgoAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    requestId: { type: Schema.Types.ObjectId, ref: "Request", required: true },
    volunteerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["assigned", "accepted", "picked_up", "reached_ngo", "completed", "cancelled"],
      default: "assigned",
    },
    assignedAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    pickedUpAt: { type: Date, default: null },
    reachedNgoAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes
TaskSchema.index({ volunteerId: 1 });
TaskSchema.index({ foodId: 1 });
TaskSchema.index({ requestId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ createdAt: -1 });

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;


