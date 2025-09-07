/**
 * Reusable UI Components for Whole & Part Applet
 * Following design system with animations, accessibility, and responsive design
 */

// Button Component with tap animations and glow effects
createComponent('Button', (props) => {
    const buttonRef = useRef(null);
    const [isGlowing, setIsGlowing] = useState(false);
    
    const {
        children,
        onClick,
        disabled = false,
        variant = 'primary',
        size = 'medium',
        className = '',
        ariaLabel,
        ...otherProps
    } = props;
    
    const { isPressed } = useInteractive(buttonRef, {
        disabled,
        onClick: (e) => {
            if (!disabled && onClick) {
                setIsGlowing(true);
                setTimeout(() => setIsGlowing(false), 300);
                onClick(e);
            }
        }
    });
    
    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;
        
        // Add glow animation class
        if (isGlowing) {
            button.classList.add('glowing');
        } else {
            button.classList.remove('glowing');
        }
    }, [isGlowing]);
    
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        disabled ? 'btn-disabled' : '',
        isPressed ? 'btn-pressed' : '',
        className
    ].filter(Boolean).join(' ');
    
    return html`
        <button 
            ref="${buttonRef}"
            class="${buttonClasses}"
            ${disabled ? 'disabled' : ''}
            aria-label="${ariaLabel || children}"
            role="button"
            tabindex="${disabled ? -1 : 0}"
        >
            <span class="btn-content" style="pointer-events: none; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                ${children}
            </span>
        </button>
    `;
});

// Progress Bar Component
createComponent('ProgressBar', (props) => {
    const {
        current = 0,
        total = 1,
        showText = true,
        className = '',
        animated = true
    } = props;
    
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));
    const progressText = appData.getStandardUI('labels.progress', { current, total });
    
    return html`
        <div class="progress-container ${className}">
            ${showText ? `
                <div class="progress-text" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ${progressText}
                </div>
            ` : ''}
            <div class="progress-bar">
                <div 
                    class="progress-fill ${animated ? 'animated' : ''}"
                    style="width: ${percentage}%"
                    role="progressbar"
                    aria-valuenow="${current}"
                    aria-valuemin="0"
                    aria-valuemax="${total}"
                    aria-label="${progressText}"
                ></div>
            </div>
        </div>
    `;
});

// Scene Container Component
createComponent('SceneContainer', (props) => {
    const {
        children,
        sceneId,
        title,
        className = '',
        showProgress = true,
        currentScene = 0,
        totalScenes = 8
    } = props;
    
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Fade in animation
        setTimeout(() => setIsVisible(true), 50);
    }, []);
    
    return html`
        <div 
            ref="${containerRef}"
            class="scene-container ${className} ${isVisible ? 'visible' : ''}"
            data-scene="${sceneId}"
            role="main"
            aria-label="${title}"
        >
            ${showProgress ? `
                <div class="scene-header">
                    ${render('ProgressBar', {
                        current: currentScene + 1,
                        total: totalScenes,
                        className: 'scene-progress'
                    })}
                </div>
            ` : ''}
            
            <div class="scene-content">
                ${children}
            </div>
        </div>
    `;
});

// Interactive Element Component (for slicers, draggable items)
createComponent('InteractiveElement', (props) => {
    const {
        children,
        onClick,
        onDragStart,
        onDrag,
        onDragEnd,
        draggable = false,
        disabled = false,
        className = '',
        ariaLabel,
        role = 'button',
        ...otherProps
    } = props;
    
    const elementRef = useRef(null);
    
    const { isPressed } = useInteractive(elementRef, {
        disabled,
        onClick
    });
    
    const dragProps = useDragAndDrop(elementRef, {
        disabled: disabled || !draggable,
        onDragStart,
        onDrag,
        onDragEnd
    });
    
    const elementClasses = [
        'interactive-element',
        draggable ? 'draggable' : '',
        disabled ? 'disabled' : '',
        isPressed ? 'pressed' : '',
        dragProps.isDragging ? 'dragging' : '',
        className
    ].filter(Boolean).join(' ');
    
    return html`
        <div 
            ref="${elementRef}"
            class="${elementClasses}"
            role="${role}"
            aria-label="${ariaLabel}"
            tabindex="${disabled ? -1 : 0}"
            ${draggable ? 'draggable="true"' : ''}
            style="${dragProps.isDragging ? `transform: translate(${dragProps.position.x}px, ${dragProps.position.y}px)` : ''}"
        >
            ${children}
        </div>
    `;
});

