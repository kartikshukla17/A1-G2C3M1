/**
 * Scene System for Whole & Part Applet
 * Manages navigation, transitions, state persistence, and scene flow
 */

class SceneSystem {
    constructor() {
        this.scenes = [];
        this.currentSceneIndex = 0;
        this.sceneHistory = [];
        this.sceneStates = new Map();
        this.transitionInProgress = false;
        this.completedScenes = new Set();
        this.sceneContainer = null;
        this.initialized = false;
        
        // Initialize when appData is available
        if (typeof appData !== 'undefined' && appData.scenes) {
            this.initialize();
        } else {
            // Wait for appData to be available
            document.addEventListener('DOMContentLoaded', () => {
                if (typeof appData !== 'undefined' && appData.scenes) {
                    this.initialize();
                }
            });
        }
    }
    
    initialize() {
        if (this.initialized) return;
        
        this.scenes = appData.scenes;
        
        // Initialize scene system
        this.initializeScenes();
        this.bindEvents();
        
        this.initialized = true;
        console.log('Scene System initialized with', this.scenes.length, 'scenes');
    }
    
    initializeScenes() {
        // Register all scene components
        this.registerSceneComponents();
        
        // Set up initial state
        this.sceneStates.set('global', {
            startTime: Date.now(),
            totalInteractions: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            hintsUsed: 0,
            language: appData.getCurrentLanguage()
        });
        
        // Initialize individual scene states
        this.scenes.forEach((scene, index) => {
            this.sceneStates.set(scene.id, {
                visited: false,
                completed: false,
                attempts: 0,
                startTime: null,
                endTime: null,
                interactions: [],
                data: {}
            });
        });
    }
    
    registerSceneComponents() {
        // Register scene-specific components
        this.registerIntroScene();
        this.registerOrderScene();
        this.registerCheesecakeCutScene();
        this.registerCheesecakeReassembleScene();
        this.registerPizzaCutScene();
        this.registerPizzaCountScene();
        this.registerPizzaReassembleScene();
        this.registerCookieQuizScene();
        this.registerSummaryScene();
    }
    
    // Scene Registration Methods
    registerIntroScene() {
        createComponent('IntroScene', (props) => {
            const [isReady, setIsReady] = useState(false);
            
            useEffect(() => {
                setTimeout(() => setIsReady(true), 500);
            }, []);
            
            const handleStart = () => {
                this.recordInteraction('intro', 'start_clicked');
                this.navigateToNext();
            };
            
            return html`
                <div class="scene-intro">
                    ${renderComponent('Header', {
                        title: 'Whole and Part'
                    })}
                    
                    <main class="intro-main">
                        <div class="intro-layout">
                            <div class="visual-column">
                                ${renderComponent('VisualFrame', {
                                    borderColor: '#FFA500',
                                    children: ''
                                })}
                            </div>
                            
                            <div class="content-column">
                                ${renderComponent('IntroText', {
                                    text: 'Dee Tee, Jax and Jane are at Cheesecake center. Let\'s find out what they ordered!'
                                })}
                                
                                ${renderComponent('PrimaryButton', {
                                    label: 'Start',
                                    onClick: handleStart
                                })}
                            </div>
                        </div>
                    </main>
                </div>
            `;
        });
    }
    
    registerOrderScene() {
        createComponent('OrderScene', (props) => {
            const handleNext = () => {
                this.recordInteraction('order_scene', 'next_clicked');
                this.navigateToNext();
            };
            
            const handlePrevious = () => {
                this.recordInteraction('order_scene', 'previous_clicked');
                this.navigateToPrevious();
            };
            
            const orderData = appData.getContentUI('order_scene');
            const characters = orderData.characters;
            
            return html`
                <div class="scene-order">
                    ${render('Header', {
                        title: orderData.title,
                        align: 'center'
                    })}
                    
                    ${render('SceneCanvas', {
                        borderColor: '#F7A338',
                        padding: 30,
                        gap: 40,
                        columns: 3,
                        children: html`
                            ${render('CharacterOrderTile', {
                                foodLabel: characters.dee_tee.food,
                                sprite: appData.assets.images.cheesecake_boy,
                                spriteAlt: characters.dee_tee.sprite_alt
                            })}
                            ${render('CharacterOrderTile', {
                                foodLabel: characters.jax.food,
                                sprite: appData.assets.images.pizza_girl,
                                spriteAlt: characters.jax.sprite_alt
                            })}
                            ${render('CharacterOrderTile', {
                                foodLabel: characters.jane.food,
                                sprite: appData.assets.images.cookie_man,
                                spriteAlt: characters.jane.sprite_alt
                            })}
                        `
                    })}
                    
                    ${render('SceneFooter', {
                        children: html`
                            ${render('NavButton', {
                                variant: 'prev',
                                onClick: handlePrevious,
                                disabled: !this.canNavigatePrevious()
                            })}
                            ${render('SceneProgress', {
                                text: orderData.instruction,
                                align: 'center'
                            })}
                            ${render('NavButton', {
                                variant: 'next',
                                onClick: handleNext,
                                disabled: !this.canNavigateNext()
                            })}
                        `
                    })}
                </div>
            `;
        });
    }
    
