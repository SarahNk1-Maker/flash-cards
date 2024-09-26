// app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
//import './globals.css'; // Global styles if needed

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
