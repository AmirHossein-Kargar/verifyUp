# Server/Client Component Architecture

## Overview

This project follows Next.js App Router best practices by using Server Components by default and only using Client Components when necessary for interactivity, state, effects, or browser APIs.

## Architecture Principles

### 1. Server Components (Default)

- All pages and layouts are Server Components by default
- Handle data fetching, metadata, and static content
- No JavaScript sent to the client
- Better performance and SEO

### 2. Client Components (When Needed)

- Only used for interactivity, state, effects, or browser APIs
- Marked with `'use client'` directive
- Isolated into dedicated wrapper components
- Keep as small and focused as possible

### 3. Motion Wrappers (Client-Only)

- All Framer Motion animations isolated into dedicated Client Components
- Server Components pass plain props/data to Motion wrappers
- No framer-motion imports in Server Components

## Component Structure

### Server Components (No 'use client')

```
frontend/src/app/
├── page.jsx                    # Homepage (Server Component)
├── about/
│   └── page.jsx               # About page (Server Component)
├── contact/
│   └── page.jsx               # Contact page (Server Component)
├── privacy/
│   └── page.jsx               # Privacy page (Server Component)
└── terms/
    └── page.jsx               # Terms page (Server Component)
```

### Client Components ('use client')

```
frontend/src/app/
├── HomeClient.jsx             # Hero section with auth logic
├── LayoutClient.jsx           # Layout with pathname logic
├── MotionSection.jsx          # Motion wrapper for sections
├── components/
│   ├── MotionWrapper.jsx      # Generic motion wrapper
│   ├── MotionDiv.jsx          # Motion wrapper for divs
│   ├── Header.jsx             # Header with navigation state
│   ├── Footer.jsx             # Footer (could be server)
│   ├── FAQ.jsx                # FAQ with accordion state
│   ├── CartIcon.jsx           # Cart with state
│   ├── ThemeToggle.jsx        # Theme switcher
│   └── StepCard.jsx           # Server component using MotionWrapper
```

## Motion Wrapper Components

### MotionSection.jsx

Generic wrapper for animating sections:

```javascript
// Client Component
"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function MotionSection({
  children,
  delay,
  className,
  ...props
}) {
  const reduce = useReducedMotion();
  if (reduce) return <section className={className}>{children}</section>;

  return (
    <motion.section className={className} {...props}>
      {children}
    </motion.section>
  );
}
```

Usage in Server Component:

```javascript
// Server Component (no 'use client')
import MotionSection from "./MotionSection";

export default function Page() {
  return (
    <MotionSection delay={0.15} className="max-w-6xl">
      <h2>Static Content</h2>
      <p>This content is rendered on the server</p>
    </MotionSection>
  );
}
```

### MotionWrapper.jsx

Generic wrapper for any motion element:

```javascript
// Client Component
"use client";
import { motion } from "framer-motion";

export default function MotionWrapper({ children, as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return <Component {...props}>{children}</Component>;
}
```

### MotionDiv.jsx

Specialized wrapper for divs with reduced motion support:

```javascript
// Client Component
"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function MotionDiv({
  children,
  className,
  as = "div",
  ...props
}) {
  const reduce = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (reduce) {
    const StaticComponent = as === "div" ? "div" : as;
    return <StaticComponent className={className}>{children}</StaticComponent>;
  }

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}
```

## Usage Patterns

### Pattern 1: Static Page with Animations

```javascript
// app/about/page.jsx (Server Component)
import MotionDiv from '../components/MotionDiv';

export const metadata = { title: 'About' };
export const revalidate = 3600; // Cache for 1 hour

export default function AboutPage() {
  // Server-side data fetching
  const data = await fetchData();

  return (
    <main>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>About Us</h1>
        <p>{data.description}</p>
      </MotionDiv>
    </main>
  );
}
```

### Pattern 2: Interactive Component

```javascript
// app/components/FAQ.jsx (Client Component)
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {faqs.map((faq, index) => (
        <div key={index}>
          <button onClick={() => setOpenIndex(index)}>{faq.question}</button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
              >
                {faq.answer}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Mixed Server/Client

```javascript
// app/page.jsx (Server Component)
import HomeClient from './HomeClient';
import MotionSection from './MotionSection';
import FAQ from './components/FAQ';

