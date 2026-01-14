import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFood extends Document {
  name: string;
  description?: string;
  foodType: string;
  quantity: number;
  unit: string;
  imageUrl?: string;
  status: "available" | "requested" | "approved" | "picked_up" | "reached_ngo" | "completed" | "cancelled" | "expired";
  donorId: mongoose.Types.ObjectId;
  preparedTime: Date;
  expiryTime: Date;
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    name: { type: String, required: true },
    description: { type: String },
    foodType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    imageUrl: { type: String },
    status: {
      type: String,
      enum: ["available", "requested", "approved", "picked_up", "reached_ngo", "completed", "cancelled", "expired"],
      default: "available",
    },
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    preparedTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FoodSchema.index({ donorId: 1 });
FoodSchema.index({ status: 1 });
FoodSchema.index({ expiryTime: 1 });
FoodSchema.index({ createdAt: -1 });

const Food: Model<IFood> = mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema);

export default Food;


