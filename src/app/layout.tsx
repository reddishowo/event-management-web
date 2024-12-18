import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Management App",
  description: "Manage your events effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} ${robotoMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="bg-blue-600 text-white py-4 px-8">
          <h1 className="text-lg font-bold">Event Management App</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="bg-gray-800 text-gray-200 py-2 text-center">
          <p>© 2024 Event Management Inc. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}