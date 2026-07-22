"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createVideo(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string || null;
  const videoUrl = formData.get("videoUrl") as string;
  const thumbnail = formData.get("thumbnail") as string || null;
  const isHostedStr = formData.getAll("isHosted");
  const isHosted = isHostedStr.includes("true");

  if (!title || !videoUrl) return;

  await prisma.videoMedia.create({
    data: {
      title,
      description,
      videoUrl,
      thumbnail,
      isHosted,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function updateVideo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string || null;
  const videoUrl = formData.get("videoUrl") as string;
  const thumbnail = formData.get("thumbnail") as string || null;
  const isHostedStr = formData.getAll("isHosted");
  const isHosted = isHostedStr.includes("true");

  if (!id || !title || !videoUrl) return;

  await prisma.videoMedia.update({
    where: { id },
    data: {
      title,
      description,
      videoUrl,
      thumbnail,
      isHosted,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(formData: FormData) {
  const id = formData.get("id") as string;
  
  if (!id) return;

  await prisma.videoMedia.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/videos");
}
