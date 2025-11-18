"use client";

import { ChevronDown, ChevronUp, LogOut, Star } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  companyFavoriteLinks,
  companyMainLinks,
  companySettingsLinks,
} from "@/constants/companyNavigation";

import { SidebarNavLink } from "./SidebarNavLink";
import { SidebarSection } from "./SidebarSection";

interface CompanySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}

export function CompanySidebar({
  isCollapsed,
  onToggle,
  onSignOut,
}: CompanySidebarProps) {
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } sticky top-0 flex h-screen flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        {isCollapsed ? (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
            <span className="text-sm font-bold">A</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800">Company</span>
              <span className="text-xs text-gray-500">شركة بسيوني</span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-md p-1 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronUp className="h-5 w-5 rotate-90 transform text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 rotate-90 transform text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4 text-sm">
        {/* Main Links */}
        <div className="space-y-1">
          {companyMainLinks.map((link) => (
            <SidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </SidebarNavLink>
          ))}
        </div>

        {/* Favorites Section */}
        <SidebarSection
          title="المفضلة"
          isCollapsed={isCollapsed}
          defaultExpanded={true}
          showAddButton={true}
        >
          {companyFavoriteLinks.map((link) => (
            <SidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              <div className="flex flex-1 items-center justify-between">
                <span>{link.name}</span>
                {!isCollapsed && (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </SidebarNavLink>
          ))}
        </SidebarSection>

        {/* Settings Section */}
        <SidebarSection
          title="الإعدادات"
          isCollapsed={isCollapsed}
          defaultExpanded={false}
          showAddButton={false}
        >
          {companySettingsLinks.map((link) => (
            <SidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </SidebarNavLink>
          ))}
        </SidebarSection>
      </nav>

      {/* Sign Out Button */}
      <div className="border-t border-gray-200 p-4">
        {isCollapsed ? (
          <button
            onClick={onSignOut}
            className="flex w-full items-center justify-center rounded-md p-2 text-red-600 transition hover:bg-red-50"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : (
          <Button
            onClick={onSignOut}
            variant="ghost"
            className="flex w-full items-center justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-400">
          © 2026 PharmaCare
        </div>
      )}
    </aside>
  );
}
