import * as authService from "../services/authService.js";
import { validatePassword } from "../utils/passwordPolicy.js";
import validator from "validator";

const authController = {
  register: async (req, res, next) => {
    try {
      const { email, password, age, gender, job } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email và mật khẩu là bắt buộc" });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Email không hợp lệ" });
      }
      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Mật khẩu không đáp ứng yêu cầu (ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)",
        });
      }
      const ageInt = age ? parseInt(age, 10) : null;
      const user = await authService.register({ email, password, age: ageInt, gender, job });
      res.status(201).json({ success: true, message: "Đăng ký thành công", data: user });
    } catch (err) {
      if (err.code === "P2002" && err.meta?.target?.includes("email")) {
        return res.status(409).json({ success: false, message: "Email đã được sử dụng" });
      }
      next(err);
    }
  },
  // sửa lại token ở đây.
  login: async (req, res, next) => {
    try {
      const { email, password, isAdminLogin } = req.body; 
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email và mật khẩu là bắt buộc" });
      }
      const requiredRole = isAdminLogin ? "admin" : "user";
      const result = await authService.login({ 
        email, 
        password, 
        requiredRole 
      });
      res.json({
        success: true,
        message: "Đăng nhập thành công",
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      res.status(401).json({
        success: false,
        message: err.message || "Sai email hoặc mật khẩu",
    });
  }
},
 forgotPassword: async (req, res, next) => {
    try {
      console.log("ĐÃ VÀO CONTROLLER. req.body LÀ:", req.body); 
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Vui lòng nhập email" });
      await authService.sendForgotOTP({ email });
      res.json({ success: true, message: "OTP đã được gửi tới email (nếu tài khoản tồn tại)" });
    } catch (err) {
      next(err);
    }
  },
 verifyOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Thiếu email hoặc OTP" });
      }
      const { resetToken } = await authService.verifyOtp({ email, otp });
      res.json({
        success: true,
        message: "Xác thực OTP thành công",
        resetToken, 
      });
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { email, resetToken, newPassword } = req.body;
      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin email, token hoặc mật khẩu mới",
        });
      }
      await authService.resetPassword({ email, resetToken, newPassword });
      res.json({ success: true, message: "Đặt lại mật khẩu thành công" });
    } catch (err) {
      next(err);
    }
  },


  logout: async (req, res, next) => {
    try {
      res.clearCookie("token");
      res.json({ success: true, message: "Đăng xuất thành công" });
    } catch (err) {
      next(err);
    }
  },

  getMe: async (req, res, next) => {
    try {
      res.json({ success: true, data: req.user });
    } catch (err) {
      next(err);
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search = "" } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where = search ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { id: { contains: search } }
        ]
      } : {};
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: "desc" },
          select: { id: true, email: true, age: true, gender: true, job: true, role: true, createdAt: true }
        }),
        prisma.user.count({ where })
      ]);
      res.json({
        success: true,
        data: users,
        pagination: { total, page: parseInt(page), limit: parseInt(limit) }
      });
    } catch (err) {
      next(err);
    }
  },
  getUserDetail: async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy" });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
  deactivateUser: async (req, res, next) => {
    try {
      await prisma.user.update({
        where: { id: req.params.id },
        data: { isActive: false } 
      });
      res.json({ success: true, message: "Đã vô hiệu hóa thành công" });
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { age, gender, job } = req.body;
      const updated = await prisma.user.update({
        where: { id: req.user.id }, 
        data: { age: age ? parseInt(age) : undefined, gender, job }
      });
      res.json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (err) {
      next(err);
    }
  }
};

export default authController;