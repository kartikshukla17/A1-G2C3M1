/**
 * Scene Implementations for Whole & Part Applet
 * Contains all 8 scenes with specific interactions and learning objectives
 */

class SceneImplementations {
    constructor(options = {}) {
        this.miniReact = options.miniReact;
        this.interactiveManager = options.interactiveManager;
        this.audioManager = options.audioManager;
        this.responsiveManager = options.responsiveManager;
        this.appData = options.appData;
        this.currentLanguage = options.currentLanguage || 'en';
        
        // Scene state management
        this.sceneStates = new Map();
        this.globalState = {
            cheesecakeSlices: 0,
            pizzaSlices: 0,
            cookieAnswers: [],
            totalScore: 0,
            completedScenes: new Set()
        };
    }
    
    // Helper function to generate consistent navigation controls
    generateSceneNavigation(sceneId, isComplete = false) {
        const getText = (key) => {
            return this.appData[this.currentLanguage]?.['standard-ui']?.[key] || key;
        };
        
        const progress = window.sceneSystem ? window.sceneSystem.getProgress() : { currentScene: 1, totalScenes: 8 };
        
        return `
            <div class="scene-footer">
                <div class="scene-footer-content">
                    <button class="nav-button prev-button" 
                            onclick="window.sceneSystem.navigateToPrevious()"
                            ${!window.sceneSystem || !window.sceneSystem.canNavigatePrevious() ? 'disabled' : ''}>
                        ← ${getText('previous') || 'Previous'}
                    </button>
                    
                    <div class="scene-progress">
                        <span class="scene-progress-text">
                            ${getText('scene_progress') || 'Scene'} ${progress.currentScene} ${getText('of') || 'of'} ${progress.totalScenes}
                        </span>
                    </div>
                    
                    <button class="nav-button next-button" 
                            onclick="window.sceneSystem.navigateToNext()"
                            ${!isComplete ? 'disabled' : ''}>
                        ${getText('next') || 'Next'} →
                    </button>
                </div>
            </div>
        `;
    }
    
    // Scene 1: Introduction
    createIntroScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [animationStep, setAnimationStep] = useState(0);
            const [isReady, setIsReady] = useState(false);
            
            useEffect(() => {
                // Animate introduction elements
                const timer = setTimeout(() => {
                    setAnimationStep(prev => {
                        if (prev < 3) return prev + 1;
                        setIsReady(true);
                        return prev;
                    });
                }, 1000);
                
                return () => clearTimeout(timer);
            }, [animationStep]);
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene intro-scene" data-scene="intro">
                    <div class="scene-content">
                        <div class="intro-header ${animationStep >= 1 ? 'animate-in' : ''}">
                            <h1 class="intro-title">${getText('intro_title')}</h1>
                            <div class="intro-subtitle">${getText('intro_subtitle')}</div>
                        </div>
                        
