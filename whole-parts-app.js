// Whole Parts Application - Pixel Precise UI Implementation
// Uses the new base screen components with state management

class WholePartsApp {
    constructor() {
        this.state = window.wholePartsState;
        this.container = null;
        this.isInitialized = false;
        this.pizzaCountingState = {
            countedParts: new Set(),
            partLabels: [],
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
        
        if (nextButton) {
            // Special handling for pizza counting mode
            if (currentState.foodType === 'pizza' && currentState.interactiveMode === 'counting') {
                nextButton.disabled = this.pizzaCountingState.countedParts.size < 4;
            } else {
                nextButton.disabled = !this.state.canGoNext();
            }
            nextButton.setAttribute('data-variant', 'next');
        }
        
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
        this.addPizzaPartLabel(quadrant, this.pizzaCountingState.nextPartNumber);
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
    
    addPizzaPartLabel(quadrant, partNumber) {
        const foodDisk = this.container.querySelector('.food-disk');
        if (!foodDisk) return;
        
        // Define anchor angles for each quadrant (in degrees)
        const anchorAngles = [20, 160, 220, 340]; // TR, TL, BL, BR
        const angle = anchorAngles[quadrant];
        const angleRad = (angle * Math.PI) / 180;
        
        // Calculate label position (64px from disk edge)
        const diskRadius = 120; // Half of 240px disk size
        const labelDistance = diskRadius + 64;
        const labelX = Math.cos(angleRad) * labelDistance;
        const labelY = Math.sin(angleRad) * labelDistance;
        
        // Create label element
        const label = document.createElement('div');
        label.className = 'pizza-part-label';
        label.textContent = `Part ${partNumber}`;
        label.style.position = 'absolute';
        label.style.left = `calc(50% + ${labelX}px)`;
        label.style.top = `calc(50% + ${labelY}px)`;
        label.style.transform = 'translate(-50%, -50%)';
        label.style.color = 'white';
        label.style.fontSize = '16px';
        label.style.fontWeight = 'bold';
        label.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        
        // Create arrow leader line
        const arrow = document.createElement('div');
        arrow.className = 'pizza-part-arrow';
        arrow.style.position = 'absolute';
        arrow.style.left = '50%';
        arrow.style.top = '50%';
        arrow.style.width = '64px';
        arrow.style.height = '2px';
        arrow.style.backgroundColor = 'white';
        arrow.style.transformOrigin = '0 50%';
        arrow.style.transform = `rotate(${angle}deg)`;
        arrow.style.pointerEvents = 'none';
        arrow.style.zIndex = '9';
        
        // Create arrow tip
        const arrowTip = document.createElement('div');
        arrowTip.style.position = 'absolute';
        arrowTip.style.right = '-6px';
        arrowTip.style.top = '-3px';
        arrowTip.style.width = '0';
        arrowTip.style.height = '0';
        arrowTip.style.borderLeft = '6px solid white';
        arrowTip.style.borderTop = '3px solid transparent';
        arrowTip.style.borderBottom = '3px solid transparent';
        arrow.appendChild(arrowTip);
        
        // Add to canvas area
        const canvasArea = this.container.querySelector('.canvas-area');
        if (canvasArea) {
            canvasArea.appendChild(arrow);
            canvasArea.appendChild(label);
            
            // Store references for cleanup
             this.pizzaCountingState.partLabels.push({ label, arrow });
         }
     }
     
     resetPizzaCountingState() {
         // Clear counted parts
         this.pizzaCountingState.countedParts.clear();
         this.pizzaCountingState.nextPartNumber = 1;
         
         // Remove existing labels and arrows
         this.pizzaCountingState.partLabels.forEach(({ label, arrow }) => {
             if (label.parentNode) label.parentNode.removeChild(label);
             if (arrow.parentNode) arrow.parentNode.removeChild(arrow);
         });
         this.pizzaCountingState.partLabels = [];
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