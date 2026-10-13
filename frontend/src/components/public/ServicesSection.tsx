import React from 'react';
import { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
            03 / xizmatlar
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
            Nima qila olaman
          </h2>
        </div>

        {/* 3 cards in 1 row on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => (
            <div key={service.id} className="card-base p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-semibold text-lg sm:text-xl text-text-main mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
