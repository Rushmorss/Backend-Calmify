import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, 
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  try {
    console.log(`[MAILER] Đang gửi email tới: ${to}`);
    const fromName = "Calmify App"; 
    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`, 
      to,
      subject,
      text: text || "Vui lòng xem email này trên trình duyệt hỗ trợ HTML.", // Dự phòng nếu HTML lỗi
      html,
    });

    console.log(`[MAILER] Gửi thành công! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[MAILER] Lỗi khi gửi email:`, error);
    throw new Error("Không thể gửi email. Vui lòng thử lại sau.");
  }
}

export { sendEmail };