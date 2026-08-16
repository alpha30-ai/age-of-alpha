import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration...');

  // Check if default novel exists
  let novel = await prisma.novel.findFirst({
    where: { title: 'عهد ألفا: ملحمة الدول المائة' }
  });

  if (!novel) {
    console.log('Creating default Novel: عهد ألفا');
    novel = await prisma.novel.create({
      data: {
        title: 'عهد ألفا: ملحمة الدول المائة',
        description: 'في عالمٍ تتصارع فيه مائة دولة على السيادة المطلقة، يقف ألفا — القائد الأعلى لإمارة الصدأ — في مواجهة قوى الظلام والمؤامرات التي تهدد بابتلاع مملكته.',
        author: 'مجهول'
      }
    });
  } else {
    console.log('Default Novel already exists.');
  }

  // Update existing Chapters
  const chapters = await prisma.chapter.updateMany({
    where: { novelId: null },
    data: { novelId: novel.id }
  });
  console.log(`Updated ${chapters.count} chapters.`);

  // Update existing Characters
  const characters = await prisma.character.updateMany({
    where: { novelId: null },
    data: { novelId: novel.id }
  });
  console.log(`Updated ${characters.count} characters.`);

  // Update existing Videos
  const videos = await prisma.videoMedia.updateMany({
    where: { novelId: null },
    data: { novelId: novel.id }
  });
  console.log(`Updated ${videos.count} videos.`);

  console.log('Migration completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
