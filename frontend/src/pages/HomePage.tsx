import React, { useEffect, useState } from 'react';
import { getPortfolio } from '../api/client';
import { PortfolioData } from '../types';
import { Navbar } from '../components/public/Navbar';
import { HeroSection } from '../components/public/HeroSection';
import { StatsSection } from '../components/public/StatsSection';
import { SkillsSection } from '../components/public/SkillsSection';
import { ServicesSection } from '../components/public/ServicesSection';
import { ProjectsSection } from '../components/public/ProjectsSection';
import { TimelineSection } from '../components/public/TimelineSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { ContactSection } from '../components/public/ContactSection';
import { Footer } from '../components/public/Footer';
import { Loader2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPortfolio()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Ma'lumotlarni yuklashda xatolik yuz berdi.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-accent animate-spin" />
          <span className="font-mono text-xs text-text-muted">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  const profile = data?.profile || null;
  const stats = data?.stats || [];
  const skillGroups = data?.skill_groups || [];
  const services = data?.services || [];
  const projects = data?.projects || [];
  const timeline = data?.timeline || [];
  const testimonials = data?.testimonials || [];

  return (
    <div className="min-h-screen flex flex-col bg-page text-text-main selection:bg-accent selection:text-page">
      <Navbar profile={profile} />

      <main className="flex-grow">
        <HeroSection profile={profile} />
        <StatsSection stats={stats} />
        <SkillsSection skillGroups={skillGroups} />
        <ServicesSection services={services} />
        <ProjectsSection projects={projects} />
        <TimelineSection timeline={timeline} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
};
