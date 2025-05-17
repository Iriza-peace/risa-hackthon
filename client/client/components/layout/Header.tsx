"use client";

import Link from "next/link";
import { Search, Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-700">CitizenVoice</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-orange-700 font-medium">
            Home
          </Link>
          <Link href="/submit" className="text-gray-700 hover:text-orange-700 font-medium">
            Submit
          </Link>
          <Link href="/my-submissions" className="text-gray-700 hover:text-orange-700 font-medium">
            My Submissions
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button>
            <Bell className="h-5 w-5 mr-2" />
            <span>Notifications</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white pt-16 z-40 transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <Link 
            href="/" 
            className="text-xl py-2 border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          <Link 
            href="/submit" 
            className="text-xl py-2 border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Submit
          </Link>
          
          <Link 
            href="/my-submissions" 
            className="text-xl py-2 border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            My Submissions
          </Link>
          
          <Link 
            href="/notifications" 
            className="text-xl py-2 border-b border-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Notifications
          </Link>
        </div>
      </div>
    </header>
  );
}