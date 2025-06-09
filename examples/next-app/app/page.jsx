import { Card } from "@saeedkolivand/react-ui-toolkit";
import ThemeProvider from "./ThemeProvider";
import ButtonsSection from "../components/ButtonsSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col p-4">
      <header className="w-full max-w-4xl mx-auto flex justify-end mb-8">
        <ThemeProvider />
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Next.js Example</h1>
            <p className="text-gray-500 dark:text-gray-400">Using React UI Toolkit with Next.js</p>
          </Card.Header>

          <Card.Body>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This example demonstrates how to use React UI Toolkit components in a Next.js
              application with the App Router. The StylesProviderSSR component is used in the root
              layout for proper server-side rendering support.
            </p>

            <ButtonsSection />
          </Card.Body>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
