import { StylesProviderSSR } from "@saeedkolivand/react-ui-toolkit";
import "@saeedkolivand/react-ui-toolkit/dist/styles.css";
import "../styles/globals.css";

export const metadata = {
  title: "React UI Toolkit - Next.js Example",
  description: "Next.js example using React UI Toolkit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StylesProviderSSR>{children}</StylesProviderSSR>
      </body>
    </html>
  );
}
