import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Law Planet - Your Gateway to Legal Help in India",
  description: "Find qualified lawyers, get legal advice, and stay updated with the latest legal developments across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Law Planet</h3>
                <p className="text-gray-400 text-sm">Making legal information accessible to everyone in India.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/" className="hover:text-white">Home</a></li>
                  <li><a href="/about" className="hover:text-white">About Us</a></li>
                  <li><a href="/find-a-lawyer" className="hover:text-white">Find a Lawyer</a></li>
                  <li><a href="/news" className="hover:text-white">News</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/about" className="hover:text-white">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Disclaimer</h4>
                <p className="text-gray-400 text-sm">
                  Law Planet is NOT a law firm and does not provide legal advice.
                  The information provided is for general informational purposes only.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Law Planet. All rights reserved. For informational purposes only.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
