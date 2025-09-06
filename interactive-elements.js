/**
 * Interactive Elements System for Whole & Part Applet
 * Handles drag-and-drop, slicing, counting, and quiz interactions
 */

class InteractiveElementsManager {
    constructor(options = {}) {
        this.audioManager = options.audioManager;
        this.responsiveManager = options.responsiveManager;
        this.eventManager = options.eventManager;
        
        // Interaction state
        this.activeInteractions = new Map();
        this.dragState = {
            isDragging: false,
            element: null,
            startPos: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            dropZones: []
        };
        
        // Slicing state
        this.slicingState = {
            isSlicing: false,
            tool: null,
            cuts: [],
            previewCut: null
        };
        
        // Counting state
        this.countingState = {
            selectedItems: new Set(),
            totalCount: 0,
            targetCount: 0
        };
        
        // Configuration
        this.config = {
            dragThreshold: 5,
            snapDistance: 20,
            sliceWidth: 3,
            animationDuration: 300,
            feedbackDelay: 100
        };
        
        this.bindEvents();
    }
    
    // Event Binding
    bindEvents() {
        // Global interaction events
        document.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        document.addEventListener('pointermove', this.handlePointerMove.bind(this));
        document.addEventListener('pointerup', this.handlePointerUp.bind(this));
        document.addEventListener('pointercancel', this.handlePointerCancel.bind(this));
        
        // Keyboard events for accessibility
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Touch events for mobile optimization
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    }
    
    // Drag and Drop System
    makeDraggable(element, options = {}) {
        const config = {
            constrainToParent: options.constrainToParent || false,
            snapToGrid: options.snapToGrid || false,
            gridSize: options.gridSize || 20,
            onDragStart: options.onDragStart || (() => {}),
            onDrag: options.onDrag || (() => {}),
            onDragEnd: options.onDragEnd || (() => {}),
            dropZones: options.dropZones || [],
            returnToOrigin: options.returnToOrigin || false,
            clone: options.clone || false
        };
        
        element.setAttribute('data-draggable', 'true');
        element.setAttribute('data-drag-config', JSON.stringify(config));
        element.style.cursor = 'grab';
        
        // Store original position for return functionality
        const rect = element.getBoundingClientRect();
        element.setAttribute('data-original-x', rect.left);
        element.setAttribute('data-original-y', rect.top);
        
        // Add accessibility attributes
        element.setAttribute('role', 'button');
        element.setAttribute('aria-grabbed', 'false');
        element.setAttribute('tabindex', '0');
        
        return element;
    }
    
    createDropZone(element, options = {}) {
        const config = {
            accepts: options.accepts || ['*'],
            onDragEnter: options.onDragEnter || (() => {}),
            onDragLeave: options.onDragLeave || (() => {}),
            onDrop: options.onDrop || (() => {}),
            highlight: options.highlight !== false,
            snapToCenter: options.snapToCenter || false
        };
        
        element.setAttribute('data-dropzone', 'true');
        element.setAttribute('data-drop-config', JSON.stringify(config));
        element.classList.add('drop-zone');
        
        // Add accessibility attributes
        element.setAttribute('role', 'region');
        element.setAttribute('aria-dropeffect', 'move');
        
        return element;
    }
    
    // Pointer Event Handlers
    handlePointerDown(event) {
        const element = event.target && event.target.closest ? event.target.closest('[data-draggable]') : null;
        if (!element) return;
        
        event.preventDefault();
        
        const config = JSON.parse(element.getAttribute('data-drag-config') || '{}');
        
        // Initialize drag state
        this.dragState.isDragging = false;
        this.dragState.element = element;
        this.dragState.startPos = {
            x: event.clientX,
            y: event.clientY
        };
        
        const rect = element.getBoundingClientRect();
        this.dragState.offset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        // Find drop zones
        this.dragState.dropZones = Array.from(document.querySelectorAll('[data-dropzone]'));
        
        // Visual feedback
        element.style.cursor = 'grabbing';
        element.setAttribute('aria-grabbed', 'true');
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('pickup');
        }
        
