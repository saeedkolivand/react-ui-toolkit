import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  ThemeToggle,
  StylesProvider
} from '@saeedkolivand/react-ui-toolkit';
import '@saeedkolivand/react-ui-toolkit/dist/styles.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert(`Logged in with ${email}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <StylesProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col p-4">
        <header className="w-full max-w-4xl mx-auto flex justify-end mb-8">
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <Card.Header>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
              <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
            </Card.Header>

            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth 
                    loading={isLoading}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </Card.Body>

            <Card.Footer>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account? 
                <Button variant="ghost" size="sm">Create Account</Button>
              </div>
            </Card.Footer>
          </Card>
        </main>
      </div>
    </StylesProvider>
  );
}

export default App;
