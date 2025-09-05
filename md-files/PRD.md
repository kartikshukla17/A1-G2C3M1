1. Project Overview

Product Name: Whole & Part — Interactive Storylet
Content ID: A1-G2C3M1
Version: 1.0
Target Audience: Grade 1–2 learners (approx. ages 5–8)
Platform: Web & tablet (offline-capable), classroom interactive displays (touch), and low-spec Android tablets
Primary Use Case: Teach the concepts whole, part, and reassembly using familiar food objects (cheesecake, pizza, cookie) through simple interactions: slice, count, drag-to-join, and choose (quiz). The lesson follows a narrative with characters Dee Tee, Jax, and Jane. 

A1-G2C3M1_ Whole and Part of a …

Business Goal: Create an engaging micro-lesson that can be integrated into a K–2 math curriculum module; measurable learning outcomes for whole/part recognition and counting.

2. Learning Objectives (measurable)

Identify a whole: Student can correctly label an object as a whole.

Identify a part: Student can correctly label an object as a part/piece.

Counting parts: Student can count how many equal parts a whole has been divided into (e.g., 2 for cheesecake, 4 for pizza).

Reassembly concept: Student understands that putting all parts together recreates the original whole.

Apply knowledge in quick assessment: Student achieves ≥80% on the in-lesson three-question whole/part quiz.

Success criteria for the lesson: at least 70% of learners complete the activity and record correct answers at the end; average time-on-task consistent with Grade 1 attention spans (~3–6 minutes for the module).

3. High-level User Flow & Activity Structure
Flow summary

Intro / Scene-setting: Characters and order revealed (cheesecake, pizza, cookie). 

A1-G2C3M1_ Whole and Part of a …

Cheesecake scene (cut into 2): User taps slicer, taps cheesecake → cheesecake splits into 2 parts. System: feedback confirming parts made.

Reassembly (cheesecake): Drag each part back to reassemble whole; confirm “All the parts together make the whole again.” 

A1-G2C3M1_ Whole and Part of a …

Pizza scene (cut into 4): Use same slice loop to cut pizza into 4 parts; user taps parts to count (taps increment counter, visual highlight). 

A1-G2C3M1_ Whole and Part of a …

Reassembly (pizza): Drag-and-drop parts to reassemble the pizza.

Cookie quiz: 3 quick whole/part multiple-choice screens (tap “Whole” or “Part”). Immediate feedback on choice; retry allowed. 

A1-G2C3M1_ Whole and Part of a …

Summary / Reinforcement screen: Definition reminders and CTA to start over or proceed to related lessons.

Activity length

Target time: 3–6 minutes total.

Micro interactions only (tap, drag, simple taps to count).

4. Detailed Scene & Interaction Specs

Note: Screen names are used as identifiers for development and QA.

Scene 0 — Splash / Intro Screen

Purpose: Introduce characters and items (Cheesecake, Pizza, Cookie).

UI elements: Title header, character art (Dee Tee, Jax, Jane), “Start” button, small narration/play voice button.

Interaction: Tap “Start” → Scene 1.

Acceptance: Start button visible, narration plays (if enabled), accessible labels for screen readers.

Scene 1 — Cheesecake (Cut into 2)

Objective: Demonstrate whole → parts (2).

Elements: Cheesecake art centered; slicer icon; instruction copy: “Tap the slicer, then tap the cheesecake.” (from PDF). 

A1-G2C3M1_ Whole and Part of a …

Interaction Flow:

User taps slicer (slicer toggles active state).

User taps cheesecake → animate slicing sequence into 2 equal parts.

Show labels: Part 1 / Part 2.

Provide immediate feedback: “Nice work, Jax! You cut the whole cheesecake into parts.” (copy from PDF). 

A1-G2C3M1_ Whole and Part of a …

Edge cases: If user taps cheesecake without selecting slicer, prompt “Tap the slicer first.”

Success state: Both parts visible; next CTA “Tap ▶ to continue”.

Scene 2 — Cheesecake Reassembly (Drag)

Objective: Student drags parts to recombine and confirm that parts make whole.

Elements: Two parts positioned apart; drop target area / snap grid.

Interactions:

Drag each part to the center → snap & play micro animation (click & shine).

When both parts present, play success animation + message: “Yay! All the parts together make the whole again.” 

A1-G2C3M1_ Whole and Part of a …

Acceptance: Parts snap correctly and cannot be glued incorrectly (prevent overlap outside target).

Scene 3 — Pizza (Cut & Count)

Objective: Show a whole cut into 4 parts; teach counting parts.

Elements: Pizza art, slicer (reuse loop), tap-to-count overlays on parts, counter UI.

Interaction Flow:

Use same slicer loop as cheesecake to cut pizza into equal 4 slices (note: doc states "use same loop as used to cut into two parts"). 

