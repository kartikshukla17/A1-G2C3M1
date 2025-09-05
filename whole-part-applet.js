/**
 * Whole & Part Applet - Main Application Logic
 * Coordinates all systems and manages the overall application state
 */

class WholePartApplet {
    constructor() {
        this.initialized = false;
        this.sceneSystem = null;
        this.audioManager = null;
        this.responsiveManager = null;
        this.eventManager = null;
        this.progressTracker = null;
        
        // Application state
        this.appState = {
            isLoading: true,
            currentLanguage: 'en',
            audioEnabled: true,
            debugMode: false,
            startTime: null,
            sessionId: this.generateSessionId()
        };
        
        // Performance tracking
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            interactionCount: 0,
            errorCount: 0
        };
        
        // Bind methods
        this.handleError = this.handleError.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    
    // Initialization Methods
    async initialize() {
        try {
            this.appState.startTime = Date.now();
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems in order
            await this.initializeCoreSystems();
            await this.initializeManagers();
            await this.initializeUI();
            await this.loadAssets();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize scene system
            await this.initializeScenes();
            
            // Hide loading screen and show app
            this.hideLoadingScreen();
            
            // Mark as initialized
            this.initialized = true;
            this.appState.isLoading = false;
            
            // Record load time
            this.performanceMetrics.loadTime = Date.now() - this.appState.startTime;
            
            // Start the applet
            this.startApplet();
            
            console.log('Whole & Part Applet initialized successfully');
            
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }
    
    async initializeCoreSystems() {
        // Initialize MiniReact if not already done
        if (typeof MiniReact === 'undefined') {
            throw new Error('MiniReact framework not loaded');
        }
        
        // Initialize data system
        if (typeof appData === 'undefined') {
            throw new Error('App data not loaded');
        }
        
        // Set initial language
        const savedLanguage = localStorage.getItem('whole-part-applet-language');
        if (savedLanguage && appData.isLanguageSupported(savedLanguage)) {
            this.appState.currentLanguage = savedLanguage;
            appData.setCurrentLanguage(savedLanguage);
        }
        
        // Initialize audio preferences
        const audioEnabled = localStorage.getItem('whole-part-applet-audio');
        if (audioEnabled !== null) {
            this.appState.audioEnabled = audioEnabled === 'true';
        }
    }
    
    async initializeManagers() {
        // Initialize Audio Manager
        this.audioManager = new AudioManager({
            enabled: this.appState.audioEnabled,
            volume: 0.7,
            preloadSounds: true
        });
        
        // Initialize Responsive Manager
        this.responsiveManager = new ResponsiveManager({
            targetAspectRatio: 16/9,
            minWidth: 320,
            maxWidth: 1920
        });
        
        // Initialize Event Manager
        this.eventManager = new EventManager({
            audioManager: this.audioManager,
            responsiveManager: this.responsiveManager
        });
        
        // Initialize Progress Tracker
        this.progressTracker = new ProgressTracker({
            sessionId: this.appState.sessionId,
            autoSave: true
        });
    }
    
    async initializeUI() {
        // Create main app container
        const appContainer = document.getElementById('app-container');
        if (!appContainer) {
            throw new Error('App container not found');
        }
        
        // Initialize responsive scaling
        this.responsiveManager.initialize(appContainer);
        
        // Create UI structure
        this.createUIStructure(appContainer);
        
        // Initialize components
        this.initializeComponents();
    }
    
    createUIStructure(container) {
        container.innerHTML = `
            <div id="loading-screen" class="loading-screen">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <h2>${appData.getStandardUI('loading.title')}</h2>
                    <p>${appData.getStandardUI('loading.message')}</p>
                </div>
            </div>
            
            <div id="app-header" class="app-header">
                <div class="header-left">
                    <h1 class="app-title">${appData.getContentUI('app.title')}</h1>
                </div>
                <div class="header-center">
                    <div id="progress-indicator" class="progress-indicator"></div>
                </div>
                <div class="header-right">
                    <button id="audio-toggle" class="icon-button" aria-label="${appData.getStandardUI('buttons.toggle_audio')}">
                        <span class="audio-icon">${this.appState.audioEnabled ? '🔊' : '🔇'}</span>
                    </button>
                    <button id="language-toggle" class="icon-button" aria-label="${appData.getStandardUI('buttons.change_language')}">
                        <span class="language-icon">${this.appState.currentLanguage.toUpperCase()}</span>
                    </button>
                </div>
            </div>
            
            <main id="scene-container" class="scene-container" role="main">
                <!-- Scenes will be rendered here -->
            </main>
            
            <div id="app-footer" class="app-footer">
                <div class="footer-content">
                    <div class="progress-info">
                        <span id="scene-counter">1 / 8</span>
                    </div>
                </div>
            </div>
            
            <div id="error-modal" class="modal error-modal hidden">
                <div class="modal-content">
                    <h3>${appData.getStandardUI('error.title')}</h3>
                    <p id="error-message"></p>
                    <button id="error-retry" class="button primary">
                        ${appData.getStandardUI('buttons.retry')}
                    </button>
                </div>
            </div>
        `;
    }
    
    initializeComponents() {
        // Initialize progress indicator
        const progressIndicator = document.getElementById('progress-indicator');
        render('ProgressBar', {
            current: 0,
            total: 8,
            showPercentage: false,
            className: 'scene-progress'
        }, progressIndicator);
        
        // Setup header controls
        this.setupHeaderControls();
    }
    
    setupHeaderControls() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        languageToggle.addEventListener('click', () => {
            this.toggleLanguage();
        });
    }
    
