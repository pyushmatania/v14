import React, { Suspense, lazy } from 'react';

import { SkeletonHero } from './Skeletons';

// 🚀 Route-based lazy loading for complete code splitting
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

// 🚀 Navigation routes
const Dashboard = lazy(() => import('./Dashboard'));
const Community = lazy(() => import('./Community'));
const Merchandise = lazy(() => import('./Merchandise'));
const ProfilePage = lazy(() => import('./profile/ProfilePage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const PortfolioAnalytics = lazy(() => import('./PortfolioAnalytics'));
const ProjectComparison = lazy(() => import('./ProjectComparison'));
const ProjectDetailPage = lazy(() => import('./ProjectDetailPage'));
const NewsAndUpdates = lazy(() => import('./NewsAndUpdates'));
const NotificationCenter = lazy(() => import('./NotificationCenter'));
const EnhancedSearch = lazy(() => import('./EnhancedSearch'));
const ProjectCatalog = lazy(() => import('./ProjectCatalog'));

// 🚀 Waitlist routes
const WaitlistHero = lazy(() => import('./waitlist/WaitlistHero'));
const BenefitsGrid = lazy(() => import('./waitlist/BenefitsGrid'));
const AnalyticsDashboard = lazy(() => import('./waitlist/AnalyticsDashboard'));

interface RouteLoaderProps {
  route: string;
  props?: Record<string, any>;
}

const RouteLoader: React.FC<RouteLoaderProps> = ({ route, props = {} }) => {
  const renderRoute = () => {
    switch (route) {
      // 🏠 Home page routes
      case 'hero':
        return <Hero {...props} />;
      case 'problem-solution':
        return <ProblemSolution {...props} />;
      case 'how-it-works':
        return <HowItWorks {...props} />;
      case 'live-projects':
        return <LiveProjects {...props} />;
      case 'why-this-matters':
        return <WhyThisMatters {...props} />;
      case 'tech-trust':
        return <TechTrust {...props} />;
      case 'rewards':
        return <Rewards {...props} />;
      case 'testimonials':
        return <Testimonials {...props} />;
      case 'about-us':
        return <AboutUs {...props} />;
      case 'faq':
        return <FAQ {...props} />;
      case 'call-to-action':
        return <CallToAction {...props} />;

      // 🧭 Navigation routes
      case 'dashboard':
        return <Dashboard {...props} />;
      case 'community':
        return <Community {...props} />;
      case 'merchandise':
        return <Merchandise {...props} />;
      case 'profile':
        return <ProfilePage {...props} />;
      case 'admin':
        return <AdminDashboard {...props} />;
      case 'portfolio-analytics':
        return <PortfolioAnalytics {...props} />;
      case 'project-comparison':
        return <ProjectComparison {...props} />;
      case 'project-detail':
        return <ProjectDetailPage project={props['project'] || {} as any} onClose={() => {}} />;
      case 'news-updates':
        return <NewsAndUpdates {...props} />;
      case 'notification-center':
        return <NotificationCenter {...props} />;
      case 'enhanced-search':
        return <EnhancedSearch {...props} />;
      case 'project-catalog':
        return <ProjectCatalog {...props} />;

      // 🚀 Waitlist routes
      case 'waitlist-hero':
        return <WaitlistHero {...props} />;
      case 'benefits-grid':
        return <BenefitsGrid {...props} />;
      case 'analytics-dashboard':
        return <AnalyticsDashboard {...props} />;

      default:
        return <div>Route not found: {route}</div>;
    }
  };

  return (
    <Suspense fallback={<SkeletonHero />}>
      {renderRoute()}
    </Suspense>
  );
};

export default RouteLoader;



