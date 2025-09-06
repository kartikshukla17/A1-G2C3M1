/**
 * Mini-React Framework for Whole & Part Applet
 * Lightweight React-like framework with hooks and component system
 * Supports touch, mouse, and stylus interactions
 */

class MiniReact {
    constructor() {
        this.currentComponent = null;
        this.hookIndex = 0;
        this.hooks = [];
        this.components = new Map();
        this.eventListeners = new Map();
        this.renderQueue = new Set();
        this.isRendering = false;
        
        // Initialize event system
        this.initializeEventSystem();
    }
    
    // Initialize unified event system for touch, mouse, and stylus
    initializeEventSystem() {
        const eventTypes = {
            start: ['mousedown', 'touchstart', 'pointerdown'],
            move: ['mousemove', 'touchmove', 'pointermove'],
            end: ['mouseup', 'touchend', 'pointerup'],
            cancel: ['touchcancel', 'pointercancel']
        };
        
        // Store event mappings for cleanup
        this.eventMappings = eventTypes;
        
        // Prevent default touch behaviors that interfere with interactions
        document.addEventListener('touchstart', (e) => {
            if (e.target && e.target.closest && e.target.closest('.interactive')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.target && e.target.closest && e.target.closest('.draggable')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Unified event position getter
    getEventPosition(event) {
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        } else if (event.changedTouches && event.changedTouches.length > 0) {
            return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
        } else {
            return { x: event.clientX, y: event.clientY };
        }
    }
    
    // useState hook implementation
    useState(initialValue) {
        const currentHookIndex = this.hookIndex++;
        const component = this.currentComponent;
        
        if (!component.hooks[currentHookIndex]) {
            component.hooks[currentHookIndex] = {
                type: 'state',
                value: typeof initialValue === 'function' ? initialValue() : initialValue
            };
        }
        
        const hook = component.hooks[currentHookIndex];
        
        const setState = (newValue) => {
            const nextValue = typeof newValue === 'function' 
                ? newValue(hook.value) 
                : newValue;
                
            if (hook.value !== nextValue) {
                hook.value = nextValue;
                this.scheduleRender(component);
            }
        };
        
        return [hook.value, setState];
    }
    
    // useEffect hook implementation
    useEffect(callback, dependencies) {
        const currentHookIndex = this.hookIndex++;
        const component = this.currentComponent;
        
        if (!component.hooks[currentHookIndex]) {
            component.hooks[currentHookIndex] = {
                type: 'effect',
                callback,
                dependencies,
                cleanup: null
            };
        }
        
        const hook = component.hooks[currentHookIndex];
        
        // Check if dependencies changed
        const depsChanged = !dependencies || 
            !hook.dependencies || 
            dependencies.length !== hook.dependencies.length ||
            dependencies.some((dep, i) => dep !== hook.dependencies[i]);
        
        if (depsChanged) {
            // Cleanup previous effect
            if (hook.cleanup && typeof hook.cleanup === 'function') {
                hook.cleanup();
            }
            
            // Run new effect
            hook.cleanup = callback();
            hook.dependencies = dependencies ? [...dependencies] : null;
        }
    }
    
    // useRef hook implementation
    useRef(initialValue) {
        const currentHookIndex = this.hookIndex++;
        const component = this.currentComponent;
        
        if (!component.hooks[currentHookIndex]) {
            component.hooks[currentHookIndex] = {
                type: 'ref',
                current: initialValue
            };
        }
        
        return component.hooks[currentHookIndex];
    }
    
    // Custom hook for drag and drop
    useDragAndDrop(elementRef, options = {}) {
        const [isDragging, setIsDragging] = this.useState(false);
        const [position, setPosition] = this.useState({ x: 0, y: 0 });
        const dragStartPos = this.useRef({ x: 0, y: 0 });
        const elementStartPos = this.useRef({ x: 0, y: 0 });
        
        this.useEffect(() => {
            const element = elementRef.current;
            if (!element) return;
            
            const handleStart = (e) => {
                if (options.disabled) return;
                
                const pos = this.getEventPosition(e);
                dragStartPos.current = pos;
                
                const rect = element.getBoundingClientRect();
                elementStartPos.current = { x: rect.left, y: rect.top };
                
                setIsDragging(true);
                element.classList.add('dragging');
                
                if (options.onDragStart) {
                    options.onDragStart(e, pos);
                }
                
                // Add audio feedback
                this.playAudioFeedback('drag_start');
            };
            
            const handleMove = (e) => {
                if (!isDragging) return;
                
                const pos = this.getEventPosition(e);
                const deltaX = pos.x - dragStartPos.current.x;
                const deltaY = pos.y - dragStartPos.current.y;
                
                const newPosition = {
                    x: elementStartPos.current.x + deltaX,
                    y: elementStartPos.current.y + deltaY
                };
                
                setPosition(newPosition);
                
                if (options.onDrag) {
                    options.onDrag(e, newPosition, { deltaX, deltaY });
                }
            };
            
            const handleEnd = (e) => {
                if (!isDragging) return;
                
                setIsDragging(false);
                element.classList.remove('dragging');
                
                if (options.onDragEnd) {
                    const pos = this.getEventPosition(e);
                    options.onDragEnd(e, pos, position);
                }
                
                // Add audio feedback
                this.playAudioFeedback('drag_end');
            };
            
            // Add event listeners for all input types
            this.eventMappings.start.forEach(eventType => {
                element.addEventListener(eventType, handleStart);
            });
            
            this.eventMappings.move.forEach(eventType => {
                document.addEventListener(eventType, handleMove);
            });
            
            this.eventMappings.end.forEach(eventType => {
                document.addEventListener(eventType, handleEnd);
            });
            
            this.eventMappings.cancel.forEach(eventType => {
                document.addEventListener(eventType, handleEnd);
            });
            
            // Cleanup function
            return () => {
                this.eventMappings.start.forEach(eventType => {
                    element.removeEventListener(eventType, handleStart);
                });
                
                this.eventMappings.move.forEach(eventType => {
                    document.removeEventListener(eventType, handleMove);
                });
                
                this.eventMappings.end.forEach(eventType => {
                    document.removeEventListener(eventType, handleEnd);
                });
                
                this.eventMappings.cancel.forEach(eventType => {
                    document.removeEventListener(eventType, handleEnd);
                });
            };
        }, [isDragging, options.disabled]);
        
        return {
            isDragging,
            position,
            setPosition
        };
    }
    
    // Custom hook for interactive elements with audio feedback
    useInteractive(elementRef, options = {}) {
        const [isActive, setIsActive] = this.useState(false);
        const [isPressed, setIsPressed] = this.useState(false);
        
        this.useEffect(() => {
            const element = elementRef.current;
            if (!element) return;
            
            const handleStart = (e) => {
                if (options.disabled) return;
                
                setIsPressed(true);
                element.classList.add('pressed');
                
                // Add tap animation
                element.style.transform = 'scale(0.95)';
                
                if (options.onPress) {
                    options.onPress(e);
                }
                
                // Audio feedback
                this.playAudioFeedback('tap');
            };
            
            const handleEnd = (e) => {
                if (!isPressed) return;
                
                setIsPressed(false);
                element.classList.remove('pressed');
                
                // Reset animation
                element.style.transform = '';
                
                // Check if it's a valid click/tap (ended on the same element)
                const pos = this.getEventPosition(e);
                const elementAtPoint = document.elementFromPoint(pos.x, pos.y);
                
                if (element.contains(elementAtPoint) && options.onClick) {
                    options.onClick(e);
                    this.playAudioFeedback('click');
                }
                
                if (options.onRelease) {
                    options.onRelease(e);
                }
            };
            
            const handleCancel = () => {
                setIsPressed(false);
                element.classList.remove('pressed');
                element.style.transform = '';
            };
            
            // Add event listeners
            this.eventMappings.start.forEach(eventType => {
                element.addEventListener(eventType, handleStart);
            });
            
            this.eventMappings.end.forEach(eventType => {
                document.addEventListener(eventType, handleEnd);
            });
            
            this.eventMappings.cancel.forEach(eventType => {
                document.addEventListener(eventType, handleCancel);
            });
            
            // Cleanup
            return () => {
                this.eventMappings.start.forEach(eventType => {
                    element.removeEventListener(eventType, handleStart);
                });
                
                this.eventMappings.end.forEach(eventType => {
                    document.removeEventListener(eventType, handleEnd);
                });
                
                this.eventMappings.cancel.forEach(eventType => {
                    document.removeEventListener(eventType, handleCancel);
                });
            };
        }, [isPressed, options.disabled]);
        
        return {
            isActive,
            isPressed,
            setIsActive
        };
    }
    
    // Audio feedback system
    playAudioFeedback(type) {
        // Create simple audio feedback using Web Audio API or audio elements
        // For now, using a simple beep system
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different actions
            const frequencies = {
                tap: 800,
                click: 1000,
                drag_start: 600,
                drag_end: 900,
                success: 1200,
                error: 400
            };
            
            oscillator.frequency.setValueAtTime(frequencies[type] || 800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Fallback: no audio feedback if Web Audio API is not supported
            console.log(`Audio feedback: ${type}`);
        }
    }
    
    // Component creation and management
    createComponent(name, renderFunction) {
        const component = {
            name,
            renderFunction,
            hooks: [],
            element: null,
            props: {},
            mounted: false
        };
        
        this.components.set(name, component);
        return component;
    }
    
    // Render a component
    render(componentName, props = {}, container) {
        const component = this.components.get(componentName);
        if (!component) {
            throw new Error(`Component '${componentName}' not found`);
        }
        
        // Set current component for hooks
        this.currentComponent = component;
        this.hookIndex = 0;
        
        // Update props
        component.props = props;
        
        // Call render function
        const result = component.renderFunction(props);
        
        // Update DOM
        if (container) {
            if (typeof result === 'string') {
                container.innerHTML = result;
            } else if (result instanceof HTMLElement) {
                container.innerHTML = '';
                container.appendChild(result);
            }
            
            component.element = container;
        }
        
        // Mark as mounted
        if (!component.mounted) {
            component.mounted = true;
        }
        
        // Reset current component
        this.currentComponent = null;
        
        return result;
    }
    
    // Schedule a re-render
    scheduleRender(component) {
        this.renderQueue.add(component);
        
        if (!this.isRendering) {
            this.isRendering = true;
            requestAnimationFrame(() => {
                this.flushRenderQueue();
            });
        }
    }
    
    // Process render queue
    flushRenderQueue() {
        for (const component of this.renderQueue) {
            if (component.element && component.mounted) {
                this.render(component.name, component.props, component.element);
            }
        }
        
        this.renderQueue.clear();
        this.isRendering = false;
    }
    
    // Unmount a component
    unmount(componentName) {
        const component = this.components.get(componentName);
        if (!component) return;
        
        // Run cleanup for all effects
        component.hooks.forEach(hook => {
            if (hook.type === 'effect' && hook.cleanup && typeof hook.cleanup === 'function') {
                hook.cleanup();
            }
        });
        
        // Clear hooks
        component.hooks = [];
        component.mounted = false;
        
        // Remove from render queue
        this.renderQueue.delete(component);
    }
    
    // Utility function to create HTML elements with props
    createElement(tag, props = {}, ...children) {
        const element = document.createElement(tag);
        
        // Set properties
        Object.entries(props).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
        
        return element;
    }
    
    // Template literal helper for HTML
    html(strings, ...values) {
        let result = '';
        for (let i = 0; i < strings.length; i++) {
            result += strings[i];
            if (i < values.length) {
                result += values[i];
            }
        }
        return result;
    }
}

// Create global instance
const miniReact = new MiniReact();

// Export hooks and utilities for global use
window.useState = miniReact.useState.bind(miniReact);
window.useEffect = miniReact.useEffect.bind(miniReact);
window.useRef = miniReact.useRef.bind(miniReact);
window.useDragAndDrop = miniReact.useDragAndDrop.bind(miniReact);
window.useInteractive = miniReact.useInteractive.bind(miniReact);
window.createElement = miniReact.createElement.bind(miniReact);
window.html = miniReact.html.bind(miniReact);
window.createComponent = miniReact.createComponent.bind(miniReact);
window.render = miniReact.render.bind(miniReact);

// Export MiniReact instance
window.MiniReact = miniReact;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MiniReact, miniReact };
}