import { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | LinknRide` : "LinknRide"}</title>
      </Head>

      <div className="relative min-h-screen bg-white flex flex-col">

        {/* ================= NAVBAR ================= */}
        <header className="bg-black text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

            {/* LOGO */}
            <Link href="/" legacyBehavior>
              <a className="flex items-center gap-2 md:gap-3">
                <img
                  src="/logo.jpg"
                  alt="LinknRide Logo"
                  width="40"
                  height="40"
                  style={{ borderRadius: "9999px" }}
                />
                <span className="text-lg md:text-xl font-extrabold tracking-wide">
                  <span className="text-white">LINK</span>
                  <span className="text-yellow-400">N</span>
                  <span className="text-white">RIDE</span>
                </span>
              </a>
            </Link>

            {/* NAV LINKS */}
            <nav className="flex items-center gap-4 md:gap-8 text-sm font-semibold">

              {/* Hide these on mobile */}
              <div className="hidden md:flex gap-8 items-center">
                <span className="hover:text-yellow-400 cursor-pointer transition">
                  How it Works
                </span>
                <span className="hover:text-yellow-400 cursor-pointer transition">
                  Users
                </span>
                <span className="hover:text-yellow-400 cursor-pointer transition">
                  Contact
                </span>
              </div>

              {/* LOGIN BUTTON (always visible) */}
              <Link href="/login" legacyBehavior>
                <a className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 md:px-5 py-2 rounded-lg font-semibold transition text-sm md:text-base">
                  Login
                </a>
              </Link>
            </nav>
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="flex-1">
          {children}
        </main>

        {/* ================= FOOTER ================= */}
        <footer className="bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left">
            <span>
              © {new Date().getFullYear()}{" "}
              <span className="text-yellow-400 font-semibold">
                LinknRide
              </span>. All rights reserved.
            </span>

            <span className="text-gray-400">
              Privacy · Terms · Support
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}