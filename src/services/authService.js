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
    data: { email, password: hashed, age, gender, job },
    select: { id: true, email: true, age: true, gender: true, job: true, createdAt: true },
  });
  return user;
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = signToken({ id: user.id, email: user.email });
  return { token, user: { id: user.id, email: user.email, age: user.age, gender: user.gender, job: user.job } };
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
  const subject = "Mã xác nhận đặt lại mật khẩu";
  const html = `<p>Mã xác nhận của bạn là: <b>${otp}</b></p><p>Mã có hiệu lực trong ${OTP_TTL_MINUTES} phút.</p>`;
  await sendEmail({ to: email, subject, html, text: `Mã xác nhận: ${otp}` });
  return { message: "OTP sent" };
}

export async function verifyOtp({ email, otp }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  if (!user.otp || !user.otpExpiry) throw new Error("No OTP requested");

  if (String(user.otp) !== String(otp)) throw new Error("Invalid OTP");
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