export default function HomePage() {
  // Server-side data
  const steps = [...];

  return (
    <main>
      {/* Client component for auth logic */}
      <HomeClient />

      {/* Server component with motion wrapper */}
      <MotionSection delay={0.15}>
        <h2>Steps</h2>
        {steps.map(step => (
          <StepCard key={step.id} {...step} />
        ))}
      </MotionSection>

      {/* Client component for interactivity */}
      <MotionSection delay={0.25}>
        <FAQ />
      </MotionSection>
    </main>
  );
}
```

## When to Use Client Components

### ✅ Use Client Components For:

- Event handlers (onClick, onChange, etc.)
- State management (useState, useReducer)
- Effects (useEffect, useLayoutEffect)
- Browser APIs (localStorage, window, document)
- Custom hooks
- Context providers/consumers
- Framer Motion animations
- Form handling with react-hook-form
- Real-time data subscriptions

### ❌ Don't Use Client Components For:

- Static content
- Metadata generation
- Data fetching (use Server Components)
- SEO-critical content
- Layouts without interactivity
- Simple presentational components

## Benefits

### Performance

- Less JavaScript sent to client
- Faster initial page load
- Better Core Web Vitals
- Reduced bundle size

### SEO

- Content rendered on server
- Better crawlability
- Faster Time to First Byte (TTFB)
- Improved search rankings

### Developer Experience

- Clear separation of concerns
- Easier to reason about data flow
- Better code organization
- Simpler testing

## Migration Checklist

When refactoring a component:

1. ✅ Check if component needs interactivity
   - No → Keep as Server Component
   - Yes → Make it Client Component

2. ✅ Check for framer-motion imports
   - Found → Extract to Motion wrapper
   - Not found → Keep as is

3. ✅ Check for hooks (useState, useEffect, etc.)
   - Found → Must be Client Component
   - Not found → Can be Server Component

4. ✅ Check for browser APIs
   - Found → Must be Client Component
   - Not found → Can be Server Component

5. ✅ Check for event handlers
   - Found → Must be Client Component
   - Not found → Can be Server Component

## Current Status

### Server Components ✅

- `/` - Homepage (uses client components for interactive parts)
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms and conditions
- `StepCard` - Step card component
- `JsonLd` - JSON-LD schema component

### Client Components ✅

- `HomeClient` - Hero with auth logic
- `LayoutClient` - Layout with pathname
- `Header` - Navigation with state
- `Footer` - Footer with animations
- `FAQ` - Accordion with state
- `CartIcon` - Cart with state
- `ThemeToggle` - Theme switcher
- `MotionSection` - Motion wrapper
- `MotionWrapper` - Generic motion wrapper
- `MotionDiv` - Div motion wrapper
- `DashboardSidebar` - Sidebar with state
- `DashboardNavbar` - Navbar with state
- `AdminSidebar` - Admin sidebar with state

### Pages That Must Stay Client ✅

- `/login` - Form with state
- `/signup` - Form with state
- `/dashboard/*` - User-specific data
- `/admin/*` - Admin panel
- `/cart` - Cart state
- `/checkout` - Payment flow
- `/services` - Interactive selection

## Best Practices

1. **Start with Server Components**
   - Default to Server Components
   - Only add 'use client' when needed

2. **Isolate Client Components**
   - Keep Client Components small
   - Extract interactive parts only
   - Pass data as props from Server Components

3. **Use Motion Wrappers**
   - Never import framer-motion in Server Components
   - Use MotionSection, MotionWrapper, or MotionDiv
   - Pass animation props from Server Components

4. **Optimize Bundle Size**
   - Minimize Client Component code
   - Use dynamic imports for heavy components
   - Lazy load when possible

5. **Maintain Type Safety**
   - Use TypeScript for complex components
   - Define prop types clearly
   - Document component APIs

## Testing

### Server Components

```javascript
// No special setup needed
import { render } from "@testing-library/react";
import AboutPage from "./page";

test("renders about page", () => {
  const { getByText } = render(<AboutPage />);
  expect(getByText("About Us")).toBeInTheDocument();
});
```

### Client Components

```javascript
// Mock framer-motion if needed
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    section: "section",
  },
  useReducedMotion: () => false,
}));
```

## Resources

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Framer Motion with Next.js](https://www.framer.com/motion/guide-nextjs/)
