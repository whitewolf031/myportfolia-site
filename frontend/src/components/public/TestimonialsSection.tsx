import React from 'react';
import { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="fikrlar" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
            06 / fikrlar
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
            Mijozlar nima deydi
          </h2>
        </div>

        {/* 2 cards in a row on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {testimonials.map((t) => (
            <div key={t.id} className="card-base p-6 sm:p-7 flex flex-col justify-between">
              <p className="font-body text-sm sm:text-base text-text-subtitle leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
              <div>
                <h4 className="font-heading font-semibold text-base text-text-main">
                  {t.author}
                </h4>
                <p className="font-body text-xs text-text-muted mt-0.5">
                  {t.role_company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