                        <div class="intro-visual ${animationStep >= 2 ? 'animate-in' : ''}">
                            <div class="whole-part-demo">
                                <div class="demo-whole">
                                    <div class="demo-circle"></div>
                                    <div class="demo-label">${getText('whole_label')}</div>
                                </div>
                                <div class="demo-arrow">→</div>
                                <div class="demo-parts">
                                    <div class="demo-slice"></div>
                                    <div class="demo-slice"></div>
                                    <div class="demo-slice"></div>
                                    <div class="demo-slice"></div>
                                    <div class="demo-label">${getText('parts_label')}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="intro-instructions ${animationStep >= 3 ? 'animate-in' : ''}">
                            <p class="instruction-text">${getText('intro_instructions')}</p>
                            <div class="interaction-hints">
                                <div class="hint-item">
                                    <div class="hint-icon drag-icon"></div>
                                    <span>${getText('drag_hint')}</span>
                                </div>
                                <div class="hint-item">
                                    <div class="hint-icon slice-icon"></div>
                                    <span>${getText('slice_hint')}</span>
                                </div>
                                <div class="hint-item">
                                    <div class="hint-icon count-icon"></div>
                                    <span>${getText('count_hint')}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="intro-actions ${isReady ? 'animate-in' : ''}">
                            <button class="btn btn-primary btn-large start-button" 
                                    onclick="window.sceneSystem.navigateToNext()">
                                ${getText('start_button')}
                            </button>
                        </div>
                    </div>
                    ${this.generateSceneNavigation('intro', isReady)}
                </div>
            `;
        };
    }
    
    // Scene 2: Cheesecake Introduction
    createCheesecakeIntroScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [showInstructions, setShowInstructions] = useState(false);
            
            useEffect(() => {
                setTimeout(() => setShowInstructions(true), 500);
            }, []);
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene cheesecake-intro-scene" data-scene="cheesecake-intro">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('cheesecake_title')}</h2>
                        <div class="progress-indicator">
                            <div class="progress-bar" style="width: 25%"></div>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="cheesecake-container">
                            <div class="whole-cheesecake" id="whole-cheesecake">
                                <div class="cheesecake-base"></div>
                                <div class="cheesecake-filling"></div>
                                <div class="cheesecake-topping"></div>
                            </div>
                        </div>
                        
                        <div class="instructions-panel ${showInstructions ? 'show' : ''}">
                            <div class="instruction-content">
                                <h3>${getText('cheesecake_instruction_title')}</h3>
                                <p>${getText('cheesecake_instruction_text')}</p>
                                
                                <div class="slicing-tools">
                                    <div class="tool-item slicing-tool" data-tool="knife" 
                                         onclick="window.interactiveManager.selectSlicingTool(this)">
                                        <div class="tool-icon knife-icon"></div>
                                        <span>${getText('knife_tool')}</span>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary" 
                                        onclick="window.sceneSystem.navigateToNext()">
                                    ${getText('ready_to_slice')}
                                </button>
                            </div>
                        </div>
                    </div>
                    ${this.generateSceneNavigation('cheesecake-intro', showInstructions)}
                </div>
            `;
        };
    }
    
    // Scene 3: Cheesecake Slicing
    createCheesecakeSliceScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [slices, setSlices] = useState([]);
            const [countingMode, setCountingMode] = useState(false);
            const [countedSlices, setCountedSlices] = useState(new Set());
            const [currentCount, setCurrentCount] = useState(0);
            const targetSlices = 2;
            
            useEffect(() => {
                if (!countingMode) {
                    this.setupCheesecakeSlicing();
                }
            }, [countingMode]);
            
            const handleSliceComplete = (sliceData) => {
                setSlices(prev => {
                    const newSlices = [...prev, sliceData];
                    if (newSlices.length >= targetSlices) {
                        setTimeout(() => {
                            setCountingMode(true);
                        }, 500);
                    }
                    return newSlices;
                });
                
                if (this.audioManager) {
                    this.audioManager.playSound('slice_success');
                }
            };
            
            const handleSliceTap = (sliceIndex) => {
                if (countedSlices.has(sliceIndex)) return;
                
                const newCountedSlices = new Set([...countedSlices, sliceIndex]);
                setCountedSlices(newCountedSlices);
                setCurrentCount(newCountedSlices.size);
                
                if (this.audioManager) {
                    this.audioManager.playSound('count_feedback');
                }
                
                // Mark scene as complete when all slices are counted
                if (newCountedSlices.size >= targetSlices) {
                    this.globalState.cheesecakeSlices = targetSlices;
                    // Enable next button instead of auto-advancing
                    window.sceneSystem.markSceneComplete('cheesecake-slice');
                }
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene cheesecake-slice-scene" data-scene="cheesecake-slice">
                    <div class="scene-header">
                        <h2 class="scene-title">${countingMode ? getText('count_the_slices') : getText('slice_cheesecake_title')}</h2>
                        <div class="step-indicator">
                            <span class="step ${!countingMode ? 'active' : 'completed'}">${getText('slice_step')}</span>
                            <span class="step ${countingMode ? 'active' : ''}">${getText('count_step')}</span>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        ${!countingMode ? `
                            <div class="slicing-workspace">
                                <div class="cheesecake-to-slice" id="sliceable-cheesecake" 
                                     data-sliceable="true" 
                                     data-slice-config='{"maxSlices": ${targetSlices}, "onSlice": "handleSliceComplete"}'>
                                    <div class="cheesecake-base"></div>
                                    <div class="cheesecake-filling"></div>
                                    <div class="cheesecake-topping"></div>
                                </div>
                                
                                <div class="slice-guides">
                                    <div class="guide-line guide-vertical" style="left: 50%"></div>
                                </div>
                            </div>
                            
                            <div class="slicing-instructions">
                                <p>${getText('slice_into_equal_parts')}</p>
                                <div class="slice-progress">
                                    <span>${getText('slices_made')}: ${slices.length}/${targetSlices}</span>
                                </div>
                            </div>
                        ` : `
                            <div class="counting-workspace">
                                <div class="cheesecake-sliced" id="cheesecake-sliced">
                                    ${Array.from({length: targetSlices}, (_, i) => `
                                        <div class="cheesecake-slice ${countedSlices.has(i) ? 'counted' : ''}" 
                                             onclick="handleSliceTap(${i})">
                                            <img src="assets/cheesecake_partition.png" alt="Cheesecake slice" class="cheesecake-part-image" />
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="counting-panel">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(currentCount / targetSlices) * 100}%"></div>
                                </div>
                                <div class="count-display">
                                    <span>${getText('parts_counted')}: ${currentCount}/${targetSlices}</span>
                                </div>
                                ${currentCount >= targetSlices ? `
                                    <div class="completion-message animate-in">
                                        <p>${getText('all_parts_counted')}</p>
                                    </div>
                                ` : `
                                    <p class="count-instruction">${getText('tap_each_slice_to_count')}</p>
                                `}
                            </div>
                        `}
                    </div>
                    ${this.generateSceneNavigation('cheesecake-slice', currentCount >= targetSlices)}
                </div>
            `;
        };
    }
    
    // Scene 4: Cheesecake Reassembly
    createCheesecakeReassembleScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [placedSlices, setPlacedSlices] = useState(0);
            const [isComplete, setIsComplete] = useState(false);
            const totalSlices = 2;
            
            useEffect(() => {
                this.setupCheesecakeReassembly();
            }, []);
            
            const handleSlicePlaced = () => {
                setPlacedSlices(prev => {
                    const newCount = prev + 1;
                    if (newCount >= totalSlices) {
                        setIsComplete(true);
                        this.globalState.completedScenes.add('cheesecake');
                        window.sceneSystem.markSceneComplete();
                    }
                    return newCount;
                });
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene cheesecake-reassemble-scene" data-scene="cheesecake-reassemble">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('reassemble_cheesecake_title')}</h2>
                        <div class="progress-indicator">
                            <span>${getText('pieces_placed')}: ${placedSlices}/${totalSlices}</span>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="reassembly-workspace">
                            <div class="cheesecake-pieces">
                                ${Array.from({length: totalSlices}, (_, i) => `
                                    <div class="cheesecake-slice draggable-slice" 
                                         data-draggable="true"
                                         data-slice-id="${i + 1}"
                                         data-drag-config='{"returnToOrigin": false, "onDragEnd": "handleSlicePlaced"}'>
                                        <img src="assets/cheesecake_partition.png" alt="Cheesecake slice" class="cheesecake-part-image" />
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="cheesecake-assembly-area">
                                <div class="assembly-base" 
                                     data-dropzone="true"
                                     data-drop-config='{"accepts": ["slice"], "snapToCenter": true}'>
                                    <div class="assembly-guide"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="reassembly-instructions">
                            <p>${getText('reassembly_instructions')}</p>
                            ${isComplete ? `
                                <div class="completion-message animate-in">
                                    <h3>${getText('great_job')}</h3>
                                    <p>${getText('cheesecake_complete')}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ${this.generateSceneNavigation('cheesecake-reassemble', isComplete)}
                </div>
            `;
        };
    }
    
    // Scene 5: Pizza Introduction
    createPizzaIntroScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [showInstructions, setShowInstructions] = useState(false);
            
            useEffect(() => {
                setTimeout(() => setShowInstructions(true), 500);
            }, []);
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene pizza-intro-scene" data-scene="pizza-intro">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('pizza_title')}</h2>
                        <div class="progress-indicator">
                            <div class="progress-bar" style="width: 50%"></div>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="pizza-container">
                            <div class="whole-pizza" id="whole-pizza">
                                <div class="pizza-base"></div>
                                <div class="pizza-sauce"></div>
                                <div class="pizza-cheese"></div>
                                <div class="pizza-toppings">
                                    <div class="topping pepperoni"></div>
                                    <div class="topping pepperoni"></div>
                                    <div class="topping pepperoni"></div>
                                    <div class="topping mushroom"></div>
                                    <div class="topping mushroom"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="instructions-panel ${showInstructions ? 'show' : ''}">
                            <div class="instruction-content">
                                <h3>${getText('pizza_instruction_title')}</h3>
                                <p>${getText('pizza_instruction_text')}</p>
                                
                                <div class="learning-objectives">
                                    <div class="objective">
                                        <span class="objective-icon">🔪</span>
                                        <span>${getText('slice_objective')}</span>
                                    </div>
                                    <div class="objective">
                                        <span class="objective-icon">🔢</span>
                                        <span>${getText('count_objective')}</span>
                                    </div>
                                    <div class="objective">
                                        <span class="objective-icon">🧩</span>
                                        <span>${getText('reassemble_objective')}</span>
                                    </div>
                                </div>
                                
                                <button class="btn btn-primary" 
                                        onclick="window.sceneSystem.navigateToNext()">
                                    ${getText('start_pizza_activity')}
                                </button>
                            </div>
                        </div>
                    </div>
                    ${this.generateSceneNavigation('pizza-intro', showInstructions)}
                </div>
            `;
        };
    }
    
    // Scene 6: Pizza Slicing & Counting
    createPizzaSliceScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [slices, setSlices] = useState([]);
            const [selectedSlices, setSelectedSlices] = useState(new Set());
            const [countingMode, setCountingMode] = useState(false);
            const [countedSlices, setCountedSlices] = useState(new Set());
            const [currentCount, setCurrentCount] = useState(0);
            const targetSlices = 4;
            
            useEffect(() => {
                this.setupPizzaSlicing();
            }, []);
            
            const handleSliceComplete = () => {
                setCountingMode(true);
                if (this.audioManager) {
                    this.audioManager.playSound('task_complete');
                }
            };
            
            const handleSliceTap = (sliceId) => {
                if (!countedSlices.has(sliceId)) {
                    const newCountedSlices = new Set(countedSlices);
                    newCountedSlices.add(sliceId);
                    setCountedSlices(newCountedSlices);
                    setCurrentCount(newCountedSlices.size);
                    
                    if (this.audioManager) {
                        this.audioManager.playSound('tap');
                    }
                    
                    // Mark scene as complete when all slices are counted
                    if (newCountedSlices.size === targetSlices) {
                        this.globalState.pizzaSlices = targetSlices;
                        // Enable next button instead of auto-advancing
                        window.sceneSystem.markSceneComplete('pizza-slice');
                    }
                }
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene pizza-slice-scene" data-scene="pizza-slice">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('slice_and_count_pizza')}</h2>
                        <div class="activity-steps">
                            <div class="step ${!countingMode ? 'active' : 'completed'}">
                                <span class="step-number">1</span>
                                <span class="step-label">${getText('slice_step')}</span>
                            </div>
                            <div class="step ${countingMode ? 'active' : ''}">
                                <span class="step-number">2</span>
                                <span class="step-label">${getText('count_step')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="pizza-workspace">
                            <div class="pizza-to-slice" id="sliceable-pizza" 
                                 data-sliceable="true"
                                 style="display: ${countingMode ? 'none' : 'block'}">
                                <div class="pizza-base"></div>
                                <div class="pizza-sauce"></div>
                                <div class="pizza-cheese"></div>
                                <div class="pizza-toppings">
                                    <div class="topping pepperoni"></div>
                                    <div class="topping pepperoni"></div>
                                    <div class="topping pepperoni"></div>
                                    <div class="topping mushroom"></div>
                                    <div class="topping mushroom"></div>
                                </div>
                            </div>
                            
                            <div class="pizza-sliced" id="sliced-pizza" 
                                 style="display: ${countingMode ? 'block' : 'none'}">
                                ${Array.from({length: targetSlices}, (_, i) => {
                                    const sliceId = i + 1;
                                    const isCounted = countedSlices.has(sliceId);
                                    return `
                                        <div class="pizza-slice countable-slice ${isCounted ? 'counted' : ''}" 
                                             data-slice-id="${sliceId}"
                                             onclick="handleSliceTap(${sliceId})">
                                            <div class="slice-content slice-${sliceId}"></div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div class="activity-panel">
                            ${!countingMode ? `
                                <div class="slicing-panel">
                                    <h3>${getText('slice_the_pizza')}</h3>
                                    <p>${getText('slice_into_equal_parts')}</p>
                                    <div class="slice-target">
                                        ${getText('target_slices')}: ${targetSlices}
                                    </div>
                                    <div class="slicing-progress">
                                        ${getText('slices_made')}: ${slices.length}/${targetSlices}
                                    </div>
                                </div>
                            ` : `
                                <div class="counting-panel">
                                    <h3>${getText('count_the_slices')}</h3>
                                    <p>${getText('tap_each_slice_to_count')}</p>
                                    <div class="count-display">
                                        <span class="count-label">${getText('parts_counted')}:</span>
                                        <span class="count-number">${currentCount}/${targetSlices}</span>
                                    </div>
                                    <div class="counting-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${(currentCount / targetSlices) * 100}%"></div>
                                        </div>
                                        ${currentCount === targetSlices ? `
                                            <div class="completion-message">
                                                ${getText('all_parts_counted')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                    ${this.generateSceneNavigation('summary', true)}
                </div>
            `;
        };
    }
    
    // Scene 7: Pizza Reassembly
    createPizzaReassembleScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [placedSlices, setPlacedSlices] = useState(0);
            const [isComplete, setIsComplete] = useState(false);
            const totalSlices = this.globalState.pizzaSlices || 4;
            
            useEffect(() => {
                this.setupPizzaReassembly();
            }, []);
            
            const handleSlicePlaced = () => {
                setPlacedSlices(prev => {
                    const newCount = prev + 1;
                    if (newCount >= totalSlices) {
                        setIsComplete(true);
                        this.globalState.completedScenes.add('pizza');
                        window.sceneSystem.markSceneComplete();
                    }
                    return newCount;
                });
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene pizza-reassemble-scene" data-scene="pizza-reassemble">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('reassemble_pizza_title')}</h2>
                        <div class="progress-indicator">
                            <span>${getText('slices_placed')}: ${placedSlices}/${totalSlices}</span>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="reassembly-workspace">
                            <div class="pizza-pieces">
                                ${Array.from({length: totalSlices}, (_, i) => `
                                    <div class="pizza-slice draggable-slice" 
                                         data-draggable="true"
                                         data-slice-id="${i + 1}"
                                         data-drag-config='{"returnToOrigin": false, "onDragEnd": "handleSlicePlaced"}'>
                                        <div class="slice-content pizza-slice-${i + 1}"></div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="pizza-assembly-area">
                                <div class="assembly-base" 
                                     data-dropzone="true"
                                     data-drop-config='{"accepts": ["slice"], "snapToCenter": true}'>
                                    <div class="assembly-guide pizza-guide"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="reassembly-instructions">
                            <p>${getText('pizza_reassembly_instructions')}</p>
                            ${isComplete ? `
                                <div class="completion-message animate-in">
                                    <h3>${getText('excellent_work')}</h3>
                                    <p>${getText('pizza_complete')}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    ${this.generateSceneNavigation('pizza-reassemble', isComplete)}
                </div>
            `;
        };
    }
    
    // Scene 8: Cookie Quiz
    createCookieQuizScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [currentQuestion, setCurrentQuestion] = useState(0);
            const [answers, setAnswers] = useState([]);
            const [showFeedback, setShowFeedback] = useState(false);
            const [quizComplete, setQuizComplete] = useState(false);
            
            // Get quiz data from appData
            const quizData = this.appData[this.currentLanguage]['content-ui']['cookie_quiz'];
            const questions = [
                {
                    id: 'q1',
                    type: 'multiple-choice',
                    question: quizData.questions.q1.prompt,
                    image: 'cookie-piece',
                    options: ['Whole', 'Part'],
                    correct: quizData.questions.q1.correct === 'Part' ? 1 : 0
                },
                {
                    id: 'q2',
                    type: 'multiple-choice', 
                    question: quizData.questions.q2.prompt,
                    image: 'cookie-full',
                    options: ['Whole', 'Part'],
                    correct: quizData.questions.q2.correct === 'Part' ? 1 : 0
                },
                {
                    id: 'q3',
                    type: 'multiple-choice',
                    question: quizData.questions.q3.prompt,
                    image: 'cookie-piece',
                    options: ['Whole', 'Part'],
                    correct: quizData.questions.q3.correct === 'Part' ? 1 : 0
                }
            ];
            
            const handleAnswer = (answerIndex) => {
                const question = questions[currentQuestion];
                const isCorrect = answerIndex === question.correct;
                
                setAnswers(prev => [...prev, { questionId: question.id, answer: answerIndex, correct: isCorrect }]);
                setShowFeedback(true);
                
                if (this.audioManager) {
                    this.audioManager.playSound(isCorrect ? 'correct' : 'incorrect');
                }
                
                setTimeout(() => {
                    setShowFeedback(false);
                    if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                    } else {
                        setQuizComplete(true);
                        this.globalState.cookieAnswers = answers;
                        setTimeout(() => {
                            window.sceneSystem.navigateToScene('summary');
                        }, 2000);
                    }
                }, 2000);
            };
            
            const renderCookieImage = (imageType) => {
                switch(imageType) {
                    case 'cookie-piece':
                        return `<div class="cookie-visual piece">
                                   <div class="cookie-crumb"></div>
                                   <div class="cookie-crumb"></div>
                                   <div class="cookie-crumb"></div>
                               </div>`;
                    case 'cookie-full':
                        return `<div class="cookie-visual whole">
                                   <div class="cookie-base"></div>
                                   <div class="cookie-chips"></div>
                               </div>`;
                    default:
                        return `<div class="cookie-visual ${imageType}"></div>`;
                }
            };
            
            const getFeedbackMessage = (isCorrect, questionId) => {
                const feedbackKey = isCorrect ? 'feedback_correct' : 'feedback_wrong';
                return quizData.questions[questionId][feedbackKey] || (isCorrect ? 'Correct!' : 'Try again!');
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            const question = questions[currentQuestion];
            
            return `
                <div class="scene cookie-quiz-scene" data-scene="cookie-quiz">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('cookie_quiz_title')}</h2>
                        <div class="quiz-progress">
                            <span>${getText('question')} ${currentQuestion + 1} ${getText('of')} ${questions.length}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="cookie-quiz-layout">
                            <!-- Left Panel: Character -->
                            <div class="quiz-left-panel">
                                <div class="character-sprite cookie-man"></div>
                                <div class="speech-bubble">
                                    <p>${getText(question.question)}</p>
                                </div>
                            </div>
                            
                            <!-- Middle Panel: Cookie Image -->
                            <div class="quiz-middle-panel">
                                <div class="cookie-display">
                                    <h3>Cookie</h3>
                                    <div class="cookie-graphic">
                                        ${renderCookieImage(question.image)}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Right Panel: Question & Options -->
                            <div class="quiz-right-panel">
                                <div class="quiz-question">
                                    <p>${getText(question.question)}</p>
                                </div>
                                
                                <div class="quiz-options">
                                    ${question.options.map((option, index) => `
                                        <button 
                                            class="option-button ${answers.find(a => a.questionId === question.id)?.selectedIndex === index ? 'selected' : ''}"
                                            onclick="handleAnswer(${index})"
                                            ${showFeedback ? 'disabled' : ''}>
                                            ${option}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        ${showFeedback ? `
                            <div class="quiz-feedback animate-in">
                                <div class="feedback-icon ${answers[answers.length - 1]?.correct ? 'correct' : 'wrong'}">
                                    ${answers[answers.length - 1]?.correct ? '✓' : '✗'}
                                </div>
                                <div class="feedback-text">
                                    ${getFeedbackMessage(answers[answers.length - 1]?.correct, question.id)}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${quizComplete ? `
                            <div class="quiz-complete">
                                <div class="completion-message">
                                    <h3>${getText('quiz_complete')}</h3>
                                    <p>${getText('great_learning')}</p>
                                    <button onclick="window.sceneSystem.navigateToNext()" class="next-button">
                                        Continue to Summary
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    ${this.generateSceneNavigation('cookie-quiz', quizComplete)}
                </div>
            `;
        };
    }
    
    // Scene 9: Summary
    createSummaryScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [showResults, setShowResults] = useState(false);
            
            useEffect(() => {
                setTimeout(() => setShowResults(true), 500);
            }, []);
            
            const calculateScore = () => {
                const correctAnswers = this.globalState.cookieAnswers.filter(a => a.correct).length;
                const totalQuestions = this.globalState.cookieAnswers.length;
                return Math.round((correctAnswers / totalQuestions) * 100);
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            const score = calculateScore();
            
            return `
                <div class="scene summary-scene" data-scene="summary">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('summary_title')}</h2>
                        <div class="completion-badge">
                            <div class="badge-icon">🏆</div>
                            <span>${getText('activity_complete')}</span>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="summary-workspace">
                            <div class="learning-summary ${showResults ? 'animate-in' : ''}">
                                <h3>${getText('what_you_learned')}</h3>
                                
                                <div class="learning-items">
                                    <div class="learning-item">
                                        <div class="item-icon"><img src="assets/cheesecake.png" alt="Cheesecake" class="summary-icon" /></div>
                                        <div class="item-content">
                                            <h4>${getText('cheesecake_learning')}</h4>
                                            <p>${getText('cheesecake_description')}</p>
                                        </div>
                                        <div class="item-status completed">✓</div>
                                    </div>
                                    
                                    <div class="learning-item">
                                        <div class="item-icon">🍕</div>
                                        <div class="item-content">
                                            <h4>${getText('pizza_learning')}</h4>
                                            <p>${getText('pizza_description')}</p>
                                        </div>
                                        <div class="item-status completed">✓</div>
                                    </div>
                                    
                                    <div class="learning-item">
                                        <div class="item-icon">🍪</div>
                                        <div class="item-content">
                                            <h4>${getText('cookie_learning')}</h4>
                                            <p>${getText('cookie_description')}</p>
                                        </div>
                                        <div class="item-status completed">✓</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="performance-summary ${showResults ? 'animate-in' : ''}">
                                <h3>${getText('your_performance')}</h3>
                                
                                <div class="score-display">
                                    <div class="score-circle">
                                        <div class="score-number">${score}%</div>
                                        <div class="score-label">${getText('quiz_score')}</div>
                                    </div>
                                </div>
                                
                                <div class="performance-details">
                                    <div class="detail-item">
                                        <span class="detail-label">${getText('activities_completed')}:</span>
                                        <span class="detail-value">${this.globalState.completedScenes.size}/2</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">${getText('quiz_questions')}:</span>
                                        <span class="detail-value">${this.globalState.cookieAnswers.filter(a => a.correct).length}/${this.globalState.cookieAnswers.length}</span>
                                    </div>
                                </div>
                                
                                <div class="encouragement-message">
                                    ${score >= 80 ? `
                                        <h4>${getText('excellent_work')}</h4>
                                        <p>${getText('excellent_message')}</p>
                                    ` : score >= 60 ? `
                                        <h4>${getText('good_work')}</h4>
                                        <p>${getText('good_message')}</p>
                                    ` : `
                                        <h4>${getText('keep_practicing')}</h4>
                                        <p>${getText('practice_message')}</p>
                                    `}
                                </div>
                            </div>
                            
                            <div class="summary-actions">
                                <button class="btn btn-secondary" 
                                        onclick="window.sceneSystem.navigateToScene('intro')">
                                    ${getText('play_again')}
                                </button>
                                <button class="btn btn-primary" 
                                        onclick="window.close()">
                                    ${getText('finish')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };
    }
    
    // Setup Methods
    // Generic cutting helper function
    setupGenericSlicing(elementId, config) {
        const element = document.getElementById(elementId);
        if (element && this.interactiveManager) {
            this.interactiveManager.makeSliceable(element, {
                maxSlices: config.maxSlices,
                sliceDirection: config.sliceDirection,
                onSlice: config.onSlice || ((element, sliceData) => {
                    // Default slice handling
                })
            });
        }
    }
    
    setupCheesecakeSlicing() {
        this.setupGenericSlicing('sliceable-cheesecake', {
            maxSlices: 2,
            sliceDirection: 'horizontal',
            onSlice: (element, sliceData) => {
                // Handle cheesecake slice completion
            }
        });
    }
    
    // Generic reassembly helper function
    setupGenericReassembly(sliceSelector, dropZoneSelector, config = {}) {
        const slices = document.querySelectorAll(sliceSelector);
        const dropZone = document.querySelector(dropZoneSelector);
        
        if (this.interactiveManager) {
            slices.forEach(slice => {
                this.interactiveManager.makeDraggable(slice, {
                    returnToOrigin: config.returnToOrigin || false,
                    onDragEnd: config.onDragEnd || (() => {
                        // Default drag end handling
                    })
                });
            });
            
            if (dropZone) {
                this.interactiveManager.createDropZone(dropZone, {
                    accepts: config.accepts || ['slice'],
                    snapToCenter: config.snapToCenter !== false,
                    onDrop: config.onDrop || (() => {
                        // Default drop handling
                    })
                });
            }
        }
    }
    
    setupCheesecakeReassembly() {
        this.setupGenericReassembly('.draggable-slice', '.assembly-base', {
            onDragEnd: () => {
                // Handle cheesecake slice placement
            },
            onDrop: () => {
                // Handle successful cheesecake drop
            }
        });
    }
    
    setupPizzaSlicing() {
        this.setupGenericSlicing('sliceable-pizza', {
            maxSlices: 4,
            sliceDirection: 'cross',
            onSlice: (element, sliceData) => {
                // Handle pizza slice completion
            }
        });
    }
    
    setupPizzaReassembly() {
        this.setupGenericReassembly('.pizza-slice', '.pizza-assembly-area .assembly-base', {
            onDragEnd: () => {
                // Handle pizza slice placement
            },
            onDrop: () => {
                // Handle successful pizza drop
            }
        });
    }
    
    // Utility Methods
    getSceneState(sceneId) {
        return this.sceneStates.get(sceneId) || {};
    }
    
    setSceneState(sceneId, state) {
        this.sceneStates.set(sceneId, { ...this.getSceneState(sceneId), ...state });
    }
    
    getGlobalState() {
        return { ...this.globalState };
    }
    
    resetProgress() {
        this.sceneStates.clear();
        this.globalState = {
            cheesecakeSlices: 0,
            pizzaSlices: 0,
            cookieAnswers: [],
            totalScore: 0,
            completedScenes: new Set()
        };
    }
}

// Export for global access
window.SceneImplementations = SceneImplementations;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SceneImplementations };
}