Core Technologies
Frontend Framework

Custom Mini-React Implementation: Lightweight React-like library for highly interactive educational applets

useState → Local state management for components

useEffect → Lifecycle-based side effects and scene transitions

useRef → DOM manipulation for drag-and-drop & snapping

Functional, modular, and reusable component structure

Languages & Standards

JavaScript (ES6+):

Template literals, destructuring, arrow functions, const/let

Modular event-driven architecture for better reusability

HTML5:

Semantic structure for improved accessibility

Screen-reader-friendly attributes for inclusive design

CSS3:

CSS variables for theme and color customization

Flexbox + Grid for layout

Hardware-accelerated transitions & animations

Responsive Design System

Target Resolution: 1920×1080 (16:9 aspect ratio)

Scaling Strategy: CSS transform: scale() for proportional resizing

Viewport Adaptation: Automatically detects available screen size and applies responsive scaling

Architecture Patterns
Component Architecture
const Scene = ({ title, onComplete }) => {
    const [step, setStep] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        // Side effects for animations or resetting scene state
    }, [step]);

    return el("div", { class: "scene" }, [
        el("h2", {}, title),
        el("button", { onClick: () => setStep(step + 1) }, "Next Step"),
    ]);
};

State Management

Local State: Managed at the component level using useState

Parent → Child: Props are passed for dynamic data

Child → Parent: Callback functions bubble events upwards

Global State: Scene progression controlled via a central controller

Event Handling

DOM Events: Lightweight listeners attached to wireframe elements

Custom Callbacks: Triggered for quizzes, slicing, and drag-drop interactions

Touch + Mouse Support:

Drag-and-drop implemented via pointer/touch events

Works seamlessly on tablets, touchscreens, and desktops

File Structure
/
├── index.html                    # Main entry point
├── js/
│   ├── mini-react.js            # Custom React-like implementation
│   ├── g2c3m1-wireframes.js     # Core wireframe app logic
│   ├── responsive-scaling.js    # Handles 16:9 scaling
│   └── events.js                # Drag, snap, tap, and quiz handlers
├── css/
│   ├── styles.css               # App-wide styles
│   ├── components.css           # Scene & stage-specific styling
│   └── themes.css               # Color tokens & responsive scaling variables
└── assets/
    ├── cheesecake.png           # Final cheesecake image
    ├── pizza.png                # Final pizza image
    ├── cookies.png              # Cookie variants
    └── icons/                   # Slicer, arrows, feedback icons

Development Workflow
Local Development
# Start local dev server
python -m http.server 8000
# OR
npx serve .

# Open in browser:
http://localhost:8000


No build step required → Works directly in the browser

Code Style Guidelines

Variables & Functions: camelCase

Components: PascalCase

CSS Classes: BEM-like naming convention

Indentation:

2 spaces → HTML & CSS

4 spaces → JavaScript

Browser Support

Supported: Chrome, Firefox, Safari, Edge

Mobile Optimized: Fully responsive with touch events

Not Supported: Internet Explorer (uses modern JS & CSS features)

Performance Considerations
Rendering Optimization

Minimal DOM Reflows: Leveraging virtual DOM diffing in Mini-React

Event Delegation: Single listener per scene where possible

GPU-Accelerated Animations: Using transform & opacity for smooth 60fps

Asset Optimization

Vector-based placeholders for wireframes

PNG images compressed for fast load times

Lazy-loading of scene assets

Debugging & Testing
Development Tools

Browser DevTools: Inspect DOM and live-edit CSS

Console Logging: For tracking state transitions and interaction triggers

Component Testing: Manual verification for scene transitions

Testing Strategy

Unit Testing: Verify correctness of slicing, drag-drop, and quiz logic

Cross-Browser Testing: Chrome, Firefox, Safari, Edge

Device Testing: Laptops, tablets, and smartboards

Responsive Testing: Check scale accuracy across resolutions