        // Call config callback
        config.onDragStart?.(element, event);
    }
    
    handlePointerMove(event) {
        if (!this.dragState.element) return;
        
        const deltaX = event.clientX - this.dragState.startPos.x;
        const deltaY = event.clientY - this.dragState.startPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Start dragging if threshold exceeded
        if (!this.dragState.isDragging && distance > this.config.dragThreshold) {
            this.startDragging();
        }
        
        if (this.dragState.isDragging) {
            this.updateDragPosition(event);
            this.checkDropZones(event);
        }
    }
    
    handlePointerUp(event) {
        if (!this.dragState.element) return;
        
        if (this.dragState.isDragging) {
            this.completeDrag(event);
        } else {
            // Handle click/tap
            this.handleElementClick(this.dragState.element, event);
        }
        
        this.resetDragState();
    }
    
    handlePointerCancel(event) {
        if (this.dragState.isDragging) {
            this.cancelDrag();
        }
        this.resetDragState();
    }
    
    // Drag Implementation
    startDragging() {
        const element = this.dragState.element;
        const config = JSON.parse(element.getAttribute('data-drag-config') || '{}');
        
        this.dragState.isDragging = true;
        
        // Create clone if needed
        if (config.clone) {
            const clone = element.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.zIndex = '1000';
            clone.style.pointerEvents = 'none';
            document.body.appendChild(clone);
            this.dragState.element = clone;
        } else {
            element.style.position = 'absolute';
            element.style.zIndex = '1000';
        }
        
        // Add dragging class
        element.classList.add('dragging');
        
        // Highlight drop zones
        this.highlightDropZones(true);
    }
    
    updateDragPosition(event) {
        const element = this.dragState.element;
        const config = JSON.parse(element.getAttribute('data-drag-config') || '{}');
        
        let x = event.clientX - this.dragState.offset.x;
        let y = event.clientY - this.dragState.offset.y;
        
        // Apply constraints
        if (config.constrainToParent && element.parentElement) {
            const parentRect = element.parentElement.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            x = Math.max(0, Math.min(x, parentRect.width - elementRect.width));
            y = Math.max(0, Math.min(y, parentRect.height - elementRect.height));
        }
        
        // Apply grid snapping
        if (config.snapToGrid) {
            x = Math.round(x / config.gridSize) * config.gridSize;
            y = Math.round(y / config.gridSize) * config.gridSize;
        }
        
        // Apply responsive scaling
        if (this.responsiveManager) {
            const scaledPos = this.responsiveManager.screenToContainer(x, y);
            x = scaledPos.x;
            y = scaledPos.y;
        }
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        
        // Call config callback
        config.onDrag?.(element, event, { x, y });
    }
    
    checkDropZones(event) {
        const elementRect = this.dragState.element.getBoundingClientRect();
        const elementCenter = {
            x: elementRect.left + elementRect.width / 2,
            y: elementRect.top + elementRect.height / 2
        };
        
        this.dragState.dropZones.forEach(zone => {
            const zoneRect = zone.getBoundingClientRect();
            const isOver = (
                elementCenter.x >= zoneRect.left &&
                elementCenter.x <= zoneRect.right &&
                elementCenter.y >= zoneRect.top &&
                elementCenter.y <= zoneRect.bottom
            );
            
            const config = JSON.parse(zone.getAttribute('data-drop-config') || '{}');
            
            if (isOver && !zone.classList.contains('drag-over')) {
                zone.classList.add('drag-over');
                config.onDragEnter?.(zone, this.dragState.element, event);
            } else if (!isOver && zone.classList.contains('drag-over')) {
                zone.classList.remove('drag-over');
                config.onDragLeave?.(zone, this.dragState.element, event);
            }
        });
    }
    
    completeDrag(event) {
        const element = this.dragState.element;
        const config = JSON.parse(element.getAttribute('data-drag-config') || '{}');
        
        // Find drop target
        const dropZone = this.findDropZone(event);
        
        if (dropZone) {
            this.handleDrop(dropZone, element, event);
        } else if (config.returnToOrigin) {
            this.returnToOrigin(element);
        }
        
        // Cleanup
        this.highlightDropZones(false);
        element.classList.remove('dragging');
        
        // Call config callback
        config.onDragEnd?.(element, event, dropZone);
    }
    
    findDropZone(event) {
        return this.dragState.dropZones.find(zone => {
            const rect = zone.getBoundingClientRect();
            return (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            );
        });
    }
    
    handleDrop(dropZone, element, event) {
        const config = JSON.parse(dropZone.getAttribute('data-drop-config') || '{}');
        
        // Check if drop is accepted
        const elementType = element.getAttribute('data-type') || 'default';
        const accepts = config.accepts || ['*'];
        
        if (!accepts.includes('*') && !accepts.includes(elementType)) {
            this.returnToOrigin(element);
            return;
        }
        
        // Position element in drop zone
        if (config.snapToCenter) {
            const zoneRect = dropZone.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            const centerX = zoneRect.left + (zoneRect.width - elementRect.width) / 2;
            const centerY = zoneRect.top + (zoneRect.height - elementRect.height) / 2;
            
            element.style.left = `${centerX}px`;
            element.style.top = `${centerY}px`;
        }
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('drop_success');
        }
        
        // Visual feedback
        dropZone.classList.add('drop-success');
        setTimeout(() => {
            dropZone.classList.remove('drop-success');
        }, this.config.animationDuration);
        
        // Call config callback
        config.onDrop?.(dropZone, element, event);
    }
    
    returnToOrigin(element) {
        const originalX = parseFloat(element.getAttribute('data-original-x') || '0');
        const originalY = parseFloat(element.getAttribute('data-original-y') || '0');
        
        // Animate return
        element.style.transition = `all ${this.config.animationDuration}ms ease-out`;
        element.style.left = `${originalX}px`;
        element.style.top = `${originalY}px`;
        
        setTimeout(() => {
            element.style.transition = '';
        }, this.config.animationDuration);
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('return');
        }
    }
    
    highlightDropZones(highlight) {
        this.dragState.dropZones.forEach(zone => {
            if (highlight) {
                zone.classList.add('drop-zone-active');
            } else {
                zone.classList.remove('drop-zone-active', 'drag-over');
            }
        });
    }
    
    resetDragState() {
        if (this.dragState.element) {
            this.dragState.element.style.cursor = 'grab';
            this.dragState.element.setAttribute('aria-grabbed', 'false');
        }
        
        this.dragState = {
            isDragging: false,
            element: null,
            startPos: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
            dropZones: []
        };
    }
    
    cancelDrag() {
        if (this.dragState.element) {
            this.returnToOrigin(this.dragState.element);
            this.highlightDropZones(false);
            this.dragState.element.classList.remove('dragging');
        }
    }
    
    // Slicing System
    makeSliceable(element, options = {}) {
        const config = {
            sliceDirection: options.sliceDirection || 'both', // 'horizontal', 'vertical', 'both'
            maxSlices: options.maxSlices || 8,
            onSliceStart: options.onSliceStart || (() => {}),
            onSlice: options.onSlice || (() => {}),
            onSliceComplete: options.onSliceComplete || (() => {}),
            showPreview: options.showPreview !== false
        };
        
        element.setAttribute('data-sliceable', 'true');
        element.setAttribute('data-slice-config', JSON.stringify(config));
        element.classList.add('sliceable');
        
        return element;
    }
    
    createSlicingTool(element, options = {}) {
        const config = {
            toolType: options.toolType || 'knife',
            sliceWidth: options.sliceWidth || 3,
            onToolSelect: options.onToolSelect || (() => {})
        };
        
        element.setAttribute('data-slicing-tool', 'true');
        element.setAttribute('data-tool-config', JSON.stringify(config));
        element.classList.add('slicing-tool');
        
        element.addEventListener('click', () => {
            this.selectSlicingTool(element);
        });
        
        return element;
    }
    
    selectSlicingTool(toolElement) {
        // Deselect previous tool
        document.querySelectorAll('.slicing-tool.selected').forEach(tool => {
            tool.classList.remove('selected');
        });
        
        // Select new tool
        toolElement.classList.add('selected');
        this.slicingState.tool = toolElement;
        
        const config = JSON.parse(toolElement.getAttribute('data-tool-config') || '{}');
        config.onToolSelect?.(toolElement);
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('tool_select');
        }
    }
    
    performSlice(element, sliceData) {
        const config = JSON.parse(element.getAttribute('data-slice-config') || '{}');
        
        // Validate slice
        if (this.slicingState.cuts.length >= config.maxSlices) {
            return false;
        }
        
        // Add slice to state
        this.slicingState.cuts.push(sliceData);
        
        // Visual feedback
        this.renderSlice(element, sliceData);
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('slice');
        }
        
        // Call config callback
        config.onSlice?.(element, sliceData, this.slicingState.cuts);
        
        return true;
    }
    
    renderSlice(element, sliceData) {
        const sliceLine = document.createElement('div');
        sliceLine.className = 'slice-line';
        
        const rect = element.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        if (sliceData.direction === 'horizontal') {
            sliceLine.style.cssText = `
                position: absolute;
                left: 0;
                top: ${sliceData.position}px;
                width: 100%;
                height: ${this.config.sliceWidth}px;
                background: #ff4444;
                z-index: 10;
                pointer-events: none;
            `;
        } else {
            sliceLine.style.cssText = `
                position: absolute;
                left: ${sliceData.position}px;
                top: 0;
                width: ${this.config.sliceWidth}px;
                height: 100%;
                background: #ff4444;
                z-index: 10;
                pointer-events: none;
            `;
        }
        
        element.appendChild(sliceLine);
        
        // Animate slice appearance
        sliceLine.style.opacity = '0';
        sliceLine.style.transform = 'scale(0)';
        
        requestAnimationFrame(() => {
            sliceLine.style.transition = `all ${this.config.animationDuration}ms ease-out`;
            sliceLine.style.opacity = '1';
            sliceLine.style.transform = 'scale(1)';
        });
    }
    
    // Counting System
    makeCountable(element, options = {}) {
        const config = {
            countValue: options.countValue || 1,
            maxSelections: options.maxSelections || Infinity,
            onSelect: options.onSelect || (() => {}),
            onDeselect: options.onDeselect || (() => {}),
            onCountChange: options.onCountChange || (() => {})
        };
        
        element.setAttribute('data-countable', 'true');
        element.setAttribute('data-count-config', JSON.stringify(config));
        element.classList.add('countable');
        
        element.addEventListener('click', () => {
            this.toggleCount(element);
        });
        
        return element;
    }
    
    toggleCount(element) {
        const config = JSON.parse(element.getAttribute('data-count-config') || '{}');
        const isSelected = this.countingState.selectedItems.has(element);
        
        if (isSelected) {
            this.deselectCountable(element);
        } else {
            this.selectCountable(element);
        }
    }
    
    selectCountable(element) {
        const config = JSON.parse(element.getAttribute('data-count-config') || '{}');
        
        // Check max selections
        if (this.countingState.selectedItems.size >= config.maxSelections) {
            return false;
        }
        
        // Add to selection
        this.countingState.selectedItems.add(element);
        this.countingState.totalCount += config.countValue;
        
        // Visual feedback
        element.classList.add('selected', 'counting-selected');
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('count_select');
        }
        
        // Call config callback
        config.onSelect?.(element, this.countingState.totalCount);
        config.onCountChange?.(this.countingState.totalCount, this.countingState.selectedItems.size);
        
        return true;
    }
    
    deselectCountable(element) {
        const config = JSON.parse(element.getAttribute('data-count-config') || '{}');
        
        // Remove from selection
        this.countingState.selectedItems.delete(element);
        this.countingState.totalCount -= config.countValue;
        
        // Visual feedback
        element.classList.remove('selected', 'counting-selected');
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('count_deselect');
        }
        
        // Call config callback
        config.onDeselect?.(element, this.countingState.totalCount);
        config.onCountChange?.(this.countingState.totalCount, this.countingState.selectedItems.size);
    }
    
    resetCounting() {
        this.countingState.selectedItems.forEach(element => {
            element.classList.remove('selected', 'counting-selected');
        });
        
        this.countingState.selectedItems.clear();
        this.countingState.totalCount = 0;
    }
    
    // Touch Event Handlers
    handleTouchStart(event) {
        // Prevent default to avoid conflicts with pointer events
        if (event.target && event.target.closest && event.target.closest('[data-draggable], [data-sliceable], [data-countable]')) {
            event.preventDefault();
        }
    }
    
    handleTouchMove(event) {
        if (this.dragState.isDragging) {
            event.preventDefault();
        }
    }
    
    handleTouchEnd(event) {
        if (this.dragState.isDragging) {
            event.preventDefault();
        }
    }
    
    // Keyboard Event Handlers
    handleKeyDown(event) {
        const focusedElement = document.activeElement;
        
        if (focusedElement?.hasAttribute('data-draggable')) {
            this.handleDraggableKeyboard(event, focusedElement);
        } else if (focusedElement?.hasAttribute('data-countable')) {
            this.handleCountableKeyboard(event, focusedElement);
        }
    }
    
    handleKeyUp(event) {
        // Handle key releases if needed
    }
    
    handleDraggableKeyboard(event, element) {
        const moveDistance = 10;
        let moved = false;
        
        switch (event.key) {
            case 'ArrowLeft':
                this.moveElement(element, -moveDistance, 0);
                moved = true;
                break;
            case 'ArrowRight':
                this.moveElement(element, moveDistance, 0);
                moved = true;
                break;
            case 'ArrowUp':
                this.moveElement(element, 0, -moveDistance);
                moved = true;
                break;
            case 'ArrowDown':
                this.moveElement(element, 0, moveDistance);
                moved = true;
                break;
            case 'Enter':
            case ' ':
                this.handleElementClick(element, event);
                moved = true;
                break;
        }
        
        if (moved) {
            event.preventDefault();
        }
    }
    
    handleCountableKeyboard(event, element) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleCount(element);
        }
    }
    
    moveElement(element, deltaX, deltaY) {
        const rect = element.getBoundingClientRect();
        const newX = rect.left + deltaX;
        const newY = rect.top + deltaY;
        
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
        
        // Audio feedback
        if (this.audioManager) {
            this.audioManager.playSound('move');
        }
    }
    
    handleElementClick(element, event) {
        if (element.hasAttribute('data-countable')) {
            this.toggleCount(element);
        } else if (element.hasAttribute('data-slicing-tool')) {
            this.selectSlicingTool(element);
        }
    }
    
    // Utility Methods
    getInteractionState() {
        return {
            drag: { ...this.dragState },
            slicing: { ...this.slicingState },
            counting: {
                selectedItems: Array.from(this.countingState.selectedItems),
                totalCount: this.countingState.totalCount,
                targetCount: this.countingState.targetCount
            }
        };
    }
    
    resetAllInteractions() {
        this.resetDragState();
        this.resetCounting();
        this.slicingState.cuts = [];
        this.slicingState.tool = null;
        
        // Clear visual states
        document.querySelectorAll('.dragging, .selected, .counting-selected, .drop-zone-active, .drag-over').forEach(el => {
            el.classList.remove('dragging', 'selected', 'counting-selected', 'drop-zone-active', 'drag-over');
        });
        
        // Clear slice lines
        document.querySelectorAll('.slice-line').forEach(line => {
            line.remove();
        });
    }
    
    // Public API
    enableInteractions() {
        document.body.classList.add('interactions-enabled');
    }
    
    disableInteractions() {
        document.body.classList.remove('interactions-enabled');
        this.resetAllInteractions();
    }
    
    // Cleanup
    destroy() {
        this.resetAllInteractions();
        // Event listeners will be cleaned up when page unloads
    }
}

// Export for global access
window.InteractiveElementsManager = InteractiveElementsManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractiveElementsManager };
}