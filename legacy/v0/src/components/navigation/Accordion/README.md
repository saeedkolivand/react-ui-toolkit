# Accordion Component

The Accordion component provides a way to show and hide sections of related content on a page. It helps organize content into collapsible items, making the interface cleaner and more manageable, especially when dealing with large amounts of information.

## Features

- Collapsible content sections
- Support for single or multiple open panels
- Animated transitions
- Customizable styling
- Support for disabled items
- Fully accessible with proper ARIA attributes

## Basic Usage

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const accordionItems = [
    {
      title: 'Section 1',
      content: <p>Content for section 1. This can include any React elements.</p>
    },
    {
      title: 'Section 2',
      content: <p>Content for section 2. This can include any React elements.</p>
    },
    {
      title: 'Disabled Section',
      content: <p>This section is disabled and cannot be expanded.</p>,
      disabled: true
    }
  ];

  return <Accordion items={accordionItems} />;
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | `AccordionItem[]` | - | Array of accordion items to display |
| allowMultiple | `boolean` | `false` | Whether multiple panels can be expanded at once |
| defaultExpanded | `number \| number[]` | - | Index or indices of initially expanded panel(s) |
| className | `string` | - | Additional CSS class for custom styling |

### AccordionItem Interface

```typescript
interface AccordionItem {
  title: React.ReactNode;    // The title of the accordion item
  content: React.ReactNode;  // The content of the accordion item
  disabled?: boolean;        // Whether the accordion item is disabled
}
```

## Examples

### Single Expanded Panel

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

function SingleExpandAccordion() {
  const accordionItems = [
    {
      title: 'What is React?',
      content: (
        <div className="py-2">
          <p>React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.</p>
        </div>
      )
    },
    {
      title: 'What are React components?',
      content: (
        <div className="py-2">
          <p>Components are the building blocks of any React application. A component is a self-contained module that renders some output.</p>
        </div>
      )
    },
    {
      title: 'What is JSX?',
      content: (
        <div className="py-2">
          <p>JSX is a syntax extension to JavaScript. It is similar to a template language, but it has full power of JavaScript.</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">React FAQ</h2>
      <Accordion items={accordionItems} defaultExpanded={0} />
    </div>
  );
}
```

### Multiple Expanded Panels

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

function MultiExpandAccordion() {
  const accordionItems = [
    {
      title: 'Getting Started',
      content: (
        <div className="py-2">
          <p>To get started, install the package via npm:</p>
          <pre className="bg-gray-100 p-2 mt-2 rounded dark:bg-gray-800">
            npm install @saeedkolivand/react-ui-toolkit
          </pre>
        </div>
      )
    },
    {
      title: 'Configuration',
      content: (
        <div className="py-2">
          <p>Configure the library in your project:</p>
          <pre className="bg-gray-100 p-2 mt-2 rounded dark:bg-gray-800">
            {`import { StylesProvider } from '@saeedkolivand/react-ui-toolkit';

export default function App({ Component, pageProps }) {
  return (
    <StylesProvider>
      <Component {...pageProps} />
    </StylesProvider>
  );
}`}
          </pre>
        </div>
      )
    },
    {
      title: 'Usage',
      content: (
        <div className="py-2">
          <p>Import and use components in your application:</p>
          <pre className="bg-gray-100 p-2 mt-2 rounded dark:bg-gray-800">
            {`import { Button } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  return <Button>Click Me</Button>;
}`}
          </pre>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Documentation</h2>
      <Accordion 
        items={accordionItems} 
        allowMultiple={true} 
        defaultExpanded={[0, 1]} 
      />
    </div>
  );
}
```

### With Nested Content

```jsx
import { Accordion, Button } from '@saeedkolivand/react-ui-toolkit';

function NestedContentAccordion() {
  const accordionItems = [
    {
      title: 'Product Information',
      content: (
        <div className="py-2 space-y-2">
          <h3 className="font-medium">Premium Widget Pro</h3>
          <p>The ultimate widget for all your needs. Features include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Advanced functionality</li>
            <li>Durable construction</li>
            <li>Sleek design</li>
            <li>2-year warranty</li>
          </ul>
          <div className="pt-2">
            <Button size="sm">View Details</Button>
          </div>
        </div>
      )
    },
    {
      title: 'Shipping Information',
      content: (
        <div className="py-2 space-y-2">
          <p>Shipping options:</p>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Method</th>
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Standard</td>
                <td className="py-2">3-5 days</td>
                <td className="py-2">$5.99</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Express</td>
                <td className="py-2">1-2 days</td>
                <td className="py-2">$12.99</td>
              </tr>
              <tr>
                <td className="py-2">Same Day</td>
                <td className="py-2">Today</td>
                <td className="py-2">$24.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },
    {
      title: 'Return Policy',
      content: (
        <div className="py-2">
          <p>We offer a 30-day return policy on all unused items in original packaging.</p>
          <p className="mt-2">Please contact customer service to initiate a return.</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Product Details</h2>
      <Accordion items={accordionItems} />
    </div>
  );
}
```

### Custom Styled Accordion

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledAccordion() {
  const accordionItems = [
    {
      title: (
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span>User Management</span>
        </div>
      ),
      content: (
        <div className="py-2">
          <p>Manage users, permissions, and roles.</p>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span>System Settings</span>
        </div>
      ),
      content: (
        <div className="py-2">
          <p>Configure system preferences and options.</p>
        </div>
      )
    },
    {
      title: (
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span>Notifications</span>
        </div>
      ),
      content: (
        <div className="py-2">
          <p>Manage system and user notifications.</p>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <Accordion 
        items={accordionItems} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-none" 
      />
    </div>
  );
}
```

### FAQ Accordion

```jsx
import { Accordion } from '@saeedkolivand/react-ui-toolkit';

function FAQAccordion() {
  const faqItems = [
    {
      title: 'How do I create an account?',
      content: (
        <div className="py-2">
          <p>To create an account, click on the "Sign Up" button in the top right corner of the homepage. Follow the instructions to complete your registration.</p>
        </div>
      )
    },
    {
      title: 'What payment methods do you accept?',
      content: (
        <div className="py-2">
          <p>We accept the following payment methods:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Credit/Debit Cards (Visa, Mastercard, Amex)</li>
            <li>PayPal</li>
            <li>Apple Pay</li>
            <li>Google Pay</li>
            <li>Bank Transfer</li>
          </ul>
        </div>
      )
    },
    {
      title: 'How can I track my order?',
      content: (
        <div className="py-2">
          <p>Once your order has been shipped, you will receive a tracking number via email. You can use this number to track your package on our website under "Order History" in your account dashboard.</p>
        </div>
      )
    },
    {
      title: 'What is your return policy?',
      content: (
        <div className="py-2">
          <p>We offer a 30-day return policy for most items. Products must be returned in their original condition and packaging. Some items, such as personalized products, cannot be returned unless they are defective.</p>
        </div>
      )
    },
    {
      title: 'How can I contact customer support?',
      content: (
        <div className="py-2">
          <p>You can reach our customer support team through:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Email: support@example.com</li>
            <li>Phone: (123) 456-7890</li>
            <li>Live Chat: Available on our website from 9am-5pm EST</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
      <Accordion 
        items={faqItems} 
        className="divide-gray-200 dark:divide-gray-700" 
      />
    </div>
  );
}
```
