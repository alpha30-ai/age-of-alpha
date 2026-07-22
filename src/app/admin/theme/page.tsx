import { PrismaClient } from "@prisma/client";
import ThemeForm from "./ThemeForm";

const prisma = new PrismaClient();

export default async function AdminThemePage() {
  const theme = await prisma.siteTheme.findUnique({
    where: { id: "default" },
  });

  const defaultTheme = {
    primaryColor: theme?.primaryColor || "#E64A19",
    secondaryColor: theme?.secondaryColor || "#A9C4EB",
    backgroundColor: theme?.backgroundColor || "#050505",
    textColor: theme?.textColor || "#B0BEC5",
    bannerTitle: theme?.bannerTitle || "عهد ألفا",
    bannerSubtitle: theme?.bannerSubtitle || "ملحمة الدول المائة",
    bannerDescription: theme?.bannerDescription || "من بين أنقاض الألم، وُلدت إمبراطورية لا تعرف الرحمة... عهدٌ تُكتب قوانينه بالدم، وتُدفع ضرائبه بالولاء المطلق.",
    bannerImageUrl: theme?.bannerImageUrl || "",
    bannerIsActive: theme?.bannerIsActive ?? true,
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">إعدادات المظهر العام</h1>
        <p className="text-gray-400">تحكم في الألوان، الصور، والنصوص الرئيسية للموقع بلمسة واحدة.</p>
      </div>
      
      <ThemeForm defaultTheme={defaultTheme} />
    </div>
  );
}
