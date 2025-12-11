import Joi from "joi";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

export const registerSchema = Joi.object({
  age: Joi.number().integer().min(13).required().messages({
    "number.base": "Tuổi phải là số",
    "number.min": "Bạn phải từ 13 tuổi trở lên",
    "any.required": "Tuổi là bắt buộc",
  }),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required().messages({
    "any.required": "Giới tính là bắt buộc",
    "any.only": "Giới tính phải là MALE, FEMALE hoặc OTHER",
  }),

  job: Joi.string().min(2).required().messages({
    "string.min": "Công việc phải có ít nhất 2 ký tự",
    "any.required": "Công việc là bắt buộc",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
});

export const resetPasswordSchema = Joi.object({
  otp: Joi.string().required().messages({
    "any.required": "Mã xác nhận là bắt buộc",
  }),

  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự",
    "any.required": "Mật khẩu mới là bắt buộc",
  }),
});
