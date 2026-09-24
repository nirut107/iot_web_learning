import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Inception-of-Things (IoT) | คู่มือการเรียนรู้และติดตามโปรเจกต์ 42',
  description: 'เว็บแอปสำหรับเรียนรู้และติดตามการทำโปรเจกต์ Inception-of-Things ครบถ้วนตั้งแต่พื้นฐานจนถึง Mandatory Part 1–3 และ Bonus GitLab ตาม Subject Version 4.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans transition-colors duration-200">
        <ThemeProvider>
          <ProgressProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
