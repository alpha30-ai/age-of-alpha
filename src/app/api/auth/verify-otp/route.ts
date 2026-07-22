import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Missing email or code" }, { status: 400 });
    }

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        type: "VERIFY_EMAIL",
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await prisma.oTPCode.deleteMany({
      where: { email, type: "VERIFY_EMAIL" }
    });

    const welcomeHtml = `
      <div style="background-color: #050505; color: #B0BEC5; padding: 40px; font-family: 'Courier New', Courier, monospace; text-align: center;">
        <h1 style="color: #E64A19;">مرحباً بك في إمارة الصدأ</h1>
        <p style="font-size: 18px;">لقد تم توثيق حسابك بنجاح. طريقك في عهد ألفا يبدأ الآن.</p>
        <p style="font-size: 16px;">استعد للمعركة!</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "مرحباً بك - عهد ألفا",
      html: welcomeHtml,
    });

    return NextResponse.json({ message: "OTP verified, account activated." }, { status: 200 });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