A1-G2C3M1_ Whole and Part of a …

After slicing, prompt: “Count the number of parts the whole pizza is cut into. Tap each part to count them.” 

A1-G2C3M1_ Whole and Part of a …

Each tap on a slice increments counter and highlights that slice; show numbers (1,2,3,4).

Success: On reaching 4, show “Yay! Good job!” and CTA to reassemble.

Scene 4 — Pizza Reassembly (Drag)

Objective: Drag each of the 4 pizza parts back to center.

Acceptance: When all 4 parts are in place, show success text: “Yay! All the parts of pizza together make the pizza whole again.” 

A1-G2C3M1_ Whole and Part of a …

Scene 5 — Cookie Quiz (3 quick questions)

Objective: Quick assessment — identify Whole vs Part.

Elements: Cookie image (varies: whole, partial), two buttons: [Whole] [Part], immediate feedback overlays.

Flow per Q:

Show cookie image → user taps Whole or Part.

Wrong answer: show corrective tip: “Look closely — that’s just a piece, not the whole cookie. Try again!” (copy used in PDF). 

A1-G2C3M1_ Whole and Part of a …

Correct answer: provide positive reinforcement and move to next question.

Retry: Allow multiple attempts; limit attempts per question (recommended 2–3) with gentle remediation.

Acceptance: Provide summary score (e.g., 3/3) and encouragement.

Scene 6 — Final Reinforcement / Restart

UI: Summary of core takeaways (definitions):

Whole = one complete object

Part = a piece of the object

All parts together make the whole again

Buttons: Restart / Next Lesson / Share progress.

5. Content / Copy (canonical strings pulled from PDF)

Use the following copy verbatim where appropriate (for fidelity):

“I want to cut the cake into 2 pieces!” 

A1-G2C3M1_ Whole and Part of a …

“Tap the slicer, then tap the cheesecake.” 

A1-G2C3M1_ Whole and Part of a …

“Nice work, Jax! You cut the whole cheesecake into parts.” 

A1-G2C3M1_ Whole and Part of a …

“Whole = One complete object!” 

A1-G2C3M1_ Whole and Part of a …

“Part = A piece of the object!” 

A1-G2C3M1_ Whole and Part of a …

“Let’s check, Jax! Count the number of parts the whole pizza is cut into. Tap each part to count them.” 

A1-G2C3M1_ Whole and Part of a …

Quiz messages (correct/wrong) as shown in PDF. 

A1-G2C3M1_ Whole and Part of a …

Note: Provide voice-over/narration files for the same copy (optional but recommended for early grades).

6. Visual Design & Assets

Base aspect ratio: 16:9 (1920×1080 base), responsive down to 1024×600.

Style: Friendly cartoon characters, large, high-contrast food assets. Use bright saturated colors appropriate for K–2.

Characters: Dee Tee, Jax, Jane (static poses + 3 emotion states: neutral/instructional, cheering/success, confused).

Assets needed:

Cheesecake whole + 2 equal slice sprites + reassembly animation frames.

Pizza whole + 4 slice sprites + reassembly frames.

Cookie images (whole, half, piece) for quiz.

Slicer icon & active state animation.

Success and error badges (green check, red cross).

UI chrome: buttons, counters, progress bar, narrator bubble.

Animations: Slicing animation, drag & snap animation, highlight on tap, rewarding confetti or sparkle on success.

7. Interaction & Accessibility Requirements

Input methods: Touch, mouse, keyboard (for accessibility), remote control (optional).
Touch targets: Minimum 44×44 px (recommended 48×48) for all tappable elements.
Drag behavior: Parts must be draggable with inertia disabled; snap to defined targets.
Counting taps: Each slice can be tapped once to count — visually mark already-counted slices and disable further count taps (or allow but do not increment).
Accessibility:

Screen-reader labels for all interactive elements.

Color contrast compliant with WCAG AA for text.

Option to enable narration and closed captions for text.

Provide keyboard alternatives: arrow/enter to select, space to activate drag via focus + move controls.
Localization: Copy externalized for easy translation; spacing and font fallback for multi-language support.

8. Technical Requirements

Framework & stack (recommended):

Frontend: React (or lightweight React alternative), single-page micro-app.

Assets: All image/sfx packaged for offline use.

Storage: LocalStorage or IndexedDB for progress (offline).

Media: Optional audio playback; fallback to captions if audio not available.

Packaging: Serve as single HTML bundle (no CORS issues) for classroom offline installs.

Performance:

Load time: <2s on classroom devices (preload images).

Animations: 60fps target on target devices; reduce animation when CPU constrained.

Instrumentation & analytics:

Track events: lesson_start, scene_complete, slice_action, drag_complete, quiz_answer (with correctness), lesson_end, time_spent.

