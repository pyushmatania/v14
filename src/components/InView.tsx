import * as React from 'react';

interface InViewProps {
  rootMargin?: string;
  threshold?: number | number[];
  children: React.ReactNode;
}

export default function InView({ rootMargin = '200px', threshold = 0, children }: InViewProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref.current || isVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin, threshold]);

  return <div ref={ref}>{isVisible ? children : null}</div>;
}