    registerCheesecakeCutScene() {
        createComponent('CheesecakeCutScene', (props) => {
            const [slicerActive, setSlicerActive] = useState(false);
            const [cheesecakeSliced, setCheesecakeSliced] = useState(false);
            const [feedback, setFeedback] = useState('');
            const [canProceed, setCanProceed] = useState(false);
            const [slicerCutting, setSlicerCutting] = useState(false);
            const [cheesecakeCutting, setCheesecakeCutting] = useState(false);
            const [partsSplitting, setPartsSplitting] = useState(false);
            
            const handleSlicerClick = () => {
                setSlicerActive(true);
                setFeedback(appData.getContentUI('cheesecake_cut.feedback_initial'));
                this.recordInteraction('cheesecake_cut', 'slicer_selected');
            };
            
            const handleCheesecakeClick = () => {
                if (slicerActive && !cheesecakeSliced) {
                    // Start cutting animation sequence
                    setSlicerCutting(true);
                    setCheesecakeCutting(true);
                    
                    // After slicer animation completes, show splitting
                    setTimeout(() => {
                        setSlicerCutting(false);
                        setCheesecakeCutting(false);
                        setCheesecakeSliced(true);
                        setPartsSplitting(true);
                        
                        // After splitting animation, show final state
                        setTimeout(() => {
                            setPartsSplitting(false);
                            setFeedback(appData.getContentUI('cheesecake_cut.feedback_success'));
                            setCanProceed(true);
                        }, 1500);
                    }, 2000);
                    
                    this.recordInteraction('cheesecake_cut', 'cheesecake_sliced');
                    this.markSceneCompleted('cheesecake_cut');
                } else if (!slicerActive) {
                    setFeedback(appData.getContentUI('cheesecake_cut.feedback_error'));
                    this.recordInteraction('cheesecake_cut', 'error_no_slicer');
                }
            };
            
            return html`
                <div class="scene-cheesecake-cut">
                    ${renderComponent('CharacterDisplay', {
                        character: 'cheesecake_boy',
                        message: appData.getContentUI('cheesecake_cut.title'),
                        position: 'left',
                        size: 'medium'
                    })}
                    
                    <div class="scene-content-area">
                        <p class="scene-instruction">
                            ${appData.getContentUI('cheesecake_cut.instruction')}
                        </p>
                        
                        <div class="tools-area">
                            ${renderComponent('InteractiveElement', {
                                onClick: handleSlicerClick,
                                className: `slicer-tool ${slicerActive ? 'active' : ''} ${slicerCutting ? 'cutting' : ''}`,
                                ariaLabel: appData.getContentUI('cheesecake_cut.tool_name'),
                                children: html`
                                    <div class="slicer-icon">🔪</div>
                                    <div class="slicer-label">${appData.getContentUI('cheesecake_cut.tool_name')}</div>
                                `
                            })}
                        </div>
                        
                        <div class="food-area">
                            ${renderComponent('InteractiveElement', {
                                onClick: handleCheesecakeClick,
                                className: `food-item cheesecake ${slicerActive ? 'sliceable' : ''} ${cheesecakeSliced ? 'sliced' : ''} ${cheesecakeCutting ? 'cutting' : ''}`,
                                ariaLabel: 'Cheesecake',
                                children: html`
                                    <div class="cheesecake-whole ${cheesecakeSliced ? 'hidden' : ''}">
                                        🍰
                                    </div>
                                    <div class="cheesecake-parts ${cheesecakeSliced ? '' : 'hidden'} ${partsSplitting ? 'splitting' : ''}">
                                        <div class="part part-1">🍰</div>
                                        <div class="part part-2">🍰</div>
                                    </div>
                                `
                            })}
                        </div>
                        
                        ${renderComponent('FeedbackMessage', {
                            message: feedback,
                            type: cheesecakeSliced ? 'success' : 'info',
                            visible: !!feedback
                        })}
                    </div>
                    
                    ${renderComponent('NavigationControls', {
                        onNext: () => this.navigateToNext(),
                        canGoNext: canProceed,
                        onPrevious: () => this.navigateToPrevious(),
                        canGoPrevious: this.canNavigatePrevious()
                    })}
                </div>
            `;
        });
    }
    
