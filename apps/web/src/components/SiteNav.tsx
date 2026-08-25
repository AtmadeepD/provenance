"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';

const LINKS = [
  { label: 'airlines', href: '/airlines', active: true },
  { label: 'aircraft', href: '/aircraft', active: false },
  { label: 'survivors', href: '/survivors', active: false },
  { label: 'obituaries', href: '/obituaries', active: false },
  { label: 'ghosts', href: '/ghosts', active: false },
];

export function SiteNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 8);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b border-rule ${
        isScrolled ? 'bg-paper/90 backdrop-blur-sm' : 'bg-paper'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display text-h3 text-ink hover:text-ink-2 transition-colors">
            PROVENANCE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {LINKS.map((link) => (
              <span key={link.label}>
                {link.active ? (
                  <Link
                    href={link.href}
                    className="text-body text-ink-2 hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    tabIndex={-1}
                    className="text-body text-ink-3 cursor-not-allowed"
                    aria-disabled="true"
                    onClick={e => e.preventDefault()}
                  >
                    {link.label}
                  </a>
                )}
              </span>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-body text-ink-2 hover:text-ink"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-paper border-t border-rule px-6 py-4 flex flex-col gap-4">
          {LINKS.map((link) => (
            <span key={link.label}>
              {link.active ? (
                <Link
                  href={link.href}
                  className="block text-body text-ink-2 hover:text-ink transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  tabIndex={-1}
                  className="block text-body text-ink-3 cursor-not-allowed"
                  aria-disabled="true"
                  onClick={e => e.preventDefault()}
                >
                  {link.label}
                </a>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
