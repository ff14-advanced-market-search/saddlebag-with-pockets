# Architecture & Organization Guide

## Directory Structure

### `/app`
Main application source code, organized by feature and function:

- **`components/`** - Reusable React components
  - `Charts/` - Data visualization components
  - `Common/` - Shared UI components (buttons, inputs, etc.)
  - `navigation/` - Navigation components (Sidebar, breadcrumbs)
  - `FFXIV/`, `WoW/`, `GW2/` - Game-specific components
  - `form/` - Form-related components and utilities
  - `widgets/` - Widget components
  - `icons/` - Custom SVG/icon components
  - `providers/` - Context providers for app-wide state

- **`constants/`** - Application-wide constants
  - `urls.ts` - External links, API endpoints, fixed strings
  - `index.ts` - Barrel export for easy importing

- **`redux/`** - State management
  - `store.ts` - Redux store configuration
  - `reducers/` - Redux reducer functions
  - `localStorage/` - Redux middleware for persistence
  - `useTypedSelector.ts` - Typed hooks for accessing state

- **`requests/`** - API/data fetching logic
  - `client/` - Client-side API utilities
  - `FFXIV/`, `WoW/`, `GW2/` - Game-specific API requests

- **`routes/`** - Remix page routes
  - File-based routing following Remix conventions
  - Named patterns: `[game].[feature].[subfeature].tsx`

- **`utils/`** - Utility functions
  - `items/` - Item database and lookup utilities
  - `locations/` - Server/world/realm validation
  - `WoWServers/` - WoW server-specific utilities
  - `filters/` - Data filtering utilities

- **`test/`** - Test files (unit and component tests)

- **`types/`** - TypeScript type definitions

- **`sessions/`** - Session management utilities

- **`sessions.server.ts`** - Server-only session logic (Remix)

### Root Level Config Files

- `vite.config.ts` - Vite build and test configuration
- `remix.config.js` - Remix framework configuration
- `tailwind.config.js` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## Key Patterns

### Component Organization
- Components are organized by feature/game rather than type
- Shared components go in `Common/`
- Each major feature gets its own subdirectory

### Type Definitions
- Types are co-located with components when possible
- Shared types live in `types/` directory
- Game-specific types are in their respective directories

### Constants
- Hardcoded strings (URLs, API endpoints) go in `constants/`
- Use barrel exports (`index.ts`) for easy importing
- TypeScript `const` assertions preserve exact types

### State Management
- Redux for app-wide state (user preferences, filters)
- LocalStorage integration for persistence
- Component-level state via hooks for simple cases

### Testing
- Unit tests: `*.test.ts` files
- Component tests: `*.test.tsx` files
- E2E tests: `e2e/*.spec.ts` files (Playwright)
- Integration tests: `*-links.test.ts` files (require server)

## Code Organization Principles

1. **Colocation** - Keep code close to where it's used
2. **Single Responsibility** - Each file has one clear purpose
3. **Naming Clarity** - Descriptive, unambiguous names
4. **Type Safety** - Leverage TypeScript for better IDE support
5. **Documentation** - JSDoc comments for complex logic
6. **Consistency** - Follow established patterns in the codebase

## Import Guidelines

- Use absolute imports (`~/...`) from the src root
- Organize imports in this order:
  1. External libraries
  2. Remix imports
  3. Internal absolute imports
  4. Relative imports
- Use barrel exports for complex directories

## Common Development Tasks

### Adding a New Page
1. Create `routes/[game].feature-name.tsx`
2. Export `meta` function for SEO
3. Add loader if data fetching needed
4. Import and use shared components
5. Add tests in `test/routes/`

### Adding a Utility Function
1. Create in appropriate `utils/` subdirectory
2. Add JSDoc comment explaining purpose/usage
3. Export from barrel `index.ts` if shared
4. Add unit tests next to the file

### Adding a Reusable Component
1. Create in appropriate `components/` subdirectory
2. Include PropTypes or TypeScript interface
3. Add example/documentation comments
4. Create component test file
5. Export from parent `index.ts`

## Refactoring Guidelines

When refactoring, ensure:
- All tests pass (`yarn test --run`)
- Build succeeds (`yarn build`)
- No console errors in development (`yarn dev`)
- Types check cleanly (`tsc --noEmit`)
