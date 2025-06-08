import React, { ReactNode } from 'react';

// Import the CSS directly for SSR compatibility
import '../styles/direct-import.css';

interface StylesProviderSSRProps {
  children: ReactNode;
}

/**
 * SSR-compatible StylesProvider that works with Next.js and other SSR frameworks
 *
 * @example
 * ```jsx
 * import { StylesProviderSSR } from '@saeedkolivand/react-ui-toolkit';
 *
 * function App() {
 *   return (
 *     <StylesProviderSSR>
 *       <YourApplication />
 *     </StylesProviderSSR>
 *   );
 * }
 * ```
 */
export const StylesProviderSSR: React.FC<StylesProviderSSRProps> = ({ children }) => {
  return <>{children}</>;
};
