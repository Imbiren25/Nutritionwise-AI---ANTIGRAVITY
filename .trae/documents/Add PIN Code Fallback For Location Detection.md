## Goal
Enable location classification when geolocation is unavailable or denied using India PIN code (postal code). Keep geolocation as primary and PIN as reliable fallback.

## UI Changes (StepD)
- Add an input labeled "PIN Code (India)" with 6‑digit validation.
- Add a button "Detect via PIN" next to the input.
- Show a status line with detected District/State and the suggested classification.
- Keep existing manual radio options for override.
- If geolocation fails or is denied, show a message and prompt the PIN flow.

## Logic & Heuristics
- Validate PIN: `^\d{6}$`. If invalid, show error and do not call API.
- Online path: call `https://api.postalpincode.in/pincode/{PIN}` (public India Post API).
  - Parse first `PostOffice` entry: `District`, `State`, `Block`, `Division`, `OfficeType`.
  - Suggest classification using heuristics:
    - Urban – Non Slum: metro districts (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad) or `OfficeType` head/sub office in large municipal divisions.
    - Rural: `Block` present and non‑metro district, or `Branch Office` in non‑municipal area.
    - Peri‑Urban: metro district but `Block` indicates outlying area.
    - Tribal: if `Division`/`Block` known tribal areas (fallback to manual unless detected from curated list).
  - Set `data.sectionD.location` to the suggested value and show a "Detected District/State" message; allow user to change via radios.
- Offline path: skip API; keep manual selection; show "Offline – enter classification manually".

## Implementation Details
- File: `components/steps/StepD.tsx`
  - State: `pinCode`, `pinStatus`, `pinError`, `isDetectingPin`.
  - Import and use `useOnlineStatus()` to decide API call.
  - New function `detectByPin()` with fetch, parse, heuristics, and `updateData('sectionD', {...})`.
  - Accessibility: `aria-live` region for status, input `aria-invalid` when errors.
- No changes to global types; classification already uses `AssessmentData['sectionD']['location']`.

## Safety & Privacy
- Do not store PIN code beyond current session; use only to suggest classification.
- Handle API errors gracefully; keep manual selection usable.

## Testing & Verification
- Denied geolocation: shows prompt for PIN, PIN detection works and sets classification.
- Invalid PIN: shows validation error; no network call.
- Offline: PIN button disabled; manual selection available.
- Typecheck and preview verification.

## Request for Confirmation
Approve this plan to implement the PIN code fallback in StepD, including UI, validation, online lookup, heuristics, and graceful offline handling.