Test Environment

Browsers: Chrome (latest), Firefox (latest), Safari (latest), Edge (latest)

Devices: Desktop 1920×1080, Laptop 1366×768, iPad/tablet, Android tablet

Input Methods: Mouse, Touch

Network: Offline + Online (to verify offline-capable behavior)

Accessibility Tools: Keyboard only, Screen reader (NVDA/VoiceOver)

Traceability Matrix
Requirement	Test IDs
R1 – Navigation Flow	T1.1 — T1.6
R2 – Remove Black Fills	T2.1 — T2.5
R3 – Blue Fills for Interactive Panels	T3.1 — T3.5
R4 – Background Image Consistency	T4.1 — T4.5
R5 – Drag & Slice Interactions	T5.1 — T5.8
R6 – Cookie Quiz Flow	T6.1 — T6.6
R7 – Feedback & Messaging	T7.1 — T7.6
R8 – Component Rendering & State	T8.1 — T8.7
R9 – 16:9 Responsive Scaling	T9.1 — T9.6
Conventions

Priority: P1 (Critical), P2 (High), P3 (Normal)

Type: M (Manual), A (Automated)

Status: TBD until executed

Selectors (example): #startBtn, #nextBtn, #prevBtn, #stage, .panel, .feedback.success, .feedback.error, data-scene-index

Detailed Test Cases
R1 – Fix Applet Navigation Flow

T1.1 Start navigates to first activity

Type/Priority: M/A, P1

Pre: App opens at intro

Steps: Click #startBtn (or Next on Scene 0)

Expected: Navigates to Scene 1 (Cheesecake activity). data-scene-index increments; #progress updates; #prevBtn enabled, #nextBtn gated by scene logic.

Status: TBD

T1.2 Sequential progression per completion

Type/Priority: M/A, P1

Steps: Complete Cheesecake cut → Next; complete combine → Next; complete Pizza count → Next; complete Pizza combine → Next; finish quiz → Next

Expected: Next is disabled until each scene’s success condition; on success, Next enabled and moves forward.

Status: TBD

T1.3 Restart from completion

Type/Priority: M/A, P1

Steps: Reach Summary; click “Start Over”

Expected: Returns to intro; all scene state reset.

Status: TBD

T1.4 Back/Forward edge cases

Type/Priority: M, P2

Steps: Rapidly click Next/Previous/Arrow keys

Expected: No stuck states; scene index remains in [0..N-1]; UI stable.

Status: TBD

T1.5 State carryover prevention

Type/Priority: M/A, P2

Steps: Fail a scene, go back, return again

Expected: Scene resets to initial state (no stale success).

Status: TBD

T1.6 Deep link (optional)

Type/Priority: M, P3

Steps: Open with hash/param for scene (if supported)

Expected: Loads correct scene; navigation still works.

Status: TBD

R2 – Remove Black Container Fills

T2.1 No black backgrounds

Type/Priority: M/A, P1

Steps: Inspect .panel, .stage, header/footer

Expected: Backgrounds use gradients/blue tones/transparent; no #000 solid fills.

Status: TBD

T2.2 Background visible

Type/Priority: M, P2

Expected: Background image visible behind panels on all scenes.

Status: TBD

T2.3 Subtle separation

Type/Priority: M, P2

Expected: Borders/opacity used instead of black; contrast meets WCAG AA for text.

Status: TBD

T2.4 Dark mode artifacts

Type/Priority: M, P2

Expected: No unexpected black blocks on any scene.

Status: TBD

T2.5 Visual regression (screenshots)

Type/Priority: A, P2

Expected: No delta > threshold for removed black fills.

Status: TBD

R3 – Blue Fills for Interactive Panels

T3.1 Interactive panels use blue tones

Type/Priority: M, P2

Expected: .panel, toolbars show blue-toned backgrounds with transparency.

Status: TBD

T3.2 Buttons remain styled

Type/Priority: M, P2

Expected: Primary/ghost buttons unchanged; containers only use blue fills.

Status: TBD

T3.3 Number-line/drag zones clarity

Type/Priority: M, P2

Expected: Interactive zones visually distinct with blue emphasis.

Status: TBD

T3.4 Opacity check

Type/Priority: M, P2

Expected: Text legibility maintained; background still visible.

Status: TBD

T3.5 Theming tokens

Type/Priority: A, P3

Expected: CSS variables for colors exist and are applied.

Status: TBD

R4 – Background Image Consistency

T4.1 Visible across scenes

Type/Priority: M/A, P1

Expected: Background image visible on all screens.

Status: TBD

T4.2 Transitions don’t flash

Type/Priority: M, P2

Expected: No flicker/flash between Next/Prev transitions.

Status: TBD

T4.3 Opacity overlays

Type/Priority: M, P2

Expected: Overlays keep ≥70% background visibility.

Status: TBD

T4.4 Persistent during animation

Type/Priority: M, P2

Expected: Animations do not hide background.

Status: TBD

T4.5 Performance

Type/Priority: M, P2

Expected: 60fps-like smoothness; no stutter from large background.

Status: TBD

R5 – Drag & Slice Interactions

T5.1 Slicer activates and cuts (Cheesecake)

Type/Priority: M/A, P1

Steps: Activate slicer tool → Tap cheesecake

Expected: Whole replaced by 2 parts; success feedback; Next enabled.

Status: TBD

T5.2 Drag cheesecake halves to align

Type/Priority: M/A, P1

Expected: Snap/touch threshold recognized; on alignment, success feedback + Next.

Status: TBD

T5.3 Pizza slicing (4 parts)

Type/Priority: M/A, P1

Expected: Whole pizza converts to 4 slices.

Status: TBD

T5.4 Tap-to-count 4 pizza slices

