import prisma from "../config/prismaClient.js";
import crypto from "crypto";
import generateOTP from "../utils/generateOtp.js";
import { sendEmail } from "../utils/mailer.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { signToken } from "../utils/jwt.js";

const OTP_TTL_MINUTES = 10;

export async function register({ email, password, age, gender, job }) {
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, age, gender, job, },
    select: { id: true, email: true, age: true, gender: true, job: true, createdAt: true },
  });
  return user;
}
export async function login({ email, password, requiredRole }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Email hoặc mật khẩu không đúng");
  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Email hoặc mật khẩu không đúng");
  if (requiredRole === "admin" && user.role !== "admin") {
    throw new Error("Bạn không có quyền truy cập vào trang quản trị");
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      age: user.age,
      gender: user.gender,
      job: user.job,
      role: user.role
    }
  };
}

export async function sendForgotOTP({ email }) {
  console.log("ĐÃ VÀO SERVICE. Email nhận được LÀ:", email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  const otp = generateOTP(6);
  const expiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry: expiry },
  });
  const subject = "Mã xác thực bảo mật (OTP) - Calmify App";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #4CAF50; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
      <p style="font-size: 16px; color: #333;">Xin chào,</p>
      <p style="font-size: 16px; color: #333;">Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản Calmify của bạn. Hãy sử dụng mã bên dưới để xác thực:</p>
      <div style="background-color: #f9f9f9; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #555;">Mã này sẽ hết hạn sau <b>${OTP_TTL_MINUTES} phút</b>.</p>
      <p style="font-size: 14px; color: #555;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #888;">
        © 2024 Calmify App Team. All rights reserved.
      </p>
    </div>
  `;
  const text = `Mã xác thực Calmify của bạn là: ${otp}. Mã hết hạn sau ${OTP_TTL_MINUTES} phút.`;
  await sendEmail({ to: email, subject, html, text });
  return { message: "OTP sent" };
}

export async function verifyOtp({ email, otp }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  if (!user.otp || !user.otpExpiry) throw new Error("No OTP requested");
  if (String(user.otp).trim() !== String(otp).trim()) {
    throw new Error("Invalid OTP");
  }
  if (new Date() > user.otpExpiry) throw new Error("OTP expired");
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(new Date().getTime() + 10 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiry: null,
      resetToken: resetToken,
      resetTokenExpiry: resetTokenExpiry,
    },
  });
  return { resetToken };
}

export async function resetPassword({ email, resetToken, newPassword }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  if (!user.resetToken || !user.resetTokenExpiry)
    throw new Error("No reset token requested");
  if (user.resetToken !== resetToken) throw new Error("Invalid token");
  if (new Date() > user.resetTokenExpiry) throw new Error("Token expired");
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { email },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
      otp: null,
      otpExpiry: null,
    },
  });
  return { message: "Password reset successful" };
}