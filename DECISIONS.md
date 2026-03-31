# Technical Decisions & Strategy

This document outlines the technical choices, architectural patterns, and senior-level optimizations implemented for the e-commerce product catalog.

## 1. Architectural Strategy & State Management

### URL-Driven Component State
**Decision**: Synchronized all primary application states (`page`, `category`, `search`) with the browser's URL search parameters.
- **Rationale**: Enables deep-linking, shareable filtered views, and full support for browser navigation (back/forward buttons). This provides a production-grade user experience where the UI remains consistent after page refreshes.

### MainLayout Pattern
**Decision**: Decoupled the structural layout (headers, sidebars, drawers) from the feature-specific logic using a `MainLayout` component.
- **Rationale**: Improves code maintainability and scalability. `App.tsx` now functions as a "Controller" and "Orchestrator," while the layout components remain reusable and focused solely on presentation.

### Data Fetching with TanStack Query
**Decision**: Utilized TanStack Query for all data fetching and caching needs.
- **Rationale**: Simplifies complex async logic, such as automatic retries with exponential backoff and localized loading/error states.

## 2. Performance & Perceived Latency

### Predictive Prefetching
**Decision**: Implemented background prefetching for the *next* page of products.
- **Rationale**: Reduces perceived latency. When a user is on page 1, the data for page 2 is already being fetched in the background, making pagination transitions near-instant.

### React 19 Transitions
**Decision**: Leveraged `useTransition` for state updates that trigger data fetching.
- **Rationale**: Keeps the UI fluid and responsive even during network-heavy operations like typing in the search bar or swiping categories.

## 3. UI/UX Optimization

### Skeleton-First Response
**Decision**: Prioritized immediate visual feedback through custom skeletons on all page and filter changes.
- **Rationale**: To provide the clearest system feedback, showing a skeleton is more effective than holding onto stale/outdated data from a previous filter or page.
- **Optimization**: Skeletons were refined to match the exact aspect ratio and card layout of the products, eliminating layout shifts (CLS).

### Responsive Sidebar/Drawer
**Decision**: Implemented a dual navigation strategy with a persistent sidebar for desktop and a slide-out drawer for mobile.
- **Rationale**: Desktop users benefit from a permanent filter control, while mobile users get a thumb-friendly, full-screen interaction that saves valuable screen real estate.

## 4. Trade-offs and Omissions

### Intentional Trade-offs
- **No Global Store (Redux/Zustand)**: Native React state and URL synchronization are sufficient and more performant for this scope.
- **No unit tests**: Prioritized architectural depth, performance optimizations, and visual polish over test coverage due to time constraints.
- **Deterministic Mock Data**: Derive categories and products from the mock source. In production, this would be a real, paginated backend API.

### High-Priority Next Steps
1. **React Testing Library**: Focusing on the retry logic, pagination edge cases, and accessibility verification.
2. **React Error Boundaries**: Wrap components for granular error recovery.
3. **Optimistic Caching**: Cache all previously-visited filter results for instant back-navigation.
4. **Service Worker**: For offline Resilience and image caching.

## 5. AI Usage Summary

During the development of this catalog, I utilized **Claude (Antigravity)** as a specialized pair-programming and implementation tool. While the AI assisted with code generation and design translation, all critical architectural and strategic decisions were human-led:

**Key Human-Led Decisions:**
- **Strategy & Governance**: Directed the pivot from a simple pill-filter to the more scalable **MainLayout** and **Sidebar/Drawer** pattern.
- **State Management**: Architected the **URL Synchronization** strategy to ensure persistence and shareability.
- **Performance Engineering**: Defined and initiated the **Predictive Prefetching** logic to optimize perceived latency.
- **UX Policy**: Enforced a **Skeleton-First** loading policy (over stale data) to provide immediate, definitive user feedback.
- **Accessibility & SEM**: Ensured all components maintain high standards for keyboard navigation and SEO-friendly semantic HTML.
