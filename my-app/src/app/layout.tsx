import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Ensure this is correctly imported

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financial Tracker", // Updated title
  description: "Track your financial assets and market news.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Added a dark theme to the body for overall modern look */}
      <body className={`${inter.className} bg-gray-900 text-white`}>{children}</body>
    </html>
  );
}
