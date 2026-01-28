# System Monitor Dashboard

A responsive Vue 3 + TypeScript dashboard displaying infrastructure health metrics with multiple data visualizations.

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs)

## Features

- **KPI Cards** — Total monitors, uptime percentage, response times
- **Line Chart** — 30-day uptime & response time trends (dual Y-axis)
- **Bar Chart** — Monitor breakdown by type (HTTP, TCP, Ping, DNS, SSL)
- **Data Table** — All monitors with status, tags, and metrics
- **Loading States** — Skeleton loaders and spinners
- **Error Handling** — Error messages with retry functionality
- **Empty States** — Friendly "no data" messages
- **Responsive Design** — Desktop, tablet, and mobile layouts
- **Accessibility** — ARIA labels, skip links, focus indicators
- **Demo Mode** — Simulate errors/empty states for testing

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Vue 3 | UI framework (Composition API) |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Chart.js + vue-chartjs | Data visualizations |
| Vite | Build tool |

## Project Structure

```
src/
├── components/
│   ├── Dashboard.vue           # Main layout & data orchestration
│   ├── DashboardHeader.vue     # Header with title & live indicator
│   ├── charts/
│   │   ├── UptimeLineChart.vue     # Line chart component
│   │   └── MonitorTypeBarChart.vue # Bar chart component
│   └── widgets/
│       ├── KpiCard.vue         # KPI card component
│       ├── WidgetWrapper.vue   # Loading/error/empty state wrapper
│       └── MonitorTable.vue    # Data table component
├── composables/
│   └── useAsyncData.ts         # Async data fetching hook
├── data/
│   └── mockData.ts             # Mock monitor & uptime data
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   └── formatters.ts           # Formatting utilities
├── App.vue
├── main.ts
└── style.css                   # Global styles & animations
```

## Architecture

```
Dashboard.vue (orchestration)
    │
    ├── useAsyncData() × 4      ← Independent data fetching per widget
    │
    ├── KpiCard × 4             ← Presentation components (props in)
    │
    ├── WidgetWrapper           ← Handles loading/error/empty states
    │   └── UptimeLineChart
    │
    ├── WidgetWrapper
    │   └── MonitorTypeBarChart
    │
    └── WidgetWrapper
        └── MonitorTable
```

**Key decisions:**
- **No Pinia/Vuex** — App complexity doesn't warrant it; composables suffice
- **Independent widget loading** — Partial failures don't break the dashboard
- **Dumb components** — Charts/table receive data via props, stay reusable

## Responsive Breakpoints

| Screen | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | ≥ 768px | 2-column KPIs, more table columns |
| Desktop | ≥ 1024px | 4-column KPIs, 2:1 chart split |

## Demo Mode

Click the **"🎛 Demo Mode"** button (bottom-right) to:
- Simulate API errors on individual widgets
- Simulate empty data states
- Test partial failure handling

## Documentation

- [`PRESENTATION_NOTES.md`](./PRESENTATION_NOTES.md) — Interview talking points
- [`DESIGN_SPECS.md`](./DESIGN_SPECS.md) — Design system & component specs
- [`design-tokens.json`](./design-tokens.json) — Colors, typography, spacing tokens

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Type-check & build
npm run preview   # Preview production build
```

## License

MIT
