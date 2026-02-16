# Skeleton Components Reorganization

## Summary

All skeleton loading components have been reorganized into a dedicated folder structure following best practices for maintainability and consistency.

## Changes Made

### 1. New Folder Structure

Created `frontend/src/components/skeletons/` with the following skeleton components:

- `AboutSkeleton.jsx` - Matches about page layout
- `CartSkeleton.jsx` - Matches cart page layout
- `ContactSkeleton.jsx` - Matches contact page layout
- `DashboardSkeleton.jsx` - Matches dashboard layout (includes sidebar)
- `HomeSkeleton.jsx` - Matches homepage layout
- `LoginSkeleton.jsx` - Matches login form layout
- `PrivacySkeleton.jsx` - Matches privacy page layout
- `SignupSkeleton.jsx` - Matches signup form layout
- `TermsSkeleton.jsx` - Matches terms page layout

### 2. Updated Import Paths

All loading.jsx files and component imports have been updated to use the new centralized path:

```javascript
// Old
import LoginSkeleton from "../components/LoginSkeleton";
import DashboardSkeleton from "@/app/components/DashboardSkeleton";

// New
import LoginSkeleton from "@/components/skeletons/LoginSkeleton";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
```

### 3. Files Updated

#### Loading Files

- `frontend/src/app/loading.jsx`
- `frontend/src/app/about/loading.jsx`
- `frontend/src/app/cart/loading.jsx`
- `frontend/src/app/contact/loading.jsx`
- `frontend/src/app/dashboard/loading.jsx`
- `frontend/src/app/dashboard/orders/loading.jsx`
- `frontend/src/app/dashboard/profile/loading.jsx`
- `frontend/src/app/login/loading.jsx`
- `frontend/src/app/privacy/loading.jsx`
- `frontend/src/app/signup/loading.jsx`
- `frontend/src/app/terms/loading.jsx`

#### Component Files

- `frontend/src/app/admin/page.jsx`
- `frontend/src/app/admin/orders/page.jsx`
- `frontend/src/app/dashboard/page.jsx`
- `frontend/src/app/dashboard/page_backup.jsx`
- `frontend/src/app/dashboard/orders/page.jsx`
- `frontend/src/app/dashboard/profile/page.jsx`
- `frontend/src/app/login/page.jsx`
- `frontend/src/app/signup/page.jsx`

### 4. Removed Old Files

Deleted old skeleton components from `frontend/src/app/components/`:

- `AboutSkeleton.jsx`
- `CartSkeleton.jsx`
- `ContactSkeleton.jsx`
- `DashboardSkeleton.jsx`
- `HeaderSkeleton.jsx` (merged into DashboardSkeleton)
- `HomePageSkeleton.jsx` (renamed to HomeSkeleton)
- `LoginSkeleton.jsx`
- `SignupSkeleton.jsx`

## Design Principles

### 1. One Skeleton Per Component

Each UI component that requires a loading state has its own dedicated skeleton component that matches the real component's layout, spacing, and size 1:1.

### 2. Real Loading States Only

Skeletons are rendered only where real async loading happens:

- Route-level `loading.jsx` files (Next.js automatic loading states)
- Component-level loading states tied to actual data fetching

### 3. No Decorative Loaders

Removed any unused or decorative skeleton components that don't correspond to actual loading states.

### 4. Consistent Structure

All skeletons follow the same pattern:

- Match the real component's DOM structure
- Use consistent Tailwind classes for skeleton elements
- Include `animate-pulse` for loading animation
- Support dark mode with `dark:` variants
- Maintain responsive design with breakpoint classes

## Benefits

1. **Centralized Management**: All skeletons in one location makes them easier to find and maintain
2. **Consistent Naming**: Clear naming convention (`<ComponentName>Skeleton.jsx`)
3. **Better Organization**: Separates skeleton components from regular UI components
4. **Easier Updates**: Changes to skeleton patterns can be applied consistently across all files
5. **Improved DX**: Developers know exactly where to find and create skeleton components

## Usage

### Creating a New Skeleton

1. Create a new file in `frontend/src/components/skeletons/`
2. Name it `<ComponentName>Skeleton.jsx`
3. Match the layout of the real component 1:1
4. Use in the corresponding `loading.jsx` file:

```javascript
import ComponentSkeleton from "@/components/skeletons/ComponentSkeleton";

export default function Loading() {
  return <ComponentSkeleton />;
}
```

### Best Practices

- Always match the real component's structure exactly
- Use the same spacing, sizing, and layout classes
- Include all major visual elements (headers, cards, buttons, etc.)
- Test in both light and dark modes
- Ensure responsive behavior matches the real component
