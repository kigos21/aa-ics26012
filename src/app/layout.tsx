import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alternative Assessment",
  description: "A project made for ICS26012 Finals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* NAVBAR */}
        <header>
          <nav className="bg-blue-50">
            <ul className="flex justify-center gap-12 px-8 py-4">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sjf" className="hover:text-blue-600">
                  Shortest Job First
                </Link>
              </li>
              <li>
                <Link href="/priority" className="hover:text-blue-600">
                  Preemptive Priority
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-blue-600">
                  Scan
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="px-[15%] py-8">{children}</main>
      </body>
    </html>
  );
}
