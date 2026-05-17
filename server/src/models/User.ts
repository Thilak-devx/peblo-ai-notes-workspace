import bcrypt from "bcryptjs";
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword: (password: string) => Promise<boolean>;
};

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (_document, returnedObject: Record<string, unknown>) => {
    delete returnedObject.password;
    return returnedObject;
  },
});

export const User = models.User || model<UserDocument>("User", userSchema);