// Feedback Message Component
createComponent('FeedbackMessage', (props) => {
    const {
        message,
        type = 'info', // 'success', 'error', 'info', 'warning'
        visible = true,
        autoHide = false,
        duration = 3000,
        onHide,
        className = ''
    } = props;
    
    const [isVisible, setIsVisible] = useState(visible);
    
    useEffect(() => {
        setIsVisible(visible);
        
        if (visible && autoHide) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onHide) onHide();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [visible, autoHide, duration]);
    
    if (!isVisible) return '';
    
    const messageClasses = [
        'feedback-message',
        `feedback-${type}`,
        className
    ].filter(Boolean).join(' ');
    
    return html`
        <div 
            class="${messageClasses}"
            role="alert"
            aria-live="polite"
        >
            <div class="feedback-content" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                ${message}
            </div>
        </div>
    `;
});

// Modal/Dialog Component
createComponent('Modal', (props) => {
    const {
        isOpen = false,
        onClose,
        title,
        children,
        className = '',
        closeOnOverlay = true,
        showCloseButton = true
    } = props;
    
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus management
            const modal = modalRef.current;
            if (modal) {
                modal.focus();
            }
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    
    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === overlayRef.current && onClose) {
            onClose();
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && onClose) {
            onClose();
        }
    };
    
    if (!isOpen) return '';
    
    return html`
        <div 
            ref="${overlayRef}"
            class="modal-overlay"
            onClick="${handleOverlayClick}"
        >
            <div 
                ref="${modalRef}"
                class="modal ${className}"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabindex="-1"
                onKeyDown="${handleKeyDown}"
            >
                ${title ? `
                    <div class="modal-header">
                        <h2 id="modal-title" class="modal-title" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            ${title}
                        </h2>
                        ${showCloseButton ? `
                            ${render('Button', {
                                onClick: onClose,
                                variant: 'secondary',
                                size: 'small',
                                className: 'modal-close',
                                ariaLabel: 'Close dialog',
                                children: '×'
                            })}
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="modal-content">
                    ${children}
                </div>
            </div>
        </div>
    `;
});

// Loading Spinner Component
createComponent('LoadingSpinner', (props) => {
    const {
        size = 'medium',
        message = appData.getStandardUI('labels.loading'),
        className = ''
    } = props;
    
    return html`
        <div class="loading-spinner ${className}" role="status" aria-label="${message}">
            <div class="spinner spinner-${size}"></div>
            ${message ? `
                <div class="loading-message" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ${message}
                </div>
            ` : ''}
        </div>
    `;
});

// Count Display Component
createComponent('CountDisplay', (props) => {
    const {
        count = 0,
        maxCount,
        label,
        showProgress = false,
        className = '',
        animated = true
    } = props;
    
    const [displayCount, setDisplayCount] = useState(0);
    
    useEffect(() => {
        if (animated && count !== displayCount) {
            const increment = count > displayCount ? 1 : -1;
            const timer = setInterval(() => {
                setDisplayCount(prev => {
                    const next = prev + increment;
                    if ((increment > 0 && next >= count) || (increment < 0 && next <= count)) {
                        clearInterval(timer);
                        return count;
                    }
                    return next;
                });
            }, 100);
            
            return () => clearInterval(timer);
        } else {
            setDisplayCount(count);
        }
    }, [count, animated]);
    
    const countText = label 
        ? appData.getStandardUI('labels.parts_counted', { count: displayCount })
        : displayCount.toString();
    
    return html`
        <div class="count-display ${className}">
            <div class="count-number" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                ${countText}
            </div>
            ${showProgress && maxCount ? `
                ${render('ProgressBar', {
                    current: displayCount,
                    total: maxCount,
                    showText: false,
                    className: 'count-progress'
                })}
            ` : ''}
        </div>
    `;
});

// Navigation Controls Component
createComponent('NavigationControls', (props) => {
    const {
        onPrevious,
        onNext,
        onRestart,
        canGoPrevious = false,
        canGoNext = false,
        showRestart = false,
        className = ''
    } = props;
    
    return html`
        <div class="navigation-controls ${className}">
            ${render('Button', {
                onClick: onPrevious,
                disabled: !canGoPrevious,
                variant: 'secondary',
                className: 'nav-btn nav-previous',
                ariaLabel: appData.getStandardUI('buttons.previous'),
                children: appData.getStandardUI('buttons.previous')
            })}
            
            ${showRestart ? `
                ${render('Button', {
                    onClick: onRestart,
                    variant: 'outline',
                    className: 'nav-btn nav-restart',
                    ariaLabel: appData.getStandardUI('buttons.restart'),
                    children: appData.getStandardUI('buttons.restart')
                })}
            ` : ''}
            
            ${render('Button', {
                onClick: onNext,
                disabled: !canGoNext,
                variant: 'primary',
                className: 'nav-btn nav-next',
                ariaLabel: appData.getStandardUI('buttons.next'),
                children: appData.getStandardUI('buttons.next')
            })}
        </div>
    `;
});

