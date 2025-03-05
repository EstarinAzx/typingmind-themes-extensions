(function () {
    const CONFIG = {
        colors: {
            background: '#F5F5F5',    // Light off-white background
            text: '#333333',          // Dark gray text for readability
            border: '#E0E0E0',        // Very light gray border
            input: {
                background: '#FFFFFF', // Pure white input background
                text: '#333333',       // Dark gray text
                placeholder: '#999999', // Medium gray for placeholder
            },
            button: {
                primary: '#F5F5DC',    // Soft beige for buttons
                hover: '#EDE4E0',      // Slightly darker beige on hover
            },
            accent: {
                primary: '#666666',    // Medium gray for accents
                secondary: '#999999',  // Light gray
                tertiary: '#E0E0E0',   // Very light gray
            },
            panels: '#FFFFFF',         // Pure white for panels
        },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
    };

    const SELECTORS = {
        CODE_BLOCKS: 'pre code',
        RESULT_BLOCKS: 'details pre',
        USER_MESSAGE_BLOCK: 'div[data-element-id="user-message"]',
        CHAT_SPACE: '[data-element-id="chat-space-middle-part"]',
    };

    const Utils = {
        debounce: (fn, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        },
        safe: (fn, context = 'unknown') => {
            try {
                return fn();
            } catch (e) {
                console.error(`Error in ${context}:`, e);
                return null;
            }
        },
        escapeHtml: str =>
            typeof str !== 'string'
                ? ''
                : str
                      .replace(/&/g, '&')
                      .replace(/</g, '<')
                      .replace(/>/g, '>')
                      .replace(/"/g, '"')
                      .replace(/'/g, '''),
    };

    /* ---------------- Sidebar Modifications ---------------- */
    if (!document.getElementById('minimalLightMode')) {
        const sidebarStyle = document.createElement('style');
        sidebarStyle.id = 'minimalLightMode';
        sidebarStyle.type = 'text/css';
        sidebarStyle.innerHTML = `
            /* Force backgrounds to light off-white */
            body, html, 
            .dark\\:bg-black,
            .dark\\:bg-gray-900,
            .bg-gray-900,
            .bg-black,
            [data-element-id="workspace-bar"],
            [data-element-id="side-bar-background"],
            [data-element-id="sidebar-beginning-part"],
            [data-element-id="sidebar-middle-part"],
            [data-element-id="chat-space-middle-part"],
            [data-element-id="chat-space-beginning-part"], 
            [data-element-id="chat-space-end-part"],
            [data-element-id="chat-space"],
            main,
            .dark .prose pre,
            .bg-gray-50.dark\\:bg-gray-800 { 
                background-color: ${CONFIG.colors.background} !important;
                background-image: none !important; /* Remove any patterns */
            }
            
            /* Force text to dark gray */
            body, html,
            p, div, span, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea,
            .dark\\:text-white,
            .dark\\:text-gray-300,
            .dark\\:text-gray-400,
            .text-white,
            .text-gray-300,
            .text-gray-400 {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Button styling - subtle and minimal */
            [data-element-id="new-chat-button-in-side-bar"] { 
                background-color: ${CONFIG.colors.button.primary} !important; 
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                transition: all 0.2s ease !important;
            }
            
            [data-element-id="new-chat-button-in-side-bar"] * { 
                color: ${CONFIG.colors.text} !important; 
            }
            
            /* Search bar styling - clean and minimal */
            [data-element-id="search-chats-bar"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            [data-element-id="search-chats-bar"][placeholder]::placeholder,
            [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
            [data-element-id="search-chats-bar"]::-moz-placeholder,
            [data-element-id="search-chats-bar"]:-ms-input-placeholder { 
                color: ${CONFIG.colors.input.placeholder} !important; 
                opacity: 1 !important; 
            }
            
            /* Selected/hover chat items - subtle highlight */
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"],
            .dark\\:hover\\:bg-gray-800:hover,
            .dark\\:bg-gray-800 { 
                background-color: ${CONFIG.colors.panels} !important; 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
            }
            
            /* Light up chat actions on hover */
            [data-element-id="custom-chat-item"] button[aria-label="Delete Chat"],
            [data-element-id="custom-chat-item"] button[aria-label="Favorite Chat"],
            [data-element-id="custom-chat-item"] button[aria-label="Chat settings"],
            [data-element-id="selected-chat-item"] button[aria-label="Delete Chat"],
            [data-element-id="selected-chat-item"] button[aria-label="Favorite Chat"],
            [data-element-id="selected-chat-item"] button[aria-label="Chat settings"] { 
                display: none !important; 
            }
            
            [data-element-id="custom-chat-item"]:hover button[aria-label="Delete Chat"],
            [data-element-id="custom-chat-item"]:hover button[aria-label="Favorite Chat"],
            [data-element-id="custom-chat-item"]:hover button[aria-label="Chat settings"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Delete Chat"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Favorite Chat"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Chat settings"],
            [data-element-id="custom-chat-item"] button[aria-expanded="true"],
            [data-element-id="selected-chat-item"] button[aria-expanded="true"] { 
                display: inline-block !important; 
                color: ${CONFIG.colors.accent.primary} !important;
            }
            
            /* Menus - minimal and clean */
            #headlessui-portal-root { 
                display: block !important; 
                visibility: visible !important; 
                pointer-events: auto !important; 
            }
            
            #headlessui-portal-root [role="menu"] { 
                display: block !important; 
                visibility: visible !important; 
                background-color: ${CONFIG.colors.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                pointer-events: auto !important; 
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            #headlessui-portal-root [role="menuitem"] { 
                display: flex !important; 
                visibility: visible !important; 
                pointer-events: auto !important; 
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Tag panel - clean and neutral */
            [data-element-id="tag-search-panel"] { 
                background-color: ${CONFIG.colors.background} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.text} !important; 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            [data-element-id="tag-search-panel"] input[type="search"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.text} !important; 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"] { 
                appearance: none !important; 
                width: 16px !important; 
                height: 16px !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                border-radius: 3px !important; 
                background-color: ${CONFIG.colors.input.background} !important; 
                position: relative !important; 
                cursor: pointer !important; 
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked { 
                background-color: ${CONFIG.colors.accent.primary} !important; 
                border-color: ${CONFIG.colors.text} !important; 
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { 
                content: '' !important; 
                position: absolute !important; 
                left: 5px !important; 
                top: 2px !important; 
                width: 4px !important; 
                height: 8px !important; 
                border: solid ${CONFIG.colors.text} !important; 
                border-width: 0 2px 2px 0 !important; 
                transform: rotate(45deg) !important; 
            }
            
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] p,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button { 
                color: ${CONFIG.colors.text} !important; 
            }
            
            /* Scrollbars - subtle and minimal */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${CONFIG.colors.accent.tertiary} ${CONFIG.colors.panels};
            }
            
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: ${CONFIG.colors.panels};
            }
            
            ::-webkit-scrollbar-thumb {
                background: ${CONFIG.colors.accent.tertiary};
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: ${CONFIG.colors.button.hover};
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar { 
                width: 8px !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track { 
                background: ${CONFIG.colors.panels} !important; 
                border-radius: 4px !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb { 
                background: ${CONFIG.colors.accent.tertiary} !important; 
                border-radius: 4px !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { 
                background: ${CONFIG.colors.button.hover} !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto { 
                scrollbar-width: thin !important; 
                scrollbar-color: ${CONFIG.colors.accent.tertiary} ${CONFIG.colors.panels} !important; 
            }
            
            /* Textareas - clean and minimal */
            [data-element-id="chat-folder"] textarea,
            [data-element-id="custom-chat-item"] textarea,
            [data-element-id="selected-chat-item"] textarea,
            [data-element-id="side-bar-background"] textarea { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            [data-element-id="chat-folder"] textarea:focus,
            [data-element-id="custom-chat-item"] textarea:focus,
            [data-element-id="selected-chat-item"] textarea:focus,
            [data-element-id="side-bar-background"] textarea:focus { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border-color: ${CONFIG.colors.text} !important; 
                box-shadow: 0 0 0 2px rgba(0,0,0,0.1) !important; 
            }
            
            /* Button hover effects - subtle */
            [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
            [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
            [data-element-id="workspace-profile-button"]:hover { 
                background-color: rgba(0,0,0,0.05) !important; 
            }
            
            /* SVG icon color fixes */
            [data-element-id="sidebar-beginning-part"] svg *, 
            [data-element-id="workspace-bar"] svg *,
            [data-element-id="side-bar-background"] svg * {
                stroke: ${CONFIG.colors.text} !important;
                fill: ${CONFIG.colors.text} !important;
            }
            
            /* Folder icons and sidebar elements - clean */
            [data-element-id="chat-folder"],
            [data-element-id="folder-header"],
            [data-element-id="folder-children"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Chat item titles and text */
            [data-element-id="custom-chat-item"] span,
            [data-element-id="custom-chat-item"] div,
            [data-element-id="selected-chat-item"] span,
            [data-element-id="selected-chat-item"] div {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* User message bubbles - soft beige, minimal */
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
                margin-left: auto !important;
                margin-right: 0 !important;
                display: block !important;
                max-width: 70% !important;
                border-radius: ${CONFIG.borderRadius.large} !important;
                background-color: ${CONFIG.colors.button.primary} !important;
                color: ${CONFIG.colors.text} !important;
                padding: ${CONFIG.spacing.small} !important;
                margin-bottom: ${CONFIG.spacing.small} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Fix light mode code blocks - minimal styling */
            .dark pre,
            .dark .bg-gray-50,
            .dark [class*="bg-gray-"] {
                background-color: ${CONFIG.colors.panels} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .dark pre code,
            .dark code {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Input area fixes - clean and minimal */
            .dark .bg-gray-800,
            .bg-gray-800,
            .dark\\:bg-gray-800,
            [data-element-id="chat-space-end-part"] [role="presentation"] {
                background-color: ${CONFIG.colors.panels} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Input box styling - minimal */
            #chat-input-textbox {
                background-color: ${CONFIG.colors.input.background} !important;
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Button styling - neutral and subtle */
            .dark .bg-gray-800 button,
            [data-element-id="send-button"],
            [data-element-id="more-options-button"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                border-color: ${CONFIG.colors.button.primary} !important;
                color: ${CONFIG.colors.text} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .dark .bg-gray-800 button:hover,
            [data-element-id="send-button"]:hover,
            [data-element-id="more-options-button"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
                border-color: ${CONFIG.colors.button.hover} !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
            }
            
            /* Bottom action buttons - neutral and minimal */
            .fixed.bottom-4.right-4 button,
            .fixed.bottom-0.right-0 button,
            .bg-blue-500,
            .bg-blue-600,
            .bg-blue-700,
            [class*="bg-blue-"],
            button[class*="bg-blue-"],
            a[class*="bg-blue-"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                transition: all 0.2s ease !important;
            }
            
            /* Hover effect for buttons - subtle */
            .fixed.bottom-4.right-4 button:hover,
            .fixed.bottom-0.right-0 button:hover,
            .bg-blue-500:hover,
            .bg-blue-600:hover,
            .bg-blue-700:hover,
            [class*="bg-blue-"]:hover,
            button[class*="bg-blue-"]:hover,
            a[class*="bg-blue-"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
            }
            
            /* Make sure SVG icons in these buttons match */
            .fixed.bottom-4.right-4 button svg *,
            .fixed.bottom-0.right-0 button svg *,
            .bg-blue-500 svg *,
            .bg-blue-600 svg *,
            button[class*="bg-blue-"] svg *,
            a[class*="bg-blue-"] svg * {
                fill: ${CONFIG.colors.text} !important;
                stroke: ${CONFIG.colors.text} !important;
            }
            
            /* Make profile picture icon stylish - minimal */
            .rounded-full,
            .rounded-full.bg-blue-500,
            .rounded-full.bg-blue-600,
            [data-element-id="workspace-profile-button"] div {
                background: linear-gradient(45deg, ${CONFIG.colors.button.primary}, ${CONFIG.colors.button.hover}) !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Remove all vaporwave effects for minimal look */
            pre code, code {
                font-family: monospace !important;
                animation: none !important;
                text-shadow: none !important;
                background-color: ${CONFIG.colors.panels} !important;
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Ensure no vaporwave-specific effects remain */
            [data-element-id="chat-space-middle-part"]::before,
            [data-element-id="chat-space-middle-part"]::after,
            [data-element-id="chat-space-beginning-part"]::after,
            [data-element-id="ai-message"]::after {
                content: none !important;
            }
            
            /* Input control panel adjustments - minimal */
            [data-element-id="chat-input-actions"] button, 
            .dark .bg-gray-800 button {
                color: ${CONFIG.colors.text} !important;
                background-color: ${CONFIG.colors.button.primary} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Input bar at bottom - clean and minimal */
            [data-element-id="chat-space-end-part"] [role="presentation"] {
                background-color: ${CONFIG.colors.panels} !important;
                border-radius: ${CONFIG.borderRadius.medium} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Fix light mode headings - consistent */
            .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Fix light mode links - subtle */
            .dark a {
                color: ${CONFIG.colors.accent.secondary} !important;
            }
            
            /* Fix menu items on light - consistent */
            .dark [role="menuitem"] {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Light mode strong text - slight emphasis */
            .dark strong, .dark b {
                color: ${CONFIG.colors.accent.primary} !important;
            }
        `;
        document.head.appendChild(sidebarStyle);
        new MutationObserver(() => {
            if (!document.getElementById('minimalLightMode'))
                document.head.appendChild(sidebarStyle);
        }).observe(document.body, { childList: true, subtree: true });
        
        console.log('Minimal Light Mode Theme loaded with refined neutral aesthetics.');
    }

    /* ---------------- Text Parsing & Code Block Handling ---------------- */
    const multiStepParse = txt =>
        Utils.safe(() => {
            let res = txt;
            res = res.replace(
                /```(\w+)?\s*([\s\S]*?)\s*```/g,
                (_, lang, code) => {
                    lang = lang ? lang.toLowerCase() : '';
                    return `<pre style="background:${CONFIG.colors.panels}; border:1px solid ${
                        CONFIG.colors.border
                    }; padding:6px; border-radius:${
                        CONFIG.borderRadius.small
                    }; overflow-x:auto; margin:0;" class="code-block${
                        lang ? ' language-' + lang : ''
                    }"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:${CONFIG.colors.text};">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:${CONFIG.colors.panels}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${inline}</code>`
            );
            res = res.replace(
                /'([^&#]+)'/g,
                (_, content) =>
                    `<code style="background-color:${CONFIG.colors.panels}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${content}</code>`
            );
            return res;
        }, 'multiStepParse');

    const processMessageContent = safeTxt =>
        Utils.safe(() => {
            const tests = [];
            let proc = safeTxt.replace(
                /(<test>)([\s\S]*?)(<\/test>)/g,
                (m, open, inner, close) => {
                    const ph = `__TEST_${tests.length}__`;
                    tests.push({ open, inner, close });
                    return ph;
                }
            );
            proc = multiStepParse(proc);
            tests.forEach(({ open, inner, close }, i) => {
                const parsed = multiStepParse(inner);
                proc = proc.replace(
                    `__TEST_${i}__`,
                    `${open}<code style="background-color:${CONFIG.colors.panels}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${parsed}</code>${close}`
                );
            });
            return proc;
        }, 'processMessageContent');

    const styleUserMessageEl = msgEl =>
        Utils.safe(() => {
            msgEl.setAttribute('data-processed', 'true');
            const raw = msgEl.textContent || '';
            if (!/[<`']/.test(raw)) return;
            const safeText = Utils.escapeHtml(raw);
            const processed = processMessageContent(safeText);
            const container = msgEl.querySelector('div');
            container
                ? (container.innerHTML = processed)
                : (msgEl.innerHTML = `<div>${processed}</div>`);
        }, 'styleUserMessageEl');

    const handleJsonCodeBlock = codeEl =>
        Utils.safe(() => {
            const content = codeEl.textContent.trim();
            if (
                !(
                    content.startsWith('{') &&
                    content.endsWith('}') &&
                    content.includes('"code"')
                )
            )
                return;
            try {
                let json = JSON.parse(content);
                if (typeof json.code !== 'string') return;
                let clean = json.code
                    .replace(/\\n/g, '\n')
                    .replace(/^"|"$/g, '');
                codeEl.textContent = clean;
                Object.assign(codeEl.style, {
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    color: `${CONFIG.colors.text}`,
                });
                const pre = codeEl.closest('pre');
                if (pre)
                    Object.assign(pre.style, {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: `${CONFIG.colors.panels}`,
                        border: `1px solid ${CONFIG.colors.border}`,
                        borderRadius: CONFIG.borderRadius.small,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    });
            } catch (e) {
                console.error(
                    'Error parsing JSON code block:',
                    e,
                    content.substring(0, 100) + '...'
                );
            }
        }, 'handleJsonCodeBlock');

    const styleSandboxOutputs = () =>
        document.querySelectorAll(SELECTORS.RESULT_BLOCKS).forEach(preEl => {
            if (preEl.closest('.editing')) return;
            if (
                preEl.textContent.includes('SANDBOX_ID') ||
                preEl.textContent.includes('STANDARD_OUTPUT')
            ) {
                Object.assign(preEl.style, {
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    overflowX: 'hidden',
                    background: `${CONFIG.colors.panels}`,
                    color: `${CONFIG.colors.text}`,
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                });
                const container = preEl.closest('.pb-6');
                if (container) container.style.overflowX = 'hidden';
            }
        });

    const improveTextDisplay = Utils.debounce(
        () =>
            Utils.safe(() => {
                document
                    .querySelectorAll(SELECTORS.USER_MESSAGE_BLOCK)
                    .forEach(msg => {
                        if (
                            msg.closest('.editing') ||
                            msg.hasAttribute('data-processed')
                        )
                            return;
                        styleUserMessageEl(msg);
                    });
                document
                    .querySelectorAll(SELECTORS.CODE_BLOCKS)
                    .forEach(code => {
                        if (!code.closest('.editing'))
                            handleJsonCodeBlock(code);
                    });
                styleSandboxOutputs();
                
                // Direct application of styles to buttons in neutral colors
                document.querySelectorAll('.bg-blue-500, .bg-blue-600, [class*="bg-blue-"]').forEach(el => {
                    el.style.backgroundColor = CONFIG.colors.button.primary;
                    el.style.color = CONFIG.colors.text;
                    el.style.border = `1px solid ${CONFIG.colors.border}`;
                    el.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                });
                
                // Apply styles to the profile icon - minimal
                document.querySelectorAll('.rounded-full').forEach(el => {
                    if (el.classList.contains('bg-blue-500') || el.classList.contains('bg-blue-600')) {
                        el.style.background = 'linear-gradient(45deg, ' + CONFIG.colors.button.primary + ', ' + CONFIG.colors.button.hover + ')';
                        el.style.border = '1px solid ' + CONFIG.colors.border;
                        el.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }
                });
                
                // Specifically fix the input panel to match minimal theme
                const inputPanel = document.querySelector('[data-element-id="chat-space-end-part"] [role="presentation"]');
                if (inputPanel) {
                    inputPanel.style.backgroundColor = CONFIG.colors.panels;
                    inputPanel.style.border = `1px solid ${CONFIG.colors.border}`;
                    inputPanel.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
                
                // Fix the chat input box - minimal
                const chatInput = document.getElementById('chat-input-textbox');
                if (chatInput) {
                    chatInput.style.backgroundColor = CONFIG.colors.input.background;
                    chatInput.style.color = CONFIG.colors.text;
                    chatInput.style.border = `1px solid ${CONFIG.colors.border}`;
                    chatInput.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
            }, 'improveTextDisplay'),
        100
    );

    document.addEventListener('DOMContentLoaded', improveTextDisplay);
    new MutationObserver(muts => {
        if (
            muts.some(
                m =>
                    m.addedNodes.length ||
                    m.type === 'characterData' ||
                    (m.type === 'childList' &&
                        m.target.matches &&
                        m.target.matches(SELECTORS.USER_MESSAGE_BLOCK))
            )
        )
            setTimeout(improveTextDisplay, 0);
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
    });

    console.log('Minimal Light Mode theme applied with refined neutral aesthetics.');
})();
