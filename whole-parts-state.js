// Whole Parts State Management System
// Manages the 5 exact states for the pixel-precise UI

class WholePartsState {
    constructor() {
        this.currentStateIndex = 0;
        this.states = [
            // State 0: Intro screen
            {
                sprite: null,
                speech: "Dee Tee, Jax and Jane are\nat Cheesecake center.\nLet's find out\nwhat they ordered!",
                showToolPanel: false,
                toolMode: null,
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: null,
                showStartButton: true
            },
            // State 1: Character selection screen
            {
                sprite: null,
                speech: "Here's what they ordered!",
                showToolPanel: false,
                toolMode: null,
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to see what Dee Tee, Jax, and Jane are up to!",
                showCharacters: true
            },
            // State 2: Slicer intro (boy + tool rail)
            {
                sprite: 'cheesecake_boy',
                speech: "I love cheesecake! Let's start with that.\n\nI want to cut the cake into 2 pieces!",
                showToolPanel: true,
                toolMode: 'slicer',
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap the slicer 🪄, then tap the cheesecake."
            },
            // State 3: Cut complete (man, cut visible, no tool rail)
            {
                sprite: 'cookie_man',
                speech: "Nice work, Jax!\n\nYou cut the {whole} cheesecake into {parts}.",
                showToolPanel: false,
                toolMode: null,
                cut: true,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to see what happens next!"
            },
            // State 4: Confusion (boy, cut visible)
            {
                sprite: 'cheesecake_boy',
                speech: "{whole} and {parts}? What does it mean? I'm confused.",
                showToolPanel: false,
                toolMode: null,
                cut: true,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to learn about whole and parts!"
            },
            // State 5: Define whole (man, no cut, caption)
            {
                sprite: 'cookie_man',
                speech: "Look, Jax.\n\nIn math, when we have the complete object or thing, we call it a {whole}.",
                showToolPanel: false,
                toolMode: null,
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: "Whole = One complete object!",
                footerText: "Tap ▶ to learn about part."
            },
            // State 6: Define part (man, cut + arrows + caption)
            {
                sprite: 'cookie_man',
                speech: "And, when a whole is cut into pieces, every piece is called a {parts}.",
                showToolPanel: false,
                toolMode: null,
                cut: true,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: "Part = A piece of the object!",
                footerText: "Tap ▶ to find out more!"
            },
            // State 7: Transition to order status
            {
                sprite: 'cookie_man',
                speech: "Great! Now you understand what {whole} and {parts} mean.\n\nLet's see what else they ordered!",
                showToolPanel: false,
                toolMode: null,
                cut: true,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                canvasCaption: null,
                footerText: "Tap ▶ to see their full order!"
            },
            // State 8: Order status screen with completion pips
            {
                sprite: null,
                speech: null,
                showToolPanel: false,
                toolMode: null,
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to see what they do with pizza.",
                showOrderStatus: true,
                headerTitle: "Here's what they ordered!",
                tiles: [
                    { foodLabel: "Cheesecake", showSprite: false, status: "done" },
                    { foodLabel: "Pizza", showSprite: false, status: "pending" },
                    { foodLabel: "Cookie", showSprite: false, status: "pending" }
                ]
            },
            // State 9: Pizza intro (pizza_girl)
            {
                sprite: 'pizza_girl',
                speech: "I'm so hungry!\nThis pizza looks delicious. Let's eat it.\n\nCut the pizza into pieces!",
                showToolPanel: true,
                toolMode: 'slicer',
                cut: false,

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: "Slicer (4 parts)",
                canvasCaption: null,
                footerText: "Tap the slicer 🪄, then tap the pizza.",
                foodType: 'pizza'
            },
            // State 10: Boy notices parts (cheesecake_boy)
            {
                sprite: 'cheesecake_boy',
                speech: "Wait, the {whole} pizza is cut into different {parts}; How many parts is this Dee Tee?",
                showToolPanel: false,
                toolMode: null,
                cut: 'horizontal',
                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to see what Dee Tee says.",
                foodType: 'pizza'
            },
            // State 11: Counting instruction (cookie_man)
            {
                sprite: 'cookie_man',
                speech: "Let's check, Jax!\n\nCount the number of {parts} the {whole} pizza is cut into.",
                showToolPanel: false,
                toolMode: null,
                cut: 'cross',
                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap each part to count them.",
                foodType: 'pizza',
                interactiveMode: 'counting'
            },
            // State 12: Confirmation (cookie_man)
            {
                sprite: 'cookie_man',
                speech: "Yay! Good job!\n\nYes, this {whole} pizza is cut into 4 {parts}.",
                showToolPanel: false,
                toolMode: null,
                cut: 'cross',

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ and let's keep following them!",
                foodType: 'pizza'
            },
            // State 13: Follow-up question (pizza_girl)
            {
                sprite: 'pizza_girl',
                speech: "If we put all the 4 {parts} back, do we get the {whole} again, Dee Tee?",
                showToolPanel: false,
                toolMode: null,
                cut: 'cross',

                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ know what Dee Tee says ?",
                foodType: 'pizza'
            },
            // State 14: Start assembly (all quarters available, canvas dim)
            {
                sprite: 'cookie_man',
                speech: "Let's see whether all the parts together make the whole pizza again.",
                showToolPanel: true,
                toolMode: 'parts',
                toolRailHeader: "Parts of the pizza.",
                cut: 'cross',
                dimCanvas: true,
                availableParts: ['qTR','qTL','qBL','qBR'],
                placedParts: [],
                canvasCaption: null,
                footerText: "Tap each part in the rail to place it.",
                foodType: 'pizza'
            },
            // State 15: Progressively placing (example: top-right placed)
            {
                sprite: 'cookie_man',
                speech: "Drag or tap a part from the rail to join it back.",
                showToolPanel: true,
                toolMode: 'parts',
                toolRailHeader: "Parts of the pizza.",
                cut: 'cross',
                dimCanvas: true,
                availableParts: ['qTL','qBL','qBR'],
                placedParts: ['qTR'],
                canvasCaption: null,
                footerText: "Great! Place the remaining parts.",
                foodType: 'pizza'
            },
            // State 16: Success — whole reassembled
            {
                sprite: 'cookie_man',
                speech: "Yay! All the {parts} together make the {whole} again.",
                showToolPanel: false,
                toolMode: null,
                cut: false,
                dimCanvas: false,
                availableParts: [],
                placedParts: ['qTR','qTL','qBL','qBR'],
                canvasCaption: "All the parts together make the whole again.",
                footerText: "Tap ▶ to move ahead in the story!",
                foodType: 'pizza'
            },
            // State 17: Order overview after pizza completion
            {
                sprite: null,
                speech: null,
                showToolPanel: false,
                toolMode: null,
                cut: false,
                dimCanvas: false,
                availableParts: [],
                placedParts: [],
                toolRailHeader: null,
                canvasCaption: null,
                footerText: "Tap ▶ to check our understanding with cookies.",
                showOrderStatus: true,
                headerTitle: "Here's what they ordered!",
                tiles: [
                    { foodLabel: "Cheesecake", showSprite: false, status: "done" },
                    { foodLabel: "Pizza", showSprite: false, status: "done" },
                    { foodLabel: "Cookie", showSprite: false, status: "pending" }
                ]
            },
            // C1: Cookie Quiz Prompt (no selection yet)
            {
                sprite: 'cookie_man',
                speech: "Look at this cookie — is it a whole or just a part?",
                showToolPanel: true,
                toolMode: 'quiz',
                cut: false,
                canvasCaption: null,
                footerText: "Tap the correct answer.",
                quiz: {
                    image: "cookie_whole",
                    options: ["Whole", "Part"],
                    selection: null,
                    evaluation: "pending",
                    feedback: null
                }
            },
            // C2: Wrong attempt (user taps "Part")
            {
                sprite: 'cookie_man',
                speech: "Look at this cookie — is it a whole or just a part?",
                showToolPanel: true,
                toolMode: 'quiz',
                cut: false,
                canvasCaption: null,
                footerText: "Tap the correct answer.",
                quiz: {
                    image: "cookie_whole",
                    options: ["Whole", "Part"],
                    selection: "Part",
                    evaluation: "wrong",
                    feedback: "Look closely — it's a complete cookie, not just a piece. Try again!"
                }
            },
            // C3: Correct attempt (user taps "Whole")
            {
                sprite: 'cookie_man',
                speech: "Look at this cookie — is it a whole or just a part?",
                showToolPanel: true,
                toolMode: 'quiz',
                cut: false,
                canvasCaption: null,
                footerText: "Tap ▶ to see the next question.",
                quiz: {
                    image: "cookie_whole",
                    options: ["Whole", "Part"],
                    selection: "Whole",
                    evaluation: "right",
                    feedback: "That's correct — it's a complete cookie. So, it's a whole."
                }
            }
        ];
        
        this.listeners = [];
    }
    