Type/Priority: M/A, P1

Expected: Count label increments uniquely; after 4 counted, success + Next.

Status: TBD

T5.5 Drag 4 pizza slices into dropzone

Type/Priority: M/A, P1

Expected: All 4 inside .dropzone → success + Next.

Status: TBD

T5.6 Touch input parity

Type/Priority: M, P1

Expected: All slice/drag interactions work via touch.

Status: TBD

T5.7 Mis-drop feedback

Type/Priority: M, P2

Expected: Wrong positions give neutral/error feedback without crash.

Status: TBD

T5.8 Rapid interactions

Type/Priority: M, P2

Expected: No duplicate counting; debounced; stable state.

Status: TBD

R6 – Cookie Quiz Flow

T6.1 Present options Whole/Part

Type/Priority: M/A, P1

Expected: Both buttons visible and clickable.

Status: TBD

T6.2 Correct answer unlocks Next

Type/Priority: M/A, P1

Expected: Success banner; Next enabled.

Status: TBD

T6.3 Incorrect answer retry

Type/Priority: M/A, P1

Expected: Error message; choices remain; selecting correct then enables Next.

Status: TBD

T6.4 Sequence of 3 questions

Type/Priority: M, P2

Expected: 3 distinct items; final leads to summary.

Status: TBD

T6.5 Accessibility (keyboard)

Type/Priority: M, P2

Expected: Tab navigation; Enter/Space select; focus visible.

Status: TBD

T6.6 Prevent double-answers

Type/Priority: M/A, P2

Expected: After success, further clicks don’t toggle state.

Status: TBD

R7 – Feedback & Messaging

T7.1 Success feedback

Type/Priority: M/A, P1

Expected: .feedback.success shown on correct actions.

Status: TBD

T7.2 Error feedback

Type/Priority: M/A, P1

Expected: .feedback.error with retry hint on incorrect actions.

Status: TBD

T7.3 Neutral instructional messages

Type/Priority: M, P2

Expected: Default instruction text before completion.

Status: TBD

T7.4 Summary correctness

Type/Priority: M, P1

Expected: Summary lists: Whole, Part, All parts → Whole again.

Status: TBD

T7.5 Consistent tone & grade level

Type/Priority: M, P3

Expected: Language appropriate for Grade 2.

Status: TBD

T7.6 No overlap/clipping

Type/Priority: M, P2

Expected: Feedback panels don’t overlap essential UI.

Status: TBD

R8 – Component Rendering & State

T8.1 Scene unmount cleanup

Type/Priority: A, P1

Expected: No lingering event listeners on scene change.

Status: TBD

T8.2 Hooks stability

Type/Priority: A, P1

Expected: useState/useEffect/useRef lifecycles run as expected; no memory leaks.

Status: TBD

T8.3 Error handling

Type/Priority: A, P2

Expected: Rendering errors logged; app remains usable.

Status: TBD

T8.4 State isolation per scene

Type/Priority: A, P2

Expected: Completing a scene doesn’t pre-complete others.

Status: TBD

T8.5 Rapid navigation stability

Type/Priority: M, P2

Expected: No double-mount/double-render issues.

Status: TBD

T8.6 Garbage collection hint

Type/Priority: A, P3

Expected: Heap snapshots stable across long sessions.

Status: TBD

T8.7 Offline operation

Type/Priority: M, P2

Expected: All assets available; no network errors block core flow.

Status: TBD

R9 – 16:9 Responsive Scaling

T9.1 Baseline 1920×1080

Type/Priority: M/A, P1

Expected: Layout pixel-perfect at base resolution.

Status: TBD

T9.2 Scale down to 1366×768

Type/Priority: M/A, P1

Expected: Entire stage visible; content centered; text readable.

Status: TBD

T9.3 Tablet portrait/landscape

Type/Priority: M, P2

Expected: Maintains 16:9 stage; letterboxing ok; no clipped content.

Status: TBD

T9.4 Real-time resize

Type/Priority: M/A, P2

Expected: Smooth recompute of scale on window resize/orientation change.

Status: TBD

T9.5 No layout shift on navigation

Type/Priority: M, P2

Expected: Stage scale constant across scenes; no jump.

Status: TBD

T9.6 Performance at scale extremes

Type/Priority: M, P2

Expected: Interactions remain smooth when very small/very large.

Status: TBD

Automation Hints (Selectors & Scripts)

Scene index: document.body.dataset.sceneIndex or maintain in controller; assert changes on Next/Prev.

Buttons: #startBtn, #nextBtn, #prevBtn.

Feedback: .feedback.success, .feedback.error.

Quiz buttons: button[data-answer="Whole"], button[data-answer="Part"].

Slicer toggle: .tool#slicerTool / #slicerTool2.

Dropzone: .dropzone.

Slices/parts: .slice, .half.

Example pseudo (Playwright):

await page.click('#startBtn');
await expect(page.locator('[data-scene="cheesecake-cut"]')).toBeVisible();
await page.click('#slicerTool');
await page.click('#cakeWhole');
await expect(page.locator('.feedback.success')).toContainText('cut into 2 parts');
await page.click('#nextBtn');

Acceptance Checklist (Go/No-Go)

 R1 Navigation: Start→All scenes→Restart verified

 R2 Visuals: No black fills anywhere

 R3 Blue containers: Applied where needed

 R4 Background: Always visible, no flicker

 R5 Interactions: Slice, count, drag/snap work (mouse & touch)

 R6 Quiz: Retry on error, success gates Next

 R7 Feedback: Clear success/error/neutral messaging

 R8 Rendering: No leaks, clean unmounts, stable hooks

 R9 Scaling: Accurate 16:9 scaling across devices