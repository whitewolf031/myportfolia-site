import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';
import { getMediaUrl } from '../../api/client';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="loyihalar" className="py-12 sm:py-20">
      <div className="max-w-container mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12">
          <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider block mb-2">
            04 / loyihalar
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-[40px] text-text-main leading-tight">
            Nima qurganman
          </h2>
        </div>

        {/* Projects Grid: 3 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {projects.map((project) => {
            const techs = project.technologies
              ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={project.id}
                className="card-base overflow-hidden flex flex-col justify-between group hover:border-accent/40 transition-all duration-300"
              >
                {/* Image / Image Placeholder */}
                <div className="w-full aspect-[16/10] bg-gradient-to-br from-[#1E3FA0]/40 to-[#12245A] border-b border-border-subtle/50 flex items-center justify-center overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={getMediaUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-mono text-xs text-accent/70 tracking-wide">
                      [ Loyiha rasmi ]
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-lg sm:text-xl text-text-main mb-2">
                      {project.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-text-subtitle line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {techs.map((tech, idx) => (
                        <span key={idx} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Batafsil Link */}
                  <div>
                    {project.link_url && project.link_url !== '[loyiha havolasi]' ? (
                      <a
                        href={project.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-secondary transition-colors"
                      >
                        <span>Batafsil</span>
                        <ArrowUpRight size={16} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent/80 cursor-default">
                        <span>Batafsil</span>
                        <ArrowUpRight size={16} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
