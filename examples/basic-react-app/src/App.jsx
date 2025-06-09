import React from 'react'
import { 
  Button, Card, ThemeToggle,
  Switch, Checkbox, Spinner
} from '@saeedkolivand/react-ui-toolkit'
import { ContactForm } from './DemoComponents'

function App() {

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">React UI Toolkit Demo</h1>
          <ThemeToggle />
        </header>

        <div className="mb-8">
          <ContactForm />
        </div>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold">Component Showcase</h2>
            <p className="text-gray-500 dark:text-gray-400">Examples of available components</p>
          </Card.Header>

          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-lg font-medium mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="warning">Warning</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-3">Spinners</h3>
                <div className="flex items-center gap-4">
                  <Spinner size="sm" variant="primary" />
                  <Spinner size="md" variant="secondary" />
                  <Spinner size="lg" variant="success" />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-3">Switch Sizes</h3>
                <div className="space-y-2">
                  <Switch label="Small" size="sm" />
                  <Switch label="Medium" size="md" />
                  <Switch label="Large" size="lg" />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium mb-3">Checkbox States</h3>
                <div className="space-y-2">
                  <Checkbox label="Default" />
                  <Checkbox label="Checked" checked={true} />
                  <Checkbox label="Indeterminate" indeterminate={true} />
                  <Checkbox label="Disabled" disabled />
                </div>
              </section>
            </div>
          </Card.Body>
        </Card>

        <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} React UI Toolkit Example</p>
          <p className="mt-1">Built with React and React UI Toolkit</p>
        </footer>
      </div>
    </div>
  )
}

export default App
