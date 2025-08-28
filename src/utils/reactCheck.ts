import React from 'react';

/**
 * React Availability Check Utility
 * Simple check to ensure React is available
 */

export const checkReactAvailability = (): boolean => {
  try {
    return typeof React !== 'undefined' && React !== null;
  } catch (error) {
    console.error('❌ Error checking React availability:', error);
    return false;
  }
};

export const withReactCheck = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  return (props: P) => {
    if (!checkReactAvailability()) {
      return React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }
      }, 'Loading React...');
    }
    return React.createElement(Component, props);
  };
}; 