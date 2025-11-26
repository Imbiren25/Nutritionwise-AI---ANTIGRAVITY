## Objectives
- Make the AI Assistant main UI match the app-wide design system (colors, spacing, components, accessibility).
- Improve chat readability, input ergonomics, and offline/disabled states.

## Scope
- Refactor visual structure inside the AI Assistant main container.
- Keep existing chat logic and hooks; focus on UI and layout.

## Target Files
- `components/AiAssistant.tsx` (chat layout, header, messages, composer)
- References only (no logic changes): `services/aiAssistantService.ts`, `hooks/useOnlineStatus.ts`, feature flags from `types.ts`

## Planned Changes
### Shell & Container
- Wrap the assistant content with `Card` sections instead of raw colored divs.
- Replace hardcoded colors like `text-neutral-*` with CSS variables (`var(--text-primary)`, `var(--text-secondary)`, `var(--border-primary)`, `var(--bg-secondary)`).
- Maintain `max-w-4xl mx-auto` and current paddings but adopt consistent spacing via primitives.

### Header Bar
- Use a compact header inside the Card: icon via `Icon` (`text-[var(--text-accent)]`), title and subtitle using variables.
- Show online/offline and feature-flag status with subtle badges using `success/warning` variables.

### Messages Area
- Implement message bubbles:
  - User bubble: aligned right, subtle accent border.
  - AI bubble: aligned left, neutral background.
- Add timestamps and aria labels (e.g., `role="article"` with `aria-label="Assistant message"`).
- Show streaming state with `Skeleton` lines while waiting.

### Input Composer
- Replace raw form with `Input` and `Button` primitives:
  - `Input` (no label, placeholder retained, full-width)
  - `Button` `primary` for Send, disabled when offline or empty
- Preserve `focus-within` ring but switch to variables (`var(--text-accent)`).

### Empty/Welcome State
- Render a friendly welcome block inside a `Card` when no messages, using `text-[var(--text-secondary)]` and prompt suggestions as `Button variant="tertiary"` chips.

### Accessibility
- Ensure keyboard navigation: focus order from composer to transcript list.
- Add `aria-live="polite"` for incoming assistant messages.
- Respect reduced motion for subtle transitions.

### Responsiveness
- Keep `max-w-4xl` and spacing; ensure input and send button remain tap-friendly on mobile.
- Avoid fixed heights; rely on `flex-grow` with overflow-y auto.

## Implementation Outline
1) Import primitives in `AiAssistant.tsx`: `Card`, `Button`, `Input`, `Skeleton`, `Icon`.
2) Replace header div with a `Card` header section and variable colors.
3) Refactor transcript to bubble components using variables and simple utility classes.
4) Swap composer to `Input + Button`; wire existing handlers with no logic changes.
5) Add accessibility attrs and aria-live region.

## Deliverables
- A visually consistent AI Assistant main area using app primitives and variables.
- Improved readability, consistent spacing, and accessible interactions.

## Verification
- Build and preview; test online/offline states, disabled send, skeleton during streaming, and keyboard navigation.

## Confirmation
If approved, I will refactor `components/AiAssistant.tsx` to use the design system primitives as described, verify via local preview, and leave logic intact.