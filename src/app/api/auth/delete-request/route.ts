import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, buildProfessionalEmailTemplate } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });
    }

    const email = session.user.email;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    // Check if it's the last admin
    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ message: "لا يمكن حذف الإداري الوحيد في النظام. قم بتعيين إداري آخر أولاً." }, { status: 403 });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Clean old delete OTPs
    await prisma.oTPCode.deleteMany({
      where: { email, type: "DELETE_ACCOUNT" }
    });

    await prisma.oTPCode.create({
      data: {
        email,
        code: otp,
        type: "DELETE_ACCOUNT",
        expiresAt,
      }
    });

    const emailHtml = buildProfessionalEmailTemplate(
      "طلب حذف الحساب",
      "لقد تلقينا طلباً لحذف حسابك نهائياً من إمارة الصدأ. إذا كنت متأكداً من هذا القرار، استخدم الكود التالي. تحذير: هذه العملية لا يمكن التراجع عنها.",
      otp,
      "#ef4444" // Red color for danger
    );

    await sendEmail({
      to: email,
      subject: "تأكيد حذف الحساب - عهد ألفا",
      html: emailHtml,
    });

    return NextResponse.json({ message: "Delete OTP sent." }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Request Error:", error);
    return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