    async loadAssets() {
        // Preload critical assets
        const criticalAssets = [
            'assets/audio/feedback/success.mp3',
            'assets/audio/feedback/error.mp3',
            'assets/audio/interactions/click.mp3',
            'assets/audio/interactions/drag.mp3'
        ];
        
        try {
            await this.audioManager.preloadSounds(criticalAssets);
        } catch (error) {
            console.warn('Some audio assets failed to load:', error);
        }
    }
    
    async initializeScenes() {
        // Initialize scene system
        this.sceneSystem = window.SceneSystem;
        if (!this.sceneSystem) {
            throw new Error('Scene system not available');
        }
        
        // Get scene container
        const sceneContainer = document.getElementById('scene-container');
        if (!sceneContainer) {
            throw new Error('Scene container not found');
        }
        
        // Initialize scene system with container
        const hasProgress = this.sceneSystem.initializeContainer(sceneContainer);
        
        // Setup scene change listeners
        this.setupSceneListeners();
        
        // Update progress display
        this.updateProgressDisplay();
        
        return hasProgress;
    }
    
    setupSceneListeners() {
        // Listen for scene changes
        document.addEventListener('sceneChanged', (event) => {
            this.handleSceneChange(event.detail);
        });
        
        // Listen for scene completion
        document.addEventListener('sceneCompleted', (event) => {
            this.handleSceneCompletion(event.detail);
        });
        
        // Listen for interactions
        document.addEventListener('userInteraction', (event) => {
            this.handleUserInteraction(event.detail);
        });
    }
    
    // Event Handlers
    handleSceneChange(sceneData) {
        // Update progress display
        this.updateProgressDisplay();
        
        // Play transition sound
        this.audioManager.playSound('transition');
        
        // Track scene change
        this.progressTracker.recordSceneChange(sceneData);
        
        // Update URL hash for deep linking
        window.location.hash = `scene-${sceneData.sceneIndex + 1}`;
    }
    
    handleSceneCompletion(sceneData) {
        // Play success sound
        this.audioManager.playSound('success');
        
        // Track completion
        this.progressTracker.recordSceneCompletion(sceneData);
        
        // Update progress display
        this.updateProgressDisplay();
        
        // Check if all scenes completed
        if (this.sceneSystem.getProgress().percentage === 100) {
            this.handleAppletCompletion();
        }
    }
    
    handleUserInteraction(interactionData) {
        // Increment interaction count
        this.performanceMetrics.interactionCount++;
        
        // Play interaction sound
        this.audioManager.playSound('click');
        
        // Track interaction
        this.progressTracker.recordInteraction(interactionData);
    }
    
    handleAppletCompletion() {
        // Show completion modal
        this.showCompletionModal();
        
        // Save final progress
        this.progressTracker.saveProgress();
        
        // Play completion sound
        this.audioManager.playSound('completion');
    }
    
    // UI Control Methods
    toggleAudio() {
        this.appState.audioEnabled = !this.appState.audioEnabled;
        this.audioManager.setEnabled(this.appState.audioEnabled);
        
        // Update UI
        const audioIcon = document.querySelector('.audio-icon');
        audioIcon.textContent = this.appState.audioEnabled ? '🔊' : '🔇';
        
        // Save preference
        localStorage.setItem('whole-part-applet-audio', this.appState.audioEnabled.toString());
        
        // Play feedback sound if enabled
        if (this.appState.audioEnabled) {
            this.audioManager.playSound('click');
        }
    }
    
