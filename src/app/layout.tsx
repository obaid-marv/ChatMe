// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from "../components/Sidebar";
import ClientProvider from '../components/ClientProvider'; // Import the client component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chatme!',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 lg:ml-64">
              {children}
            </main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}
