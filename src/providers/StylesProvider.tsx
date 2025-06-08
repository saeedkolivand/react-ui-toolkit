import React, { useEffect, ReactNode } from 'react';

interface StylesProviderProps {
  children: ReactNode;
}

/**
 * StylesProvider automatically injects the necessary CSS styles for the component library
 * Wrap your application with this provider to avoid manually importing CSS files
 *
 * @example
 * ```jsx
 * import { StylesProvider } from '@saeedkolivand/react-ui-toolkit';
 *
 * function App() {
 *   return (
 *     <StylesProvider>
 *       <YourApplication />
 *     </StylesProvider>
 *   );
 * }
 * ```
 */
export const StylesProvider: React.FC<StylesProviderProps> = ({ children }) => {
  useEffect(() => {
    const styleId = 'react-ui-toolkit-styles';

    if (!document.getElementById(styleId)) {
      try {
        // Create a style tag and inject the CSS content
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = '@saeedkolivand/react-ui-toolkit/dist/styles.css';
        document.head.appendChild(link);
      } catch (error) {
        console.warn('Failed to load React UI Toolkit styles:', error);
      }
    }
  }, []);

  return <>{children}</>;
};
