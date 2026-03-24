# Architecture & Developer Guide

## Getting started

### Prerequisites
- Node.js 18+
- npm 9+ (or your preferred package manager)
- Angular 21 CLI — `npm install -g @angular/cli`

### Install dependencies
```bash
npm install
```

### Development server
```bash
ng serve
```
Opens at `http://localhost:4200`. The app hot-reloads on file changes.

### Production build
```bash
ng build
```
Output lands in `dist/`. Use `ng build --configuration production` for a fully optimised bundle (tree-shaking, minification, etc.).

### Run tests
```bash
ng test
```
Runs the Vitest suite once and reports pass/fail. Omit `--watch=false` if you want the watcher active during development.

---

## Folder structure

```
src/
├── app/
│   ├── core/                          # Singleton, app-wide concerns
│   │   ├── interfaces/                # Shared TypeScript interfaces / types
│   │   │   └── vehicle.interface.ts
│   │   └── services/                  # API layer — provided in root (singleton)
│   │       └── vehicle.service.ts
│   │
│   ├── features/                      # One folder per product feature/domain
│   │   └── vehicles/                  # "Vehicles" feature context
│   │       └── components/
│   │           ├── vehicle-card/      # Presentational card component
│   │           ├── vehicle-detail-modal/ # Detail modal for a single vehicle
│   │           └── vehicle-list/      # Container — owns data fetching & layout
│   │
│   └── shared/                        # Truly reusable, feature-agnostic code
│       └── ui/
│           ├── button/                # Generic button component
│           └── svg/
│               └── car-silhouette/    # Inline SVG component (fallback image)
│
├── styles.scss                        # Global tokens & base styles
└── index.html                         # Shell — font imports, meta tags
```

### Why this shape?

| Layer | Rule |
|---|---|
| `core/` | Instantiated once for the lifetime of the app. Services here use `providedIn: 'root'` so Angular's DI keeps a single instance. Never import feature-specific code here. |
| `features/` | Each feature is self-contained. A new feature (e.g. `comparisons/`, `saved-vehicles/`) gets its own folder and never reaches into another feature's internals. |
| `shared/` | Only code that has been genuinely used in two or more features belongs here. Avoid pre-emptive abstraction — move things in when the second consumer appears. |

---

## Key architectural decisions

### Signals for state management
Angular's built-in signals (`signal`, `computed`, `input`) are used throughout instead of RxJS subject/BehaviourSubject chains for local component state. This keeps change detection explicit and predictable.

```typescript
// component input as a signal
vehicle = input.required<AnyVehicle>();

// derived state — recalculates only when vehicle() changes
readonly imageUrl = computed(() => {
  const { media } = this.vehicle();
  return media.find(m => m.url.includes('16x9'))?.url ?? media[0]?.url ?? '';
});

// mutable local state
imageError = signal(false);
```

RxJS is still used in the service layer where it makes sense (HTTP streams, `forkJoin` for parallel API calls).

### Core API service — singleton pattern
`VehicleService` lives in `core/services/` and is provided in root. It owns every HTTP call and exposes clean observables to consumers. Components never call `HttpClient` directly.

```
Component → VehicleService → HttpClient → API
```

This means the API contract is defined in one place. Swap the backend URL, add caching, or mock responses for tests — all from a single file.

### Single responsibility components
Each component has one job:

| Component | Responsibility |
|---|---|
| `VehicleListComponent` | Fetch data, manage loading/error state, render the grid |
| `VehicleCardComponent` | Display a single vehicle summary, open the detail modal |
| `VehicleDetailModal` | Display full vehicle detail in a native `<dialog>` |
| `ButtonComponent` | Render a consistently styled `<button>` — nothing more |
| `CarSilhouetteComponent` | Render the SVG fallback with themeable colours |

### `OnPush` change detection
All components use `ChangeDetectionStrategy.OnPush`. Combined with signal inputs, Angular only re-renders a component when its inputs change or a signal it reads is updated — not on every application tick.

### BEM naming convention
CSS follows BEM (`block__element--modifier`). Every component owns its styles via Angular's view encapsulation, so class names are scoped automatically and BEM is used for internal readability rather than collision avoidance.

---

## Theming & white-labelling

All colours are defined as CSS custom properties on `:root` in `src/styles.scss`. No hardcoded colour values appear in component stylesheets.

### Brand tokens
These are the two values most likely to change per client:

```scss
:root {
  --primary-colour:   #312f2f;  /* buttons, borders, headings */
  --secondary-colour: #ffffff;  /* card backgrounds, button secondary text */
}
```

### Overriding for a brand
Create a brand override file and load it after `styles.scss`:

```scss
// src/themes/brand-x.scss
:root {
  --primary-colour:   #005eb8;
  --secondary-colour: #f0f7ff;
}
```

No component code changes. No build flags. All components consume the tokens automatically via `var(--primary-colour)` etc.

### Full token reference

| Token | Default | Usage |
|---|---|---|
| `--primary-colour` | `#312f2f` | Button bg, borders, name rule lines |
| `--secondary-colour` | `#ffffff` | Card bg, button secondary bg |
| `--colour-text` | `#333333` | Body copy |
| `--colour-text-muted` | `#555555` | Secondary text, descriptions |
| `--colour-text-on-primary` | `#ffffff` | Text placed on primary-colour backgrounds |
| `--colour-border` | `#e0e0e0` | Card dividers, mobile row borders |
| `--colour-divider` | `#d0d0d0` | 1px grid gap (tablet+) |
| `--colour-surface` | `#f7f7f7` | Modal list item backgrounds |
| `--colour-surface-hover` | `#f0f0f0` | Interactive surface on hover |
| `--colour-error` | `#c0392b` | Error state messages |
| `--colour-skeleton-base` | `#efefef` | Skeleton loader base |
| `--colour-skeleton-shine` | `#e0e0e0` | Skeleton loader shimmer highlight |
| `--colour-shadow` | `rgba(0,0,0,0.35)` | Modal box-shadow |
| `--colour-backdrop` | `rgba(0,0,0,0.55)` | Modal backdrop overlay |
