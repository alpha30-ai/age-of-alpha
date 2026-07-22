import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: process.env.EMAIL_SERVER_PORT === "465",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@ageofalpha.com",
    to,
    subject,
    html,
  });
}

export function buildProfessionalEmailTemplate(title: string, subtitle: string, otpCode: string, themeColor: string = "#E64A19") {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #050505; color: #F8FAFC; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #111111, #050505); padding: 40px 20px; text-align: center; border-bottom: 2px solid ${themeColor}; }
        .header h1 { margin: 0; color: ${themeColor}; font-size: 28px; text-shadow: 0 0 10px ${themeColor}66; }
        .content { padding: 40px 30px; text-align: center; }
        .subtitle { font-size: 18px; color: #E2E8F0; margin-bottom: 30px; line-height: 1.6; }
        .otp-box { background: linear-gradient(145deg, #1a1a1a, #111111); border: 1px solid ${themeColor}40; padding: 20px; border-radius: 12px; margin: 30px auto; max-width: 300px; }
        .otp-code { font-size: 36px; font-weight: bold; color: ${themeColor}; letter-spacing: 10px; text-shadow: 0 0 15px ${themeColor}40; margin: 0; }
        .footer { background-color: #050505; padding: 20px; text-align: center; font-size: 12px; color: #4b5563; border-top: 1px solid #1a1a1a; }
        .warning { font-size: 13px; color: #ef4444; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>عهد ألفا</h1>
        </div>
        <div class="content">
          <h2 style="margin-top: 0;">${title}</h2>
          <div class="subtitle">${subtitle}</div>
          <div class="otp-box">
            <p class="otp-code">${otpCode}</p>
          </div>
          <div class="warning">
            هذا الرمز صالح لمدة 15 دقيقة فقط. لا تشارك هذا الرمز مع أي شخص آخر.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ملحمة الدول المائة. جميع الحقوق محفوظة.
        </div>
      </div>
    </body>
    </html>
  `;
}

