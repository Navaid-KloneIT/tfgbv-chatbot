import './globals.css';

export const metadata = {
  title: 'TFGBV Support Chatbot - Uks Research Centre',
  description: 'Confidential support and information for women experiencing Technology-Facilitated Gender-Based Violence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}