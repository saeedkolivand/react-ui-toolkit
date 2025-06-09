import React from 'react';

// Import the CSS directly, which works with bundlers like webpack
// This approach is more SSR-friendly
import '../styles/index.css';

/**
 * A version of the styles HOC that's compatible with SSR frameworks like Next.js
 * This HOC statically imports the CSS rather than trying to load it dynamically
 */
export const withStylesSSR = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithStylesSSR: React.FC<P> = props => {
    return <Component {...props} />;
  };

  WithStylesSSR.displayName = `withStylesSSR(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithStylesSSR;
};
