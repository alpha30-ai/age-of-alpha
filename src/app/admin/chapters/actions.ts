"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createChapter(formData: FormData) {
  const chapterNum = parseInt(formData.get("chapterNum") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  const audioUrl = formData.get("audioUrl") as string || null;

  if (!title || !content || isNaN(chapterNum)) return;

  await prisma.chapter.create({
    data: {
      chapterNum,
      title,
      content,
      imageUrl,
      audioUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
}

export async function updateChapter(formData: FormData) {
  const id = formData.get("id") as string;
  const chapterNum = parseInt(formData.get("chapterNum") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  const audioUrl = formData.get("audioUrl") as string || null;

  if (!id || !title || !content || isNaN(chapterNum)) return;

  await prisma.chapter.update({
    where: { id },
    data: {
      chapterNum,
      title,
      content,
      imageUrl,
      audioUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/chapters");
  revalidatePath(`/chapters/${chapterNum}`);
  redirect("/admin/chapters");
}

export async function deleteChapter(formData: FormData) {
  const id = formData.get("id") as string;
  
  if (!id) return;

  await prisma.chapter.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/chapters");
}
