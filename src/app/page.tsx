import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import LatestChapters from '@/components/home/LatestChapters';
import VideoShowcase from '@/components/home/VideoShowcase';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  const [theme, characters] = await Promise.all([
    prisma.siteTheme.findUnique({
      where: { id: "default" },
    }),
    prisma.character.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: 4 // Get the top 4 characters for the showcase
    })
  ]);

  return (
    <main>
      <Navbar />
      <HeroSection theme={theme} />
      <AboutSection characters={characters} />
      <LatestChapters />
      <VideoShowcase />
      <Footer />
    </main>
  );
}
