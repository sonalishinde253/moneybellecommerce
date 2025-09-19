import User from '../models/User.js';
import appError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendEmail from "../utils/email.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
dotenv.config();
import catchAsync from '../utils/catchAsync.js';

const generateToken = (userId,rememberMe) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d'});
    return token;
};
const createSendToken = (user,rememberMe, statusCode, res) => {
  console.log(user._id);
  const token = generateToken(user._id,rememberMe);
  const role = user.role;
  const fullName = user.fullName;
  const email = user.email;
  const username = user.username;
  const phone = user.phone;
  res.status(statusCode).json({
    status: "success",
    fullName,
    email,
    username,
    phone,
    role,
    token,
  });
};
export const signup = catchAsync(async(req, res, next) => {
  let password = await bcrypt.hash(req.body.password, 12);
  let passwordConfirm = password;
    const data = { 
                    fullName:req.body.fullName, 
                    email : req.body.email, 
                    username:req.body.username, 
                    password:password, 
                    passwordConfirm:password,
                    phone: req.body.phone
                };
    if (password !== passwordConfirm) {
        return next(new appError("Passwords do not match", 400));
    }
    const newUser = await User.create(data)
    createSendToken(newUser, false,201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password,rememberMe } = req.body;
  const user = await User.findOne({ email }).select("+password");
  // try{
      if (!user || !(await user.correctPassword(password))) {
        //  new appError("Incorrect email or password", 401);
        // return next(new Error("Incorrect email or password"));
         return res.status(401).json({ status: "fail",message : "Incorrect email or password" });
      }
    // }catch(err){
    //   return err;
    // }
  createSendToken(user,rememberMe,200, res);
});

export const logout = (req, res) => {
  res.status(200).json({ status: "success" });
};

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // console.log("token : ",token);
  if (!token) {
    return next(
      new appError("You are not logged in. Please log in to access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
//  console.log("Decoded:", decoded);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError("The user belonging to this token no longer exists.", 401)
    );
  }

  req.user = currentUser;
  next();
});


export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new appError("User not found with this email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost:3000/api/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      resetToken,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError("Error sending the email. Please try again later.", 500)
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new appError("Token is invalid or has expired", 400));
  }

  // Update user's password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm; // Ensure passwordConfirm matches new password
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, false,200, res); // Send new token after password reset
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.correctPassword(currentPassword))) {
    return next(new appError("Incorrect current password", 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, false,200, res);
});
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};