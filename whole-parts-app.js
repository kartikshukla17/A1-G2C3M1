// Whole Parts Application - Pixel Precise UI Implementation
// Uses the new base screen components with state management

class WholePartsApp {
    constructor() {
        this.state = window.wholePartsState;
        this.container = null;
        this.isInitialized = false;
        this.pizzaCountingState = {
            countedParts: new Set(),
    
            nextPartNumber: 1
        };
    }
    
    init(containerId = 'app') {
        if (this.isInitialized) return;
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }
        
        // Set up state listener
        this.state.addListener((newState) => {
            this.render();
        });
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Initial render
        this.render();
        
        this.isInitialized = true;
        console.log('Whole Parts App initialized');
    }
    
    setupEventHandlers() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-button[data-variant="next"]')) {
                e.preventDefault();
                if (this.state.canGoNext()) {
                    this.state.nextState();
                }
            }
            
            if (e.target.matches('.nav-button[data-variant="prev"]')) {
                e.preventDefault();
                if (this.state.canGoPrev()) {
                    this.state.prevState();
                }
            }
            
            // Handle tool clicks
            if (e.target.matches('.tool-icon')) {
                e.preventDefault();
                this.state.handleToolClick();
            }
            
            // Handle food disk clicks
            if (e.target.matches('.food-disk')) {
                e.preventDefault();
                const currentState = this.state.getCurrentState();
                
                // Check if we're in pizza counting mode
                if (currentState.foodType === 'pizza' && currentState.interactiveMode === 'counting') {
                    this.handlePizzaSliceClick(e);
                } else {
                    this.state.handleFoodDiskClick();
                }
            }
            
            // Handle pizza quarter placement from ToolRail
            if (e.target.matches('.part-thumbnail')) {
                e.preventDefault();
                const partType = e.target.dataset.part;
                if (partType && ['qTR', 'qTL', 'qBL', 'qBR'].includes(partType)) {
                    // Add animation class
                    e.target.classList.add('placing');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        e.target.classList.remove('placing');
                    }, 250);
                    
                    this.state.placePart(partType);
                }
            }
        });
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && this.state.canGoNext()) {
                this.state.nextState();
            }
            if (e.key === 'ArrowLeft' && this.state.canGoPrev()) {
                this.state.prevState();
            }
        });
    }
    
    render() {
        if (!this.container) return;
        
        const currentState = this.state.getCurrentState();
        
        // Check if we should render CharacterSelectionScreen independently
        if (currentState.showCharacters) {
            // Render CharacterSelectionScreen directly using MiniReact component system
            const component = window.MiniReact.components.get('CharacterSelectionScreen');
            if (component) {
                this.container.innerHTML = component.renderFunction({
                    state: currentState,
                    onStateChange: (newState) => {
                        // Handle state changes if needed
                    }
                });
                return;
            } else {
                console.error('CharacterSelectionScreen component not found');
            }
        }
        
        // Update canvas area class based on tool panel visibility
        const canvasAreaClass = currentState.showToolPanel ? 'canvas-area with-tool-panel' : 'canvas-area';
        
        // Render the screen component
        this.container.innerHTML = window.Components.Screen({
            state: currentState,
            onStateChange: (newState) => {
                // Handle state changes if needed
            }
        });
        
        // Apply dynamic classes
        const canvasArea = this.container.querySelector('.canvas-area');
        if (canvasArea && currentState.showToolPanel) {
            canvasArea.classList.add('with-tool-panel');
        }
        
        // Update navigation button states
        const prevButton = this.container.querySelector('.nav-button[data-variant="prev"]');
        const nextButton = this.container.querySelector('.nav-button[data-variant="next"]');
        
        if (prevButton) {
            prevButton.disabled = !this.state.canGoPrev();
            prevButton.setAttribute('data-variant', 'prev');
        }
        
        // if (nextButton) {
        //     // Special handling for pizza counting mode
        //     if (currentState.foodType === 'pizza' && currentState.interactiveMode === 'counting') {
        //         nextButton.disabled = this.pizzaCountingState.countedParts.size < 4;
        //     } else {
        //         nextButton.disabled = !this.state.canGoNext();
        //     }
        //     nextButton.setAttribute('data-variant', 'next');
        // }
        
        // Reset pizza counting state when entering counting mode
        if (currentState.foodType === 'pizza' && currentState.interactiveMode === 'counting' && 
            this.pizzaCountingState.countedParts.size === 0) {
            this.resetPizzaCountingState();
        }
        
        // Add click handlers for interactive elements
        this.addInteractiveHandlers();
    }
    
    addInteractiveHandlers() {
        // Add tap animations to interactive elements
        const interactiveElements = this.container.querySelectorAll('.tool-icon, .food-disk, .nav-button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mousedown', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('mouseup', () => {
                element.style.transform = '';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    

    

    
    // Public methods for external control
    goToState(index) {
        this.state.goToState(index);
    }
    
    getCurrentStateIndex() {
        return this.state.currentStateIndex;
    }
    
    getTotalStates() {
        return this.state.states.length;
    }
    
    handlePizzaSliceClick(event) {
        const foodDisk = event.target;
        const rect = foodDisk.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clickX = event.clientX;
        const clickY = event.clientY;
        
        // Calculate relative position from center
        const relX = clickX - centerX;
        const relY = clickY - centerY;
        
        // Determine quadrant (TR=0, TL=1, BL=2, BR=3)
        let quadrant;
        if (relX >= 0 && relY <= 0) quadrant = 0; // Top Right
        else if (relX < 0 && relY <= 0) quadrant = 1; // Top Left
        else if (relX < 0 && relY > 0) quadrant = 2; // Bottom Left
        else quadrant = 3; // Bottom Right
        
        // Check if this quadrant was already counted
        if (this.pizzaCountingState.countedParts.has(quadrant)) {
            return; // Already counted, ignore
        }
        
        // Add to counted parts
        this.pizzaCountingState.countedParts.add(quadrant);
        
        // Create and add label
        
        this.pizzaCountingState.nextPartNumber++;
        
        // Check if all 4 parts are counted
        if (this.pizzaCountingState.countedParts.size === 4) {
            // Enable Next button and auto-advance after short delay
            const nextButton = this.container.querySelector('.nav-button[data-variant="next"]');
            if (nextButton) {
                nextButton.disabled = false;
            }
            
            // Auto-advance to confirmation state after 1 second
            setTimeout(() => {
                this.state.nextState();
            }, 1000);
        }
    }
    
    resetPizzaCountingState() {
         // Clear counted parts
         this.pizzaCountingState.countedParts.clear();
         this.pizzaCountingState.nextPartNumber = 1;
         

     }
}

// Export to global scope
window.WholePartsApp = WholePartsApp;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing WholePartsApp...');
    window.wholePartsApp = new WholePartsApp();
    window.wholePartsApp.init('app');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WholePartsApp;
}