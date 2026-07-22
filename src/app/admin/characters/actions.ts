'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createCharacter(formData: FormData) {
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const faction = formData.get('faction') as string;
  const strength = parseInt(formData.get('strength') as string) || 50;
  const magic = parseInt(formData.get('magic') as string) || 50;
  const intelligence = parseInt(formData.get('intelligence') as string) || 50;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const imageUrl = formData.get('imageUrl') as string;

  await prisma.character.create({
    data: {
      name,
      title,
      description,
      faction,
      strength,
      magic,
      intelligence,
      sortOrder,
      imageUrl,
    }
  });

  revalidatePath('/admin/characters');
  revalidatePath('/characters');
  revalidatePath('/');
}

export async function deleteCharacter(id: string) {
  await prisma.character.delete({
    where: { id }
  });
  revalidatePath('/admin/characters');
  revalidatePath('/characters');
  revalidatePath('/');
}

export async function updateCharacter(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const faction = formData.get('faction') as string;
  const strength = parseInt(formData.get('strength') as string) || 50;
  const magic = parseInt(formData.get('magic') as string) || 50;
  const intelligence = parseInt(formData.get('intelligence') as string) || 50;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const imageUrl = formData.get('imageUrl') as string;

  const updateData: any = {
    name,
    title,
    description,
    faction,
    strength,
    magic,
    intelligence,
    sortOrder,
  };

  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }

  await prisma.character.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/characters');
  revalidatePath('/characters');
  revalidatePath('/');
  revalidatePath(`/characters/${id}`);
}