    toggleLanguage() {
        // Cycle through available languages
        const languages = appData.getAvailableLanguages();
        const currentIndex = languages.indexOf(this.appState.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        const newLanguage = languages[nextIndex];
        
        // Update language
        this.appState.currentLanguage = newLanguage;
        appData.setCurrentLanguage(newLanguage);
        
        // Update UI
        const languageIcon = document.querySelector('.language-icon');
        languageIcon.textContent = newLanguage.toUpperCase();
        
        // Save preference
        localStorage.setItem('whole-part-applet-language', newLanguage);
        
        // Re-render current scene with new language
        this.sceneSystem.renderCurrentScene();
        
        // Update other UI elements
        this.updateUILanguage();
        
        // Play feedback sound
        this.audioManager.playSound('click');
    }
    
    updateUILanguage() {
        // Update header elements
        const appTitle = document.querySelector('.app-title');
        if (appTitle) {
            appTitle.textContent = appData.getContentUI('app.title');
        }
        
        // Update button labels
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.setAttribute('aria-label', appData.getStandardUI('buttons.toggle_audio'));
        }
        
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.setAttribute('aria-label', appData.getStandardUI('buttons.change_language'));
        }
    }
    
    updateProgressDisplay() {
        const progress = this.sceneSystem.getProgress();
        
        // Update progress bar
        const progressIndicator = document.getElementById('progress-indicator');
        if (progressIndicator) {
            render('ProgressBar', {
                current: progress.currentScene,
                total: progress.totalScenes,
                showPercentage: false,
                className: 'scene-progress'
            }, progressIndicator);
        }
        
        // Update scene counter
        const sceneCounter = document.getElementById('scene-counter');
        if (sceneCounter) {
            sceneCounter.textContent = `${progress.currentScene} / ${progress.totalScenes}`;
        }
    }
    
    // Loading Screen Methods
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }
    
    // Modal Methods
    showCompletionModal() {
        const progress = this.sceneSystem.getProgress();
        const stats = this.progressTracker.getStats();
        
        const modal = document.createElement('div');
        modal.className = 'modal completion-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${appData.getContentUI('completion.title')}</h2>
                <div class="completion-stats">
                    <div class="stat">
                        <span class="stat-label">${appData.getContentUI('completion.scenes_completed')}</span>
                        <span class="stat-value">${progress.completedScenes} / ${progress.totalScenes}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">${appData.getContentUI('completion.total_interactions')}</span>
                        <span class="stat-value">${stats.totalInteractions}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">${appData.getContentUI('completion.time_spent')}</span>
                        <span class="stat-value">${this.formatTime(stats.totalTime)}</span>
                    </div>
                </div>
                <div class="completion-actions">
                    <button id="restart-button" class="button primary">
                        ${appData.getStandardUI('buttons.restart')}
                    </button>
                    <button id="close-completion" class="button secondary">
                        ${appData.getStandardUI('buttons.close')}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal events
        modal.querySelector('#restart-button').addEventListener('click', () => {
            this.restartApplet();
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#close-completion').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    // Utility Methods
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }
    
    // Event Listeners Setup
    setupEventListeners() {
        // Window events
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleResize);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Error handling
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handleError);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.restartApplet();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.toggleAudio();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.toggleLanguage();
                        break;
                }
            }
        });
    }
    
    handleResize() {
        if (this.responsiveManager) {
            this.responsiveManager.handleResize();
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause audio and save progress
            this.audioManager.pauseAll();
            this.progressTracker.saveProgress();
        } else {
            // Resume audio
            this.audioManager.resumeAll();
        }
    }
    
    handleError(message, error) {
        console.error('Applet Error:', message, error);
        this.performanceMetrics.errorCount++;
        
        // Show error modal
        const errorModal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        
        if (errorModal && errorMessage) {
            errorMessage.textContent = typeof message === 'string' ? message : 'An unexpected error occurred';
            errorModal.classList.remove('hidden');
        }
    }
    
    // Public API Methods
    startApplet() {
        if (!this.initialized) {
            throw new Error('Applet not initialized');
        }
        
        // Start the first scene
        this.sceneSystem.navigateToScene(0);
        
        // Start progress tracking
        this.progressTracker.startSession();
        
        console.log('Whole & Part Applet started');
    }
    
    restartApplet() {
        // Reset all systems
        this.sceneSystem.resetProgress();
        this.progressTracker.resetProgress();
        
        // Navigate to first scene
        this.sceneSystem.navigateToScene(0);
        
        // Update displays
        this.updateProgressDisplay();
        
        // Generate new session
        this.appState.sessionId = this.generateSessionId();
        
        console.log('Applet restarted');
    }
    
    getAppState() {
        return {
            ...this.appState,
            progress: this.sceneSystem ? this.sceneSystem.getProgress() : null,
            performance: this.performanceMetrics
        };
    }
}

// Initialize applet when DOM is ready
let appletInstance = null;

function initializeApplet() {
    if (appletInstance) {
        console.warn('Applet already initialized');
        return appletInstance;
    }
    
    appletInstance = new WholePartApplet();
    appletInstance.initialize().catch(error => {
        console.error('Failed to initialize applet:', error);
    });
    
    return appletInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplet);
} else {
    initializeApplet();
}

// Export for global access
window.WholePartApplet = WholePartApplet;
window.appletInstance = appletInstance;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WholePartApplet, initializeApplet };
}