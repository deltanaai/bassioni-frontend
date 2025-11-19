"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Input } from "@/components/ui/input";
import { pharmaHeaderLinks } from "@/constants/pharmaNavigation";

import { PharmaHeaderNavLink } from "./PharmaHeaderNavLink";

export function PharmaHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-700/50 bg-gray-900 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo and Company Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images.png"
              alt="Company Logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 border-emerald-500/30 shadow-md"
            />
            <div className="hidden md:block">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-lg font-semibold text-transparent">
                بسيوني
              </span>
              <div className="text-xs text-gray-400">Pharma Dashboard</div>
            </div>
          </div>
        </div>

        {/* Right: Search and Notifications */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="البحث..."
              className="w-64 border-gray-700 bg-gray-800 pr-4 pl-10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-gray-900"></span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-800">
            <Image
              src="/images.png"
              alt="User"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-emerald-500/30"
            />
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-700/50 bg-gray-800/50 px-6 py-3">
        <nav className="flex items-center gap-2 text-sm">
          {pharmaHeaderLinks.map((link) => (
            <PharmaHeaderNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-4 w-4" />}
            >
              {link.name}
            </PharmaHeaderNavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
