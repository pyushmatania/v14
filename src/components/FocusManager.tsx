import React, { useEffect, useRef, useCallback, ReactNode } from 'react';

interface FocusManagerProps {
  children: ReactNode;
  trapFocus?: boolean;
  returnFocus?: boolean;
  onFocusChange?: (_focusedElement: HTMLElement | null) => void;
  initialFocus?: string;
  className?: string;
}

const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  trapFocus = false,
  returnFocus = true,
  onFocusChange,
  initialFocus,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElements = useRef<HTMLElement[]>([]);

  // 🚀 Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(containerRef.current.querySelectorAll(selector)) as HTMLElement[];
    
    // 🚀 Filter out hidden elements
    return elements.filter(element => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
  }, []);

  // 🚀 Focus the first focusable element
  const focusFirstElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  // 🚀 Focus the last focusable element
  const focusLastElement = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // 🚀 Focus the next element
  const focusNextElement = useCallback((currentElement: HTMLElement) => {
    const elements = getFocusableElements();
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex === -1 || currentIndex === elements.length - 1) {
      if (trapFocus) {
        elements[0]?.focus();
      }
    } else {
      elements[currentIndex + 1]?.focus();
    }
  }, [getFocusableElements, trapFocus]);

  // 🚀 Focus the previous element
  const focusPreviousElement = useCallback((currentElement: HTMLElement) => {
    const elements = getFocusableElements();
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex === -1 || currentIndex === 0) {
      if (trapFocus) {
        elements[elements.length - 1]?.focus();
      }
    } else {
      elements[currentIndex - 1]?.focus();
    }
  }, [getFocusableElements, trapFocus]);

  // 🚀 Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey, target } = event;
    const currentElement = target as HTMLElement;

    switch (key) {
      case 'Tab':
        if (trapFocus) {
          event.preventDefault();
          
          if (shiftKey) {
            focusPreviousElement(currentElement);
          } else {
            focusNextElement(currentElement);
          }
        }
        break;
        
      case 'Escape':
        if (returnFocus && previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
        break;
        
      case 'Home':
        if (trapFocus) {
          event.preventDefault();
          focusFirstElement();
        }
        break;
        
      case 'End':
        if (trapFocus) {
          event.preventDefault();
          focusLastElement();
        }
        break;
    }
  }, [trapFocus, returnFocus, focusFirstElement, focusLastElement, focusNextElement, focusPreviousElement]);

  // 🚀 Handle focus changes
  const handleFocusChange = useCallback((event: FocusEvent) => {
    const focusedElement = event.target as HTMLElement;
    
    // 🚀 Check if focus is within the container
    if (containerRef.current?.contains(focusedElement)) {
      onFocusChange?.(focusedElement);
    } else {
      onFocusChange?.(null);
    }
  }, [onFocusChange]);

  // 🚀 Initialize focus management
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 🚀 Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 🚀 Get focusable elements
    focusableElements.current = getFocusableElements();

    // 🚀 Set initial focus
    if (initialFocus) {
      const targetElement = container.querySelector(initialFocus) as HTMLElement;
      if (targetElement && targetElement.focus) {
        targetElement.focus();
      }
    } else if (focusableElements.current.length > 0) {
      focusFirstElement();
    }

    // 🚀 Add event listeners
    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusChange);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusChange);

      // 🚀 Return focus when unmounting
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [trapFocus, returnFocus, initialFocus, focusFirstElement, handleKeyDown, handleFocusChange]);

  // 🚀 Update focusable elements when children change
  useEffect(() => {
    const updateFocusableElements = () => {
      focusableElements.current = getFocusableElements();
    };

    // 🚀 Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'hidden', 'style', 'tabindex']
      });
    }

    return () => observer.disconnect();
  }, [getFocusableElements]);

  return (
    <div
      ref={containerRef}
      className={`focus-manager ${className}`}
      tabIndex={trapFocus ? -1 : undefined}
      role={trapFocus ? 'dialog' : undefined}
      aria-modal={trapFocus ? true : undefined}
    >
      {children}
    </div>
  );
};

// 🚀 Hook for managing focus programmatically
export const useFocusManagement = () => {
  const focusFirst = useCallback(() => {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const firstElement = document.querySelector(selector) as HTMLElement;
    firstElement?.focus();
  }, []);

  const focusLast = useCallback(() => {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, []);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    element?.focus();
  }, []);

  const focusNext = useCallback((currentElement: HTMLElement) => {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex !== -1 && currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus();
    }
  }, []);

  const focusPrevious = useCallback((currentElement: HTMLElement) => {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex > 0) {
      elements[currentIndex - 1].focus();
    }
  }, []);

  return {
    focusFirst,
    focusLast,
    focusElement,
    focusNext,
    focusPrevious
  };
};

export default FocusManager;


