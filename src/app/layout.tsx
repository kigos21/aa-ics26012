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
      <body className={`${inter.className} bg-amber-300`}>
        {/* NAVBAR */}
        <header>
          <nav className="bg-amber-800">
            <ul className="flex justify-center gap-12 px-8 py-4">
              <li>
                <Link href="/" className="hover:text-orange-600">
                  <b>Home</b>
                </Link>
              </li>
              <li>
                <Link href="/sjf" className="hover:text-orange-600">
                  <b>Shortest Job First</b>
                </Link>
              </li>
              <li>
                <Link href="/priority" className="hover:text-orange-600">
                  <b>Preemptive Priority</b>
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-orange-600">
                  <b>Scan</b>
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
