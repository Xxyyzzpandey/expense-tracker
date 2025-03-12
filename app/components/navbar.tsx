"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600 dark:text-white">
            <Link href="/">Personal Finance Tracker</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/pages/budgetform">Budget</NavLink>
            <NavLink href="/pages/dashboard">Dashboard</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <span className="text-2xl">&times;</span> // Close Icon
            ) : (
              <span className="text-2xl">&#9776;</span> // Hamburger Icon
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-4 py-2 space-y-2">
          <NavLink href="/">Home</NavLink>
            <NavLink href="/pages/budgetform">Budget</NavLink>
            <NavLink href="/pages/dashboard">Dashboard</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable NavLink Component
function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
    >
      {children}
    </Link>
  );
}
