import * as userService from "../services/userService.js";

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy thông tin" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body; 
    const updatedUser = await userService.updateUserProfile(userId, updateData);
    res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ success: false, message: "Lỗi cập nhật thông tin" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn file ảnh" });
    }
    const avatarPath = `/uploads/avatars/${file.filename}`;
    const updatedUser = await userService.updateUserAvatar(userId, avatarPath);
    res.json({ success: true, message: "Upload avatar thành công", data: updatedUser });
  } catch (err) {
    console.error("Error in updateAvatar:", err);
    res.status(500).json({ success: false, message: "Lỗi khi upload avatar" });
  }
};