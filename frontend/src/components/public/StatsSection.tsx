import React from 'react';
import { Stat } from '../../types';

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 animate-fade-in-up [animation-delay:420ms]">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <div className="card-base p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center">
            {stats.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="w-full flex flex-col items-center justify-center text-center py-2 px-2"
              >
                <div className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] text-text-main tracking-tight leading-none mb-2 text-center select-none w-full">
                  {stat.value}
                </div>
                <div className="font-body text-xs sm:text-sm text-text-muted font-normal text-center leading-snug select-none w-full">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
