Overview

The A1‑G2C3M1 repo implements an interactive learning module about whole and part of a whole. A PDF specification (Whole and Part of a Whole) provided by the user outlines the intended narrative, interactions and UI. I compared the repository code against the PDF and noted several discrepancies. This document lists the differences and suggests precise updates. Citations from the spec and code are provided for reference.

Critical mismatches
Area	Spec expectation (from PDF)	Current implementation (repo)	Recommended changes
Cheesecake slicing	Students cut the cheesecake into two pieces, then drag the two parts back together. The narrative explicitly says: "I want to cut the cake into 2 pieces!" and later shows only Part 1 and Part 2.	scenes.js sets targetSlices = 4 for the cheesecake slice scene
GitHub
, and WholePartsState defines four cheesecake slices. The slicing setup uses maxSlices: 4
GitHub
.	Change the cheesecake slicing to 2 slices:

Set targetSlices = 2 and maxSlices: 2 in createCheesecakeSliceScene() and setupCheesecakeSlicing().

Adjust the reassembly logic to expect 2 slices instead of 4. Make sure part labels show only Part 1 and Part 2.

Update feedback strings to reflect “2 parts” instead of “4 parts”. |
| Pizza slicing & counting | The pizza should be cut into four parts. After cutting, Dee Tee asks how many parts there are; Jax taps each slice to count them, and they conclude the pizza is cut into 4 parts. | createPizzaSliceScene() sets targetSlices = 8
GitHub
 and setupPizzaSlicing() passes maxSlices: 8 for radial cutting. Counting logic validates against 8 slices and transitions only when the user count equals 8
GitHub
. Reassembly also expects 8 slices
GitHub
. | Standardise pizza slicing to 4 parts:

Set targetSlices = 4 and maxSlices: 4 in pizza slice scene and setup.

Adjust counting logic to expect 4 taps. After each tap, darken/shadow the slice and update a visible counter (Part 1 to Part 4).

Modify reassembly to handle 4 slices and transition after all four parts are placed.

Ensure the narration matches the spec by using the copy “Yes, this whole pizza is cut into 4 parts.”. |
| Reuse of cutting logic | The spec instructs that pizza cutting should reuse the same loop used for cheesecake: "Use the same loop as used to cut into two parts". | Cheesecake slicing uses a dedicated scene with a target of 4 (should be 2), while pizza slicing uses a separate scene with its own state and an 8‑slice radial cutting logic. | Extract a generic cutLoop({targetSlices}) helper and reuse it for both cheesecake and pizza scenes. The helper should accept the number of slices and slicing orientation (horizontal for cheesecake, cross for pizza) and handle tool activation, slice counting and transition. |
| Counting feedback | The spec shows a progressive count with slices being darkened/marked as the learner taps each part. It also displays labels Part 1, Part 2, etc.. | In the current pizza slice scene, counting happens via a numeric input (userCount) and a submit button. Slices are not darkened; the learner must type or increment a count and press a button
GitHub
. | Remove the userCount/submit pattern. Instead, when a slice is tapped, darken it (add a “selected” class) and automatically increment the count. Show labels Part 1, Part 2, Part 3 and Part 4 next to the slices. When all four parts are tapped, display the message “Yay! Good job! Yes, this whole pizza is cut into 4 parts.”. |
| Cookie quiz content | The quiz comprises three questions asking whether the displayed cookie is a whole or a part. The learner selects Whole or Part, receives immediate feedback, and then proceeds to the next question. | The createCookieQuizScene() in scenes.js defines a completely different quiz with multiple‑choice fraction questions (1/2, 1/3, etc.) and a drag‑drop activity
GitHub
. Data in data.js defines the correct whole/part quiz, but this scene ignores it. | Replace the fraction‑based quiz with the spec’s whole/part quiz:

Use the questions defined in appData['content-ui']['cookie_quiz'] (types piece and full).

Display each cookie image in the middle panel. Show two buttons labelled Whole and Part on the right.

After a wrong answer, display the hint “Try again!”. After a correct answer, show the appropriate message and enable the Next arrow.

