import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "donor" | "ngo" | "volunteer" | "admin";
  status: "pending" | "approved" | "rejected"; // For NGO only
  organization?: string; // For NGO and Donor
  // NGO specific fields
  deliveryLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["donor", "ngo", "volunteer", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function (this: IUser) {
        // NGO starts as pending, others are approved by default
        return this.role === "ngo" ? "pending" : "approved";
      },
    },
    organization: { type: String },
    deliveryLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;






