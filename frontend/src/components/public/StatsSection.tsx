import React from 'react';
import { Stat } from '../../types';

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <div className="card-base p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y-0 md:divide-x divide-border-subtle/60">
            {stats.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className={`flex flex-col items-center justify-center text-center ${
                  idx > 0 ? 'md:pl-6' : ''
                }`}
              >
                <span className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] text-text-main tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="font-body text-xs sm:text-sm text-text-muted font-normal">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
