import userService from "../services/userService.js";

const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.user.id); 
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }
    const user = await userService.getUserProfile(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi Server" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateSettings = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const updatedSettings = await userService.updateUserSettings(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Cập nhật cài đặt thành công",
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }
    const userId = parseInt(req.user.id);
    const avatarPath = req.file.path.replace(/\\/g, "/"); 
    const updatedUser = await userService.updateUserProfile(userId, {
      avatar: avatarPath 
    });

    res.status(200).json({
      success: true,
      message: "Upload ảnh đại diện thành công",
      data: { avatar: avatarPath }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi upload ảnh" });
  }
};
export default {
    getProfile,
    updateProfile,
    updateSettings,
    uploadAvatar
}