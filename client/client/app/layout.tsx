import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CitizenVoice - Public Engagement Platform',
  description: 'A platform for citizens to submit complaints and feedback on public services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-lg font-semibold text-orange-700">CitizenVoice</span>
                <p className="text-sm text-gray-500 mt-1">© 2025 All rights reserved</p>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  About
                </a>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 hover:text-orange-700">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}