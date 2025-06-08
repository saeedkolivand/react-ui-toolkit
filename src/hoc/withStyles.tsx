import React, { useEffect } from 'react';

/**
 * Injects the component library styles automatically
 * Wrapping your application with this HOC eliminates the need for
 * manually importing the CSS file
 */
export const withStyles = <P extends object>(Component: React.ComponentType<P>): React.FC<P> => {
  const WithStyles: React.FC<P> = props => {
    useEffect(() => {
      // We only need to load the styles once, and this ensures they're loaded
      // when the component mounts
      const styleId = 'react-ui-toolkit-styles';

      if (!document.getElementById(styleId)) {
        try {
          // Dynamically import the CSS
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

    return <Component {...props} />;
  };

  WithStyles.displayName = `withStyles(${Component.displayName || Component.name || 'Component'})`;

  return WithStyles;
};
