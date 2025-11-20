"use client";

import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  pharmaDiscountLinks,
  pharmaMainLinks,
  pharmaOrderLinks,
  pharmaProductLinks,
  pharmaSettingsLinks,
} from "@/constants/pharmaNavigation";

import { PharmaSidebarNavLink } from "./PharmaSidebarNavLink";
import { PharmaSidebarSection } from "./PharmaSidebarSection";

interface PharmaSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
}

export function PharmaSidebar({
  isCollapsed,
  onToggle,
  onSignOut,
}: PharmaSidebarProps) {
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } sticky top-0 flex h-screen flex-col border-r border-gray-700/50 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl transition-all duration-300 ease-in-out`}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between border-b border-gray-700/50 p-4">
        {isCollapsed ? (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <span className="text-lg font-bold text-white">P</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="text-center text-xl font-bold tracking-wide">
              <span className="text-white">Pharma</span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                bassiony
              </span>
            </div>
            <span className="text-center text-xs text-gray-400">
              صيدلية بسيوني
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-700/50 hover:text-white"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronUp className="h-5 w-5 rotate-90 transform" />
          ) : (
            <ChevronDown className="h-5 w-5 rotate-90 transform" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4 text-sm">
        {/* Main Links */}
        <div className="space-y-1">
          {pharmaMainLinks.map((link) => (
            <PharmaSidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </PharmaSidebarNavLink>
          ))}
        </div>

        {/* Orders Section */}
        <PharmaSidebarSection
          title="الطلبات"
          isCollapsed={isCollapsed}
          defaultExpanded={true}
        >
          {pharmaOrderLinks.map((link) => (
            <PharmaSidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </PharmaSidebarNavLink>
          ))}
        </PharmaSidebarSection>

        {/* Products Section */}
        <PharmaSidebarSection
          title="المنتجات"
          isCollapsed={isCollapsed}
          defaultExpanded={true}
        >
          {pharmaProductLinks.map((link) => (
            <PharmaSidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </PharmaSidebarNavLink>
          ))}
        </PharmaSidebarSection>

        {/* Discounts Section */}
        <PharmaSidebarSection
          title="الخصومات"
          isCollapsed={isCollapsed}
          defaultExpanded={false}
        >
          {pharmaDiscountLinks.map((link) => (
            <PharmaSidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </PharmaSidebarNavLink>
          ))}
        </PharmaSidebarSection>

        {/* Settings Section */}
        <PharmaSidebarSection
          title="النظام"
          isCollapsed={isCollapsed}
          defaultExpanded={false}
        >
          {pharmaSettingsLinks.map((link) => (
            <PharmaSidebarNavLink
              key={link.href}
              href={link.href}
              icon={<link.Icon className="h-5 w-5" />}
              isCollapsed={isCollapsed}
            >
              {link.name}
            </PharmaSidebarNavLink>
          ))}
        </PharmaSidebarSection>
      </nav>

      {/* Sign Out Button */}
      <div className="border-t border-gray-700/50 p-4">
        {isCollapsed ? (
          <button
            onClick={onSignOut}
            className="flex w-full items-center justify-center rounded-lg p-2.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : (
          <Button
            onClick={onSignOut}
            variant="ghost"
            className="flex w-full items-center justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-gray-700/50 p-4 text-center text-xs text-gray-500">
          © 2026 PharmaCare
        </div>
      )}
    </aside>
  );
}