// Character Display Component
createComponent('CharacterDisplay', (props) => {
    const {
        character, // 'cheesecake_boy', 'pizza_girl', 'cookie_man'
        message,
        position = 'left', // 'left', 'right', 'center'
        size = 'medium',
        className = ''
    } = props;
    
    const characterRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Animate character entrance
        setTimeout(() => setIsVisible(true), 100);
    }, [character]);
    
    const characterClasses = [
        'character-display',
        `character-${character}`,
        `position-${position}`,
        `size-${size}`,
        isVisible ? 'visible' : '',
        className
    ].filter(Boolean).join(' ');
    
    // Get character image source with fallback
    const getCharacterSrc = () => {
        if (!character || !appData || !appData.assets || !appData.assets.images) {
            return '';
        }
        return appData.assets.images[character] || '';
    };
    
    const characterSrc = getCharacterSrc();
    const characterAlt = character ? character.replace('_', ' ') : 'Character';
    
    return html`
        <div ref="${characterRef}" class="${characterClasses}">
            <div class="character-image">
                ${characterSrc ? `
                    <img 
                        src="${characterSrc}"
                        alt="${characterAlt}"
                        loading="lazy"
                    />
                ` : `
                    <div class="character-placeholder" style="
                        width: 100px;
                        height: 100px;
                        background: #ddd;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #666;
                    ">
                        ${characterAlt}
                    </div>
                `}
            </div>
            ${message ? `
                <div class="character-message">
                    <div class="message-bubble">
                        <div class="message-text" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                            ${message}
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
});

// Scene canvas wrapper with orange border
createComponent('SceneCanvas', (props) => {
    const { borderColor = '#F7A338', padding = 20, gap = 20, columns = 3, children } = props;
    return html`
        <div class="scene-canvas" style="
            border: 3px solid ${borderColor};
            border-radius: 15px;
            padding: ${padding}px;
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: ${gap}px;
            justify-items: center;
            align-items: end;
        ">
            ${children || ''}
        </div>
    `;
});

// Food bubble component
createComponent('FoodBubble', (props) => {
    const { label, size = 'lg' } = props;
    const sizeClass = `food-bubble-${size}`;
    return html`
        <div class="food-bubble ${sizeClass}">
            <span class="food-bubble-label">${label}</span>
        </div>
    `;
});

// Character sprite component
createComponent('CharacterSprite', (props) => {
    const { src, alt = 'Character', width, height } = props;
    const style = `${width ? `width: ${width}px;` : ''} ${height ? `height: ${height}px;` : ''}`;
    
    // Don't render if src is undefined or empty
    if (!src) {
        return html`
            <div class="character-sprite-placeholder" style="
                ${style}
                background: #f0f0f0;
                border: 2px dashed #ccc;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 12px;
                min-width: 60px;
                min-height: 60px;
            ">
                ${alt}
            </div>
        `;
    }
    
    return html`
        <img class="character-sprite" src="${src}" alt="${alt}" style="${style}" />
    `;
});

// Character order tile component
createComponent('CharacterOrderTile', (props) => {
    const { foodLabel, foodKind = 'bubble', sprite, spriteAlt, onSelect, disabled } = props;
    const tileClass = `character-order-tile ${disabled ? 'disabled' : ''}`;
    const clickHandler = onSelect && !disabled ? onSelect : null;
    
    const tileRef = useRef(null);
    
    const { isPressed } = useInteractive(tileRef, {
        disabled,
        onClick: clickHandler
    });
    
    return html`
        <div ref="${tileRef}" class="${tileClass} ${isPressed ? 'pressed' : ''}">
            ${render('FoodBubble', { label: foodLabel, size: 'lg' })}
            ${render('CharacterSprite', { src: sprite, alt: spriteAlt })}
        </div>
    `;
});

const NavButton = createComponent('NavButton', (props) => {
    const { variant = 'next', onStateChange = () => {}, disabled = false } = props;
    const isNext = variant === 'next';
    const label = isNext ? '▶' : '◀';
    
    return html`
        <button class="nav-button" data-variant="${variant}" ${disabled ? 'disabled' : ''}>
            ${label}
        </button>
    `;
});

// Scene progress text component
createComponent('SceneProgress', (props) => {
    const { text, icon, align = 'center' } = props;
    const defaultIcon = '▶';
    const displayIcon = icon || defaultIcon;
    
    return html`
        <div class="scene-progress" style="text-align: ${align}">
            <span class="scene-progress-text">${text.replace('▶', `<span class="scene-progress-icon">${displayIcon}</span>`)}</span>
        </div>
    `;
});

// Scene footer wrapper component
createComponent('SceneFooter', (props) => {
    const { children } = props;
    return html`
        <div class="scene-footer">
            <div class="scene-footer-divider"></div>
            <div class="scene-footer-content">
                ${children || ''}
            </div>
        </div>
    `;
});

