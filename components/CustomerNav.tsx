import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

export default function CustomerNav() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { name: "🏠 Dashboard", path: "/customer/dashboard" },
    { name: "📋 My Loads", path: "/customer/my-loads" },
    { name: "💬 My Requests", path: "/customer/my-requests" },
  ];

  return (
    <header className="flex flex-col bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="flex justify-between items-center px-8 py-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/customer/dashboard")}>
          <Image src="/logo.jpg" alt="LinknRide Logo" width={40} height={40} className="rounded-full" />
          <h1 className="text-2xl font-bold text-blue-700">LINKNRIDE</h1>
        </div>

        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="font-medium text-gray-700">Hi, Customer</span>
            <Image
              src="/profile-icon.png"
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-gray-300"
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border w-48 py-2 z-20">
              <button
                onClick={() => router.push("/customer/customer-profile")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
              >
                👤 My Profile
              </button>
              <button
                onClick={() => alert("Logout functionality coming soon!")}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex justify-center gap-8 border-t border-gray-200 py-3 bg-white/60">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => router.push(link.path)}
            className={`font-medium ${
              router.pathname === link.path
                ? "text-blue-700 border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-700"
            }`}
          >
            {link.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
