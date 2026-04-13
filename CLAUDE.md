# Room — Claude Instructions

## Architecture
Free forex education platform under IntensiveTrader brand (Thai language)

- **Stack:** Astro 6 + MDX + Tailwind CSS 4, static output
- **Content:** MDX-based courses and lessons using Astro Content Collections (glob loader)
  - `src/content/courses/*.mdx` — course metadata (title, description, courseType, tags, order)
  - `src/content/lessons/{course-slug}/*.mdx` — lesson content (title, course ref, order, videoId, duration)
  - Course types: `learn` (knowledge) and `learn-tool` (tool guide with download link)
- **Pages:**
  - `src/pages/index.astro` — homepage with course grid, filter (all/learn/learn-tool), inline lesson content for single-lesson courses
  - `src/pages/[slug].astro` — course detail with lesson list (multi-lesson courses only, single-lesson redirects to homepage)
  - `src/pages/[slug]/[lesson].astro` — individual lesson page
- **Components:** `src/components/` — TopBar, Layout, BrokerCTA, CourseCard, LessonNav (all `.astro`)
- **Styling:** `src/styles/global.css` — Tailwind + custom dark theme, Inter + Noto Sans Thai fonts
- **Deploy:** static build, sub-app pattern (build -> copy to intensivetrader.com)
- **Build:** `npm run build` (astro build)

## Rules
- Content is Thai language — keep all UI text in Thai
- Dark theme only — all colors use CSS custom properties (dark-card, dark-border, primary, secondary, etc.)
- Adding a new course = create course MDX + lesson MDX files, no code changes needed
- BrokerCTA component appears at end-of-lesson and sidebar — affiliate placement
