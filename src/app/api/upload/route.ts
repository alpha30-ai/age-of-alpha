import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, ''); // sanitize
    const filename = `${uniqueSuffix}-${originalName}`;
    
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure dir exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // ignore if exists
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'فشل في رفع الملف' }, { status: 500 });
  }
}