// Character Sprite component for base screen components
const CharacterSprite = createComponent('CharacterSprite', (props) => {
    const { spriteKey = 'cheesecake_boy' } = props;
    
    // Get character image source with fallback
    const getCharacterSrc = () => {
        if (!spriteKey || !appData || !appData.assets || !appData.assets.images) {
            return '';
        }
        return appData.assets.images[spriteKey] || '';
    };
    
    const characterSrc = getCharacterSrc();
    const characterAlt = spriteKey ? spriteKey.replace('_', ' ') : 'Character';
    
    if (!characterSrc) {
        return html`
            <div class="character-sprite-placeholder" style="
                width: 100px;
                height: 100px;
                background: #f0f0f0;
                border: 2px dashed #ccc;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 12px;
            ">
                ${characterAlt}
            </div>
        `;
    }
    
    return html`
        <img class="character-sprite" src="${characterSrc}" alt="${characterAlt}" />
    `;
});

// Base Screen Components for Pixel-Precise UI
const Screen = createComponent('Screen', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    
    // Handle special screens
    if (state.showStartButton) {
        return html`
            <div class="screen intro-screen">
                ${IntroScreen.renderFunction({ state, onStateChange })}
            </div>
        `;
    }
    
    // CharacterSelectionScreen now renders independently
    
    if (state.showOrderStatus) {
        return OrderStatusScreen.renderFunction({ state, onStateChange });
    }
    
    // Default screen layout
    return html`
        <div class="screen">
            ${LeftPanel.renderFunction({ state, onStateChange })}
            ${RightRegion.renderFunction({ state, onStateChange })}
        </div>
    `;
});

const LeftPanel = createComponent('LeftPanel', (props) => {
    const { state = {} } = props;
    const { sprite = 'cheesecake_boy', speech = '' } = state;
    
    return html`
        <div class="left-panel">
            ${SpeechBubble.renderFunction({ speech })}
            ${CharacterSprite.renderFunction({ spriteKey: sprite })}
        </div>
    `;
});

const RightRegion = createComponent('RightRegion', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    
    return html`
        <div class="right-region">
            ${SceneFrame.renderFunction({ state, onStateChange })}
            ${FooterBar.renderFunction({ state, onStateChange })}
        </div>
    `;
});

const SceneFrame = createComponent('SceneFrame', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    const { 
        showToolPanel = false, 
        toolMode = 'slicer', 
        toolRailHeader = '', 
        railHeader = '', 
        toolRailNote = '', 
        availableParts = [],
        quiz = null
    } = state;
    
    const renderRightPanel = () => {
        if (!showToolPanel) return '';
        
        if (toolMode === 'quiz' && quiz) {
            return QuizRail.renderFunction({
                quiz,
                onOptionSelect: (optionKey) => {
                    if (window.wholePartsState && window.wholePartsState.selectQuizOption) {
                        window.wholePartsState.selectQuizOption(optionKey);
                    }
                }
            });
        }
        
        // Tool functionality placeholder
        if (toolMode === 'slicer') {
            return '';
        }
        
        return '';
    };
    
    const sceneInteriorClass = [
        'scene-frame-interior',
        toolMode === 'quiz' ? 'quiz-mode' : '',
        showToolPanel ? 'with-tool-panel' : ''
    ].filter(Boolean).join(' ');
    
    return html`
        <div class="scene-frame">
            <div class="${sceneInteriorClass}">
                ${CanvasArea.renderFunction({ state })}
                ${renderRightPanel()}
            </div>
        </div>
    `;
});

