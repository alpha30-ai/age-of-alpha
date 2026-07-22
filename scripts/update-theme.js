const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating banner text in database...');
  try {
    await prisma.siteTheme.upsert({
      where: { id: 'default' },
      update: {
        bannerDescription: "من بين أنقاض الألم، وُلدت إمبراطورية لا تعرف الرحمة... عهدٌ تُكتب قوانينه بالدم، وتُدفع ضرائبه بالولاء المطلق.",
      },
      create: {
        id: 'default',
        bannerDescription: "من بين أنقاض الألم، وُلدت إمبراطورية لا تعرف الرحمة... عهدٌ تُكتب قوانينه بالدم، وتُدفع ضرائبه بالولاء المطلق.",
      }
    });
    console.log('Successfully updated banner description.');
  } catch (error) {
    console.error('Failed to update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
