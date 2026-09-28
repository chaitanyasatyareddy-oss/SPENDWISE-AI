---
name: spendwise-browser-verifier
description: Directs the Antigravity Browser Agent to run automated end-to-end user journey tests and produce visual verification artifacts.
triggers:
  - verify application
  - browser test
  - E2E flow
  - test dashboard
---

# Mission Statement
Perform E2E verification of SpendWise AI flows via Antigravity's integrated Chrome browser agent, capturing video recordings and screenshots to validate implementation accuracy.

# Automated Verification Steps
1. Launch dev server using system command `npm run dev` or `flutter run -d web --web-port=3000`.
2. Direct Managed Browser Agent to navigate to `http://localhost:3000` (or active local dev port).
3. Perform test user authentication flow.
4. Test manual transaction addition: Input merchant "Swiggy", amount "450", category "Food", submit form.
5. Verify transaction appears in recent transactions list and updates dashboard aggregations.
6. Trigger language toggle switch (e.g., change UI to Telugu) and verify localized string rendering across navigation tabs.
7. Output test artifacts: Capture final visual state screenshot and store session recording link in the generated Walkthrough Artifact.
