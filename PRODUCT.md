# Product

## Register

product

## Users

Indonesian adults proving they are 18 or older to access an age-gated service. They
hold a KTP and enter their 16-digit NIK once. Assume low crypto literacy: most have
never used a wallet, do not know what a zero-knowledge proof is, and should never need
to. They use Kage on their own phone, on varied Android devices and screen sizes, often
in a hurry to get past a gate. The job: prove an attribute (age ≥ 18) without handing
over identity documents, then move on.

## Product Purpose

Kage is a privacy-preserving age-verification wallet. It holds the user's NIK in the OS
keystore, obtains a signed credential from the issuer, delegates ZK proving, and produces
a one-time 6-digit relay code a verifier types in. No personal data is published on-chain;
a nullifier prevents reuse. Success: a first-time user completes onboarding and produces a
working proof code without confusion, and trusts that their personal data stayed private.

## Brand Personality

Trustworthy, calm, clear. The voice of a credible institution that respects the user, not
a bank ad and not a government form. Plain, reassuring, honest about what happens to their
data. Confidence without jargon. It should feel safe to hand your national ID number to.

## Anti-references

- **Crypto / Web3 dark neon.** No neon-on-black, glowing gradients, or "degen" energy.
  It undercuts trust for everyday, non-crypto users.
- **Default unstyled React Native.** The current state: stock blue `Button`s, no
  hierarchy, no spacing rhythm, no type scale. The baseline to escape, not a style.
- **Generic government / bureaucratic portal.** No drab officialdom, dense forms, or cold
  civic-tech feel. Credible, not bureaucratic.

## Design Principles

1. **Privacy is visible.** Show what stays on the device and what leaves it. The trust
   claim is the product; make it legible, don't bury it.
2. **Calm credibility.** Institution-grade trust without coldness. Quiet confidence over
   decoration.
3. **Plain language first.** Bahasa Indonesia primary, low jargon. A user who has never
   heard of a proof or a wallet should still finish the task.
4. **One task per screen.** A single clear primary action. Minimal friction from open to
   proof code.
5. **Honest about tradeoffs.** Surface the real trust boundary (e.g. the demo's
   server-side proving) rather than hiding it.

## Accessibility & Inclusion

- Target **WCAG AA** contrast minimums on all text and interactive controls.
- **Large tap targets (44px+) and readable base type** for older and low-vision users on
  small or low-density screens.
- **Bahasa Indonesia first** copy: plain, simple language, minimal technical jargon.
