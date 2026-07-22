import type { Metadata } from 'next';
import './globals.css';
import prisma from '@/lib/prisma';

import AuthProvider from '@/components/providers/AuthProvider';
import BackgroundEffects from '@/components/layout/BackgroundEffects';

export const metadata: Metadata = {
  title: 'عهد ألفا: ملحمة الدول المائة | Age of Alpha',
  description: 'رواية فانتازيا مظلمة ملحمية تدور في عالم الدول المائة، حيث يقود ألفا إمارة الصدأ في صراع مصيري من أجل البقاء والسيادة.',
  keywords: ['عهد ألفا', 'ملحمة الدول المائة', 'رواية فانتازيا', 'فانتازيا مظلمة', 'إمارة الصدأ'],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeStyles = '';
  try {
    const theme = await prisma.siteTheme.findUnique({ where: { id: 'default' } });
    if (theme) {
      themeStyles = `
        :root {
          --theme-bg: ${theme.backgroundColor || '#050505'};
          --theme-primary: ${theme.primaryColor || '#E64A19'};
          --theme-secondary: ${theme.secondaryColor || '#A9C4EB'};
          --theme-text: ${theme.textColor || '#F8FAFC'};
        }
      `;
    }
  } catch (error) {
    console.error('Failed to fetch theme:', error);
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
      </head>
      <body className="bg-abyss text-silver-ash font-tajawal min-h-screen antialiased overflow-x-hidden">
        <BackgroundEffects />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
