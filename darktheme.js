(function () {
    // === Palette from your screenshot ===
    const CONFIG = {
        colors: {
            background: '#212121',        // main canvas background
            text:       '#C2C2C2',        // primary text
            border:     '#303030',        // dividers & code borders
            input: {
                background:  '#2E2E2E',   // chat‑bubble & input bg
                text:        '#C2C2C2',   // input text
                placeholder: 'rgba(194,194,194,0.6)', // muted placeholder
            },
            button: {
                primary: '#C2C2C2',       // send/more buttons
                hover:   'rgba(194,194,194,0.8)', // hover state
            },
        },
        spacing:      { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
    };

    const SELECTORS = {
        CODE_BLOCKS:        'pre code',
        RESULT_BLOCKS:      'details pre',
        USER_MESSAGE_BLOCK: 'div[data-element-id="user-message"]',
        CHAT_SPACE:         '[data-element-id="chat-space-middle-part"]',
    };

    const Utils = {
        debounce: (fn, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        },
        safe: (fn, ctx = 'unknown') => {
            try { return fn(); }
            catch (e) { console.error(`Error in ${ctx}:`, e); return null; }
        },
        escapeHtml: s =>
            typeof s !== 'string'
                ? ''
                : s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                   .replace(/"/g,'&quot;').replace(/'/g,'&#039;'),
    };

    /* ---------------- Sidebar Styles ---------------- */
    if (!document.getElementById('tmDarkSidebar')) {
        const css = `
            [data-element-id="workspace-bar"],
            [data-element-id="side-bar-background"],
            [data-element-id="sidebar-beginning-part"],
            [data-element-id="sidebar-middle-part"] {
                background-color: ${CONFIG.colors.background} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"] {
                background-color: ${CONFIG.colors.input.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"] * {
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="search-chats-bar"] {
                background-color: ${CONFIG.colors.input.background} !important;
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
            }
            [data-element-id="search-chats-bar"]::placeholder {
                color: ${CONFIG.colors.input.placeholder} !important;
                opacity: 1 !important;
            }
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="dark:text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="dark:text-white"] {
                color: ${CONFIG.colors.text} !important;
                opacity: 1 !important;
                --tw-text-opacity:1 !important;
            }
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] {
                background-color: ${CONFIG.colors.input.background} !important;
            }
            [data-element-id="custom-chat-item"] button[aria-label],
            [data-element-id="selected-chat-item"] button[aria-label] {
                display: none !important;
            }
            [data-element-id="custom-chat-item"] button[aria-expanded="true"],
            [data-element-id="selected-chat-item"] button[aria-expanded="true"] {
                display: inline-block !important;
            }
            #headlessui-portal-root {
                display: block !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }
            #headlessui-portal-root [role="menu"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="tag-search-panel"] {
                background-color: ${CONFIG.colors.background} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="tag-search-panel"] input[type="search"] {
                background-color: ${CONFIG.colors.input.background} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="tag-search-panel"] input[type="checkbox"] {
                appearance: none !important;
                width: 16px !important; height: 16px !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                background-color: ${CONFIG.colors.input.background} !important;
                border-radius: 3px !important; cursor: pointer !important;
            }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked {
                background-color: ${CONFIG.colors.button.primary} !important;
                border-color: ${CONFIG.colors.button.primary} !important;
            }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after {
                content: '' !important;
                position: absolute !important; left: 5px !important; top: 2px !important;
                width: 4px !important; height: 8px !important;
                border: solid ${CONFIG.colors.background} !important;
                border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important;
            }
        `;
        const s = document.createElement('style');
        s.id = 'tmDarkSidebar';
        s.textContent = css;
        document.head.appendChild(s);
        console.log('TypingMind Dark Sidebar applied.');
    }

    /* ---------------- Chat & Code Styles ---------------- */
    const mainCSS = `
        [data-element-id="chat-space-middle-part"] {
            background-color: ${CONFIG.colors.background} !important;
        }
        [data-element-id="chat-space-middle-part"] .prose.max-w-full,
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            color: ${CONFIG.colors.text} !important;
        }
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            background-color: ${CONFIG.colors.input.background} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            padding: ${CONFIG.spacing.small} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
            max-width: 70% !important;
            margin-left: auto !important; margin-right: 0 !important;
        }
        [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
            background-color: #242424 !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
        }
        [data-element-id="chat-space-middle-part"] pre.mb-2.overflow-auto {
            background-color: #000 !important;
            color: #fff !important;
            border: none !important;
            padding: 8px !important;
            border-radius: 4px !important;
        }
        [data-element-id="chat-space-middle-part"] ul,
        [data-element-id="chat-space-middle-part"] ol {
            margin: 0.5rem 0 !important;
        }
        [data-element-id="chat-space-middle-part"] li {
            margin: 0.3rem 0 !important;
        }
        [data-element-id="chat-space-middle-part"] li::marker {
            color: ${CONFIG.colors.text} !important;
            font-weight: bold !important;
        }
    `;
    const m = document.createElement('style');
    m.textContent = mainCSS;
    document.head.appendChild(m);

    /* ---------------- Input Area Styles ---------------- */
    const inputCSS = `
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: ${CONFIG.colors.input.background};
            border-radius: ${CONFIG.borderRadius.large};
            margin-bottom: ${CONFIG.spacing.medium};
        }
        #chat-input-textbox {
            background: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.input.text} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: 1.5rem !important;
            padding: 0.75rem 1rem !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
        }
        [data-element-id="send-button"],
        [data-element-id="more-options-button"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            border-color: ${CONFIG.colors.button.primary} !important;
        }
        [data-element-id="send-button"]:hover,
        [data-element-id="more-options-button"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
            border-color: ${CONFIG.colors.button.hover} !important;
        }
    `;
    const i = document.createElement('style');
    i.textContent = inputCSS;
    document.head.appendChild(i);

    /* ---------------- Text Parsing & JSON Code Handling ---------------- */
    // (keep your existing multiStepParse, processMessageContent, styleUserMessageEl, handleJsonCodeBlock, styleSandboxOutputs, observers, etc.)
    // ...
    // For brevity I’ve omitted rest of your parsing logic—it remains unchanged.

    console.log('TypingMind Custom Dark (screenshot) loaded.');
})();
