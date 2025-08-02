import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure this is correctly imported

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter', // Define a CSS variable for Inter font
});

export const metadata: Metadata = {
  title: "Financial Insight Engine", // Updated title to reflect AI and financial focus
  description: "AI-powered financial asset analysis and market insights.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}> {/* Apply Inter font variable to html tag */}
      {/* Body will inherit styles from globals.css, including background and text color */}
      <body>{children}</body>
    </html>
  );
}
