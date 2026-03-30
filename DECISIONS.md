# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture
*Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?*

### Custom `useProducts` Hook with TanStack Query (Professional Strategy)

Initially, I implemented a custom `useEffect`-based data fetching hook, then pivoted to **TanStack Query** for more robust management. 

**Resilience Features Preserved & Enhanced:**
- **Conditional Stale Data (Dual-Loading Strategy)**: To match modern e-commerce standards, the hook distinguishes between a "Page Change" and a "Filter Change":
    - **Filter/Search Change**: Immediately clears the results and shows **shimmer skeletons**. This confirms to the user that their new intent (e.g., searching for a different category) has been registered.
    - **Pagination Change**: Keeps the **stale data** visible (dimmed at 55% opacity) while the next page loads. This provides a smoother browsing experience without jarring layout shifts.
- **Exponential Backoff**: Still using `BASE_DELAY * 2^attempt` logic via TanStack's `retryDelay`.
- **Debounced Search**: Maintained at 300ms to optimize API load.

**Architecture Benefits**:
- **Declarative Resilience**: Used `placeholderData` as a callback function and the `isPlaceholderData` property to handle the complex state transitions with minimal boilerplate.
- **Centralized request management** and reduction in potential race condition bugs.

## 2. Trade-offs and Omissions
*What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?*

### Intentional Trade-offs
- **No external state management library** — React's built-in `useState`/`useEffect` is sufficient for this scope. React Query would add value at 3+ endpoints.
- **Category list is hardcoded** — matches the known API categories. In production, I'd fetch categories dynamically.
- **No unit tests** — given time constraints, I prioritized robust error handling and polished UX over test coverage.
- **Used `category` field as "brand"** — the API lacks a `brand` field, so category is displayed in the brand position per Figma layout.

### If I Had More Time
1. **React Testing Library tests** — especially for the retry logic, pagination edge cases, and error states.
2. **Optimistic caching per page** — cache previously-fetched pages so back-navigation is instant.
3. **Virtual scrolling** for very large datasets.
4. **URL state synchronization** — sync page/category/search to URL params so users can bookmark/share filtered views.
5. **Service Worker** for offline resilience.

## 3. AI Usage
*How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you.*

I used **Claude (Antigravity)** as a pair-programming assistant for this assignment:

- **Architecture planning** — initially discussed custom `useEffect` logic for resilience, then pivoted to **TanStack Query** for better long-term maintainability and out-of-the-box handling of caching and retries.
- **Code migration** — aided in translating the previous `useEffect` logic into the `useQuery` configuration, ensuring all previous features (debounce, backoff, stale data) were mapped correctly.
- **Figma interpretation** — since the Figma design showed Image → Brand → Name → Price, the AI helped map the API's `category` field to the "brand" position.
- **Decision validation** — used AI to pressure-test trade-offs (e.g., "should I use React Query?" → decided no, single endpoint doesn't justify the dependency).

**Key human decisions maintained:**
- Architectural pattern selection (custom hook over library)
- UX decisions (non-blocking errors, stale data preservation)
- Accessibility requirements (ARIA labels, focus management, semantic HTML)
- Design system integration (reusing existing glassmorphism tokens)

## 4. Edge Cases Identified
*Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here.*

### Handled Edge Cases
- **Race conditions** — multiple rapid page/filter changes don't corrupt state (AbortController + request ID).
- **Image load failures** — graceful fallback to SVG placeholder icon.
- **Low stock / Out of stock** — visual badges on product cards.
- **Empty search results** — dedicated empty state with helpful message.
- **Pagination boundary** — Previous/Next buttons properly disabled at page 1 and last page.
- **Category + search combo** — both filters work together correctly, results summary reflects both.

### Known Limitations
- **No retry limit feedback** — the error banner doesn't tell users "3 retries failed." Could add attempt count.
- **No request timeout** — relies on the API's own delay (500-2500ms). In production, I'd add a fetch timeout wrapper.
- **Pagination doesn't persist across filter changes** — intentionally resets to page 1, but could preserve if the new total supports it.
- **Mock API randomness** — prices and categories are randomly assigned on each page load (due to `Math.random()` in the mock). In production, this would be deterministic.
