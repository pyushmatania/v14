import React, { Suspense, lazy } from 'react';

// Direct imports for critical sections to avoid RouteLoader overhead
const Hero = lazy(() => import('./Hero'));
const ProblemSolution = lazy(() => import('./ProblemSolution'));
const HowItWorks = lazy(() => import('./HowItWorks'));
const LiveProjects = lazy(() => import('./LiveProjects'));
const WhyThisMatters = lazy(() => import('./WhyThisMatters'));
const TechTrust = lazy(() => import('./TechTrust'));
const Rewards = lazy(() => import('./Rewards'));
const Testimonials = lazy(() => import('./Testimonials'));
const AboutUs = lazy(() => import('./AboutUs'));
const FAQ = lazy(() => import('./FAQ'));
const CallToAction = lazy(() => import('./CallToAction'));

import { FastSkeletonHero } from './FastSkeletons';
import { Project } from '../types';
import { ViewType } from '../types/viewTypes';

interface HomePageProps {
  setCurrentView: (_view: ViewType) => void;
  onProjectSelect?: (_project: Project, _tab?: 'overview' | 'invest') => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentView, onProjectSelect }) => {
  return (
    <>
      {/* Hero Section - Load immediately */}
      <Suspense fallback={<FastSkeletonHero />}>
        <Hero setCurrentView={setCurrentView} />
      </Suspense>
      
      {/* Problem Solution Section */}
      <Suspense fallback={<div className="h-32" />}>
        <ProblemSolution setCurrentView={setCurrentView} />
      </Suspense>
      
      {/* How It Works Section */}
      <Suspense fallback={<div className="h-32" />}>
        <HowItWorks setCurrentView={setCurrentView} />
      </Suspense>
      
      {/* Rewards Section */}
      <Suspense fallback={<div className="h-32" />}>
        <Rewards />
      </Suspense>
      
      {/* Live Projects Section */}
      <Suspense fallback={<div className="h-32" />}>
        <LiveProjects 
          onViewAll={() => setCurrentView('projects')} 
          {...(onProjectSelect && { onProjectSelect })} 
        />
      </Suspense>
      
      {/* Why This Matters Section */}
      <Suspense fallback={<div className="h-32" />}>
        <WhyThisMatters onJoin={() => setCurrentView('waitlist')} />
      </Suspense>
      
      {/* Tech Trust Section */}
      <Suspense fallback={<div className="h-32" />}>
        <TechTrust />
      </Suspense>
      
      {/* Testimonials Section */}
      <Suspense fallback={<div className="h-32" />}>
        <Testimonials />
      </Suspense>
      
      {/* About Us Section */}
      <Suspense fallback={<div className="h-32" />}>
        <AboutUs />
      </Suspense>
      
      {/* FAQ Section */}
      <Suspense fallback={<div className="h-32" />}>
        <FAQ />
      </Suspense>
      
      {/* Call to Action Section */}
      <Suspense fallback={<div className="h-32" />}>
        <CallToAction setCurrentView={setCurrentView} />
      </Suspense>
    </>
  );
};

export default HomePage;
