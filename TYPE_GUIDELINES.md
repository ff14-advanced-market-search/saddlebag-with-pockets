# TypeScript Type Definitions Guide

This guide explains how types are organized in the codebase for better maintainability and developer experience.

## Type Location Rules

### Component-Local Types
Types used only by a single component should be defined in that component file:

```typescript
// Button.tsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  // ...
}
```

### Shared Component Types
Types used by multiple related components can go in an `index.ts` or `types.ts`:

```typescript
// components/form/types.ts
export interface InputProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export interface FormState {
  [key: string]: unknown
}
```

### Application-Wide Types
Global types that many components need go in `types/`:

```typescript
// types/index.ts
export interface User {
  id: string
  email: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'en' | 'de' | 'fr'
}
```

### Route/Page Types
Remix loader data types go in `root.tsx`:

```typescript
// root.tsx
export interface LoaderData {
  site_name: string
  user: User | null
  // ...
}
```

### API/Request Types
Types for API responses go in request modules:

```typescript
// requests/FFXIV/types.ts
export interface FFXIVMarketData {
  item_id: number
  listings: FFXIVListing[]
  history: FFXIVSaleHistory[]
}

export interface FFXIVListing {
  price: number
  quantity: number
  seller: string
}
```

## Type Naming Conventions

- **Props Types**: `ComponentNameProps` or `ComponentNamePropsType`
  ```typescript
  interface SidebarProps { /* ... */ }
  interface BannerProps { /* ... */ }
  ```

- **Data Types**: Descriptive noun (singular or plural as appropriate)
  ```typescript
  interface User { /* ... */ }
  interface ServerList { /* ... */ }
  interface MarketData { /* ... */ }
  ```

- **State Types**: `StateNameType` or just the object shape
  ```typescript
  type FilterState = { /* ... */ }
  type UserPreferencesType = { /* ... */ }
  ```

- **Function Signatures**: `FunctionNameType` or `FunctionNameFn`
  ```typescript
  type RenderIconType = (iconType: string, className: string) => React.ReactNode
  type AsyncFetchFn = (url: string) => Promise<Response>
  ```

- **Utility/Const Types**: `ValueType` or specific domain
  ```typescript
  type GameName = 'ffxiv' | 'wow' | 'gw2'
  type IconType = 'chart' | 'magnify' | 'cog'
  ```

## Generic Type Patterns

### Generic Array Helpers
```typescript
type Arrayable<T> = T | T[]
type Nullable<T> = T | null
type Optional<T> = T | undefined
type Flatten<T> = T extends Array<infer U> ? U : T
```

### Component Generic Props
```typescript
interface WithChildren<T = React.ReactNode> {
  children: T
}

interface WithClassName {
  className?: string
}

// Usage
const Container: React.FC<WithChildren<React.ReactNode>> = ({ children }) => (
  <div>{children}</div>
)
```

### API Response Patterns
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

## Avoiding Common Type Mistakes

### ❌ Don't use `any`
```typescript
// Bad
const handleData = (data: any) => { /* ... */ }

// Good
const handleData = (data: MarketData) => { /* ... */ }
```

### ❌ Don't use `unknown` without checking
```typescript
// Bad
const value: unknown = getData()
console.log(value.name) // Error!

// Good
const value: unknown = getData()
if (typeof value === 'object' && value !== null) {
  console.log((value as MarketData).name)
}
```

### ✓ Use union types for variants
```typescript
// Good - clear what values are acceptable
type GameName = 'ffxiv' | 'wow' | 'gw2'
type Theme = 'light' | 'dark' | 'auto'

// Instead of
type GameName = string
type Theme = string
```

### ✓ Use `const` assertions for literals
```typescript
// Good - preserves literal types
const GAMES = ['ffxiv', 'wow', 'gw2'] as const
type GameName = typeof GAMES[number]

// Instead of
const GAMES = ['ffxiv', 'wow', 'gw2'] // string[]
```

## Type Checking Standards

Run type checking with:
```bash
yarn tsc --noEmit
```

This ensures:
- No implicit `any` types
- All imports/exports have correct types
- Type relationships are correct

Before committing, ensure no TypeScript errors in your changes.
