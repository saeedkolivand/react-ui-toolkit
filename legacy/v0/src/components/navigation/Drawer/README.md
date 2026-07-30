# Drawer Component

The Drawer component provides a sliding panel that appears from the edge of the screen. It's perfect for navigation menus, filters, or any content that doesn't need to interrupt the user's main workflow. It can appear from any edge of the screen and offers smooth animations.

## Features

- Can appear from any edge (left, right, top, bottom)
- Multiple size options (sm, md, lg, xl, full)
- Smooth animations with Framer Motion
- Backdrop overlay with click-to-close option
- Keyboard navigation (ESC to close)
- Close button toggle
- Automatic body scroll locking when open

## Basic Usage

```jsx
import { useState } from 'react';
import { Drawer, Button } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Drawer Title</h2>
          <p className="mb-4">This is the drawer content.</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | `boolean` | - | Whether the drawer is open |
| onClose | `() => void` | - | Callback when the drawer should close |
| position | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | The position of the drawer |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | The size of the drawer |
| showCloseButton | `boolean` | `true` | Whether to show the close button |
| closeOnBackdropClick | `boolean` | `true` | Whether to close the drawer when clicking the backdrop |
| closeOnEsc | `boolean` | `true` | Whether to close the drawer when pressing escape |
| className | `string` | - | Additional CSS class for the drawer container |

The Drawer component also accepts all standard HTML div attributes as well as Framer Motion props (except `ref` and `children`).

## Examples

### Different Positioned Drawers

```jsx
import { useState } from 'react';
import { Drawer, Button } from '@saeedkolivand/react-ui-toolkit';

function DrawerPositions() {
  const [drawerProps, setDrawerProps] = useState({ isOpen: false, position: 'right' });

  const openDrawer = (position) => {
    setDrawerProps({ isOpen: true, position });
  };

  const closeDrawer = () => {
    setDrawerProps({ ...drawerProps, isOpen: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => openDrawer('left')}>Left Drawer</Button>
        <Button onClick={() => openDrawer('right')}>Right Drawer</Button>
        <Button onClick={() => openDrawer('top')}>Top Drawer</Button>
        <Button onClick={() => openDrawer('bottom')}>Bottom Drawer</Button>
      </div>

      <Drawer 
        isOpen={drawerProps.isOpen} 
        onClose={closeDrawer}
        position={drawerProps.position}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {drawerProps.position.charAt(0).toUpperCase() + drawerProps.position.slice(1)} Drawer
          </h2>
          <p className="mb-4">This drawer appears from the {drawerProps.position}.</p>
          <div className="flex justify-end">
            <Button onClick={closeDrawer}>Close</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

### Different Sized Drawers

```jsx
import { useState } from 'react';
import { Drawer, Button } from '@saeedkolivand/react-ui-toolkit';

function DrawerSizes() {
  const [drawerProps, setDrawerProps] = useState({ isOpen: false, size: 'md' });

  const openDrawer = (size) => {
    setDrawerProps({ isOpen: true, size });
  };

  const closeDrawer = () => {
    setDrawerProps({ ...drawerProps, isOpen: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => openDrawer('sm')}>Small Drawer</Button>
        <Button onClick={() => openDrawer('md')}>Medium Drawer</Button>
        <Button onClick={() => openDrawer('lg')}>Large Drawer</Button>
        <Button onClick={() => openDrawer('xl')}>Extra Large Drawer</Button>
        <Button onClick={() => openDrawer('full')}>Full Drawer</Button>
      </div>

      <Drawer 
        isOpen={drawerProps.isOpen} 
        onClose={closeDrawer}
        size={drawerProps.size}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {drawerProps.size.toUpperCase()} Drawer
          </h2>
          <p className="mb-4">This is a {drawerProps.size} sized drawer.</p>
          <div className="flex justify-end">
            <Button onClick={closeDrawer}>Close</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

### Navigation Drawer

```jsx
import { useState } from 'react';
import { Drawer, Button, Icon } from '@saeedkolivand/react-ui-toolkit';

function NavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const handleNavigation = (page) => {
    setActivePage(page);
    // On mobile you might want to close the drawer after navigation
    // setIsOpen(false);
  };

  const NavItem = ({ icon, label, id }) => (
    <button
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${activePage === id ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
      onClick={() => handleNavigation(id)}
    >
      <Icon name={icon} className="mr-3" />
      <span>{label}</span>
    </button>
  );

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(true)}
        className="flex items-center"
      >
        <Icon name="menu" className="mr-2" />
        Menu
      </Button>

      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        position="left"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Navigation</h2>

          <nav className="space-y-2">
            <NavItem icon="home" label="Home" id="home" />
            <NavItem icon="user" label="Profile" id="profile" />
            <NavItem icon="settings" label="Settings" id="settings" />
            <NavItem icon="help" label="Help" id="help" />
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              className="w-full justify-center"
              onClick={() => setIsOpen(false)}
            >
              Close Menu
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

### Filter Drawer

```jsx
import { useState } from 'react';
import { Drawer, Button, Checkbox } from '@saeedkolivand/react-ui-toolkit';

function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: {
      electronics: false,
      clothing: false,
      books: false,
      home: false
    },
    price: {
      under25: false,
      under50: false,
      under100: false,
      over100: false
    }
  });

  const handleFilterChange = (section, option) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [option]: !prev[section][option]
      }
    }));
  };

  const applyFilters = () => {
    console.log('Applied filters:', filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      category: {
        electronics: false,
        clothing: false,
        books: false,
        home: false
      },
      price: {
        under25: false,
        under50: false,
        under100: false,
        over100: false
      }
    });
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Filter Products
      </Button>

      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        position="right"
        size="md"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Filter Products</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Category</h3>
              <div className="space-y-2">
                <Checkbox 
                  label="Electronics" 
                  checked={filters.category.electronics}
                  onChange={() => handleFilterChange('category', 'electronics')}
                />
                <Checkbox 
                  label="Clothing" 
                  checked={filters.category.clothing}
                  onChange={() => handleFilterChange('category', 'clothing')}
                />
                <Checkbox 
                  label="Books" 
                  checked={filters.category.books}
                  onChange={() => handleFilterChange('category', 'books')}
                />
                <Checkbox 
                  label="Home & Kitchen" 
                  checked={filters.category.home}
                  onChange={() => handleFilterChange('category', 'home')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <Checkbox 
                  label="Under $25" 
                  checked={filters.price.under25}
                  onChange={() => handleFilterChange('price', 'under25')}
                />
                <Checkbox 
                  label="$25 - $50" 
                  checked={filters.price.under50}
                  onChange={() => handleFilterChange('price', 'under50')}
                />
                <Checkbox 
                  label="$50 - $100" 
                  checked={filters.price.under100}
                  onChange={() => handleFilterChange('price', 'under100')}
                />
                <Checkbox 
                  label="Over $100" 
                  checked={filters.price.over100}
                  onChange={() => handleFilterChange('price', 'over100')}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button 
              className="flex-1"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```

### Custom Styled Drawer

```jsx
import { useState } from 'react';
import { Drawer, Button } from '@saeedkolivand/react-ui-toolkit';

function CustomStyledDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Custom Drawer
      </Button>

      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        className="border-l-4 border-primary-500 rounded-l-none"
        position="right"
      >
        <div className="p-6 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/20 dark:to-gray-800 h-full">
          <h2 className="text-xl font-bold mb-4 text-primary-700 dark:text-primary-300">
            Custom Styled Drawer
          </h2>
          <p className="mb-4">This drawer has custom styling applied to it.</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
```