    registerCheesecakeReassembleScene() {
        createComponent('CheesecakeReassembleScene', (props) => {
            const [parts, setParts] = useState([
                { id: 1, x: 100, y: 200, placed: false },
                { id: 2, x: 300, y: 200, placed: false }
            ]);
            const [allPartsPlaced, setAllPartsPlaced] = useState(false);
            const [feedback, setFeedback] = useState(appData.getContentUI('cheesecake_reassemble.feedback_initial'));
            
            const handlePartDrop = (partId, position) => {
                const dropZone = { x: 200, y: 150, width: 100, height: 100 };
                const isInDropZone = position.x >= dropZone.x && 
                                   position.x <= dropZone.x + dropZone.width &&
                                   position.y >= dropZone.y && 
                                   position.y <= dropZone.y + dropZone.height;
                
                if (isInDropZone) {
                    setParts(prev => prev.map(part => 
                        part.id === partId ? { ...part, placed: true, x: dropZone.x + (partId - 1) * 50, y: dropZone.y } : part
                    ));
                    
                    this.recordInteraction('cheesecake_reassemble', 'part_placed', { partId });
                    
                    const newParts = parts.map(part => 
                        part.id === partId ? { ...part, placed: true } : part
                    );
                    
                    if (newParts.every(part => part.placed)) {
                        setAllPartsPlaced(true);
                        setFeedback(appData.getContentUI('cheesecake_reassemble.feedback_success'));
                        this.markSceneCompleted('cheesecake_reassemble');
                    }
                }
            };
            
            return html`
                <div class="scene-cheesecake-reassemble">
                    <p class="scene-instruction">
                        ${appData.getContentUI('cheesecake_reassemble.instruction')}
                    </p>
                    
                    <div class="reassemble-area">
                        <div class="drop-zone ${allPartsPlaced ? 'success' : ''}">
                            <!-- Drop zone for parts -->
                        </div>
                        
                        ${parts.map(part => html`
                            ${renderComponent('InteractiveElement', {
                                draggable: true,
                                onDragEnd: (e, pos) => handlePartDrop(part.id, pos),
                                className: `food-part cheesecake-part ${part.placed ? 'placed' : ''}`,
                                style: `left: ${part.x}px; top: ${part.y}px;`,
                                children: '🍰'
                            })}
                        `).join('')}
                    </div>
                    
                    ${renderComponent('FeedbackMessage', {
                        message: feedback,
                        type: allPartsPlaced ? 'success' : 'info',
                        visible: true
                    })}
                    
                    ${renderComponent('NavigationControls', {
                        onNext: () => this.navigateToNext(),
                        canGoNext: allPartsPlaced,
                        onPrevious: () => this.navigateToPrevious(),
                        canGoPrevious: this.canNavigatePrevious()
                    })}
                </div>
            `;
        });
    }
    
    // Similar registration methods for other scenes...
    registerPizzaCutScene() {
        createComponent('PizzaCutScene', (props) => {
            // Similar to cheesecake cut but with 4 parts
            return html`<div>Pizza Cut Scene - Implementation similar to cheesecake</div>`;
        });
    }
    
    registerPizzaCountScene() {
        createComponent('PizzaCountScene', (props) => {
            // Counting interaction for 4 pizza parts
            return html`<div>Pizza Count Scene</div>`;
        });
    }
    
