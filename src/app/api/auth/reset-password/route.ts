import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email,
        code,
        type: "RESET_PASSWORD",
      }
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.oTPCode.deleteMany({
      where: { email, type: "RESET_PASSWORD" }
    });

    return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
