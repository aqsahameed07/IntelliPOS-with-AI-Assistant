// models/User.ts

import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    address: String,
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "customer"],
      default: "employee",
    },

      status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);