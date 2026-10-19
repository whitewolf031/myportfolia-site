import React from 'react';
import { Profile } from '../../types';

interface FooterProps {
  profile: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();
  const name = profile?.full_name || 'Sardorbek Ergashev';
  const telegram = profile?.telegram_username || '@Sardorbek_Ergashev';
  const github = profile?.github_url || '[Havola]';
  const linkedin = profile?.linkedin_url || '[Havola]';
  const instagram = profile?.instagram_url;

  return (
    <footer className="w-full border-t border-border-subtle/40 py-10 mt-12 bg-page/90">
      <div className="max-w-container mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-text-muted">
        <div>
          <span>{currentYear} © [{name}]</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={telegram.startsWith('@') ? `https://t.me/${telegram.replace('@', '')}` : telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            Telegram
          </a>
          {instagram && instagram !== '[Havola]' && (
            <>
              <span className="text-border-subtle">|</span>
              <a
                href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                Instagram
              </a>
            </>
          )}
          <span className="text-border-subtle">|</span>
          <a
            href={github.startsWith('http') ? github : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <span className="text-border-subtle">|</span>
          <a
            href={linkedin.startsWith('http') ? linkedin : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