const CanvasArea = createComponent('CanvasArea', (props) => {
    const { state = {} } = props;
    const { 
        cut = false, 
 
        canvasCaption = null, 
        dimCanvas = false, 
        placedParts = [], 
        showToolPanel = false, 
        foodType = 'cheesecake',
        toolMode = 'slicer'
    } = state;
    
    const canvasClass = showToolPanel ? 'canvas-area with-tool-panel' : 'canvas-area';
    const foodLabel = foodType === 'pizza' ? 'Pizza' : 'Cheesecake';
    
    // Quiz mode shows cookie graphic
    if (toolMode === 'quiz') {
        const { quiz = null } = state;
        const showWholeCookie = quiz && quiz.image === 'cookie_whole';
        
        return html`
            <div class="${canvasClass} quiz-canvas">
                <div class="canvas-content">
                    <div class="cookie-graphic">
                        <div class="cookie-drawing">
                            <div class="food-disk cookie-disk">
                                <div class="food-label">Cookie</div>
                                ${showWholeCookie ? '' : '<div class="cut-line vertical"></div>'}
                            </div>
                        </div>
                    </div>
                    ${canvasCaption ? `<div class="canvas-caption">${canvasCaption}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    return html`
        <div class="${canvasClass}">
            <div class="canvas-content">
                ${FoodDisk.renderFunction({ label: foodLabel, cut, dimCanvas, placedParts, foodType })}
                ${canvasCaption ? `<div class="canvas-caption">${canvasCaption}</div>` : ''}
            </div>
        </div>
    `;
});

// ToolRail component - placeholder for future implementation
// const ToolRail = createComponent('ToolRail', (props) => {
//     return '';
// });

// QuizRail component for cookie quiz
const QuizRail = createComponent('QuizRail', (props) => {
    const { 
        quiz = null,
        onOptionSelect = () => {} 
    } = props;
    
    if (!quiz) return '';
    
    const { options = [], selection = null, evaluation = 'pending', feedback = null } = quiz;
    
    const optionButtons = options.map(option => {
        let buttonState = 'neutral';
        if (selection === option) {
            buttonState = evaluation === 'right' ? 'correct' : evaluation === 'wrong' ? 'wrong' : 'neutral';
        }
        
        return html`
            ${renderComponent('OptionButton', {
                key: option,
                label: option,
                state: buttonState,
                onClick: () => onOptionSelect(option)
            })}
        `;
    }).join('');
    
    const showFeedback = evaluation !== 'pending' && feedback;
    const feedbackVariant = evaluation === 'right' ? 'correct' : evaluation === 'wrong' ? 'wrong' : 'none';
    
    return html`
        <div class="quiz-rail">
            <div class="option-stack">
                ${optionButtons}
            </div>
            ${showFeedback ? html`
                ${renderComponent('FeedbackCard', {
                    variant: feedbackVariant,
                    text: feedback
                })}
            ` : ''}
        </div>
    `;
});

// OptionButton Component for Quiz
const OptionButton = createComponent('OptionButton', (props) => {
    const { key, label, state = 'neutral', onClick = () => {} } = props;
    
    const handleClick = () => {
        onClick(key);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(key);
        }
    };
    
    return html`
        <button 
            class="option-button ${state}"
            role="button"
            aria-pressed="${state !== 'neutral'}"
            onclick="${handleClick}"
            onkeydown="${handleKeyDown}"
            tabindex="0"
        >
            ${label}
        </button>
    `;
});

// FeedbackCard Component for Quiz
const FeedbackCard = createComponent('FeedbackCard', (props) => {
    const { variant = 'none', text = '' } = props;
    
    if (variant === 'none' || !text) {
        return '';
    }
    
    return html`
        <div class="feedback-card ${variant}">
            ${text}
        </div>
    `;
});

// Export components for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Button,
        InteractiveElement,
        FeedbackMessage,
        NavigationControls,
        CharacterDisplay,
        FoodDisk,
        StatusPip,
        OrderStatusScreen,
        QuizRail,
        OptionButton,
        FeedbackCard
    };
}

// Auto font-size scaling utility
function autoScaleFontSize(element) {
    const container = element.closest('.speech-bubble');
    if (!container) return;
    
    const maxFontSize = 20;
    const minFontSize = 10;
    let fontSize = maxFontSize;
    
    // Reset to max font size
    element.style.fontSize = fontSize + 'px';
    
    // Check if content overflows and reduce font size if needed
    while (element.scrollHeight > container.clientHeight - 48 && fontSize > minFontSize) {
        fontSize -= 1;
        element.style.fontSize = fontSize + 'px';
    }
}

const SpeechBubble = createComponent('SpeechBubble', (props) => {
    const { speech = '' } = props;
    
    // Process speech tokens for highlighting
    const processedSpeech = speech
        .replace(/{whole}/g, '<span class="highlight-whole">whole</span>')
        .replace(/{parts}/g, '<span class="highlight-parts">parts</span>')
        .replace(/\n/g, '<br>');
    
    // Create element with auto-scaling
    const element = html`
        <div class="speech-bubble">
            <div class="speech-content" onload="autoScaleFontSize(this)">${processedSpeech}</div>
            <div class="speech-tail"></div>
        </div>
    `;
    
    // Apply auto-scaling after render
    setTimeout(() => {
        const speechContent = element.querySelector('.speech-content');
        if (speechContent) {
            autoScaleFontSize(speechContent);
        }
    }, 0);
    
    return element;
});

