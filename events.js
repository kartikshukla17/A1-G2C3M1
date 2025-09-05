/**
 * Event Management System for Whole & Part Applet
 * Handles drag-and-drop, slicing, quiz interactions, and audio feedback
 */

class EventManager {
    constructor(options = {}) {
        this.audioManager = options.audioManager;
        this.responsiveManager = options.responsiveManager;
        
        // Event state
        this.activeInteractions = new Map();
        this.dragState = {
            isDragging: false,
            draggedElement: null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 }
        };
        
        this.sliceState = {
            isSlicing: false,
            selectedTool: null,
            targetFood: null
        };
        
        this.quizState = {
            currentQuestion: 0,
            selectedAnswer: null,
            attempts: 0
        };
        
        // Touch/mouse support
        this.inputType = 'mouse';
        this.touchSupported = 'ontouchstart' in window;
        
        this.bindGlobalEvents();
    }
    
    // Global Event Binding
    bindGlobalEvents() {
        // Prevent default drag behavior on images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
        
        // Handle context menu
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.interactive-element')) {
                e.preventDefault();
            }
        });
        
        // Handle selection
        document.addEventListener('selectstart', (e) => {
            if (e.target.closest('.interactive-element')) {
                e.preventDefault();
            }
        });
    }
    
    // Drag and Drop System
    initializeDragAndDrop(element, options = {}) {
        const config = {
            constrainToParent: true,
            snapToGrid: false,
            gridSize: 20,
            dropZones: [],
            onDragStart: null,
            onDragMove: null,
            onDragEnd: null,
            onDrop: null,
            ...options
        };
        
        // Store configuration
        const elementId = this.getElementId(element);
        this.activeInteractions.set(elementId, {
            type: 'drag',
            element,
            config,
            state: { isDragging: false }
        });
        
        // Add drag class
        element.classList.add('draggable-element');
        
        // Bind events based on input type
        if (this.touchSupported) {
            this.bindTouchDragEvents(element, config);
        }
        this.bindMouseDragEvents(element, config);
        
        return elementId;
    }
    
    bindMouseDragEvents(element, config) {
        element.addEventListener('mousedown', (e) => {
            this.startDrag(element, config, {
                x: e.clientX,
                y: e.clientY,
                type: 'mouse'
            });
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.dragState.isDragging && this.dragState.draggedElement === element) {
                this.updateDrag({
                    x: e.clientX,
                    y: e.clientY,
                    type: 'mouse'
                });
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (this.dragState.isDragging && this.dragState.draggedElement === element) {
                this.endDrag({
                    x: e.clientX,
                    y: e.clientY,
                    type: 'mouse'
                });
            }
        });
    }
    
    bindTouchDragEvents(element, config) {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrag(element, config, {
                x: touch.clientX,
                y: touch.clientY,
                type: 'touch'
            });
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.dragState.isDragging && this.dragState.draggedElement === element) {
                e.preventDefault();
                const touch = e.touches[0];
                this.updateDrag({
                    x: touch.clientX,
                    y: touch.clientY,
                    type: 'touch'
                });
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.dragState.isDragging && this.dragState.draggedElement === element) {
                e.preventDefault();
                const touch = e.changedTouches[0];
                this.endDrag({
                    x: touch.clientX,
                    y: touch.clientY,
                    type: 'touch'
                });
            }
        });
    }
    
    startDrag(element, config, pointer) {
        this.dragState.isDragging = true;
        this.dragState.draggedElement = element;
        this.inputType = pointer.type;
        
        // Get element position
        const rect = element.getBoundingClientRect();
        this.dragState.startPosition = {
            x: rect.left,
            y: rect.top
        };
        
        // Calculate offset from pointer to element center
        this.dragState.offset = {
            x: pointer.x - rect.left - rect.width / 2,
            y: pointer.y - rect.top - rect.height / 2
        };
        
        // Add dragging class
        element.classList.add('dragging');
        
        // Play drag start sound
        if (this.audioManager) {
            this.audioManager.playSound('drag_start');
        }
        
        // Call callback
        if (config.onDragStart) {
            config.onDragStart(element, this.dragState.startPosition);
        }
        
        // Dispatch custom event
        this.dispatchInteractionEvent('dragStart', {
            element,
            position: this.dragState.startPosition,
            inputType: this.inputType
        });
    }
    
    updateDrag(pointer) {
        if (!this.dragState.isDragging) return;
        
        const element = this.dragState.draggedElement;
        const elementId = this.getElementId(element);
        const interaction = this.activeInteractions.get(elementId);
        
        if (!interaction) return;
        
        const config = interaction.config;
        
        // Calculate new position
        let newX = pointer.x - this.dragState.offset.x;
        let newY = pointer.y - this.dragState.offset.y;
        
        // Apply constraints
        if (config.constrainToParent) {
            const parent = element.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            newX = Math.max(parentRect.left, Math.min(newX, parentRect.right - elementRect.width));
            newY = Math.max(parentRect.top, Math.min(newY, parentRect.bottom - elementRect.height));
        }
        
        // Apply grid snapping
        if (config.snapToGrid) {
            newX = Math.round(newX / config.gridSize) * config.gridSize;
            newY = Math.round(newY / config.gridSize) * config.gridSize;
        }
        
        // Update position
        this.dragState.currentPosition = { x: newX, y: newY };
        element.style.left = newX + 'px';
        element.style.top = newY + 'px';
        
        // Check drop zones
        this.checkDropZones(element, config.dropZones, { x: newX, y: newY });
        
        // Call callback
        if (config.onDragMove) {
            config.onDragMove(element, this.dragState.currentPosition);
        }
    }
    
    endDrag(pointer) {
        if (!this.dragState.isDragging) return;
        
        const element = this.dragState.draggedElement;
        const elementId = this.getElementId(element);
        const interaction = this.activeInteractions.get(elementId);
        
        if (!interaction) return;
        
        const config = interaction.config;
        
        // Remove dragging class
        element.classList.remove('dragging');
        
        // Check for successful drop
        const dropResult = this.checkDropZones(element, config.dropZones, this.dragState.currentPosition, true);
        
        // Play appropriate sound
        if (this.audioManager) {
            if (dropResult.success) {
                this.audioManager.playSound('drop_success');
            } else {
                this.audioManager.playSound('drop_fail');
            }
        }
        
        // Call callbacks
        if (config.onDragEnd) {
            config.onDragEnd(element, this.dragState.currentPosition, dropResult);
        }
        
        if (dropResult.success && config.onDrop) {
            config.onDrop(element, dropResult.dropZone, this.dragState.currentPosition);
        }
        
        // Dispatch custom event
        this.dispatchInteractionEvent('dragEnd', {
            element,
            position: this.dragState.currentPosition,
            dropResult,
            inputType: this.inputType
        });
        
        // Reset drag state
        this.resetDragState();
    }
    
    checkDropZones(element, dropZones, position, finalCheck = false) {
        const elementRect = {
            x: position.x,
            y: position.y,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        
        for (const dropZone of dropZones) {
            const zoneElement = typeof dropZone.element === 'string' 
                ? document.querySelector(dropZone.element)
                : dropZone.element;
            
            if (!zoneElement) continue;
            
            const zoneRect = zoneElement.getBoundingClientRect();
            
            // Check overlap
            const overlap = this.calculateOverlap(elementRect, {
                x: zoneRect.left,
                y: zoneRect.top,
                width: zoneRect.width,
                height: zoneRect.height
            });
            
            const threshold = dropZone.threshold || 0.5;
            const overlapPercentage = overlap / (elementRect.width * elementRect.height);
            
            if (overlapPercentage >= threshold) {
                // Highlight drop zone
                zoneElement.classList.add('drop-zone-active');
                
                if (finalCheck) {
                    zoneElement.classList.add('drop-zone-success');
                    return {
                        success: true,
                        dropZone: dropZone,
                        element: zoneElement,
                        overlap: overlapPercentage
                    };
                }
            } else {
                zoneElement.classList.remove('drop-zone-active');
            }
        }
        
        return { success: false };
    }
    
    calculateOverlap(rect1, rect2) {
        const left = Math.max(rect1.x, rect2.x);
        const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
        const top = Math.max(rect1.y, rect2.y);
        const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
        
        if (left < right && top < bottom) {
            return (right - left) * (bottom - top);
        }
        
        return 0;
    }
    
    resetDragState() {
        this.dragState = {
            isDragging: false,
            draggedElement: null,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 }
        };
    }
    
    // Slicing System
    initializeSlicing(toolElement, targetElements, options = {}) {
        const config = {
            requireToolSelection: true,
            sliceAnimation: true,
            sliceSound: true,
            onToolSelect: null,
            onSlice: null,
            ...options
        };
        
        // Setup tool selection
        toolElement.addEventListener('click', () => {
            this.selectSlicingTool(toolElement, config);
        });
        
        // Setup target elements
        targetElements.forEach(target => {
            target.addEventListener('click', () => {
                this.attemptSlice(target, config);
            });
        });
        
        return {
            toolElement,
            targetElements,
            config
        };
    }
    
    selectSlicingTool(toolElement, config) {
        // Deselect previous tool
        document.querySelectorAll('.slicing-tool.selected').forEach(tool => {
            tool.classList.remove('selected');
        });
        
        // Select new tool
        toolElement.classList.add('selected');
        this.sliceState.selectedTool = toolElement;
        
        // Play selection sound
        if (this.audioManager && config.sliceSound) {
            this.audioManager.playSound('tool_select');
        }
        
        // Call callback
        if (config.onToolSelect) {
            config.onToolSelect(toolElement);
        }
        
        // Dispatch event
        this.dispatchInteractionEvent('toolSelected', {
            tool: toolElement,
            toolType: toolElement.dataset.toolType || 'slicer'
        });
    }
    
    attemptSlice(targetElement, config) {
        const canSlice = !config.requireToolSelection || this.sliceState.selectedTool;
        
        if (!canSlice) {
            // Show error feedback
            this.showSliceError(targetElement, 'No tool selected');
            return false;
        }
        
        // Perform slice
        this.performSlice(targetElement, config);
        return true;
    }
    
    performSlice(targetElement, config) {
        // Add slicing animation
        if (config.sliceAnimation) {
            targetElement.classList.add('slicing');
            
            setTimeout(() => {
                targetElement.classList.remove('slicing');
                targetElement.classList.add('sliced');
            }, 300);
        } else {
            targetElement.classList.add('sliced');
        }
        
        // Play slice sound
        if (this.audioManager && config.sliceSound) {
            this.audioManager.playSound('slice');
        }
        
        // Call callback
        if (config.onSlice) {
            config.onSlice(targetElement, this.sliceState.selectedTool);
        }
        
        // Dispatch event
        this.dispatchInteractionEvent('slicePerformed', {
            target: targetElement,
            tool: this.sliceState.selectedTool,
            foodType: targetElement.dataset.foodType || 'unknown'
        });
    }
    
    showSliceError(targetElement, message) {
        // Add error animation
        targetElement.classList.add('slice-error');
        
        setTimeout(() => {
            targetElement.classList.remove('slice-error');
        }, 500);
        
        // Play error sound
        if (this.audioManager) {
            this.audioManager.playSound('error');
        }
        
        // Dispatch event
        this.dispatchInteractionEvent('sliceError', {
            target: targetElement,
            message
        });
    }
    
    // Quiz System
    initializeQuiz(quizContainer, questions, options = {}) {
        const config = {
            allowMultipleAttempts: true,
            showFeedback: true,
            randomizeAnswers: false,
            onAnswerSelect: null,
            onQuestionComplete: null,
            onQuizComplete: null,
            ...options
        };
        
        this.quizState = {
            currentQuestion: 0,
            selectedAnswer: null,
            attempts: 0,
            questions,
            config,
            container: quizContainer
        };
        
        this.renderCurrentQuestion();
        
        return this.quizState;
    }
    
    renderCurrentQuestion() {
        const { currentQuestion, questions, config, container } = this.quizState;
        const question = questions[currentQuestion];
        
        if (!question) {
            this.completeQuiz();
            return;
        }
        
        let answers = [...question.answers];
        if (config.randomizeAnswers) {
            answers = this.shuffleArray(answers);
        }
        
        container.innerHTML = `
            <div class="quiz-question">
                <h3 class="question-text">${question.text}</h3>
                <div class="question-answers">
                    ${answers.map((answer, index) => `
                        <button class="answer-button" data-answer-id="${answer.id}">
                            ${answer.text}
                        </button>
                    `).join('')}
                </div>
                <div class="question-feedback" id="question-feedback"></div>
            </div>
        `;
        
        // Bind answer events
        container.querySelectorAll('.answer-button').forEach(button => {
            button.addEventListener('click', () => {
                this.selectAnswer(button.dataset.answerId);
            });
        });
    }
    
    selectAnswer(answerId) {
        const { currentQuestion, questions, config } = this.quizState;
        const question = questions[currentQuestion];
        const answer = question.answers.find(a => a.id === answerId);
        
        if (!answer) return;
        
        this.quizState.selectedAnswer = answer;
        this.quizState.attempts++;
        
        // Update UI
        const buttons = this.quizState.container.querySelectorAll('.answer-button');
        buttons.forEach(button => {
            button.classList.remove('selected', 'correct', 'incorrect');
            if (button.dataset.answerId === answerId) {
                button.classList.add('selected');
            }
        });
        
        // Check answer
        const isCorrect = answer.correct;
        
        if (isCorrect) {
            this.handleCorrectAnswer(answer);
        } else {
            this.handleIncorrectAnswer(answer);
        }
        
        // Call callback
        if (config.onAnswerSelect) {
            config.onAnswerSelect(answer, isCorrect, this.quizState.attempts);
        }
    }
    
    handleCorrectAnswer(answer) {
        const { config, container } = this.quizState;
        
        // Update UI
        const selectedButton = container.querySelector(`[data-answer-id="${answer.id}"]`);
        selectedButton.classList.add('correct');
        
        // Show feedback
        if (config.showFeedback) {
            this.showQuizFeedback(answer.feedback || 'Correct!', 'success');
        }
        
        // Play success sound
        if (this.audioManager) {
            this.audioManager.playSound('quiz_correct');
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
        
        // Dispatch event
        this.dispatchInteractionEvent('quizAnswerCorrect', {
            question: this.quizState.currentQuestion,
            answer,
            attempts: this.quizState.attempts
        });
    }
    
    handleIncorrectAnswer(answer) {
        const { config, container } = this.quizState;
        
        // Update UI
        const selectedButton = container.querySelector(`[data-answer-id="${answer.id}"]`);
        selectedButton.classList.add('incorrect');
        
        // Show feedback
        if (config.showFeedback) {
            this.showQuizFeedback(answer.feedback || 'Try again!', 'error');
        }
        
        // Play error sound
        if (this.audioManager) {
            this.audioManager.playSound('quiz_incorrect');
        }
        
        // Allow retry if configured
        if (config.allowMultipleAttempts) {
            setTimeout(() => {
                selectedButton.classList.remove('selected', 'incorrect');
                this.clearQuizFeedback();
            }, 1500);
        }
        
        // Dispatch event
        this.dispatchInteractionEvent('quizAnswerIncorrect', {
            question: this.quizState.currentQuestion,
            answer,
            attempts: this.quizState.attempts
        });
    }
    
    showQuizFeedback(message, type) {
        const feedbackElement = document.getElementById('question-feedback');
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `question-feedback ${type}`;
            feedbackElement.classList.add('visible');
        }
    }
    
    clearQuizFeedback() {
        const feedbackElement = document.getElementById('question-feedback');
        if (feedbackElement) {
            feedbackElement.classList.remove('visible');
        }
    }
    
    nextQuestion() {
        const { config } = this.quizState;
        
        // Call callback
        if (config.onQuestionComplete) {
            config.onQuestionComplete(this.quizState.currentQuestion, this.quizState.attempts);
        }
        
        // Move to next question
        this.quizState.currentQuestion++;
        this.quizState.attempts = 0;
        this.quizState.selectedAnswer = null;
        
        // Render next question
        this.renderCurrentQuestion();
    }
    
    completeQuiz() {
        const { config } = this.quizState;
        
        // Call callback
        if (config.onQuizComplete) {
            config.onQuizComplete(this.quizState);
        }
        
        // Dispatch event
        this.dispatchInteractionEvent('quizComplete', {
            totalQuestions: this.quizState.questions.length,
            totalAttempts: this.quizState.attempts
        });
    }
    
    // Utility Methods
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    getElementId(element) {
        if (!element.id) {
            element.id = 'interactive_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        return element.id;
    }
    
    dispatchInteractionEvent(type, detail) {
        const event = new CustomEvent('userInteraction', {
            detail: {
                type,
                timestamp: Date.now(),
                ...detail
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Cleanup Methods
    removeInteraction(elementId) {
        const interaction = this.activeInteractions.get(elementId);
        if (interaction) {
            const element = interaction.element;
            
            // Remove classes
            element.classList.remove('draggable-element', 'slicing-tool', 'quiz-element');
            
            // Remove from active interactions
            this.activeInteractions.delete(elementId);
        }
    }
    
    cleanup() {
        // Clear all active interactions
        this.activeInteractions.clear();
        
        // Reset states
        this.resetDragState();
        this.sliceState = {
            isSlicing: false,
            selectedTool: null,
            targetFood: null
        };
        this.quizState = {
            currentQuestion: 0,
            selectedAnswer: null,
            attempts: 0
        };
    }
}

// Audio Manager for interaction sounds
class AudioManager {
    constructor(options = {}) {
        this.enabled = options.enabled !== false;
        this.volume = options.volume || 0.7;
        this.sounds = new Map();
        this.audioContext = null;
        this.preloadSounds = options.preloadSounds || false;
        
        this.initializeAudioContext();
        this.loadDefaultSounds();
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }
    
    loadDefaultSounds() {
        const defaultSounds = {
            click: this.createBeepSound(800, 0.1),
            drag_start: this.createBeepSound(600, 0.15),
            drop_success: this.createBeepSound(1000, 0.2),
            drop_fail: this.createBeepSound(300, 0.3),
            slice: this.createBeepSound(1200, 0.25),
            tool_select: this.createBeepSound(900, 0.1),
            quiz_correct: this.createBeepSound(1500, 0.3),
            quiz_incorrect: this.createBeepSound(200, 0.4),
            error: this.createBeepSound(150, 0.5),
            success: this.createBeepSound(1800, 0.4),
            transition: this.createBeepSound(700, 0.2)
        };
        
        Object.entries(defaultSounds).forEach(([name, sound]) => {
            this.sounds.set(name, sound);
        });
    }
    
    createBeepSound(frequency, duration) {
        return {
            type: 'beep',
            frequency,
            duration
        };
    }
    
    playSound(soundName) {
        if (!this.enabled || !this.audioContext) return;
        
        const sound = this.sounds.get(soundName);
        if (!sound) return;
        
        if (sound.type === 'beep') {
            this.playBeep(sound.frequency, sound.duration);
        } else if (sound.type === 'audio') {
            this.playAudioFile(sound.audio);
        }
    }
    
    playBeep(frequency, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playAudioFile(audio) {
        if (audio && typeof audio.play === 'function') {
            audio.volume = this.volume;
            audio.play().catch(error => {
                console.warn('Audio play failed:', error);
            });
        }
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    pauseAll() {
        // Pause any playing audio files
        this.sounds.forEach(sound => {
            if (sound.type === 'audio' && sound.audio) {
                sound.audio.pause();
            }
        });
    }
    
    resumeAll() {
        // Resume audio context if suspended
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Progress Tracker for analytics
class ProgressTracker {
    constructor(options = {}) {
        this.sessionId = options.sessionId || 'session_' + Date.now();
        this.autoSave = options.autoSave !== false;
        
        this.sessionData = {
            sessionId: this.sessionId,
            startTime: Date.now(),
            endTime: null,
            scenes: [],
            interactions: [],
            errors: []
        };
    }
    
    startSession() {
        this.sessionData.startTime = Date.now();
    }
    
    recordSceneChange(sceneData) {
        this.sessionData.scenes.push({
            timestamp: Date.now(),
            type: 'scene_change',
            ...sceneData
        });
        
        if (this.autoSave) {
            this.saveProgress();
        }
    }
    
    recordSceneCompletion(sceneData) {
        this.sessionData.scenes.push({
            timestamp: Date.now(),
            type: 'scene_complete',
            ...sceneData
        });
        
        if (this.autoSave) {
            this.saveProgress();
        }
    }
    
    recordInteraction(interactionData) {
        this.sessionData.interactions.push({
            timestamp: Date.now(),
            ...interactionData
        });
        
        if (this.autoSave) {
            this.saveProgress();
        }
    }
    
    recordError(errorData) {
        this.sessionData.errors.push({
            timestamp: Date.now(),
            ...errorData
        });
        
        if (this.autoSave) {
            this.saveProgress();
        }
    }
    
    getStats() {
        const now = Date.now();
        return {
            sessionDuration: now - this.sessionData.startTime,
            totalInteractions: this.sessionData.interactions.length,
            totalScenes: this.sessionData.scenes.filter(s => s.type === 'scene_change').length,
            completedScenes: this.sessionData.scenes.filter(s => s.type === 'scene_complete').length,
            totalErrors: this.sessionData.errors.length
        };
    }
    
    saveProgress() {
        try {
            localStorage.setItem('whole-part-applet-session', JSON.stringify(this.sessionData));
        } catch (error) {
            console.warn('Could not save session data:', error);
        }
    }
    
    resetProgress() {
        this.sessionData = {
            sessionId: 'session_' + Date.now(),
            startTime: Date.now(),
            endTime: null,
            scenes: [],
            interactions: [],
            errors: []
        };
        
        localStorage.removeItem('whole-part-applet-session');
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventManager, AudioManager, ProgressTracker };
}

// Global access
window.EventManager = EventManager;
window.AudioManager = AudioManager;
window.ProgressTracker = ProgressTracker;