    registerPizzaReassembleScene() {
        createComponent('PizzaReassembleScene', (props) => {
            // Similar to cheesecake reassemble but with 4 parts
            return html`<div>Pizza Reassemble Scene</div>`;
        });
    }
    
    registerCookieQuizScene() {
        createComponent('CookieQuizScene', (props) => {
            // Quiz with 3 questions about whole vs part
            return html`<div>Cookie Quiz Scene</div>`;
        });
    }
    
    registerSummaryScene() {
        createComponent('SummaryScene', (props) => {
            // Summary of learning with concepts
            return html`<div>Summary Scene</div>`;
        });
    }
    
    // Navigation Methods
    navigateToScene(sceneIndex) {
        if (this.transitionInProgress) return;
        if (sceneIndex < 0 || sceneIndex >= this.scenes.length) return;
        
        this.transitionInProgress = true;
        
        // Record navigation
        this.recordInteraction('navigation', 'scene_change', {
            from: this.currentSceneIndex,
            to: sceneIndex
        });
        
        // Add current scene to history
        this.sceneHistory.push(this.currentSceneIndex);
        
        // Update scene states
        const currentScene = this.scenes[this.currentSceneIndex];
        const currentState = this.sceneStates.get(currentScene.id);
        if (currentState.startTime && !currentState.endTime) {
            currentState.endTime = Date.now();
        }
        
        // Set new scene
        const previousIndex = this.currentSceneIndex;
        this.currentSceneIndex = sceneIndex;
        
        // Mark new scene as visited
        const newScene = this.scenes[sceneIndex];
        const newState = this.sceneStates.get(newScene.id);
        if (!newState.visited) {
            newState.visited = true;
            newState.startTime = Date.now();
        }
        
        // Perform transition
        this.performSceneTransition(previousIndex, sceneIndex);
    }
    
    navigateToNext() {
        if (this.currentSceneIndex < this.scenes.length - 1) {
            this.navigateToScene(this.currentSceneIndex + 1);
        }
    }
    
    navigateToPrevious() {
        if (this.sceneHistory.length > 0) {
            const previousIndex = this.sceneHistory.pop();
            this.navigateToScene(previousIndex);
        }
    }
    
    canNavigateNext() {
        const currentScene = this.scenes[this.currentSceneIndex];
        if (!currentScene.required) return true;
        return this.completedScenes.has(currentScene.id);
    }
    
    canNavigatePrevious() {
        return this.sceneHistory.length > 0;
    }
    
