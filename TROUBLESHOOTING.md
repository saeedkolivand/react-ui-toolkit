# Troubleshooting Guide

## CSS Files Not Loading

### Problem

After installing the package, you may find that styles are not being applied to the components.

### Solutions

1. **Direct CSS Import (Most Reliable)**

   Explicitly import the CSS file in your application entry point:

   ```javascript
   import "@saeedkolivand/react-ui-toolkit/dist/styles.css";
   ```

2. **Use the StylesProvider Component**

   Wrap your application with the StylesProvider:

   ```jsx
   import { StylesProvider } from "@saeedkolivand/react-ui-toolkit";

   function App() {
     return (
       <StylesProvider>
         <YourApplication />
       </StylesProvider>
     );
   }
   ```

3. **Use the withStyles HOC**

   ```jsx
   import { withStyles } from "@saeedkolivand/react-ui-toolkit";

   function App() {
     return <YourApplication />;
   }

   export default withStyles(App);
   ```

4. **Manual CSS Include**

   You can also manually include the CSS file in your HTML:

   ```html
   <link rel="stylesheet" href="node_modules/@saeedkolivand/react-ui-toolkit/dist/styles.css" />
   ```

   Or use a CDN:

   ```html
   <link
     rel="stylesheet"
     href="https://unpkg.com/@saeedkolivand/react-ui-toolkit@latest/dist/styles.css"
   />
   ```

## Troubleshooting CSS in Next.js

For Next.js projects, use the SSR-compatible provider:

```jsx
import { StylesProviderSSR } from "@saeedkolivand/react-ui-toolkit";

function MyApp({ Component, pageProps }) {
  return (
    <StylesProviderSSR>
      <Component {...pageProps} />
    </StylesProviderSSR>
  );
}

export default MyApp;
```

Alternatively, you can import the CSS file in your `_app.js` file:

```jsx
import "@saeedkolivand/react-ui-toolkit/dist/styles.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

## CSS Not Working in Production Builds

If you're experiencing issues with CSS in production builds, make sure your bundler is configured to handle CSS files properly. For most bundlers, you'll need to set up appropriate loaders or plugins for CSS processing.

### Webpack

Ensure you have the appropriate loaders configured:

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

### Vite

Vite handles CSS imports out of the box, but you may need to add specific configuration for CSS modules or preprocessors.
