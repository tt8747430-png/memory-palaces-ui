# Recommended Technology Stack

## 1. The Core Language: TypeScript

- **Why:** JavaScript is the baseline for cross-platform web/mobile development, but TypeScript is essential for maintaining scalable codebases. It ensures type safety across your UI components, API payloads, and state management layers.
- **Benefit:** When building for multiple platforms (iOS, Android, Web), TypeScript catches platform-specific property mismatches during compilation rather than causing runtime crashes on a physical device.

## 2. The Framework: Expo + React Native

- **Why:** As the modern wrapper around React Native, Expo provides the most robust architecture for delivering a native-feeling mobile app alongside a performant web PWA from a single codebase.
- **Key Tooling inside Expo:**
- **Expo Router:** Brings file-based routing (similar to Next.js App Router conventions) to mobile, making navigation intuitive and consistent across web and iOS.
- **EAS (Expo Application Services):** Allows you to build your iOS binaries in the cloud, completely eliminating the need to manage complex Xcode configurations locally during early development phases.

## 3. Styling: NativeWind (Tailwind CSS)

- **Why:** React Native natively uses a styling engine based on JavaScript objects (similar to CSS Flexbox but with differences). **NativeWind** allows you to use standard Tailwind CSS utility classes directly inside your React Native and web components.
- **Benefit:** You can share design tokens and styling configurations cleanly between your web views and native mobile layouts without rewriting the visual layer from scratch.

## 4. Package Management & Architecture: pnpm + Turborepo

- **Why:** If you plan to maintain a web application (like a Next.js landing page or full dashboard) alongside an Expo mobile app, a monorepo structure is highly recommended.
- **pnpm:** Extremely fast, disk-space efficient, and handles workspace dependencies perfectly.
- **Turborepo:** Caches build steps and speeds up linting, testing, and compilation across your shared packages (e.g., shared TypeScript interfaces, shared API client logic).

## 5. Data Fetching & State: TanStack Query (React Query)

- **Why:** Mobile apps and PWAs deal with unpredictable network connectivity. TanStack Query manages caching, background revalidation, offline synchronization, and state management for server data out of the box.
- **Benefit:** It removes the need for heavy local state-management libraries (like Redux) for anything originating from an external API or database.

---

## Recommended Development Workflow Stack

| Layer               | Recommended Tool    | Core Advantage for iOS / PWA                                            |
| ------------------- | ------------------- | ----------------------------------------------------------------------- |
| **Language**        | TypeScript          | Eliminates runtime type errors across platforms.                        |
| **Framework**       | Expo (React Native) | Direct native UI on iOS; compiles to an optimized web bundle for PWAs.  |
| **Routing**         | Expo Router         | Unified, URL-driven navigation for web deep-linking and mobile screens. |
| **Styling**         | NativeWind          | Direct use of Tailwind CSS classes for unified styling.                 |
| **Package Manager** | `pnpm`              | Lightning-fast dependency resolution and robust monorepo support.       |
| **Data Fetching**   | TanStack Query      | Automated caching, loading states, and offline persistence.             |
