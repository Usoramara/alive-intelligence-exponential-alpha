import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Only use Clerk when real keys are configured
const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('placeholder');

export const metadata: Metadata = {
  title: "The Alive Intelligence",
  description: "Wybe's cognitive architecture — the mind itself, running in the browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );

  if (!hasClerkKeys) return content;

  return <ClerkProvider>{content}</ClerkProvider>;
}
