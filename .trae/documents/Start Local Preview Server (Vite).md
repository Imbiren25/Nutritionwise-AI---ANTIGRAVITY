## Identify Affected Buttons

* Target buttons where clicks sometimes don’t register: Sign Up submit, Assessment “Next”, Glossary actions

* Note conditions when it fails (mobile/desktop, loading state, validation state, overlays)

## Instrument And Observe State

* Add temporary console logs for `disabled`, `loading`, `isFormValid`, and any validation flags right before render

* Verify whether the button is truly disabled or clicks are being swallowed

## Button Component Audit

* Ensure the shared `components/ui/Button` renders a native `button` element and forwards `type`, `disabled`, and `onClick`

* Set `type="button"` for non-submit actions; `type="submit"` only within forms to avoid unintended submits

* Add `disabled:pointer-events-none` to prevent accidental clicks while disabled

* Ensure nested icons have `pointer-events-none` so they don’t intercept taps

## Fix Disabled Logic Races

* Derive a single `isDisabled = loading || !isFormValid || isBlockedByAgreements` state

* Update state changes synchronously; avoid mixing validation in multiple effects that can momentarily flip the button enabled/disabled

* For heavy validation, use `useDeferredValue` or throttle to prevent flicker

## Form Validation Consistency (SignUp)

* Confirm `isFormValid` covers: non-empty name/email, valid email, password ≥ 8, confirm matches, privacy/consent checked

* When disabled, show inline reasons (e.g., “Please accept privacy policy”) rather than only disabling the button

* Keep the red error banner only for backend errors; show an informational banner when Firebase isn’t ready

## Overlay And Z-Index Issues

* Check for overlays/tooltips/positioned elements above the button; ensure they don’t capture clicks

* Use `z-10` on actionable buttons if needed and `pointer-events-none` on decorative overlays

## Mobile Touch Specifics

* Verify tap hitbox ≥ 44px height and label/icon not capturing events

* Confirm no CSS transforms cause misaligned hit areas on iOS Safari

## Testing

* Desktop Chrome/Firefox + Mobile Safari/Chrome

* Validate stable enabled/disabled behavior under rapid typing and validation changes

* Confirm the button fires exactly once per click while `loading` prevents double submits

## Rollback Plan

* If any regression occurs, revert to previous Button props while keeping the instrumentation to locate the failing condition

