import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const updateAvatar = async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: "Thiếu file" });
  try {
    const avatarPath = `/uploads/avatars/${file.filename}`;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: avatarPath },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi upload" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { nickname } = req.body; 
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { nickname: nickname }, 
    });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật info" });
  }
};