    // Transition Methods
    performSceneTransition(fromIndex, toIndex) {
        const container = this.sceneContainer;
        if (!container) return;
        
        // Fade out current scene
        container.style.opacity = '0';
        container.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            // Render new scene
            this.renderCurrentScene();
            
            // Fade in new scene
            container.style.opacity = '1';
            container.style.transform = 'translateX(0)';
            
            this.transitionInProgress = false;
            
            // Announce scene change for accessibility
            this.announceSceneChange();
        }, 300);
    }
    
    announceSceneChange() {
        const currentScene = this.scenes[this.currentSceneIndex];
        const announcement = appData.getStandardUI('accessibility.scene_changed', {
            sceneName: currentScene.name
        });
        
        // Create temporary announcement element
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        
        document.body.appendChild(announcer);
        setTimeout(() => document.body.removeChild(announcer), 1000);
    }
    
    // Scene Rendering
    renderCurrentScene() {
        if (!this.sceneContainer || !this.initialized || this.scenes.length === 0) {
            console.warn('Scene system not ready for rendering');
            return;
        }
        
        const currentScene = this.scenes[this.currentSceneIndex];
        if (!currentScene) {
            console.error('Current scene not found:', this.currentSceneIndex);
            return;
        }
        
        const componentName = this.getSceneComponentName(currentScene.id);
        
        // Check if component exists
        if (!window.MiniReact.components.has(componentName)) {
            console.error('Scene component not found:', componentName);
            return;
        }
        
        // Render scene with progress information
        const sceneProps = {
            sceneId: currentScene.id,
            title: currentScene.name,
            currentScene: this.currentSceneIndex,
            totalScenes: this.scenes.length,
            sceneData: this.sceneStates.get(currentScene.id)
        };
        
        try {
            render(componentName, sceneProps, this.sceneContainer);
            console.log('Rendered scene:', componentName);
        } catch (error) {
            console.error('Error rendering scene:', componentName, error);
        }
    }
    
    getSceneComponentName(sceneId) {
        const componentMap = {
            'intro': 'IntroScene',
            'cheesecake_cut': 'CheesecakeCutScene',
            'cheesecake_reassemble': 'CheesecakeReassembleScene',
            'pizza_cut': 'PizzaCutScene',
            'pizza_count': 'PizzaCountScene',
            'pizza_reassemble': 'PizzaReassembleScene',
            'cookie_quiz': 'CookieQuizScene',
            'summary': 'SummaryScene'
        };
        
        return componentMap[sceneId] || 'IntroScene';
    }
    
    // State Management
    markSceneCompleted(sceneId) {
        this.completedScenes.add(sceneId);
        const sceneState = this.sceneStates.get(sceneId);
        sceneState.completed = true;
        sceneState.endTime = Date.now();
        
        // Update global stats
        const globalState = this.sceneStates.get('global');
        globalState.correctAnswers++;
        
        this.saveProgress();
    }
    
    recordInteraction(sceneId, action, data = {}) {
        const sceneState = this.sceneStates.get(sceneId);
        if (sceneState) {
            sceneState.interactions.push({
                timestamp: Date.now(),
                action,
                data
            });
        }
        
        // Update global interaction count
        const globalState = this.sceneStates.get('global');
        globalState.totalInteractions++;
        
        this.saveProgress();
    }
    
    // Progress Persistence
    saveProgress() {
        try {
            const progressData = {
                currentSceneIndex: this.currentSceneIndex,
                sceneHistory: this.sceneHistory,
                completedScenes: Array.from(this.completedScenes),
                sceneStates: Object.fromEntries(this.sceneStates),
                timestamp: Date.now()
            };
            
            localStorage.setItem('whole-part-applet-progress', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Could not save progress:', error);
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('whole-part-applet-progress');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                this.currentSceneIndex = progressData.currentSceneIndex || 0;
                this.sceneHistory = progressData.sceneHistory || [];
                this.completedScenes = new Set(progressData.completedScenes || []);
                
                if (progressData.sceneStates) {
                    this.sceneStates = new Map(Object.entries(progressData.sceneStates));
                }
                
                return true;
            }
        } catch (error) {
            console.warn('Could not load progress:', error);
        }
        
        return false;
    }
    
    resetProgress() {
        this.currentSceneIndex = 0;
        this.sceneHistory = [];
        this.completedScenes.clear();
        this.initializeScenes();
        localStorage.removeItem('whole-part-applet-progress');
    }
    
    // Event Binding
    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.transitionInProgress) return;
            
            switch (e.key) {
                case 'ArrowRight':
                    if (this.canNavigateNext()) {
                        e.preventDefault();
                        this.navigateToNext();
                    }
                    break;
                case 'ArrowLeft':
                    if (this.canNavigatePrevious()) {
                        e.preventDefault();
                        this.navigateToPrevious();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToScene(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToScene(this.scenes.length - 1);
                    break;
            }
        });
        
        // Handle visibility change (pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProgress();
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }
    
    // Container Initialization
    initializeContainer(container) {
        if (container) {
            this.sceneContainer = container;
        }
        
        // Ensure scene system is initialized
        if (!this.initialized) {
            this.initialize();
        }
        
        // Try to load saved progress
        const hasProgress = this.loadProgress();
        
        // Render initial scene
        this.renderCurrentScene();
        
        return hasProgress;
    }
    
    // Public API
    getCurrentScene() {
        return this.scenes[this.currentSceneIndex];
    }
    
    getProgress() {
        return {
            currentScene: this.currentSceneIndex + 1,
            totalScenes: this.scenes.length,
            completedScenes: this.completedScenes.size,
            percentage: Math.round((this.completedScenes.size / this.scenes.length) * 100)
        };
    }
    
    getSceneState(sceneId) {
        return this.sceneStates.get(sceneId);
    }
}

// Create global scene system instance
const sceneSystem = new SceneSystem();

// Export for global access
window.SceneSystem = sceneSystem;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneSystem, sceneSystem };
}