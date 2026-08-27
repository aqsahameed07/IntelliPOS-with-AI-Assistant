// app/models/Activity.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  type: "product" | "order" | "customer" | "payment" | "inventory" | "system" | "employee" | "sale" | "category" | "vendor" | "invoice" | "refund";
  message: string;
  userId: string;
  userEmail: string;
  userName: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["product", "order", "customer", "payment", "inventory", "system", "employee", "sale", "category", "vendor", "invoice", "refund"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes for better performance
ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });

export const Activity = mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);