import React from 'react';

import InView from './InView';
import RouteLoader from './RouteLoader';

type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail' | 'waitlist' | 'analytics';

interface HomePageProps {
  setCurrentView: (view: ViewType) => void; // eslint-disable-line no-unused-vars
  onProjectSelect?: (project: any) => void; // eslint-disable-line no-unused-vars
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentView, onProjectSelect }) => {
  return (
    <>
      {/* Hero Section */}
      <RouteLoader 
        route="hero" 
        props={{ setCurrentView }} 
      />
      
      {/* Problem Solution Section */}
      <InView>
        <RouteLoader 
          route="problem-solution" 
          props={{ setCurrentView }} 
        />
      </InView>
      
      {/* How It Works Section */}
      <InView>
        <RouteLoader 
          route="how-it-works" 
          props={{ setCurrentView }} 
        />
      </InView>
      
      {/* Rewards Section */}
      <InView>
        <RouteLoader route="rewards" />
      </InView>
      
      {/* Live Projects Section */}
      <InView>
        <RouteLoader 
          route="live-projects" 
          props={{ 
            onViewAll: () => setCurrentView('projects'), 
            onProjectSelect 
          }} 
        />
      </InView>
      
      {/* Why This Matters Section */}
      <InView>
        <RouteLoader 
          route="why-this-matters" 
          props={{ onJoin: () => setCurrentView('waitlist') }} 
        />
      </InView>
      
      {/* Tech Trust Section */}
      <InView>
        <RouteLoader route="tech-trust" />
      </InView>
      
      {/* Testimonials Section */}
      <InView>
        <RouteLoader route="testimonials" />
      </InView>
      
      {/* About Us Section */}
      <InView>
        <RouteLoader route="about-us" />
      </InView>
      
      {/* FAQ Section */}
      <InView>
        <RouteLoader route="faq" />
      </InView>
      
      {/* Call to Action Section */}
      <InView>
        <RouteLoader 
          route="call-to-action" 
          props={{ setCurrentView }} 
        />
      </InView>
    </>
  );
};

export default HomePage;
