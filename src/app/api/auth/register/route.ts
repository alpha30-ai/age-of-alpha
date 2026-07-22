import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail, buildProfessionalEmailTemplate } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" }, { status: 400 });
    }

    // Backend validation for password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        message: "كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل، وتحتوي على رقم ورمز خاص." 
      }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "هذا البريد الإلكتروني مسجل بالفعل" }, { status: 400 });
    }

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "USER";
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.oTPCode.create({
      data: {
        email,
        code: otp,
        type: "VERIFY_EMAIL",
        expiresAt,
      }
    });

    const emailHtml = buildProfessionalEmailTemplate(
      "توثيق الحساب",
      "لقد خطوت خطواتك الأولى في إمارة الصدأ. يرجى توثيق حسابك لتتمكن من دخول الملحمة.",
      otp
    );

    await sendEmail({
      to: email,
      subject: "توثيق حسابك - عهد ألفا",
      html: emailHtml,
    });

    return NextResponse.json({ message: "User registered, OTP sent." }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "حدث خطأ في السيرفر: " + (error.message || "Unknown error") }, { status: 500 });
  }
}
