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
                                    onclick="window.sceneSystem.navigateToScene('cheesecake-intro')">
                                ${getText('start_button')}
                            </button>
                        </div>
                    </div>
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
                                        onclick="window.sceneSystem.navigateToScene('cheesecake-slice')">
                                    ${getText('ready_to_slice')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };
    }
    
    // Scene 3: Cheesecake Slicing
    createCheesecakeSliceScene() {
        const { useState, useEffect } = this.miniReact;
        
        return () => {
            const [slices, setSlices] = useState([]);
            const [isSlicing, setIsSlicing] = useState(false);
            const [completedSlices, setCompletedSlices] = useState(0);
            const targetSlices = 4;
            
            useEffect(() => {
                this.setupCheesecakeSlicing();
            }, []);
            
            const handleSlice = (sliceData) => {
                setSlices(prev => [...prev, sliceData]);
                setCompletedSlices(prev => {
                    const newCount = prev + 1;
                    if (newCount >= targetSlices) {
                        setTimeout(() => {
                            window.sceneSystem.navigateToScene('cheesecake-reassemble');
                        }, 1000);
                    }
                    return newCount;
                });
                
                if (this.audioManager) {
                    this.audioManager.playSound('slice_success');
                }
            };
            
            const getText = (key) => {
                return this.appData[this.currentLanguage]?.['content-ui']?.[key] || key;
            };
            
            return `
                <div class="scene cheesecake-slice-scene" data-scene="cheesecake-slice">
                    <div class="scene-header">
                        <h2 class="scene-title">${getText('slice_cheesecake_title')}</h2>
                        <div class="slice-counter">
                            <span>${getText('slices_made')}: ${completedSlices}/${targetSlices}</span>
                        </div>
                    </div>
                    
                    <div class="scene-content">
                        <div class="slicing-workspace">
                            <div class="cheesecake-to-slice" id="sliceable-cheesecake" 
                                 data-sliceable="true" 
                                 data-slice-config='{"maxSlices": ${targetSlices}, "onSlice": "handleSlice"}'>
                                <div class="cheesecake-base"></div>
                                <div class="cheesecake-filling"></div>
                                <div class="cheesecake-topping"></div>
                            </div>
                            
                            <div class="slice-guides">
                                <div class="guide-line guide-vertical" style="left: 50%"></div>
                                <div class="guide-line guide-horizontal" style="top: 50%"></div>
                            </div>
                        </div>
                        
                        <div class="slicing-instructions">
                            <p>${getText('slicing_instructions')}</p>
                            <div class="slice-preview">
                                ${Array.from({length: targetSlices}, (_, i) => `
                                    <div class="slice-indicator ${i < completedSlices ? 'completed' : ''}">
                                        ${i + 1}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
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
            const totalSlices = 4;
            
            useEffect(() => {
                this.setupCheesecakeReassembly();
            }, []);
            
            const handleSlicePlaced = () => {
                setPlacedSlices(prev => {
                    const newCount = prev + 1;
                    if (newCount >= totalSlices) {
                        setIsComplete(true);
                        this.globalState.completedScenes.add('cheesecake');
                        setTimeout(() => {
                            window.sceneSystem.navigateToScene('pizza-intro');
                        }, 2000);
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
                                        <div class="slice-content slice-${i + 1}"></div>
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
                                        onclick="window.sceneSystem.navigateToScene('pizza-slice')">
                                    ${getText('start_pizza_activity')}
                                </button>
                            </div>
                        </div>
                    </div>
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
            const [userCount, setUserCount] = useState(0);
            const targetSlices = 8;
            
            useEffect(() => {
                this.setupPizzaSlicing();
            }, []);
            
            const handleSliceComplete = () => {
                setCountingMode(true);
                if (this.audioManager) {
                    this.audioManager.playSound('task_complete');
                }
            };
            
            const handleCountSubmit = () => {
                const isCorrect = userCount === targetSlices;
                if (isCorrect) {
                    this.globalState.pizzaSlices = targetSlices;
                    setTimeout(() => {
                        window.sceneSystem.navigateToScene('pizza-reassemble');
                    }, 1000);
                } else {
                    // Show feedback and allow retry
                    if (this.audioManager) {
                        this.audioManager.playSound('incorrect');
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
                                ${Array.from({length: targetSlices}, (_, i) => `
                                    <div class="pizza-slice countable-slice" 
                                         data-countable="true"
                                         data-slice-id="${i + 1}"
                                         data-count-config='{"countValue": 1, "onSelect": "handleSliceSelect"}'>
                                        <div class="slice-content slice-${i + 1}"></div>
                                    </div>
                                `).join('')}
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
                                    <p>${getText('click_each_slice')}</p>
                                    <div class="count-display">
                                        <span class="count-label">${getText('your_count')}:</span>
                                        <span class="count-number">${userCount}</span>
                                    </div>
                                    <button class="btn btn-primary" 
                                            onclick="handleCountSubmit()"
                                            ${userCount === 0 ? 'disabled' : ''}>
                                        ${getText('submit_count')}
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
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
            const totalSlices = this.globalState.pizzaSlices || 8;
            
            useEffect(() => {
                this.setupPizzaReassembly();
            }, []);
            
            const handleSlicePlaced = () => {
                setPlacedSlices(prev => {
                    const newCount = prev + 1;
                    if (newCount >= totalSlices) {
                        setIsComplete(true);
                        this.globalState.completedScenes.add('pizza');
                        setTimeout(() => {
                            window.sceneSystem.navigateToScene('cookie-quiz');
                        }, 2000);
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
            
            const questions = [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'cookie_question_1',
                    image: 'cookie-halves',
                    options: ['1/2', '1/3', '1/4', '2/3'],
                    correct: 0
                },
                {
                    id: 2,
                    type: 'multiple-choice',
                    question: 'cookie_question_2',
                    image: 'cookie-quarters',
                    options: ['1/2', '1/3', '1/4', '3/4'],
                    correct: 2
                },
                {
                    id: 3,
                    type: 'drag-drop',
                    question: 'cookie_question_3',
                    image: 'cookie-thirds',
                    fractions: ['1/3', '2/3', '3/3'],
                    correct: '2/3'
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
                        <div class="quiz-workspace">
                            <div class="question-area">
                                <div class="question-image">
                                    <div class="cookie-visual ${question.image}"></div>
                                </div>
                                
                                <div class="question-text">
                                    <h3>${getText(question.question)}</h3>
                                </div>
                            </div>
                            
                            <div class="answer-area">
                                ${question.type === 'multiple-choice' ? `
                                    <div class="answer-options">
                                        ${question.options.map((option, index) => `
                                            <button class="answer-option" 
                                                    onclick="handleAnswer(${index})"
                                                    ${showFeedback ? 'disabled' : ''}>
                                                ${option}
                                            </button>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div class="drag-drop-area">
                                        <div class="fraction-options">
                                            ${question.fractions.map((fraction, index) => `
                                                <div class="fraction-option draggable" 
                                                     data-draggable="true"
                                                     data-fraction="${fraction}">
                                                    ${fraction}
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="drop-target" 
                                             data-dropzone="true"
                                             data-drop-config='{"accepts": ["fraction"]}'>
                                            ${getText('drop_answer_here')}
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                        
                        ${showFeedback ? `
                            <div class="feedback-panel animate-in">
                                <div class="feedback-content ${answers[answers.length - 1]?.correct ? 'correct' : 'incorrect'}">
                                    <div class="feedback-icon">
                                        ${answers[answers.length - 1]?.correct ? '✓' : '✗'}
                                    </div>
                                    <div class="feedback-text">
                                        ${getText(answers[answers.length - 1]?.correct ? 'correct_answer' : 'incorrect_answer')}
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${quizComplete ? `
                            <div class="completion-message animate-in">
                                <h3>${getText('quiz_complete')}</h3>
                                <p>${getText('great_learning')}</p>
                            </div>
                        ` : ''}
                    </div>
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
                                        <div class="item-icon">🍰</div>
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
    setupCheesecakeSlicing() {
        const cheesecake = document.getElementById('sliceable-cheesecake');
        if (cheesecake && this.interactiveManager) {
            this.interactiveManager.makeSliceable(cheesecake, {
                maxSlices: 4,
                sliceDirection: 'both',
                onSlice: (element, sliceData) => {
                    // Handle slice completion
                }
            });
        }
    }
    
    setupCheesecakeReassembly() {
        const slices = document.querySelectorAll('.draggable-slice');
        const dropZone = document.querySelector('.assembly-base');
        
        if (this.interactiveManager) {
            slices.forEach(slice => {
                this.interactiveManager.makeDraggable(slice, {
                    returnToOrigin: false,
                    onDragEnd: () => {
                        // Handle slice placement
                    }
                });
            });
            
            if (dropZone) {
                this.interactiveManager.createDropZone(dropZone, {
                    accepts: ['slice'],
                    snapToCenter: true,
                    onDrop: () => {
                        // Handle successful drop
                    }
                });
            }
        }
    }
    
    setupPizzaSlicing() {
        const pizza = document.getElementById('sliceable-pizza');
        if (pizza && this.interactiveManager) {
            this.interactiveManager.makeSliceable(pizza, {
                maxSlices: 8,
                sliceDirection: 'radial',
                onSlice: (element, sliceData) => {
                    // Handle pizza slice
                }
            });
        }
    }
    
    setupPizzaReassembly() {
        const slices = document.querySelectorAll('.pizza-slice');
        const dropZone = document.querySelector('.pizza-assembly-area .assembly-base');
        
        if (this.interactiveManager) {
            slices.forEach(slice => {
                this.interactiveManager.makeDraggable(slice, {
                    returnToOrigin: false
                });
            });
            
            if (dropZone) {
                this.interactiveManager.createDropZone(dropZone, {
                    accepts: ['slice'],
                    snapToCenter: true
                });
            }
        }
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