const FoodDisk = createComponent('FoodDisk', (props) => {
    const { label = 'Cheesecake', cut = false, dimCanvas = false, placedParts = [], foodType = 'cheesecake', toolMode = null } = props;
    
    // Determine cut lines based on food type and cut state
    let cutLines = '';
    if (cut) {
        if (foodType === 'pizza') {
            if (cut === 'horizontal') {
                cutLines = '<div class="cut-line horizontal"></div>';
            } else if (cut === 'cross') {
                cutLines = '<div class="cut-line horizontal pizza-cross"></div><div class="cut-line vertical pizza-cross"></div>';
            }
        } else {
            // Default cheesecake vertical cut
            cutLines = '<div class="cut-line vertical"></div>';
        }
    }
    
    // Add placed parts visualization for pizza
    let placedPartsContent = '';
    if (toolMode === 'parts' && placedParts.length > 0) {
        placedPartsContent = placedParts.map(part => `
            <div class="placed-part-ring ${part}-ring"></div>
        `).join('');
    }
    
    // Add partition image if cut
    let partitionImage = '';
    if (cut) {
        const partitionSrc = foodType === 'pizza' ? 'assets/pizza-partition.png' : 'assets/cheesecake_partition.png';
        const partitionAlt = foodType === 'pizza' ? 'Pizza partition' : 'Cheesecake partition';
        partitionImage = `<img src="${partitionSrc}" alt="${partitionAlt}" class="food-part-image" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; border-radius: 50%; z-index: 5;" />`;
    }
    
    // Add part labels for pizza
    let partLabels = '';
    if (cut && foodType === 'pizza') {
        partLabels = `
            <div class="part-label part-1" style="position: absolute; top: 10%; left: 10%; color: white; font-weight: bold; font-size: clamp(14px, 2.5vw, 18px); text-shadow: 2px 2px 4px rgba(0,0,0,0.8); z-index: 10; pointer-events: none;">Part 1</div>
            <div class="part-label part-2" style="position: absolute; top: 10%; right: 10%; color: white; font-weight: bold; font-size: clamp(14px, 2.5vw, 18px); text-shadow: 2px 2px 4px rgba(0,0,0,0.8); z-index: 10; pointer-events: none;">Part 2</div>
            <div class="part-label part-3" style="position: absolute; bottom: 10%; left: 10%; color: white; font-weight: bold; font-size: clamp(14px, 2.5vw, 18px); text-shadow: 2px 2px 4px rgba(0,0,0,0.8); z-index: 10; pointer-events: none;">Part 3</div>
            <div class="part-label part-4" style="position: absolute; bottom: 10%; right: 10%; color: white; font-weight: bold; font-size: clamp(14px, 2.5vw, 18px); text-shadow: 2px 2px 4px rgba(0,0,0,0.8); z-index: 10; pointer-events: none;">Part 4</div>
        `;
    }
    

    
    // Only show base food image if partition image is not present
    const showBaseImage = !(cut && foodType === 'pizza');
    
    return html`
        <div class="food-disk-container">
            <div class="food-disk">
                ${showBaseImage ? `<img src="assets/${foodType === 'pizza' ? 'pizza' : 'cheesecake'}.png" alt="${foodType === 'pizza' ? 'Pizza' : 'Cheesecake'}" class="food-image" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; border-radius: 50%; z-index: 1;" />` : ''}
                ${cutLines}
                ${placedPartsContent}
                ${partitionImage}
                ${partLabels}
                ${dimCanvas ? CanvasDimmingOverlay.renderFunction({ placedParts, toolMode }) : ''}
            </div>

        </div>
    `;
});

const PartThumbnail = createComponent('PartThumbnail', (props) => {
    const { part = 'left', draggable = true } = props;
    
    // Handle pizza quarters
    if (['qTR', 'qTL', 'qBL', 'qBR'].includes(part)) {
        return html`
            <div class="part-thumbnail pizza-quarter ${part}-quarter" data-part="${part}" ${draggable ? 'draggable="true"' : ''}>
                <img src="assets/${part}.svg" alt="${part} quarter" class="quarter-image" />
            </div>
        `;
    }
    
    // Default cheesecake parts
    return html`
        <div class="part-thumbnail ${part}-part" ${draggable ? 'draggable="true"' : ''}>
            <img src="assets/cheesecake_partition.png" alt="Cheesecake part" class="cheesecake-part-image" />
        </div>
    `;
});

const CanvasDimmingOverlay = createComponent('CanvasDimmingOverlay', (props) => {
    const { placedParts = [], toolMode = null } = props;
    
    if (toolMode === 'parts') {
        // Pizza quarters dimming
        const qTRPlaced = placedParts.includes('qTR');
        const qTLPlaced = placedParts.includes('qTL');
        const qBLPlaced = placedParts.includes('qBL');
        const qBRPlaced = placedParts.includes('qBR');
        
        return html`
            <div class="canvas-dimming-overlay pizza-dimming">
                ${!qTRPlaced ? '<div class="dim-overlay qTR-dim"></div>' : ''}
                ${!qTLPlaced ? '<div class="dim-overlay qTL-dim"></div>' : ''}
                ${!qBLPlaced ? '<div class="dim-overlay qBL-dim"></div>' : ''}
                ${!qBRPlaced ? '<div class="dim-overlay qBR-dim"></div>' : ''}
            </div>
        `;
    }
    
    // Default cheesecake dimming
    const leftPlaced = placedParts.includes('left');
    const rightPlaced = placedParts.includes('right');
    
    return html`
        <div class="canvas-dimming-overlay">
            ${!leftPlaced ? '<div class="dim-overlay left-dim"></div>' : ''}
            ${!rightPlaced ? '<div class="dim-overlay right-dim"></div>' : ''}
        </div>
    `;
});

const IntroScreen = createComponent('IntroScreen', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    
    return html`
        <div class="intro-screen">
            <div class="intro-header">
                <h1 class="intro-title">Whole and Part</h1>
            </div>
            <div class="intro-hero">
                <div class="intro-scene-window">
                    <!-- Empty staging area for future content -->
                </div>
                <div class="intro-copy">
                    <div class="intro-text">
                        Dee Tee, Jax and Jane are at Cheesecake center.<br>
                        Let's find out what they ordered!
                    </div>
                    <button class="intro-start-button" onclick="window.wholePartsApp.state.nextState()">
                        Start
                    </button>
                </div>
            </div>
        </div>
    `;
});

const CharacterSelectionScreen = createComponent('CharacterSelectionScreen', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    const { speech = 'Here\'s what they ordered!', footerText = 'Tap ▶ to see what Dee Tee, Jax, and Jane are up to!' } = state;
    
    return html`
        <div class="character-screen">
            <div class="character-header">
                <h1 class="character-title">${speech}</h1>
            </div>
            
            <div class="character-main">
                <div class="character-choices-container">
                    <div class="character-choice">
                        <div class="character-food-circle">
                            <span class="character-food-label">Cheesecake</span>
                        </div>
                        <div class="character-sprite-container">
                            <img src="assets/cheesecake_boy.png" alt="Dee Tee" class="character-sprite" />
                        </div>
                    </div>
                    
                    <div class="character-choice">
                        <div class="character-food-circle">
                            <span class="character-food-label">Pizza</span>
                        </div>
                        <div class="character-sprite-container">
                            <img src="assets/pizza_girl.png" alt="Jax" class="character-sprite" />
                        </div>
                    </div>
                    
                    <div class="character-choice">
                        <div class="character-food-circle">
                            <span class="character-food-label">Cookie</span>
                        </div>
                        <div class="character-sprite-container">
                            <img src="assets/cookie_man.png" alt="Jane" class="character-sprite" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="character-navigation">
                <div class="character-nav-content">
                    <span class="character-nav-text">${footerText}</span>
                    <button class="character-nav-button" onclick="window.wholePartsApp.state.nextState()">
                        <span class="nav-arrow">▶</span>
                    </button>
                </div>
            </div>
        </div>
    `;
});

// StatusPip component for showing completion status
const StatusPip = createComponent('StatusPip', (props) => {
    const { status = 'pending' } = props;
    const isDone = status === 'done';
    
    return html`
        <div class="status-pip ${status}">
            ${isDone ? '<span class="check-mark">✓</span>' : ''}
        </div>
    `;
});

// OrderStatusScreen - reuses character selection layout but shows status pips
const OrderStatusScreen = createComponent('OrderStatusScreen', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    const { headerTitle = '', tiles = [], footerText = '' } = state;
    
    return html`
        <div class="character-screen">
            <div class="character-header">
                <h1 class="character-title">${headerTitle}</h1>
            </div>
            
            <div class="character-main">
                <div class="character-choices-container">
                    ${tiles.map(tile => html`
                        <div class="character-choice">
                            <div class="character-food-circle">
                                <span class="character-food-label">${tile.foodLabel}</span>
                            </div>
                            ${StatusPip.renderFunction({ status: tile.status })}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="character-navigation">
                <div class="character-nav-content">
                    <span class="character-nav-text">${footerText}</span>
                    <button class="character-nav-button" onclick="window.wholePartsApp.state.nextState()">
                        <span class="nav-arrow">▶</span>
                    </button>
                </div>
            </div>
        </div>
    `;
});

const FooterBar = createComponent('FooterBar', (props) => {
    const { state = {}, onStateChange = () => {} } = props;
    const { footerText = '' } = state;
    
    return html`
        <div class="footer-bar">
            <div class="footer-divider"></div>
            <div class="footer-content">
                ${NavButton.renderFunction({ variant: 'prev', onStateChange })}
                ${SceneProgressText.renderFunction({ text: footerText })}
                ${NavButton.renderFunction({ variant: 'next', onStateChange })}
            </div>
        </div>
    `;
});

const SceneProgressText = createComponent('SceneProgressText', (props) => {
    const { text = '' } = props;
    
    return html`
        <div class="scene-progress-text">
            ${text}
        </div>
    `;
});

// Create component wrapper functions that call the render function directly
function createComponentWrapper(componentName) {
    return function(props = {}) {
        const component = window.MiniReact.components.get(componentName);
        if (!component) {
            console.error(`Component '${componentName}' not found`);
            return '';
        }
        return component.renderFunction(props);
    };
}

// Export components for global access
window.Components = {
    Button: createComponentWrapper('Button'),
    ProgressBar: createComponentWrapper('ProgressBar'),
    SceneContainer: createComponentWrapper('SceneContainer'),
    InteractiveElement: createComponentWrapper('InteractiveElement'),
    FeedbackMessage: createComponentWrapper('FeedbackMessage'),
    Modal: createComponentWrapper('Modal'),
    LoadingSpinner: createComponentWrapper('LoadingSpinner'),
    CountDisplay: createComponentWrapper('CountDisplay'),
    NavigationControls: createComponentWrapper('NavigationControls'),
    CharacterDisplay: createComponentWrapper('CharacterDisplay'),
    Header: createComponentWrapper('Header'),
    VisualFrame: createComponentWrapper('VisualFrame'),
    IntroText: createComponentWrapper('IntroText'),
    PrimaryButton: createComponentWrapper('PrimaryButton'),
    SceneCanvas: createComponentWrapper('SceneCanvas'),
    CharacterOrderTile: createComponentWrapper('CharacterOrderTile'),
    FoodBubble: createComponentWrapper('FoodBubble'),
    CharacterSprite: createComponentWrapper('CharacterSprite'),
    SceneFooter: createComponentWrapper('SceneFooter'),
    NavButton: createComponentWrapper('NavButton'),
    SceneProgress: createComponentWrapper('SceneProgress'),
    // New Base Screen Components
    Screen: function(props = {}) { return Screen.renderFunction(props); },
    LeftPanel: function(props = {}) { return LeftPanel.renderFunction(props); },
    RightRegion: function(props = {}) { return RightRegion.renderFunction(props); },
    SceneFrame: function(props = {}) { return SceneFrame.renderFunction(props); },
    CanvasArea: function(props = {}) { return CanvasArea.renderFunction(props); },
    // ToolRail: function(props = {}) { return ToolRail.renderFunction(props); },
    SpeechBubble: function(props = {}) { return SpeechBubble.renderFunction(props); },
    FoodDisk: function(props = {}) { return FoodDisk.renderFunction(props); },
    PartThumbnail: function(props = {}) { return PartThumbnail.renderFunction(props); },
    CanvasDimmingOverlay: function(props = {}) { return CanvasDimmingOverlay.renderFunction(props); },
    FooterBar: function(props = {}) { return FooterBar.renderFunction(props); },
    SceneProgressText: function(props = {}) { return SceneProgressText.renderFunction(props); },
    StatusPip: function(props = {}) { return StatusPip.renderFunction(props); },
    OrderStatusScreen: function(props = {}) { return OrderStatusScreen.renderFunction(props); },
    // Quiz Components
    QuizRail: function(props = {}) { return QuizRail.renderFunction(props); },
    OptionButton: function(props = {}) { return OptionButton.renderFunction(props); },
    FeedbackCard: function(props = {}) { return FeedbackCard.renderFunction(props); }
};

// Header Component
createComponent('Header', (props) => {
    const { title = 'Whole and Part' } = props;
    
    return html`
        <header class="app-header">
            <h1 class="header-title">${title}</h1>
        </header>
    `;
});

// Visual Frame Component
createComponent('VisualFrame', (props) => {
    const { borderColor = '#F1C40F', children = '' } = props;
    
    return html`
        <div class="visual-frame" style="border-color: ${borderColor}">
            ${children}
        </div>
    `;
});

// Intro Text Component
createComponent('IntroText', (props) => {
    const { text = '' } = props;
    
    return html`
        <div class="intro-text">
            <p>${text}</p>
        </div>
    `;
});

// Primary Button Component
createComponent('PrimaryButton', (props) => {
    const { label = 'Start', onClick } = props;
    const buttonRef = useRef(null);
    
    const handleClick = (e) => {
        if (onClick) {
            // Add tap animation
            const button = buttonRef.current;
            if (button) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }
            onClick(e);
        }
    };
    
    return html`
        <button 
            ref="${buttonRef}" 
            class="primary-button"
            onclick="${handleClick}"
        >
            ${label}
        </button>
    `;
});

// Helper function to render components
window.renderComponent = (componentName, props, container) => {
    return render(componentName, props, container);
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Components: window.Components, renderComponent: window.renderComponent };
}