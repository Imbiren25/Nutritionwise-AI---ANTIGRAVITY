## Goals
- Modernize the AI chat UI with consistent design system primitives, better readability in light theme, and strong accessibility.

## Key Fixes
- Replace hardcoded colors (`text-white`, `text-neutral-*`, `text-primary-green`, `bg-secondary-blue`) with CSS variables and shared components.
- Implement message bubbles with clear contrast for light theme.
- Upgrade composer to use `Input` and `Button` primitives.
- Add aria-live for assistant messages and visible focus rings.

## Target File
- `components/AiAssistant.tsx:110-180`

## Implementation Details
- Header:
  - Use `Icon name="ai"` with `text-[var(--text-accent)]`
  - Title `text-[var(--text-primary)]`; subtitle `text-[var(--text-secondary)]`
- Messages:
  - Model bubble: `bg-[var(--bg-tertiary)] text-[var(--text-primary)]`
  - User bubble: `bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]`
  - Error bubble: `bg-[var(--error-bg)] text-[var(--error-text)]` with retry as `Button variant="link"`
  - Add `aria-live="polite"` container for assistant messages
- Composer:
  - Replace raw `input` + `button` with `Input` and `Button` primitives
  - Disable send when offline or input empty; maintain friendly placeholder
- Scroll/Loading:
  - Keep auto-scroll; replace typing dots with `Skeleton` for consistency

## Accessibility & Responsiveness
- Proper labels, `aria-live` for assistant replies, keyboard navigability
- Maintain `max-w-4xl mx-auto`, large tap targets on mobile

## Deliverables
- Refactored `AiAssistant.tsx` adhering to the app’s design tokens and primitives
- Verified in light theme and dark theme

## Approval
If approved, I will refactor `AiAssistant.tsx` accordingly, build and preview, and confirm contrast and accessibility in light theme.