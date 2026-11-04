import React from 'react';
import { SkillGroup } from '../../types';

import { ScrollReveal } from '../common/ScrollReveal';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  if (!skillGroups || skillGroups.length === 0) return null;

  return (
    <section id="konikmalar" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="mb-8 sm:mb-12">
            <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
              02 / ko'nikmalar
            </span>
            <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
              Texnologiyalar
            </h2>
          </div>
        </ScrollReveal>

        {/* 2x2 Grid on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {skillGroups.map((group, index) => (
            <ScrollReveal key={group.id} delayMs={index * 100}>
              <div className="card-base p-6 group cursor-default">
                <h3 className="font-heading font-semibold text-lg sm:text-xl text-text-main mb-4 transition-colors duration-300 group-hover:text-accent flex items-center justify-between">
                  <span>{group.name}</span>
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {group.skills?.map((skill) => (
                    <span key={skill.id} className="chip">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
