import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, 
  },
});
async function sendEmail({ to, subject, html, text }) {
  try {
    console.log(`[MAILER] Đang gửi email tới: ${to}`);
    const info = await transporter.sendMail({
      from: `"Calmify" <${process.env.SMTP_USER}>`, 
      to,
      subject,
      text: text || "Vui lòng xem trên trình duyệt hỗ trợ HTML",
      html,
    });
    console.log(`[MAILER] Gửi thành công! ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[MAILER] Lỗi gửi mail:`, error.message);
    throw error;
  }
}

export { sendEmail };