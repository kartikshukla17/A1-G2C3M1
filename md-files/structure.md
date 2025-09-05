Directory Layout
whole-and-part-applet/
├── index.html                 # Main entry point (English)
├── index-en.html              # Duplicate English version
├── css/
│   ├── styles.css            # Global styles, responsive scaling, animations
│   ├── components.css        # Component-specific styling
│   └── themes.css            # Theme variables and color tokens
├── js/
│   ├── mini-react.js         # Lightweight custom React-like framework
│   ├── data.js              # Internationalization and app data
│   ├── whole-part-applet.js  # Main application logic & scene controller
│   ├── responsive-scaling.js # 16:9 scaling system for adaptive viewports
│   └── events.js            # Drag, snap, quiz, and slicer interaction logic
├── assets/
│   ├── cheesecake.png       # Cheesecake illustrations
│   ├── pizza.png            # Pizza illustrations
│   ├── cookies.png          # Cookie quiz illustrations
│   ├── icons/               # Slicer, feedback, navigation icons
│   └── background.png       # Primary background image
└── .kiro/
    ├── specs/               # Product & design specifications
    └── steering/            # AI-assisted developer workflows

Component Architecture
Main Application Flow
WholeAndPartApplet (Root Component)
├── IntroScreen
├── CheesecakeActivity
│   ├── SlicerTool
│   ├── DragAndDrop
│   ├── FeedbackPanel
├── PizzaActivity
│   ├── SliceCounter
│   ├── DragAndDrop
│   ├── FeedbackPanel
├── CookieQuiz
│   ├── QuestionCard
│   ├── AnswerButtons
│   └── FeedbackPanel
├── SummaryScreen
└── EndScreen

Component Responsibilities
Core Components

WholeAndPartApplet → Root state management & navigation controller

IntroScreen → Story setup, character introduction, and activity objectives

CheesecakeActivity → Demonstrates whole vs. part using a 2-piece example

PizzaActivity → Extends concept with a 4-piece division and tap-to-count

CookieQuiz → Interactive assessment reinforcing whole vs. part concepts

SummaryScreen → Displays completed learnings and final recap

EndScreen → Restart flow and session completion feedback

UI Components

SlicerTool → Handles cutting interactions

DragAndDrop → Enables combining pieces to form wholes

FeedbackPanel → Dynamic feedback (success, error, retry)

NavigationFooter → Consistent navigation with Next / Previous buttons

Styling Organization
CSS Structure
/* Global Variables & Resets */
:root {
  --primary-bg: #0e1726;
  --accent: #ffb703;
  --success: #26a269;
  --error: #e63946;
  --muted: #9fb3c8;
}
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Layout Systems */
.responsive-wrapper { transform: scale(var(--scale-factor)); }
.app-container { display: grid; grid-template-rows: auto 1fr auto; }

/* Component Styles */
.header-section { padding: 12px; font-weight: bold; }
.visualization-panel { display: flex; justify-content: center; }
.button-panel { display: flex; gap: 10px; }
.feedback-panel { border-radius: 8px; padding: 10px; }

/* Activity-Specific Styles */
.cheesecake-activity { ... }
.pizza-activity { ... }
.cookie-quiz { ... }

/* Interactive Elements */
.number-line { position: relative; }
.diamond-pointer { animation: blink 1.2s infinite; }
.fraction-display { font-size: 1.4rem; }

/* Responsive & Animations */
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.5} }
@media (max-width: 1280px) { .app-container { padding: 12px; } }

Design System

Colors: Centralized via CSS variables for consistency

Typography: Poppins + system fallback with responsive scaling

Spacing: Uses rem-based modular scale

Reusable Components: Modular button, feedback, and layout styles

Data Management
Internationalization Structure
AppData = {
  currentLanguage: "en",
  languages: { en, id },
  translations: {
    en: {
      dialogs: { intro, summary, end },
      cheesecake: { instructions, feedback },
      pizza: { slicing, counting, feedback },
      cookieQuiz: { questions, buttons, feedback },
    },
    id: {
      /* Indonesian translations */
    }
  }
};

State Management Patterns

Local State: Managed using useState hooks

Props Flow: Parent-to-child for dynamic content

Callbacks: Child-to-parent for user actions

Global State: Scene index + current progress handled in root

File Naming Conventions
JavaScript Files

kebab-case: File names (whole-part-applet.js, mini-react.js)

camelCase: Variables and functions

PascalCase: Component names

UPPER_CASE: Constants & configuration keys

CSS Classes

kebab-case: .pizza-activity, .feedback-panel

BEM-like: .component__element--modifier

Semantic: .feedback-success, .slicer-tool, .drag-target

Asset Organization

Descriptive Names: cheesecake-halves.png, pizza-slice.png

Consistent Extensions: .png for images, .js for scripts, .css for styles

Logical Grouping: All related illustrations under assets/

Development Patterns
Component Development Workflow

Functional Components Only: Avoid class-based components

Hooks First: useState, useEffect, useRef for state and DOM logic

Props Validation: Implicit validation through strict usage

Direct Event Binding: Lightweight, avoids unnecessary abstraction

Code Organization Principles

Single Responsibility: Each file has a dedicated purpose

Composable Components: Build complex UIs from smaller parts

Reusability First: Extract common patterns into shared components

Maintainability: Predictable, consistent naming and structure