import React from 'react';
import { TimelineItem } from '../../types';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) return null;

  const experienceItems = timeline.filter((item) => item.kind === 'experience');
  const educationItems = timeline.filter((item) => item.kind === 'education');

  const renderItem = (item: TimelineItem) => {
    const period = item.end ? `${item.start} — ${item.end}` : item.start;
    const titleLine = item.organization
      ? `${item.title}, ${item.organization}`
      : item.title;

    return (
      <div key={item.id} className="relative pl-6 pb-8 border-l border-border-subtle last:border-l-0 last:pb-0">
        {/* Bullet Dot */}
        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-page" />
        
        {/* Period */}
        <span className="font-mono text-xs text-accent block mb-1">
          {period}
        </span>

        {/* Title */}
        <h4 className="font-heading font-semibold text-base sm:text-lg text-text-main mb-1">
          {titleLine}
        </h4>

        {/* Description */}
        {item.description && (
          <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="tajriba" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
            05 / tajriba va ta'lim
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
            Yo'lim
          </h2>
        </div>

        {/* Two columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Tajriba column */}
          {experienceItems.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-xl text-accent mb-6 flex items-center gap-2">
                <span>Tajriba</span>
              </h3>
              <div className="flex flex-col">
                {experienceItems.map(renderItem)}
              </div>
            </div>
          )}

          {/* Ta'lim column */}
          {educationItems.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-xl text-accent mb-6 flex items-center gap-2">
                <span>Ta'lim</span>
              </h3>
              <div className="flex flex-col">
                {educationItems.map(renderItem)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
