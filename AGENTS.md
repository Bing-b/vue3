# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a Vue 3 + TypeScript application called "catpark" using Vite as the build tool. The project uses pnpm as the package manager and follows modern Vue.js development patterns.

## Build Commands

### Development

- `pnpm dev` - Start development server with auto-open
- `pnpm serve` - Alias for `pnpm dev`

### Build

- `pnpm build` - Production build without legacy support
- `pnpm build:prod` - Production build with legacy support

### Package Management

- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add dev dependency

### Linting & Formatting

- `eslint .` - Run ESLint on all files
- `prettier --write .` - Format all files with Prettier
- `eslint . --fix` - Auto-fix ESLint issues

### Testing

No test framework is currently configured in this project.

## Code Style Guidelines

### Import Organization

```typescript
// 1. Vue and core libraries
import { createApp } from 'vue';
import { createPinia } from 'pinia';

// 2. Third-party libraries
import ElementPlus from 'element-plus';
import mitt from 'mitt';

// 3. Internal modules (use path aliases)
import router from '@/router';
import directives from '@/directives/index';
import utils from '@/utils/commonFuction';

// 4. Types and interfaces
import type { User } from '@/types';
```

### Path Aliases

- `@/*` → `src/*`
- `#/*` → `types/*`
- `/intro` → `./node_modules/intro`

### TypeScript Configuration

- Strict mode enabled
- ESNext target
- DOM libraries included
- Experimental decorators enabled
- Consistent file name casing enforced

### Vue Component Conventions

- Use Composition API with `<script setup lang="ts">`
- Component names should be descriptive (multi-word rule disabled)
- Use TypeScript for all props and emits
- Prefer auto-imports for Vue composables

### Pinia Store Conventions

```typescript
export default defineStore('storeName', {
  state: () => ({
    // state properties
  }),
  actions: {
    // methods
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },
});
```

### API Layer Conventions

```typescript
// Use request wrapper with generics
export function apiCall<T>() {
  return request<T>({
    url: '/endpoint',
    method: 'GET',
  });
}

// Environment-aware base URLs
const baseURL = import.meta.env.PROD ? '' : '/api';
```

### ESLint Rules

- No console warnings (off for development)
- Unused variables treated as errors
- No explicit function return type required
- Use-before-define warnings enabled

### Prettier Configuration

- Print width: 100 characters
- Tab width: 2 spaces
- Single quotes for strings
- Semicolons required
- No tabs, use spaces
- Arrow function parens: always
- LF line endings
- Tailwind CSS plugin enabled

### File Naming

- Use kebab-case for component files: `my-component.vue`
- Use camelCase for TypeScript files: `myService.ts`
- Use kebab-case for directories: `my-feature/`

### Error Handling

- Use try-catch blocks for async operations
- Implement proper error types with TypeScript
- Use ElementPlus message components for user feedback
- Handle API errors in request interceptor

### CSS/SCSS

- Use SCSS with modern compiler API
- Follow Tailwind CSS utility-first approach
- Component-specific styles in `<style scoped>`
- Global styles in `@/theme/` directory

### Directives

- Custom directives organized in `@/directives/modules/`
- Export from `@/directives/index.ts`
- Use TypeScript for directive options

### Hooks (Composables)

- Use `use` prefix for composables: `useLoading.ts`
- Organize in `@/hooks/` directory
- Return reactive refs and functions
- Handle cleanup with `onUnmounted`

### Third-Party Libraries

- Element Plus for UI components
- Leaflet for mapping functionality
- ECharts for data visualization
- Three.js for 3D graphics
- GSAP for animations

## Development Notes

### Environment Variables

- Use `VITE_` prefix for environment variables
- Access via `import.meta.env.VITE_*`
- Environment-aware API base URLs

### Build Optimization

- ESBuild minification with console/debugger removal
- Code splitting configured for vendor libraries
- Legacy browser support optional
- Compression plugin enabled

### Proxy Configuration

- `/api` → AMap REST API
- `/github` → GitHub API
- `/td` → TianDiTu API

### Global Properties

- `mittBus` - Event bus instance
- `$getImg` - Image utility function

## Important Files

- `vite.config.ts` - Vite configuration
- `eslint.config.js` - ESLint flat config
- `.prettierrc` - Prettier configuration
- `tsconfig.json` - TypeScript configuration
- `src/main.ts` - Application entry point
- `build/utils.ts` - Build utilities
- `build/plugins.ts` - Vite plugins configuration
