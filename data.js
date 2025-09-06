// Internationalization data for Whole & Part of a Whole applet
// Content ID: A1-G2C3M1
// Following snake_case naming convention and ICU format for dynamic content

const appData = {
    currentLanguage: "en",
    
    // Language configuration
    languages: {
        en: "English",
        es: "Español"
    },
    
    // Translation data organized by domains
    translations: {
        en: {
            // Standard UI - Reusable UI text (buttons, labels, instructions)
            "standard-ui": {
                buttons: {
                    start: "Start",
                    next: "Next →",
                    previous: "← Previous",
                    restart: "Start Over",
                    try_again: "Try Again",
                    continue: "Continue",
                    whole: "Whole",
                    part: "Part"
                },
                labels: {
                    scene: "Scene",
                    progress: "Scene {current} of {total}",
                    count: "Count: {count}",
                    parts_counted: "{count, plural, one {# part} other {# parts}} counted",
                    loading: "Loading...",
                    ready: "Ready to start learning!"
                },
                navigation: {
                    grade_level: "Grade 1-2",
                    interactive_learning: "Interactive Learning",
                    keyboard_hint: "Use ← / → to navigate • Click / tap to interact",
                    scene_progress: "Scene",
                    of: "of"
                },
                accessibility: {
                    scene_changed: "Scene changed to {sceneName}",
                    button_enabled: "Button enabled",
                    button_disabled: "Button disabled",
                    drag_instruction: "Use arrow keys to move, space to drop",
                    screen_reader_instructions: "This is an interactive learning activity. Use tab to navigate between elements."
                }
            },
            
            // Content UI - Applet-specific content (dialogs, feedback, questions)
            "content-ui": {
                title: "Whole & Part of a Whole",
                
                // Scene 0 - Intro/Splash
                intro: {
                    title: "Whole and Part",
                    subtitle: "Characters: Dee Tee, Jax, Jane at Cheesecake Center",
                    description: "Dee Tee, Jax and Jane are at Cheesecake center. Let's find out what they ordered!",
                    items: {
                        cheesecake: "Cheesecake",
                        pizza: "Pizza",
                        cookie: "Cookie"
                    }
                },
                
                order_scene: {
                    title: "Here's what they ordered!",
                    instruction: "Tap ▶ to see what Dee Tee, Jax, and Jane are up to!",
                    characters: {
                        dee_tee: {
                            name: "Dee Tee",
                            food: "Cheesecake",
                            sprite_alt: "Boy pointing to cheesecake"
                        },
                        jax: {
                            name: "Jax",
                            food: "Pizza",
                            sprite_alt: "Girl pointing to pizza"
                        },
                        jane: {
                            name: "Jane",
                            food: "Cookie",
                            sprite_alt: "Man pointing to cookie"
                        }
                    }
                },
                
                // Scene 1 - Cheesecake Cut
                cheesecake_cut: {
                    title: "I want to cut the cake into 2 pieces!",
                    instruction: "Tap the slicer, then tap the cheesecake.",
                    tool_name: "Slicer (2 parts)",
                    feedback_initial: "Select the slicer, then tap the cheesecake.",
                    feedback_success: "Nice work, Jax! You cut the whole cheesecake into parts.",
                    feedback_error: "Tap the slicer first.",
                    hint: "Tap cake while the slicer is active"
                },
                
                // Pizza Flow States
                pizza_intro: {
                    sprite: "pizza_girl",
                    speech: "I'm so hungry!\nThis pizza looks delicious. Let's eat it.\n\nCut the pizza into pieces!",
                    showToolPanel: true,
                    cut: false,
                    showPartLabels: false,
                    footerText: "Tap the slicer 🪄, then tap the pizza."
                },
                
                pizza_boy_notices: {
                    sprite: "cheesecake_boy",
                    speech: "Wait, the {whole} pizza is cut into different {parts}; How many parts is this Dee Tee?",
                    showToolPanel: false,
                    cut: "horizontal",
                    showPartLabels: false,
                    footerText: "Tap ▶ to see what Dee Tee says."
                },
                
                pizza_counting_instruction: {
                    sprite: "cookie_man",
                    speech: "Let's check, Jax!\n\nCount the number of {parts} the {whole} pizza is cut into.",
                    showToolPanel: false,
                    cut: "cross",
                    showPartLabels: false,
                    footerText: "Tap each part to count them."
                },
                
                pizza_confirmation: {
                    sprite: "cookie_man",
                    speech: "Yay! Good job!\n\nYes, this {whole} pizza is cut into 4 {parts}.",
                    showToolPanel: false,
                    cut: "cross",
                    showPartLabels: true,
                    footerText: "Tap ▶ and let's keep following them!"
                },
                
                pizza_followup: {
                    sprite: "pizza_girl",
                    speech: "If we put all the 4 {parts} back, do we get the {whole} again, Dee Tee?",
                    showToolPanel: false,
                    toolMode: null,
                    cut: "cross",
                    showPartLabels: true,
                    dimCanvas: false,
                    availableParts: [],
                    placedParts: [],
                    canvasCaption: null,
                    footerText: "Tap ▶ know what Dee Tee says ?",
                    foodType: "pizza"
                },

                pizza_reassembly_start: {
                    sprite: "cookie_man",
                    speech: "Let's see whether all the parts together make the whole pizza again.",
                    showToolPanel: true,
                    toolMode: "parts",
                    toolRailHeader: "Parts of the pizza.",
                    cut: "cross",
                    showPartLabels: true,
                    dimCanvas: true,
                    availableParts: ["qTR", "qTL", "qBL", "qBR"],
                    placedParts: [],
                    canvasCaption: null,
                    footerText: "Tap each part in the rail to place it.",
                    foodType: "pizza"
                },

                pizza_reassembly_progress: {
                    sprite: "cookie_man",
                    speech: "Drag or tap a part from the rail to join it back.",
                    showToolPanel: true,
                    toolMode: "parts",
                    toolRailHeader: "Parts of the pizza.",
                    cut: "cross",
                    showPartLabels: true,
                    dimCanvas: true,
                    availableParts: ["qTL", "qBL", "qBR"],
                    placedParts: ["qTR"],
                    canvasCaption: null,
                    footerText: "Great! Place the remaining parts.",
                    foodType: "pizza"
                },

                pizza_reassembly_success: {
                    sprite: "cookie_man",
                    speech: "Yay! All the {parts} together make the {whole} again.",
                    showToolPanel: false,
                    toolMode: null,
                    cut: false,
                    showPartLabels: false,
                    dimCanvas: false,
                    availableParts: [],
                    placedParts: ["qTR", "qTL", "qBL", "qBR"],
                    canvasCaption: "All the parts together make the whole again.",
                    footerText: "Tap ▶ to move ahead in the story!",
                    foodType: "pizza"
                },
                
                // Scene 2 - Cheesecake Count
                cheesecake_count: {
                    title: "Let's check, Jax! Count the number of parts the whole cheesecake is cut into.",
                    instruction: "Count the number of parts the whole cheesecake is cut into. Tap each part to count them.",
                    feedback_initial: "Tap slices in any order to count Part 1 to Part 2.",
                    feedback_counting: "Count: {count} (Part {count})",
                    feedback_success: "Yay! The cheesecake is cut into 2 parts.",
                    slice_step: "Slice",
                    count_step: "Count",
                    slice_into_equal_parts: "Cut the cheesecake into equal parts",
                    count_the_slices: "Count the Slices",
                    tap_each_slice_to_count: "Tap each slice to count them",
                    parts_counted: "Parts counted",
                    all_parts_counted: "Great! All parts counted!",
                    part_labels: {
                        1: "Part 1",
                        2: "Part 2"
                    }
                },
                
                // Scene 3 - Cheesecake Reassemble
                cheesecake_reassemble: {
                    title: "Do all parts make the whole again?",
                    instruction: "Drag each part to bring them together.",
                    feedback_initial: "Arrange the two parts so they touch.",
                    feedback_success: "Yay! All the parts together make the whole again.",
                    hint: "Drag each part to the center"
                },
                
                // Scene 3 - Pizza Cut
                pizza_cut: {
                    title: "Let's eat pizza!",
                    instruction: "Cut the pizza into pieces!",
                    tool_name: "Slicer (4 parts)",
                    feedback_initial: "Select the slicer, then tap the pizza.",
                    feedback_success: "Great! Pizza cut into 4 parts.",
                    feedback_error: "Tap the slicer first.",
                    hint: "Tap pizza while slicer is active"
                },
                
                // Scene 4 - Pizza Count
                pizza_count: {
                    title: "Let's check, Jax! Count the number of parts the whole pizza is cut into.",
                    instruction: "Count the number of parts the whole pizza is cut into. Tap each part to count them.",
                    feedback_initial: "Tap slices in any order to count Part 1 to Part 4.",
                    feedback_counting: "Count: {count} (Part {count})",
                    feedback_success: "Yay! The pizza is cut into 4 parts.",
                    slice_and_count_pizza: "Slice and Count Pizza",
                    slice_step: "Slice",
                    count_step: "Count",
                    slice_the_pizza: "Slice the Pizza",
                    slice_into_equal_parts: "Cut the pizza into equal parts",
                    target_slices: "Target slices",
                    slices_made: "Slices made",
                    count_the_slices: "Count the Slices",
                    tap_each_slice_to_count: "Tap each slice to count them",
                    parts_counted: "Parts counted",
                    all_parts_counted: "Great! All parts counted!",
                    part_labels: {
                        1: "Part 1",
                        2: "Part 2", 
                        3: "Part 3",
                        4: "Part 4"
                    }
                },
                
                // Scene 5 - Pizza Reassemble
                pizza_reassemble: {
                    title: "Do 4 parts make the whole again?",
                    instruction: "Drag each part to bring them together.",
                    feedback_initial: "Assemble all 4 slices into the dashed area.",
                    feedback_success: "Yay! All the parts of pizza together make the pizza whole again.",
                    hint: "Drag all pieces to the center"
                },
                
                // Scene 6 - Cookie Quiz
                cookie_quiz: {
                    title: "Quick Quiz",
                    questions: {
                        q1: {
                            prompt: "Look at the cookie — is it a whole or just a part?",
                            type: "piece",
                            correct: "Part",
                            feedback_wrong: "Look closely — that's just a piece, not the whole cookie. Try again!",
                            feedback_correct: "That's correct — it's just a piece of cookie. So, it's a part of a whole."
                        },
                        q2: {
                            prompt: "Look at this cookie — is it a whole or just a part?",
                            type: "full",
                            correct: "Whole",
                            feedback_wrong: "Look closely — it's a complete cookie, not just a piece. Try again!",
                            feedback_correct: "That's correct — it's a complete cookie. So, it's a whole."
                        },
                        q3: {
                            prompt: "Lastly look at this one — is it a whole or just a part?",
                            type: "piece",
                            correct: "Part",
                            feedback_wrong: "Look closely — that's just a piece, not the whole cookie. Try again!",
                            feedback_correct: "That's correct — it's just a piece of cookie. So, it's a part of a whole."
                        }
                    },
                    feedback_initial: "Select Whole or Part."
                },
                
                // Scene 7 - Summary
                summary: {
                    title: "We learnt!",
                    concepts: {
                        whole_definition: "Whole = One complete object!",
                        part_definition: "Part = A piece of the object!",
                        reassembly_concept: "All parts together make the whole again."
                    },
                    completion_message: "You completed the module!",
                    bridge_messages: {
                        to_pizza: "What happens with pizza?",
                        to_quiz: "Quick Check with Cookies",
                        pizza_description: "We will cut pizza and count parts.",
                        quiz_description: "3 quick questions with instant feedback."
                    }
                },
                
                // Concept definitions (used throughout)
                concepts: {
                    whole: "Whole = One complete object!",
                    part: "Part = A piece of the object!",
                    reassembly: "All the parts together make the whole again."
                },
                
                // General feedback messages
                feedback: {
                    positive: {
                        great_job: "Great job!",
                        nice_work: "Nice work!",
                        excellent: "Excellent!",
                        yay: "Yay!",
                        correct: "That's correct!"
                    },
                    encouraging: {
                        try_again: "Try again!",
                        keep_going: "Keep going!",
                        almost_there: "Almost there!",
                        good_try: "Good try!"
                    },
                    instructional: {
                        tap_to_continue: "Tap Next to continue",
                        drag_instruction: "Drag the pieces together",
                        count_instruction: "Tap each piece to count",
                        select_answer: "Select your answer"
                    }
                }
            }
        },
        
        // Spanish translations (placeholder structure)
        es: {
            "standard-ui": {
                buttons: {
                    start: "Comenzar",
                    next: "Siguiente →",
                    previous: "← Anterior",
                    restart: "Empezar de Nuevo",
                    try_again: "Intentar de Nuevo",
                    continue: "Continuar",
                    whole: "Entero",
                    part: "Parte"
                },
                labels: {
                    scene: "Escena",
                    progress: "Escena {current} de {total}",
                    count: "Cuenta: {count}",
                    parts_counted: "{count, plural, one {# parte} other {# partes}} contadas",
                    loading: "Cargando...",
                    ready: "¡Listo para empezar a aprender!"
                },
                navigation: {
                    grade_level: "Grado 1-2",
                    interactive_learning: "Aprendizaje Interactivo",
                    keyboard_hint: "Usa ← / → para navegar • Haz clic / toca para interactuar"
                }
            },
            
            "content-ui": {
                title: "Entero y Parte de un Entero",
                
                intro: {
                    title: "¡Esto es lo que pidieron!",
                    subtitle: "Personajes: Dee Tee, Jax, Jane en el Centro de Cheesecake",
                    description: "¡Toca Comenzar para ver qué hacen Dee Tee, Jax y Jane!",
                    items: {
                        cheesecake: "Cheesecake",
                        pizza: "Pizza",
                        cookie: "Galleta"
                    }
                },
                
                cheesecake_cut: {
                    title: "¡Quiero cortar el pastel en 2 pedazos!",
                    instruction: "Toca el cortador, luego toca el cheesecake.",
                    tool_name: "Cortador (2 partes)",
                    feedback_initial: "Selecciona el cortador, luego toca el cheesecake.",
                    feedback_success: "¡Buen trabajo, Jax! Cortaste el cheesecake entero en partes.",
                    feedback_error: "Toca el cortador primero.",
                    hint: "Toca el pastel mientras el cortador está activo"
                },
                
                concepts: {
                    whole: "¡Entero = Un objeto completo!",
                    part: "¡Parte = Un pedazo del objeto!",
                    reassembly: "Todas las partes juntas hacen el entero otra vez."
                }
                // ... Additional Spanish translations would continue here
            }
        }
    },
    
    // Helper functions for internationalization
    getCurrentLanguage() {
        return this.currentLanguage;
    },
    
    setLanguage(lang) {
        if (this.languages[lang]) {
            this.currentLanguage = lang;
        }
    },
    
    // Get translated text with fallback chain (es-MX → es → en)
    getText(domain, key, params = {}) {
        const keys = key.split('.');
        let text = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const k of [domain, ...keys]) {
            if (text && text[k]) {
                text = text[k];
            } else {
                // Fallback to English
                text = this.translations.en;
                for (const fallbackKey of [domain, ...keys]) {
                    if (text && text[fallbackKey]) {
                        text = text[fallbackKey];
                    } else {
                        return `[Missing: ${domain}.${key}]`;
                    }
                }
                break;
            }
        }
        
        // Handle ICU message formatting for plurals and variables
        if (typeof text === 'string' && Object.keys(params).length > 0) {
            return this.formatMessage(text, params);
        }
        
        return text || `[Missing: ${domain}.${key}]`;
    },
    
    // Simple ICU message formatter
    formatMessage(message, params) {
        let formatted = message;
        
        // Handle simple variable substitution {variable}
        for (const [key, value] of Object.entries(params)) {
            const regex = new RegExp(`\\{${key}\\}`, 'g');
            formatted = formatted.replace(regex, value);
        }
        
        // Handle plural forms {count, plural, one {# item} other {# items}}
        const pluralRegex = /\{(\w+),\s*plural,\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/g;
        formatted = formatted.replace(pluralRegex, (match, countKey, oneForm, otherForm) => {
            const count = params[countKey];
            const form = count === 1 ? oneForm : otherForm;
            return form.replace(/#/g, count);
        });
        
        return formatted;
    },
    
    // Convenience methods for common UI text
    getStandardUI(key, params = {}) {
        return this.getText('standard-ui', key, params);
    },
    
    getContentUI(key, params = {}) {
        return this.getText('content-ui', key, params);
    },
    
    // Scene configuration data
    scenes: [
        {
            id: "intro",
            name: "Introduction",
            type: "intro",
            required: false
        },
        {
            id: "order_scene",
            name: "Character Orders",
            type: "display",
            required: false
        },
        {
            id: "cheesecake_cut",
            name: "Cheesecake Cutting",
            type: "slice",
            parts: 2,
            required: true
        },
        {
            id: "cheesecake_reassemble",
            name: "Cheesecake Reassembly",
            type: "reassemble",
            parts: 2,
            required: true
        },
        {
            id: "pizza_cut",
            name: "Pizza Cutting",
            type: "slice",
            parts: 4,
            required: true
        },
        {
            id: "pizza_count",
            name: "Pizza Counting",
            type: "count",
            parts: 4,
            required: true
        },
        {
            id: "pizza_reassemble",
            name: "Pizza Reassembly",
            type: "reassemble",
            parts: 4,
            required: true
        },
        {
            id: "cookie_quiz",
            name: "Cookie Quiz",
            type: "quiz",
            questions: 3,
            required: true
        },
        {
            id: "summary",
            name: "Summary",
            type: "summary",
            required: false
        }
    ],
    
    // Asset configuration
    assets: {
        images: {
            cheesecake_boy: "assets/cheesecake_boy.png",
            cookie_man: "assets/cookie_man.png",
            pizza_girl: "assets/pizza_girl.png"
        },
        quarters: {
            qTR: "assets/qTR.svg",
            qTL: "assets/qTL.svg",
            qBL: "assets/qBL.svg",
            qBR: "assets/qBR.svg"
        },
        // SVG icons will be defined inline in the components
        icons: {
            slicer: "🔪",
            arrow_right: "→",
            arrow_left: "←",
            check: "✓",
            cross: "✗"
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appData;
} else if (typeof window !== 'undefined') {
    window.appData = appData;
}