Respect privacy: send aggregated telemetry; offline-first queue with opt-in.

Dependencies: Minimal 3rd-party libs (avoid heavy animation libs). Use CSS transforms for animations.

9. Data Model & Content Configuration

Lesson JSON (example schema):

{
  "id":"A1-G2C3M1",
  "title":"Whole and Part of a Whole",
  "scenes":[
    {"id":"cheesecake_cut","type":"slice","parts":2,"copyKeys":["cheesecake.instruction"]},
    {"id":"cheesecake_reassemble","type":"reassemble","parts":2},
    {"id":"pizza_cut","type":"slice","parts":4},
    {"id":"pizza_reassemble","type":"reassemble","parts":4},
    {"id":"cookie_quiz","type":"quiz","questions":3}
  ],
  "assets":["cheesecake.png","pizza.png","cookie_variants.png","slicer.svg"]
}


This allows future content reuse (change parts value to vary difficulty).

10. Success Metrics & Analytics

Primary metrics:

Completion rate: % learners who reach final reinforcement. Target ≥70%.

Quiz accuracy: Average correct answers on cookie quiz. Target ≥80% for Grade 1-2.

Interaction time: Median time per scene and total lesson time. Expected 3–6 minutes.

Retries: Average number of wrong attempts per quiz item; goal ≤1.5.

Reassembly success: % learners who can reassemble on first attempt.

Collect telemetry for these events with timestamps. Provide teacher dashboard indicators (class average, distribution).

11. Acceptance Criteria & QA Checklist

Functional:

Slicer must toggle and apply to the correct object only.

Cheesecake splits into exactly 2 equal parts; pizza into 4 equal slices. 

A1-G2C3M1_ Whole and Part of a …

Drag-and-snap must allow reassembly for both cheesecake and pizza.

Tap-to-count: each tap must mark and increment counter, final count equals number of parts.

Quiz shows correct/wrong messages exactly as copy prescribes; allow retries.

Accessibility:

All actionable elements reachable via keyboard and readable by screen reader.

Captions available for narration/audio.

Performance:

Verify load and animation performance on minimum spec tablet.

Content fidelity:

All dialog strings and feedback messages match the PDF copy (where shown) or teacher-approved variants. 

A1-G2C3M1_ Whole and Part of a …

12. Testing Scenarios (sample)

Happy path: User slices cheesecake → reassembles → slices pizza → counts 4 → reassembles → completes quiz with 3 correct answers.

Incorrect quiz choice: User selects wrong answer → receives specific corrective message → retries and eventually answers correctly. 

A1-G2C3M1_ Whole and Part of a …

Partial interaction: User attempts to drag parts without enabling slicer — ensure correct guidance prompt.

Accessibility check: Navigate via keyboard/Screen Reader, ensure all elements announced.

Offline mode: Load lesson with network disabled; all assets and telemetry queued.

13. Future Enhancements & Variants

Variable partition counts: Make parts dynamic (2,3,4,6) to extend to fraction basics.

Equivalence extension: Show equivalent partitions (e.g., 1/2 vs 2/4) on next lessons.

Progression path: Sequence lessons from whole/part → simple fractions → equivalent fractions (natural next module).

Teacher mode: Batch reporting, ability to set lesson difficulty for classroom.

Audio narration in multiple languages and accessibility voice options.

Rewards & profile: Save badges for completion.

14. Deliverables & Milestones (suggested)

Design handoff (1–2 weeks): UI mockups for all 6 scenes, asset index.

Prototype (2–3 weeks): Interactive web prototype with basic slicing, drag, and quiz.

Alpha QA (1 week): Internal testing on target devices.

Beta (1 week): Teacher/classroom pilot, collect telemetry.

Launch & packaging (1 week): Offline packaging & final QA.

(Timelines are suggested planning artifacts — adjust to your sprint cadence.)

15. Risks & Mitigations

Risk: Young learners may misinterpret tap/drag affordances.
Mitigation: Add contextual micro-hints + short demo animation on first open.

Risk: Performance issues on low-end tablets.
Mitigation: Optimize assets, provide “low-motion” toggle.

Risk: Localization may break UI spacing.
Mitigation: Use dynamic layout and test with longest target strings.

16. Appendix — Key extracts from source (for dev / content team)

“Tap the slicer, then tap the cheesecake.” (instruction). 

A1-G2C3M1_ Whole and Part of a …

“Drag each part to bring them together.” (reassembly instruction). 

A1-G2C3M1_ Whole and Part of a …

“Count the number of parts the whole pizza is cut into. Tap each part to count them.” (counting instruction). 

A1-G2C3M1_ Whole and Part of a …

Cookie quiz copy: includes both corrective (“Look closely — that’s just a piece… Try again!”) and positive (“That’s correct — it’s a complete cookie…”) messages