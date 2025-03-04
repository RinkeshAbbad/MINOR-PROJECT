"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaYoutube, FaTwitter, FaBook } from "react-icons/fa";
import LogoutButton from "../components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "YouTube Analyzer",
      href: "/dashboard/youtube",
      icon: FaYoutube,
      current: pathname === "/dashboard/youtube",
    },
    {
      name: "Research Assistant",
      href: "/dashboard/research",
      icon: FaBook,
      current: pathname === "/dashboard/research",
    },
    {
      name: "Tweet Generator",
      href: "/dashboard/twitter",
      icon: FaTwitter,
      current: pathname === "/dashboard/twitter",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  href="/dashboard"
                  className="text-xl font-bold text-gray-800"
                >
                  AI Hub
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      item.current
                        ? "border-b-2 border-blue-500 text-gray-900"
                        : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 