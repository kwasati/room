# Room

Personal learning platform — online courses and lessons for trading education.

## Tech Stack

- [Astro](https://astro.build/) v6 (static output)
- [MDX](https://mdxjs.com/) for content (courses + lessons)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [astro-embed](https://github.com/delucis/astro-embed) for video embeds

## Content Structure

Content is organized as MDX collections:

- `src/content/courses/` — course definitions (title, description, tags, type)
- `src/content/lessons/` — individual lessons linked to courses (with optional video)

Course types: `learn` (knowledge) and `learn-tool` (tool-specific guides).

## Development

```bash
npm install
npm run dev        # dev server at localhost:4321
npm run build      # static build to dist/
npm run preview    # preview production build
```

Requires Node.js >= 22.12.0.

## Project Structure

```
src/
  content/         # MDX content collections
    courses/       # course frontmatter + content
    lessons/       # lesson frontmatter + content
  components/      # Astro/UI components
  layouts/         # page layouts
  pages/           # route pages
  styles/          # global styles
  content.config.ts
public/            # static assets
```