Remove fraction options and drag‑drop logic. |
| Cookie quiz layout | Each cookie quiz screen is split into three vertical panels: left (character & dialogue), middle (cookie image), and right (question, options and feedback). There are two large buttons (Whole, Part) in the right panel; the answer feedback appears below them. | The current implementation uses a generic mini‑react template; layout details are unclear and the fraction quiz does not match the three‑panel design. | Implement a three‑column flex/grid layout for the cookie quiz in index.html/CSS. Use semantic regions (<aside>, <main>, <section> or <div class="left-panel">, etc.). The right panel should hold the question text, two option buttons, and a feedback area that updates based on the selected option. Ensure the layout is responsive and visually matches the spec. |
| Scene progression & navigation | The spec always shows previous/next chevrons and a scene progress indicator. Each scene transitions only when the learner completes the required action (e.g., slicing, counting, drag reassembly, answering quiz). | Some scenes in the repo auto‑advance on timers (e.g., auto‑progress in scenes.js after targetSlices are cut
GitHub
). In the quiz, scenes may advance automatically after feedback. Navigation controls are not consistently visible in the provided HTML. | Ensure every scene exposes Next and Previous buttons (disabled when actions are incomplete), along with a progress indicator “Scene X of Y”. Replace automatic timers with explicit navigation triggered by user actions. |
| Copy differences | Several phrases differ slightly. For example, the spec emphasises "Tap the slicer 🗡️, then tap the cheesecake", while data.js lists the tool name separately ("Slicer (2 parts)") and uses generic hints. The spec shows Dee Tee’s line: "If we put all the 4 parts back, do we get the whole again, Dee Tee?". Some of these lines are missing or altered in data.js and whole-parts-state.js. | Text in data.js and whole-parts-state.js sometimes abbreviates or paraphrases the spec (e.g., “Tap ▶ know what Dee Tee says ?” instead of “Tap ▶ to see what Dee Tee says.”) and occasionally omits punctuation. | Update all English strings in data.js and state definitions to match the PDF exactly. For example:

In the cheesecake intro, set speech: “I love cheesecake! Let’s start with that.

I want to cut the cake into 2 pieces!\nTap the slicer 🗡️, then tap the cheesecake.”

For pizza: “I’m so hungry! This pizza looks delicious. Let’s eat it.\n\nCut the pizza into pieces!” and “Use the same loop as used to cut into two parts”.

For counting: “Tap each part to count them” and list the part labels as the learner taps.

Ensure Dee Tee’s questions and confirmations are word‑for‑word matches to the spec. |
| Slicing orientation | The cheesecake slice is a simple straight cut into two equal halves; the pizza is cut into four equal quarters using two perpendicular cuts. | setupCheesecakeSlicing() uses 'both' slice directions and allows up to 4 slices
GitHub
; setupPizzaSlicing() uses 'radial' slices with up to 8 pieces
GitHub
. | Modify the slicing algorithm parameters:

For cheesecake: allow only one straight cut (horizontal or vertical) and return two equal parts.

For pizza: enforce exactly two perpendicular cuts to produce four quarter slices; hide the slicer after cutting.

Remove radial cutting and extra slice directions. |
| Reassembly mechanics | Learners drag each part back to the plate; when all parts are assembled, a caption says "All the parts together make the whole again". The pizza reassembly reuses the same drag‑and‑snap loop as the cheesecake. | Reassembly scenes for cheesecake and pizza exist but use different implementations. Pizza reassembly is tied to the erroneous 8‑slice state. | Extract a common reassemblyLoop({parts}) helper used by both foods. Each part should snap to a central area; after all parts are placed, display the caption and enable Next. The caption string should be the same in both scenes. |
| Summary screen | The summary simply restates the definitions: "Whole = One complete object", "Part = A piece of the object", "All the parts together make the whole again" and offers a Start Over button. | The current summary scene in scenes.js shows a score percentage, an activity-completion trophy, lists of "cheesecake learning", "pizza learning" and "cookie learning", and performance messages
GitHub
. This structure doesn’t match the spec or grade level. | Simplify the summary: remove scores and performance messages. Display the three concept statements and a Start Over button that resets the scene system. Optionally show icons for cheesecake, pizza and cookie with their statuses (done/pending). |

Additional recommendations

Three‑panel layout in HTML/CSS – Create three distinct panels (left, center, right) within .main-content for narrative text, interactive object (e.g., food image), and controls/feedback. This will ensure consistent spacing and align with the spec’s visuals.

Tool rail icons – Use clear slicer icons (🗡️) and ensure they are disabled when not needed. The spec uses darkening/shadow cues; implement CSS classes to dim tapped parts or disable buttons when appropriate.

Scene progress indicator – Include a “Scene X of Y” label using appData.standard-ui.labels.progress. Update the progress when navigating scenes.

Accessibility – Add aria-labels to buttons, interactive parts and scenes. Provide keyboard controls (arrow keys for drag directions, Enter to confirm) as described in appData.standard-ui.accessibility.

Internationalization – data.js already includes a Spanish placeholder. After correcting English strings, mirror the same changes in the Spanish section.

Scaffolding labels – The spec consistently shows small labels on each screen (e.g., “Question / context”, “Interaction instruction”, “Numpad, buttons, feedback”). These provide learners with cues about which area of the UI they are looking at. The current implementation doesn’t show these labels. Add them as subtle but visible captions within each panel of the three‑column layout. Ensure they remain present throughout the experience and are localized along with other text.

Conclusion

The current implementation contains significant differences from the PDF specification. Most critically, the slice counts for cheesecake and pizza are incorrect, the cookie quiz content diverges completely, and certain UI behaviours like darkening selected slices, reusing loops and showing consistent navigation are not implemented. Addressing the recommended changes above will align the repository with the specification and deliver the intended learning experience.