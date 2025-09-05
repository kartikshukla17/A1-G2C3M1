/**
 * Responsive Scaling System for Whole & Part Applet
 * Maintains 16:9 aspect ratio and scales content appropriately
 */

class ResponsiveManager {
    constructor(options = {}) {
        this.targetAspectRatio = options.targetAspectRatio || 16/9;
        this.minWidth = options.minWidth || 320;
        this.maxWidth = options.maxWidth || 1920;
        this.minHeight = options.minHeight || 180;
        this.maxHeight = options.maxHeight || 1080;
        
        // Scaling configuration
        this.baseWidth = 960;
        this.baseHeight = 540;
        this.currentScale = 1;
        this.container = null;
        
        // Breakpoints for different scaling strategies
        this.breakpoints = {
            mobile: 480,
            tablet: 768,
            desktop: 1024,
            large: 1440
        };
        
        // Device detection
        this.deviceInfo = {
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            orientation: 'landscape',
            pixelRatio: window.devicePixelRatio || 1
        };
        
        // Performance optimization
        this.resizeTimeout = null;
        this.resizeDelay = 100;
        
        this.detectDevice();
        this.bindEvents();
    }
    
    // Device Detection
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Mobile detection
        this.deviceInfo.isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent) || 
                                  width <= this.breakpoints.mobile;
        
        // Tablet detection
        this.deviceInfo.isTablet = /tablet|ipad/.test(userAgent) || 
                                  (width > this.breakpoints.mobile && width <= this.breakpoints.tablet);
        
        // Desktop detection
        this.deviceInfo.isDesktop = !this.deviceInfo.isMobile && !this.deviceInfo.isTablet;
        
        // Orientation detection
        this.deviceInfo.orientation = width > height ? 'landscape' : 'portrait';
        
        console.log('Device detected:', this.deviceInfo);
    }
    
    // Initialization
    initialize(container) {
        this.container = container;
        
        if (!this.container) {
            throw new Error('Container element is required for responsive manager');
        }
        
        // Set up container
        this.setupContainer();
        
        // Initial scaling
        this.updateScaling();
        
        // Set up CSS custom properties
        this.updateCSSVariables();
        
        console.log('Responsive manager initialized');
    }
    
    setupContainer() {
        // Add responsive classes
        this.container.classList.add('responsive-container');
        
        if (this.deviceInfo.isMobile) {
            this.container.classList.add('device-mobile');
        } else if (this.deviceInfo.isTablet) {
            this.container.classList.add('device-tablet');
        } else {
            this.container.classList.add('device-desktop');
        }
        
        this.container.classList.add(`orientation-${this.deviceInfo.orientation}`);
        
        // Set initial styles
        Object.assign(this.container.style, {
            position: 'relative',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            transformOrigin: 'center center'
        });
    }
    
    // Scaling Calculations
    calculateOptimalScale() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportAspectRatio = viewportWidth / viewportHeight;
        
        let scale, containerWidth, containerHeight;
        
        if (viewportAspectRatio > this.targetAspectRatio) {
            // Viewport is wider than target - fit to height
            containerHeight = Math.min(viewportHeight, this.maxHeight);
            containerWidth = containerHeight * this.targetAspectRatio;
            scale = containerHeight / this.baseHeight;
        } else {
            // Viewport is taller than target - fit to width
            containerWidth = Math.min(viewportWidth, this.maxWidth);
            containerHeight = containerWidth / this.targetAspectRatio;
            scale = containerWidth / this.baseWidth;
        }
        
        // Ensure minimum dimensions
        if (containerWidth < this.minWidth) {
            containerWidth = this.minWidth;
            containerHeight = containerWidth / this.targetAspectRatio;
            scale = containerWidth / this.baseWidth;
        }
        
        if (containerHeight < this.minHeight) {
            containerHeight = this.minHeight;
            containerWidth = containerHeight * this.targetAspectRatio;
            scale = containerHeight / this.baseHeight;
        }
        
        return {
            scale,
            width: containerWidth,
            height: containerHeight,
            left: (viewportWidth - containerWidth) / 2,
            top: (viewportHeight - containerHeight) / 2
        };
    }
    
    // Scaling Application
    updateScaling() {
        if (!this.container) return;
        
        const scaling = this.calculateOptimalScale();
        this.currentScale = scaling.scale;
        
        // Apply scaling transform
        const transform = `translate(${scaling.left}px, ${scaling.top}px) scale(${scaling.scale})`;
        
        Object.assign(this.container.style, {
            width: `${this.baseWidth}px`,
            height: `${this.baseHeight}px`,
            transform: transform,
            transformOrigin: '0 0'
        });
        
        // Update CSS variables
        this.updateCSSVariables(scaling);
        
        // Dispatch scaling event
        this.dispatchScalingEvent(scaling);
        
        console.log('Scaling updated:', {
            scale: scaling.scale,
            dimensions: `${scaling.width}x${scaling.height}`,
            position: `${scaling.left}, ${scaling.top}`
        });
    }
    
    updateCSSVariables(scaling = null) {
        if (!scaling) {
            scaling = this.calculateOptimalScale();
        }
        
        const root = document.documentElement;
        
        // Base scaling variables
        root.style.setProperty('--scale-factor', scaling.scale);
        root.style.setProperty('--base-width', `${this.baseWidth}px`);
        root.style.setProperty('--base-height', `${this.baseHeight}px`);
        root.style.setProperty('--container-width', `${scaling.width}px`);
        root.style.setProperty('--container-height', `${scaling.height}px`);
        
        // Responsive font sizes
        const baseFontSize = 16;
        const scaledFontSize = Math.max(12, Math.min(24, baseFontSize * scaling.scale));
        root.style.setProperty('--font-size-base', `${scaledFontSize}px`);
        root.style.setProperty('--font-size-small', `${scaledFontSize * 0.875}px`);
        root.style.setProperty('--font-size-large', `${scaledFontSize * 1.25}px`);
        root.style.setProperty('--font-size-xlarge', `${scaledFontSize * 1.5}px`);
        
        // Responsive spacing
        const baseSpacing = 8;
        const scaledSpacing = Math.max(4, baseSpacing * scaling.scale);
        root.style.setProperty('--spacing-xs', `${scaledSpacing * 0.5}px`);
        root.style.setProperty('--spacing-sm', `${scaledSpacing}px`);
        root.style.setProperty('--spacing-md', `${scaledSpacing * 2}px`);
        root.style.setProperty('--spacing-lg', `${scaledSpacing * 3}px`);
        root.style.setProperty('--spacing-xl', `${scaledSpacing * 4}px`);
        
        // Device-specific variables
        root.style.setProperty('--is-mobile', this.deviceInfo.isMobile ? '1' : '0');
        root.style.setProperty('--is-tablet', this.deviceInfo.isTablet ? '1' : '0');
        root.style.setProperty('--is-desktop', this.deviceInfo.isDesktop ? '1' : '0');
        root.style.setProperty('--pixel-ratio', this.deviceInfo.pixelRatio);
        
        // Touch-friendly sizing
        const minTouchTarget = this.deviceInfo.isMobile ? 44 : 32;
        const scaledTouchTarget = Math.max(minTouchTarget, 32 * scaling.scale);
        root.style.setProperty('--min-touch-target', `${scaledTouchTarget}px`);
    }
    
    // Event Handling
    bindEvents() {
        // Resize event with debouncing
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Orientation change
        window.addEventListener('orientationchange', () => {
            // Delay to allow orientation change to complete
            setTimeout(() => {
                this.detectDevice();
                this.updateScaling();
            }, 100);
        });
        
        // Fullscreen change
        document.addEventListener('fullscreenchange', () => {
            setTimeout(() => {
                this.updateScaling();
            }, 100);
        });
        
        // Visibility change (for mobile browsers)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    this.updateScaling();
                }, 100);
            }
        });
    }
    
    handleResize() {
        // Debounce resize events
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.detectDevice();
            this.updateScaling();
            this.resizeTimeout = null;
        }, this.resizeDelay);
    }
    
    // Utility Methods
    scaleValue(value) {
        return value * this.currentScale;
    }
    
    unscaleValue(value) {
        return value / this.currentScale;
    }
    
    scalePoint(point) {
        return {
            x: point.x * this.currentScale,
            y: point.y * this.currentScale
        };
    }
    
    unscalePoint(point) {
        return {
            x: point.x / this.currentScale,
            y: point.y / this.currentScale
        };
    }
    
    // Coordinate Conversion
    screenToContainer(screenX, screenY) {
        if (!this.container) return { x: screenX, y: screenY };
        
        const containerRect = this.container.getBoundingClientRect();
        const scaling = this.calculateOptimalScale();
        
        return {
            x: (screenX - containerRect.left) / scaling.scale,
            y: (screenY - containerRect.top) / scaling.scale
        };
    }
    
    containerToScreen(containerX, containerY) {
        if (!this.container) return { x: containerX, y: containerY };
        
        const containerRect = this.container.getBoundingClientRect();
        const scaling = this.calculateOptimalScale();
        
        return {
            x: containerX * scaling.scale + containerRect.left,
            y: containerY * scaling.scale + containerRect.top
        };
    }
    
    // Responsive Breakpoint Helpers
    isMobileSize() {
        return window.innerWidth <= this.breakpoints.mobile;
    }
    
    isTabletSize() {
        return window.innerWidth > this.breakpoints.mobile && 
               window.innerWidth <= this.breakpoints.tablet;
    }
    
    isDesktopSize() {
        return window.innerWidth > this.breakpoints.tablet;
    }
    
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.mobile) return 'mobile';
        if (width <= this.breakpoints.tablet) return 'tablet';
        if (width <= this.breakpoints.desktop) return 'desktop';
        return 'large';
    }
    
    // Font Size Helpers
    getResponsiveFontSize(baseSize) {
        const minSize = baseSize * 0.75;
        const maxSize = baseSize * 1.5;
        const scaledSize = baseSize * this.currentScale;
        
        return Math.max(minSize, Math.min(maxSize, scaledSize));
    }
    
    // Touch Target Helpers
    ensureTouchTarget(element, minSize = null) {
        if (!this.deviceInfo.isMobile && !this.deviceInfo.isTablet) return;
        
        const targetSize = minSize || (this.deviceInfo.isMobile ? 44 : 36);
        const scaledSize = this.scaleValue(targetSize);
        
        const currentWidth = element.offsetWidth;
        const currentHeight = element.offsetHeight;
        
        if (currentWidth < scaledSize || currentHeight < scaledSize) {
            element.style.minWidth = `${scaledSize}px`;
            element.style.minHeight = `${scaledSize}px`;
            element.style.padding = `${(scaledSize - Math.min(currentWidth, currentHeight)) / 2}px`;
        }
    }
    
    // Performance Optimization
    optimizeForDevice() {
        const root = document.documentElement;
        
        if (this.deviceInfo.isMobile) {
            // Reduce animations on mobile
            root.style.setProperty('--animation-duration', '0.2s');
            root.style.setProperty('--transition-duration', '0.15s');
        } else {
            // Full animations on desktop
            root.style.setProperty('--animation-duration', '0.3s');
            root.style.setProperty('--transition-duration', '0.25s');
        }
        
        // Adjust quality based on pixel ratio
        if (this.deviceInfo.pixelRatio > 2) {
            root.style.setProperty('--image-quality', 'high');
        } else {
            root.style.setProperty('--image-quality', 'standard');
        }
    }
    
    // Event Dispatching
    dispatchScalingEvent(scaling) {
        const event = new CustomEvent('scalingUpdated', {
            detail: {
                scale: scaling.scale,
                width: scaling.width,
                height: scaling.height,
                left: scaling.left,
                top: scaling.top,
                deviceInfo: this.deviceInfo,
                breakpoint: this.getCurrentBreakpoint()
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Public API
    getScalingInfo() {
        return {
            currentScale: this.currentScale,
            targetAspectRatio: this.targetAspectRatio,
            baseWidth: this.baseWidth,
            baseHeight: this.baseHeight,
            deviceInfo: this.deviceInfo,
            breakpoint: this.getCurrentBreakpoint()
        };
    }
    
    setTargetAspectRatio(ratio) {
        this.targetAspectRatio = ratio;
        this.updateScaling();
    }
    
    setBaseDimensions(width, height) {
        this.baseWidth = width;
        this.baseHeight = height;
        this.updateScaling();
    }
    
    // Cleanup
    destroy() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove event listeners would go here if we stored references
        // For now, they'll be cleaned up when the page unloads
    }
}

// CSS Helper Functions
function createResponsiveCSS() {
    const css = `
        /* Responsive Container Base Styles */
        .responsive-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            transform-origin: center center;
        }
        
        /* Device-specific adjustments */
        .device-mobile {
            --touch-adjustment: 1.2;
        }
        
        .device-tablet {
            --touch-adjustment: 1.1;
        }
        
        .device-desktop {
            --touch-adjustment: 1.0;
        }
        
        /* Orientation adjustments */
        .orientation-portrait {
            --orientation-factor: 0.9;
        }
        
        .orientation-landscape {
            --orientation-factor: 1.0;
        }
        
        /* Responsive text scaling */
        .responsive-text {
            font-size: clamp(0.75rem, var(--font-size-base), 1.5rem);
        }
        
        .responsive-text-small {
            font-size: clamp(0.625rem, var(--font-size-small), 1.25rem);
        }
        
        .responsive-text-large {
            font-size: clamp(1rem, var(--font-size-large), 2rem);
        }
        
        /* Responsive spacing */
        .responsive-spacing {
            padding: var(--spacing-md);
            margin: var(--spacing-sm);
        }
        
        /* Touch-friendly elements */
        .touch-target {
            min-width: var(--min-touch-target);
            min-height: var(--min-touch-target);
            padding: var(--spacing-sm);
        }
        
        /* Responsive animations */
        .responsive-animation {
            transition-duration: var(--transition-duration);
            animation-duration: var(--animation-duration);
        }
        
        /* Media queries for fallback */
        @media (max-width: 480px) {
            .responsive-container {
                --mobile-adjustment: 1;
            }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
            .responsive-container {
                --tablet-adjustment: 1;
            }
        }
        
        @media (min-width: 769px) {
            .responsive-container {
                --desktop-adjustment: 1;
            }
        }
        
        /* High DPI adjustments */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .responsive-container {
                --high-dpi: 1;
            }
        }
    `;
    
    return css;
}

// Auto-inject responsive CSS
function injectResponsiveCSS() {
    const existingStyle = document.getElementById('responsive-scaling-css');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-scaling-css';
    style.textContent = createResponsiveCSS();
    document.head.appendChild(style);
}

// Initialize CSS when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectResponsiveCSS);
} else {
    injectResponsiveCSS();
}

// Export for global access
window.ResponsiveManager = ResponsiveManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveManager, createResponsiveCSS, injectResponsiveCSS };
}