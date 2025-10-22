// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'TFGBV Support Chatbot - Uks Research Centre',
  description: 'Confidential support and information for women experiencing Technology-Facilitated Gender-Based Violence',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}