Introduction

The Whole and Part of a Whole learning applet is designed to introduce Grade 2 students to the concepts of wholes and parts through interactive activities involving cheesecake, pizza, and cookies. The applet currently requires improvements to ensure smooth navigation, clear visual feedback, consistent UI styling, and bug-free interactions.

The applet must guide students seamlessly from the introductory story through interactive cutting, counting, and combining activities, to quizzes and finally a completion screen, maintaining an engaging and child-friendly experience.

Requirements
Requirement 1: Fix Applet Navigation Flow

User Story:
As a student, I want the applet to progress through all activities in sequence when I click the start button, so I can complete the lesson without getting stuck.

Acceptance Criteria

WHEN the user clicks the Start button on the intro screen THEN the applet SHALL navigate to the first cheesecake activity.

WHEN the user completes any activity THEN the applet SHALL automatically enable the Next button for progression.

WHEN the applet transitions between activities THEN it SHALL preserve scene state and component rendering seamlessly.

WHEN the user reaches the completion screen THEN the applet SHALL provide a Restart option that resets state and returns to the intro screen.

Requirement 2: Improve Visual Design and Remove Black Container Fills

User Story:
As a student, I want the applet interface to look visually appealing with a clean, playful design, so I can focus on the learning content without distraction.

Acceptance Criteria

WHEN the applet loads THEN no core containers SHALL have black background fills.

WHEN displaying any activity screen THEN the background image SHALL remain visible behind panels and stage areas.

WHEN container separation is needed THEN the applet SHALL use blue fills or subtle opacity overlays instead of solid black.

WHEN interactive stages are displayed THEN their panels SHALL maintain soft edges, rounded corners, and minimal visual clutter.

Requirement 3: Use Blue Fills for Interactive Panels

User Story:
As a student, I want important interactive areas to stand out visually, so I can clearly identify where to interact during activities.

Acceptance Criteria

WHEN activity panels require visual emphasis THEN they SHALL use blue-based fills with soft shadows and transparency.

WHEN content requires separation from the background THEN subtle blue-toned overlays SHALL be applied.

WHEN displaying buttons and controls THEN their existing visual design SHALL remain intact while panels adopt blue fills.

WHEN visualizing number line or drag-drop activities THEN the applet SHALL highlight interactive zones using blue containers.

Requirement 4: Maintain Background Image Consistency

User Story:
As a student, I want the background image to remain visible and cohesive throughout the applet, so the experience feels unified and engaging.

Acceptance Criteria

WHEN the applet loads THEN the background image SHALL be clearly visible across all screens.

WHEN transitioning between screens THEN the background SHALL remain consistent without flickering or full redraws.

WHEN overlay panels are used THEN they SHALL maintain at least 70% background visibility through transparency.

WHEN stage animations occur THEN the background image SHALL remain persistent and unaffected.

Requirement 5: Fix Drag-and-Drop & Slicing Interactions

User Story:
As a student, I want to drag parts and slice items smoothly, so I can engage intuitively with the learning content.

Acceptance Criteria

WHEN using the slicer tool THEN the applet SHALL allow single-click cutting with smooth visual transitions.

WHEN dragging cheesecake or pizza parts THEN pieces SHALL snap together when aligned correctly.

WHEN dragging parts into target zones THEN valid drops SHALL trigger immediate visual success feedback.

WHEN drag-and-drop is active THEN the applet SHALL support both mouse and touch events seamlessly.

Requirement 6: Enhance Cookie Quiz Flow

User Story:
As a student, I want to identify whether cookies represent wholes or parts through a simple quiz, so I can confirm my understanding.

Acceptance Criteria

WHEN a cookie is displayed THEN the user SHALL choose between Whole or Part.

WHEN an incorrect option is selected THEN the applet SHALL display error feedback and allow retry without blocking progression.

WHEN the correct option is selected THEN the applet SHALL display success feedback and enable the Next button.

WHEN the quiz completes THEN the applet SHALL automatically proceed to the summary screen.

Requirement 7: Improve Feedback and Success Messaging

User Story:
As a student, I want instant visual feedback for my actions, so I can learn effectively through trial and correction.

Acceptance Criteria

WHEN a correct action is performed THEN the applet SHALL display green success highlights and a confirmation message.

WHEN an incorrect action is performed THEN the applet SHALL display red error highlights with retry instructions.

WHEN a pending action is required THEN the applet SHALL provide neutral instructional feedback.

WHEN activities complete THEN a summary panel SHALL highlight the key concept:

Whole = One complete object

Part = A piece of the object

All parts together make the whole again

Requirement 8: Debug and Fix Component Rendering

User Story:
As a developer, I want consistent component rendering and state handling, so that the applet works reliably across all activities.

Acceptance Criteria

WHEN the Mini-React rendering system is used THEN component states SHALL persist correctly across scene transitions.

WHEN useState, useEffect, and useRef are used THEN components SHALL manage updates without memory leaks.

WHEN switching between activities THEN unused components SHALL unmount cleanly without leftover event listeners.

WHEN errors occur during rendering THEN they SHALL be logged and handled gracefully without freezing the applet.

Requirement 9: Ensure Full 16:9 Responsive Scaling

User Story:
As a student, I want the applet to scale perfectly on my device, so I always see the full content clearly regardless of resolution.

Acceptance Criteria

WHEN the applet loads THEN it SHALL maintain a 1920×1080 design baseline.

WHEN viewed on smaller screens THEN the applet SHALL apply proportional CSS transform scaling to maintain a perfect 16:9 ratio.

WHEN scaling occurs THEN content SHALL remain centered both vertically and horizontally.

WHEN device orientation changes THEN the applet SHALL automatically recalculate scaling in real-time.