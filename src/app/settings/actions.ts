'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const image = formData.get('image') as string;
  const password = formData.get('password') as string;

  const dataToUpdate: any = {};
  
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (image) dataToUpdate.image = image;
  
  if (password && password.trim() !== '') {
    const hashedPassword = await bcrypt.hash(password, 10);
    dataToUpdate.password = hashedPassword;
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: dataToUpdate,
    });
    
    revalidatePath('/settings');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('Failed to update profile');
  }
}
