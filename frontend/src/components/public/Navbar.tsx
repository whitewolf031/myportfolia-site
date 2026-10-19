import React, { useState } from 'react';
import { Menu, X, FileDown } from 'lucide-react';
import { Profile } from '../../types';
import { getMediaUrl } from '../../api/client';

interface NavbarProps {
  profile: Profile | null;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Men haqimda', href: '#haqimda' },
    { label: "Ko'nikmalar", href: '#konikmalar' },
    { label: 'Loyihalar', href: '#loyihalar' },
    { label: 'Tajriba', href: '#tajriba' },
    { label: 'Fikrlar', href: '#fikrlar' },
    { label: 'Aloqa', href: '#aloqa' },
  ];

  const displayName = profile?.full_name ? `${profile.full_name.charAt(0)}. ${profile.full_name.split(' ')[1] || ''}_` : 'S. Ergashev_';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-page/80 border-b border-border-subtle/50 transition-all">
      <div className="max-w-container mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#haqimda" className="font-mono text-lg font-semibold text-text-main tracking-tight hover:text-accent transition-colors">
          {displayName}
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-subtitle">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-text-main transition-colors focus-visible:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action / Resume */}
        <div className="hidden md:flex items-center">
          {profile?.resume ? (
            <a
              href={getMediaUrl(profile.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs px-4 py-2 flex items-center gap-2 hover:border-accent"
            >
              <FileDown size={14} className="text-accent" />
              <span>Rezyume yuklab olish</span>
            </a>
          ) : (
            <a
              href="#aloqa"
              className="btn-ghost text-xs px-4 py-2 flex items-center gap-2 hover:border-accent"
            >
              <span>Bog'lanish</span>
            </a>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5 focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>Menyu</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-page/95 backdrop-blur-lg border-b border-border-subtle px-6 py-6 animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-subtitle hover:text-text-main py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            {profile?.resume && (
              <a
                href={getMediaUrl(profile.resume)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-ghost text-center py-2.5 mt-2 flex items-center justify-center gap-2 text-sm"
              >
                <FileDown size={16} className="text-accent" />
                <span>Rezyume yuklab olish</span>
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
