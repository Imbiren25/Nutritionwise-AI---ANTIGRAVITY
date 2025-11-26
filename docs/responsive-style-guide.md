# Responsive Style Guide

## Modes
- Mobile: <768px
- Tablet: 768–1023px
- Desktop: ≥1024px

## Layout
- Containers: `max-w-container` centered, `px-6 md:px-8 lg:px-12`
- Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, baseline `gap-4`

## Typography
- Use responsive utilities and clamp for headings where appropriate
- Maintain readable line lengths; adjust line-height per mode

## Colors & Contrast
- Ensure AA contrast for text and interactive states across modes

## Interactions
- Touch targets: mobile ≥48x48, tablet ≥44x44
- Focus rings: `focus:ring-2` with brand accent

## Motion
- Respect `prefers-reduced-motion`; disable animations when set