    getCurrentState() {
        return this.states[this.currentStateIndex];
    }
    
    nextState() {
        if (this.currentStateIndex < this.states.length - 1) {
            this.currentStateIndex++;
            this.notifyListeners();
        }
    }
    
    prevState() {
        if (this.currentStateIndex > 0) {
            this.currentStateIndex--;
            this.notifyListeners();
        }
    }
    
    goToState(index) {
        if (index >= 0 && index < this.states.length) {
            this.currentStateIndex = index;
            this.notifyListeners();
        }
    }
    
    canGoPrev() {
        return this.currentStateIndex > 0;
    }
    
    addListener(callback) {
        this.listeners.push(callback);
    }
    
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.getCurrentState()));
    }
    
    // Handle tool interactions
    handleToolClick() {
        const currentState = this.getCurrentState();
        if (currentState.showToolPanel && !currentState.cut) {
            // Simulate cutting action - move to next state
            this.nextState();
        }
    }
    
    // Handle food disk click
    handleFoodDiskClick() {
        const currentState = this.getCurrentState();
        if (currentState.showToolPanel && !currentState.cut) {
            // Complete the cutting action
            this.nextState();
        }
    }
    
    // Handle pizza part placement
    placePart(partId) {
        const currentState = this.getCurrentState();
        if (currentState.toolMode === 'parts' && currentState.availableParts.includes(partId)) {
            // Create new state with part moved from available to placed
            const newAvailableParts = currentState.availableParts.filter(part => part !== partId);
            const newPlacedParts = [...currentState.placedParts, partId];
            
            // Update current state
            this.states[this.currentStateIndex] = {
                ...currentState,
                availableParts: newAvailableParts,
                placedParts: newPlacedParts,
                footerText: newPlacedParts.length === 4 ? 
                    "Great! All parts are placed. Tap ▶ to continue!" : 
                    "Great! Place the remaining parts."
            };
            
            // If all parts are placed, enable progression to success state
            if (newPlacedParts.length === 4) {
                // Auto-advance to success state after a short delay
                setTimeout(() => {
                    this.nextState();
                }, 1000);
            }
            
            this.notifyListeners();
        }
    }
    
    // Handle quiz option selection
    selectQuizOption(optionKey) {
        const currentState = this.getCurrentState();
        if (currentState.toolMode !== 'quiz' || !currentState.quiz) return;
        
        // Update current state with selected option
        const updatedState = {
            ...currentState,
            quiz: {
                ...currentState.quiz,
                selection: optionKey
            }
        };
        
        // Determine feedback based on correctness (for whole cookie, correct answer is "Whole")
        if (optionKey === "Whole") {
            updatedState.quiz.evaluation = "right";
            updatedState.quiz.feedback = "That's correct — it's a complete cookie. So, it's a whole.";
            updatedState.footerText = "Tap ▶ to see the next question.";
        } else {
            updatedState.quiz.evaluation = "wrong";
            updatedState.quiz.feedback = "Look closely — it's a complete cookie, not just a piece. Try again!";
            updatedState.footerText = "Tap the correct answer.";
        }
        
        // Update the current state
        this.states[this.currentStateIndex] = updatedState;
        this.notifyListeners();
    }
    
    // Override canGoNext for quiz states
    canGoNext() {
        const currentState = this.getCurrentState();
        
        // For quiz states, only allow next if correct answer is selected
        if (currentState.toolMode === 'quiz' && currentState.quiz) {
            return currentState.quiz.evaluation === "right";
        }
        
        return this.currentStateIndex < this.states.length - 1;
    }
}

// Create global state instance
window.wholePartsState = new WholePartsState();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WholePartsState;
}