import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "غير مصرح لك" }, { status: 401 });
    }

    const email = session.user.email;
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "يرجى إدخال الكود" }, { status: 400 });
    }

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        type: "DELETE_ACCOUNT",
        expiresAt: { gt: new Date() }
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ message: "الكود غير صحيح أو منتهي الصلاحية" }, { status: 400 });
    }

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

    // Delete the user
    await prisma.user.delete({
      where: { email }
    });

    // Cleanup OTPs
    await prisma.oTPCode.deleteMany({
      where: { email }
    });

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete Confirm Error:", error);
    return NextResponse.json({ message: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
