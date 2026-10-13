import React from 'react';
import { SkillGroup } from '../../types';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  if (!skillGroups || skillGroups.length === 0) return null;

  return (
    <section id="konikmalar" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
            02 / ko'nikmalar
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
            Texnologiyalar
          </h2>
        </div>

        {/* 2x2 Grid on desktop, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {skillGroups.map((group) => (
            <div key={group.id} className="card-base p-6">
              <h3 className="font-heading font-semibold text-lg sm:text-xl text-text-main mb-4">
                {group.name}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {group.skills?.map((skill) => (
                  <span key={skill.id} className="chip">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
