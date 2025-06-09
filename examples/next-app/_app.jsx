import React from 'react';
import { StylesProviderSSR } from '@saeedkolivand/react-ui-toolkit';
import '@saeedkolivand/react-ui-toolkit/dist/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <StylesProviderSSR>
      <Component {...pageProps} />
    </StylesProviderSSR>
  );
}

export default MyApp;
