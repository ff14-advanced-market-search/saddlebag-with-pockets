# Import Organization Standards

This document outlines how imports should be organized in the codebase for consistency and readability.

## Import Order

Imports should be organized in the following order with blank lines between sections:

```typescript
// 1. External libraries (React, Remix, etc.)
import { useState, useEffect } from 'react'
import type { MetaFunction } from '@remix-run/cloudflare'
import { Form, Link, useLoaderData } from '@remix-run/react'

// 2. Third-party packages
import { classNames } from 'clsx'

// 3. Internal absolute imports (from ~/)
import { EXTERNAL_LINKS } from '~/constants'
import Banner from '~/components/Common/Banner'
import type { LoaderData } from '~/root'

// 4. Relative imports (from ./ or ../)
import { NotificationBell } from './NotificationBell'
import type { NavbarLinkProps } from '../types'
```

## Using Barrel Exports

Barrel exports (index.ts files) make imports cleaner:

```typescript
// Instead of:
import Button from '~/components/form/Button'
import Input from '~/components/form/Input'
import TextArea from '~/components/form/TextArea'

// Use:
import { Button, Input, TextArea } from '~/components/form'
```

## Absolute vs Relative Imports

- Use absolute imports (`~/`) for:
  - Components from different feature areas
  - Utils, constants, types across the app
  - Libraries and configurations

- Use relative imports (`./`, `../`) for:
  - Components in the same directory
  - Sub-components of a feature
  - Internal component utilities

## Type Imports

Use `type` keyword for type-only imports to improve tree-shaking:

```typescript
// Good
import type { LoaderData } from '~/root'
import { useLoaderData } from '@remix-run/react'

// Avoid
import { LoaderData, useLoaderData } from './types'
```

## Organizing Large Import Lists

Break long import lists across multiple lines:

```typescript
// Avoid (hard to read)
import { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext } from 'react'

// Good
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useContext
} from 'react'
```

## Game-Specific Imports

Keep game-specific imports in game-specific files:

```typescript
// In FFXIV route/component
import { WorldList } from '~/utils/locations/Worlds'
import type { FFXIVMarketData } from '~/requests/FFXIV'

// In WoW route/component
import { validateServerAndRegion } from '~/utils/WoWServers/validateServerAndRegion'
import type { WoWRealmData } from '~/requests/WoW'
```

## Avoiding Circular Dependencies

If you find yourself with circular imports:

1. Move shared types to `~/types`
2. Extract common utilities to `~/utils`
3. Use relative imports for closely related modules
4. Consider restructuring the component hierarchy

## ESLint Rules

The project uses ESLint to enforce some of these standards automatically. Common rules:

- `sort-imports` - Alphabetizes imports
- `import/order` - Enforces import ordering
- `no-relative-parent-imports` - Discourages excessive `../`

Run `yarn lint` to check your imports.
