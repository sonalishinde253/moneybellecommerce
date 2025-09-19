import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
const addressSchema = new mongoose.Schema({
  street1: {
    type: String,
    required: true,
  },
  street2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name not provided"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "user must have a password"],
    minlength: 8,
    select: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    // validate works on save() , create() - doesn't work on findByIdAndUpdate
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  phone: {
    type: String,
    required: true,
  },
  address: [addressSchema],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  image: {
    type: String,
    default:
      "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png",
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
// Check if provided password matches user's password
UserSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
// Create password reset token and set expiry
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  return resetToken;
};
const User = mongoose.model("User",UserSchema);
export default User;