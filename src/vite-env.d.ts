/// <reference types="vite/client" />

// Global React declaration for libraries that need it
declare global {
  interface Window {
    React: typeof import('react');
  }
}

export {};
