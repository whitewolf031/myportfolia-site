import React from 'react';
import { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const fullName = profile?.full_name || 'Sardorbek Ergashev';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || 'Sardorbek';
  const lastName = nameParts.slice(1).join(' ') || 'Ergashev';

  const headline = profile?.headline || 'Backend dasturchi. Python va Django bilan ishonchli tizimlar, Telegram botlar va admin panellar yarataman.';
  const bio = profile?.short_bio || '[Yashash joyi haqida 2-3 jumla]';

  return (
    <section id="haqimda" className="pt-10 pb-16 md:py-24">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Mobile Photo Frame (shown first on mobile, hidden on lg) */}
          <div className="block lg:hidden w-full max-w-[340px] mx-auto">
            <div className="photo-frame aspect-square w-full">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-[#162B63] to-[#0E1A3D] overflow-hidden flex items-center justify-center relative">
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-accent/60 font-mono text-sm tracking-wide">
                    [ Rasm yuklang ]
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left / Main Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Open to work badge */}
            {profile?.open_to_work && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-chip-bg border border-border-subtle mb-6 sm:mb-8">
                <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
                <span className="text-xs font-mono text-chip-text tracking-wide">
                  Yangi loyihalar uchun ochiqman
                </span>
              </div>
            )}

            {/* H1 Heading */}
            <h1 className="font-heading font-bold text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight mb-6">
              <span className="block text-gradient">{firstName}</span>
              <span className="block text-gradient">{lastName}</span>
            </h1>

            {/* Headline */}
            <p className="text-text-subtitle text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mb-4">
              {headline}
            </p>

            {/* Short Bio */}
            <p className="text-text-muted text-sm sm:text-base font-normal leading-relaxed max-w-xl mb-8">
              {bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#aloqa"
                className="btn-primary text-sm sm:text-base px-7 py-3 text-center w-full sm:w-auto font-semibold shadow-lg shadow-accent/20"
              >
                Bog'lanish
              </a>
              <a
                href="#loyihalar"
                className="btn-ghost text-sm sm:text-base px-6 py-3 text-center w-full sm:w-auto font-medium"
              >
                Loyihalar
              </a>
            </div>
          </div>

          {/* Desktop Photo Frame (lg:col-span-5) */}
          <div className="hidden lg:block lg:col-span-5 w-full max-w-[420px] ml-auto">
            <div className="photo-frame aspect-[4/5] w-full">
              <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-[#162B63] to-[#0E1A3D] overflow-hidden flex items-center justify-center relative">
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-accent/60 font-mono text-sm tracking-wide">
                    [ Rasm yuklang ]
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
