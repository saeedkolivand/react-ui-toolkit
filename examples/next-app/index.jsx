import React from "react";
import Head from "next/head";
import { Button, Card, ThemeToggle } from "@saeedkolivand/react-ui-toolkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col p-4">
      <Head>
        <title>React UI Toolkit - Next.js Example</title>
        <meta name="description" content="Next.js example using React UI Toolkit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="w-full max-w-4xl mx-auto flex justify-end mb-8">
        <ThemeToggle />
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
              application. The StylesProviderSSR component is used in _app.jsx for proper
              server-side rendering support.
            </p>

            <div className="space-y-2">
              <Button variant="primary" fullWidth>
                Primary Action
              </Button>
              <Button variant="outline" fullWidth>
                Secondary Action
              </Button>
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
