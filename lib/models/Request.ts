import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRequest extends Document {
  foodId: mongoose.Types.ObjectId;
  ngoId: mongoose.Types.ObjectId;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  requestedAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    ngoId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RequestSchema.index({ foodId: 1 });
RequestSchema.index({ ngoId: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ createdAt: -1 });

const Request: Model<IRequest> = mongoose.models.Request || mongoose.model<IRequest>("Request", RequestSchema);

export default Request;






