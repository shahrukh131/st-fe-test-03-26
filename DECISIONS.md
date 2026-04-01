# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture
*Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?*

I used **URL-driven state synchronization** — `page`, `category`, and `search` are all derived from and synced back to `URLSearchParams` in the `useProducts` hook. This enables deep-linking, shareable filtered views, and native browser back/forward navigation without needing a global store.

For the flaky API (20% failure rate, 500–2500ms latency), **TanStack Query** handles all server state with:
- **Automatic retries**: 3 attempts with exponential backoff (`Math.min(1000 * 2^attempt, 30000)`)
- **Loading states**: Skeleton-first approach — every filter/page change renders purpose-built skeleton cards immediately rather than displaying stale data from a previous query
- **Error handling**: Layered strategy — a dismissible `ErrorBanner` when stale data exists (so users can still browse), and a full-page error state with a retry button when no data is available at all
- **React 19 `useTransition`** wraps all state-changing operations, keeping the UI responsive during network-heavy operations

No global store (Redux/Zustand) was needed — URL params + TanStack Query's cache cover all state needs.

## 2. Trade-offs and Omissions
*What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?*

**Intentionally left out:**
- **Unit/integration tests** — Prioritized architectural depth, performance optimizations (prefetching, transitions), and visual polish
- **React Error Boundaries** — Errors are handled via TanStack Query's built-in error states instead
- **SSR** — Client-side SPA via Vite is sufficient for a catalog demo

**If I had more time, I'd prioritize (in order):**
1. **Price Range Filtering**: Implementing a multi-thumb slider for price filtering alongside the category filter
2. **React Testing Library** tests targeting retry logic, pagination edge cases, and accessibility
3. **React Error Boundaries** for granular component-level recovery
4. **Optimistic caching** of previously-visited filter/page combinations for instant back-navigation
5. **Service Worker** for offline resilience and image caching

## 3. AI Usage
*How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you.*

I used **Claude (Antigravity)** as a pair-programming tool. It assisted with code generation for components, translating design specs into pixel-perfect CSS, and implementing the mobile bottom-sheet drawer with Framer Motion.

All critical architectural decisions were human-led:
- URL synchronization strategy for state persistence
- The `MainLayout` / Sidebar / Drawer structural pattern
- Skeleton-first loading policy (over stale data display)
- Predictive prefetching of the next page
- Multi-category toggle filtering approach

## 4. Edge Cases Identified
*Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here.*

- **URL history spam**: Every filter/page change pushes to history, making the back button tedious. `replaceState` might be better for search input changes.
- **Mock data non-determinism**: `Math.random()` for prices/stock/categories means products aren't consistent across page loads.
- **No "empty results" state**: When a search/filter returns zero products, the grid just renders empty with no dedicated messaging.
- **Pagination reset UX**: Changing category auto-resets to page 1 without explicit user indication that a reset occurred.
