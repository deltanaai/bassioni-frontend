"use client";

import { Bell, ChevronDown, MessageSquare, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Input } from "@/components/ui/input";
import { companyHeaderLinks } from "@/constants/companyNavigation";

import { HeaderNavLink } from "./HeaderNavLink";

export function CompanyHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Breadcrumbs and Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images.png"
              alt="Company Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-gray-300"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900">Company Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Search, Notifications, and Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pr-4 pl-10"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-md p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Messages */}
          <button className="relative rounded-md p-2 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
            <Image
              src="/images.png"
              alt="User"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200 px-6 py-3">
        <nav className="flex items-center gap-1 text-sm">
          {companyHeaderLinks.map((link) => (
            <HeaderNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-4 w-4" />}
            >
              {link.name}
            </HeaderNavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
