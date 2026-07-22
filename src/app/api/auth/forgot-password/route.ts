import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, buildProfessionalEmailTemplate } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete existing reset OTPs for this email
    await prisma.oTPCode.deleteMany({
      where: { email, type: "RESET_PASSWORD" }
    });

    await prisma.oTPCode.create({
      data: {
        email,
        code: otp,
        type: "RESET_PASSWORD",
        expiresAt,
      }
    });

    const emailHtml = buildProfessionalEmailTemplate(
      "استعادة الرقم السري",
      "لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. إذا لم تكن أنت من طلب ذلك، يرجى تجاهل هذه الرسالة.",
      otp
    );

    await sendEmail({
      to: email,
      subject: "استعادة كلمة المرور - عهد ألفا",
      html: emailHtml,
    });

    return NextResponse.json({ message: "Password reset OTP sent." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
