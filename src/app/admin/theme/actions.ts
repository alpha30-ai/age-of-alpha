"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function updateTheme(formData: FormData) {
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const backgroundColor = formData.get("backgroundColor") as string;
  const textColor = formData.get("textColor") as string;
  
  const bannerTitle = formData.get("bannerTitle") as string;
  const bannerSubtitle = formData.get("bannerSubtitle") as string;
  const bannerImageUrl = formData.get("bannerImageUrl") as string;
  const bannerIsActiveStr = formData.getAll("bannerIsActive");
  const bannerIsActive = bannerIsActiveStr.includes("true");

  await prisma.siteTheme.upsert({
    where: { id: "default" },
    update: {
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      bannerTitle,
      bannerSubtitle,
      bannerImageUrl,
      bannerIsActive,
    },
    create: {
      id: "default",
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      bannerTitle,
      bannerSubtitle,
      bannerImageUrl,
      bannerIsActive,
    },
  });

  revalidatePath("/");
}
