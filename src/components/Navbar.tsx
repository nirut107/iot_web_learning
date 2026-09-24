'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  BookOpen,
  CheckSquare,
  Wrench,
  ShieldAlert,
  BookA,
  FileText,
  Settings,
  Search,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useTheme } from '@/context/ThemeContext';
import { SearchModal } from './SearchModal';

export function Navbar() {
  const pathname = usePathname();
  const { learningProgressPercent, mandatoryProgressPercent } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'ภาพรวม', icon: Layers },
    { href: '/modules', label: 'บทเรียน', icon: BookOpen },
    { href: '/checklist', label: 'Checklist', icon: CheckSquare },
    { href: '/troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { href: '/defense', label: 'ซ้อม Defense', icon: ShieldAlert },
    { href: '/glossary', label: 'Glossary', icon: BookA },
    { href: '/references', label: 'เอกสารอ้างอิง', icon: FileText },
    { href: '/settings', label: 'ตั้งค่า', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1700px] w-full items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-sky-500 text-white shadow-md shadow-emerald-500/20">
                <Layers className="h-5 w-5 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                    Inception-of-Things
                  </span>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    v4.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden 2xl:block whitespace-nowrap">
                  คู่มือเรียน & ซ้อมตรวจ 42 IoT
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 px-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Progress Pills, Search, Theme Toggle, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Progress Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <Link
                href="/modules"
                className="flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors whitespace-nowrap"
                title="ความคืบหน้าการเรียน"
              >
                <span className="text-[10px] uppercase font-bold hidden xl:inline">เรียน</span>
                <span className="font-bold">{learningProgressPercent}%</span>
              </Link>
              <Link
                href="/checklist"
                className="flex items-center gap-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 px-2.5 py-1 text-sky-700 dark:text-sky-400 hover:bg-sky-100 transition-colors whitespace-nowrap"
                title="ความพร้อมตรวจ Mandatory Checklist"
              >
                <span className="text-[10px] uppercase font-bold hidden xl:inline">ตรวจ</span>
                <span className="font-bold">{mandatoryProgressPercent}%</span>
              </Link>
            </div>

            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap"
              title="ค้นหา (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">ค้นหา</span>
              <kbd className="hidden sm:inline rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-[10px] text-slate-500 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="เปลี่ยนธีม มืด/สว่าง"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="เปิดเมนู"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
