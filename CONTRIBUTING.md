# Contributing to CareTransition

Thank you for your interest in contributing to CareTransition. We welcome contributions that align with our commitment to patient safety, privacy, and deterministic software engineering.

## Guiding Principles

1. **Zero External Data Transmission:** Never introduce network calls that transmit user or patient input to third-party servers, analytics platforms, or external AI models.
2. **Medical Safety First:** Never write features that diagnose conditions, calculate prescription dosages, or automatically resolve conflicting prescriptions.
3. **Explicit User Confirmation:** Information extracted from discharge notes must always require the user's explicit review and confirmation before being added to local storage.
4. **Deterministic Code:** Parsing routines must use predictable, tested rule-based methods rather than generative models that may hallucinate medical details.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Verify production build:
   ```bash
   npm run build
   ```

## Pull Request Checklist

- [ ] New features include corresponding Vitest tests.
- [ ] No tracking pixels, analytics, or remote API calls introduced.
- [ ] Accessible UI standards (color contrast, clear font sizes, keyboard navigation).
- [ ] `npm test` and `npm run build` pass with zero errors.

