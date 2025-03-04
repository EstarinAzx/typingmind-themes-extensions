(function () {
    const CONFIG = {
        colors: {
            background: '#1A0A24',    // Deep purple background
            text: '#FFC0CB',          // Light pink text
            border: '#FF00FF',        // Bright magenta borders
            input: {
                background: '#2D1A3B', // Slightly lighter purple input background
                text: '#FFC0CB',       // Light pink text
                placeholder: '#FF69B4', // Neon pink for placeholder
            },
            button: {
                primary: '#8A2BE2',    // Medium purple for buttons
                hover: '#9B4DFF',      // Lighter purple on hover
            },
            accent: {
                primary: '#FF00FF',    // Bright magenta
                secondary: '#FF69B4',  // Neon pink
                tertiary: '#8A2BE2',   // Medium purple
            },
            panels: '#2D1A3B',         // Slightly lighter purple for panels
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
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;'),
    };

    /* ---------------- Sidebar Modifications ---------------- */
    if (!document.getElementById('typingmindVaporwaveDarkMode')) {
        const sidebarStyle = document.createElement('style');
        sidebarStyle.id = 'typingmindVaporwaveDarkMode';
        sidebarStyle.type = 'text/css';
        sidebarStyle.innerHTML = `
            /* Force backgrounds to vaporwave purple */
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
            }
            
            /* Force text to light pink */
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
            
            /* Button styling */
            [data-element-id="new-chat-button-in-side-bar"] { 
                background-color: ${CONFIG.colors.button.primary} !important; 
                color: #ffffff !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 0 8px rgba(255, 0, 255, 0.4) !important;
            }
            
            [data-element-id="new-chat-button-in-side-bar"] * { 
                color: #ffffff !important; 
            }
            
            /* Search bar styling */
            [data-element-id="search-chats-bar"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
            }
            
            [data-element-id="search-chats-bar"][placeholder]::placeholder,
            [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
            [data-element-id="search-chats-bar"]::-moz-placeholder,
            [data-element-id="search-chats-bar"]:-ms-input-placeholder { 
                color: ${CONFIG.colors.input.placeholder} !important; 
                opacity:1 !important; 
                -webkit-text-fill-color: ${CONFIG.colors.input.placeholder} !important; 
            }
            
            /* Selected/hover chat items */
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"],
            .dark\\:hover\\:bg-gray-800:hover,
            .dark\\:bg-gray-800 { 
                background-color: ${CONFIG.colors.panels} !important; 
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
            }
            
            /* Menus */
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
            }
            
            #headlessui-portal-root [role="menuitem"] { 
                display: flex !important; 
                visibility: visible !important; 
                pointer-events: auto !important; 
            }
            
            /* Tag panel */
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
                width: 16px !important; 
                height: 16px !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                border-radius: 3px !important; 
                background-color: ${CONFIG.colors.input.background} !important; 
                position: relative !important; 
                cursor: pointer !important; 
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked { 
                background-color: ${CONFIG.colors.accent.tertiary} !important; 
                border-color: ${CONFIG.colors.text} !important; 
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { 
                content: '' !important; 
                position: absolute !important; 
                left: 5px !important; 
                top: 2px !important; 
                width: 4px !important; 
                height: 8px !important; 
                border: solid white !important; 
                border-width: 0 2px 2px 0 !important; 
                transform: rotate(45deg) !important; 
            }
            
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] p,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button { 
                color: ${CONFIG.colors.text} !important; 
            }
            
            /* Scrollbars */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${CONFIG.colors.button.primary} ${CONFIG.colors.panels};
            }
            
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: ${CONFIG.colors.panels};
            }
            
            ::-webkit-scrollbar-thumb {
                background: ${CONFIG.colors.button.primary};
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
                background: ${CONFIG.colors.button.primary} !important; 
                border-radius: 4px !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { 
                background: ${CONFIG.colors.button.hover} !important; 
            }
            
            [data-element-id="tag-search-panel"] .overflow-auto { 
                scrollbar-width: thin !important; 
                scrollbar-color: ${CONFIG.colors.button.primary} ${CONFIG.colors.panels} !important; 
            }
            
            /* Textareas */
            [data-element-id="chat-folder"] textarea,
            [data-element-id="custom-chat-item"] textarea,
            [data-element-id="selected-chat-item"] textarea,
            [data-element-id="side-bar-background"] textarea { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
            }
            
            [data-element-id="chat-folder"] textarea:focus,
            [data-element-id="custom-chat-item"] textarea:focus,
            [data-element-id="selected-chat-item"] textarea:focus,
            [data-element-id="side-bar-background"] textarea:focus { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border-color: ${CONFIG.colors.text} !important; 
                box-shadow: 0 0 0 2px rgba(255,0,255,0.2) !important; 
            }
            
            /* Button hover effects */
            [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
            [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
            [data-element-id="workspace-profile-button"]:hover { 
                background-color: rgba(255,0,255,0.15) !important; 
            }
            
            /* SVG icon color fixes */
            [data-element-id="sidebar-beginning-part"] svg *, 
            [data-element-id="workspace-bar"] svg *,
            [data-element-id="side-bar-background"] svg * {
                stroke: ${CONFIG.colors.text} !important;
                fill: ${CONFIG.colors.text} !important;
            }
            
            /* Folder icons and sidebar elements */
            [data-element-id="chat-folder"],
            [data-element-id="folder-header"],
            [data-element-id="folder-children"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Chat item titles and text */
            [data-element-id="custom-chat-item"] span,
            [data-element-id="custom-chat-item"] div,
            [data-element-id="selected-chat-item"] span,
            [data-element-id="selected-chat-item"] div {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* User message bubbles with medium purple background */
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
                margin-left: auto !important;
                margin-right: 0 !important;
                display: block !important;
                max-width: 70% !important;
                border-radius: ${CONFIG.borderRadius.large} !important;
                background-color: ${CONFIG.colors.accent.tertiary} !important;
                color: #FFFFFF !important;
                padding: ${CONFIG.spacing.small} !important;
                margin-bottom: ${CONFIG.spacing.small} !important;
                border: 1px solid ${CONFIG.colors.accent.primary} !important;
                box-shadow: 0 0 8px rgba(255, 0, 255, 0.3) !important;
            }
            
            /* Fix dark mode code blocks */
            .dark pre,
            .dark .bg-gray-50,
            .dark [class*="bg-gray-"] {
                background-color: #24133D !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 0 10px rgba(255, 0, 255, 0.2) !important;
            }
            
            .dark pre code,
            .dark code {
                color: #FF69B4 !important;
            }
            
            /* Input area fixes */
            .dark .bg-gray-800,
            .bg-gray-800,
            .dark\\:bg-gray-800,
            [data-element-id="chat-space-end-part"] [role="presentation"] {
                background-color: ${CONFIG.colors.panels} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 0 10px rgba(255, 0, 255, 0.2) !important;
            }
            
            /* Input box styling */
            #chat-input-textbox {
                background-color: ${CONFIG.colors.input.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Button styling */
            .dark .bg-gray-800 button,
            [data-element-id="send-button"],
            [data-element-id="more-options-button"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                border-color: ${CONFIG.colors.button.primary} !important;
                color: #ffffff !important;
            }
            
            .dark .bg-gray-800 button:hover,
            [data-element-id="send-button"]:hover,
            [data-element-id="more-options-button"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
                border-color: ${CONFIG.colors.button.hover} !important;
            }
            
            /* Bottom action buttons in vaporwave colors */
            .fixed.bottom-4.right-4 button,
            .fixed.bottom-0.right-0 button,
            .bg-blue-500,
            .bg-blue-600,
            .bg-blue-700,
            [class*="bg-blue-"],
            button[class*="bg-blue-"],
            a[class*="bg-blue-"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                color: #ffffff !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 0 8px rgba(255, 0, 255, 0.4) !important;
                transition: all 0.3s ease !important;
            }
            
            /* Hover effect for buttons */
            .fixed.bottom-4.right-4 button:hover,
            .fixed.bottom-0.right-0 button:hover,
            .bg-blue-500:hover,
            .bg-blue-600:hover,
            .bg-blue-700:hover,
            [class*="bg-blue-"]:hover,
            button[class*="bg-blue-"]:hover,
            a[class*="bg-blue-"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
                box-shadow: 0 0 12px rgba(255, 0, 255, 0.6) !important;
            }
            
            /* Make sure SVG icons in these buttons match */
            .fixed.bottom-4.right-4 button svg *,
            .fixed.bottom-0.right-0 button svg *,
            .bg-blue-500 svg *,
            .bg-blue-600 svg *,
            button[class*="bg-blue-"] svg *,
            a[class*="bg-blue-"] svg * {
                fill: #ffffff !important;
                stroke: #ffffff !important;
            }
            
            /* Make profile picture icon stylish */
            .rounded-full,
            .rounded-full.bg-blue-500,
            .rounded-full.bg-blue-600,
            [data-element-id="workspace-profile-button"] div {
                background: linear-gradient(45deg, #FF00FF, #8A2BE2) !important;
                border: 1px solid #ffffffaa !important;
                box-shadow: 0 0 8px rgba(255, 0, 255, 0.5) !important;
            }
            
            /* Vaporwave Neon Glow effect for code blocks */
            @keyframes neonGlow {
                0% { text-shadow: 0 0 8px #FF00FF; }
                50% { text-shadow: 0 0 15px #FF69B4; }
                100% { text-shadow: 0 0 8px #FF00FF; }
            }
            
            pre code, code {
                animation: neonGlow 3s infinite;
                font-family: monospace !important;
            }
            
            /* Add vaporwave grid background effect to the main chat area */
            [data-element-id="chat-space-middle-part"]::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: linear-gradient(0deg, transparent 24%, rgba(255, 105, 180, 0.03) 25%, rgba(255, 105, 180, 0.03) 26%, transparent 27%, transparent 74%, rgba(255, 105, 180, 0.03) 75%, rgba(255, 105, 180, 0.03) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 105, 180, 0.03) 25%, rgba(255, 105, 180, 0.03) 26%, transparent 27%, transparent 74%, rgba(255, 105, 180, 0.03) 75%, rgba(255, 105, 180, 0.03) 76%, transparent 77%, transparent);
                background-size: 50px 50px;
                z-index: -1;
                pointer-events: none;
            }
            
            /* Neon pink gradient at the top */
            [data-element-id="chat-space-beginning-part"]::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #FF00FF, #FF69B4, #8A2BE2, #FF00FF);
                z-index: 100;
            }
            
            /* Add some horizontal lines for a vaporwave/retro feel */
            [data-element-id="chat-space-middle-part"]::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    0deg,
                    rgba(255, 0, 255, 0.03),
                    rgba(255, 0, 255, 0.03) 1px,
                    transparent 1px,
                    transparent 20px
                );
                pointer-events: none;
                z-index: -1;
            }
            
            /* Add a small magenta line below AI responses */
            [data-element-id="ai-message"]::after {
                content: '';
                display: block;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, transparent, ${CONFIG.colors.accent.primary}, transparent);
                margin-top: 12px;
            }
            
            /* Input control panel adjustments */
            [data-element-id="chat-input-actions"] button, 
            .dark .bg-gray-800 button {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Input bar at bottom */
            [data-element-id="chat-space-end-part"] [role="presentation"] {
                background-color: ${CONFIG.colors.panels} !important;
                border-radius: 10px !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 0 10px rgba(255, 0, 255, 0.2) !important;
            }
            
            /* Fix dark mode headings */
            .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
                color: ${CONFIG.colors.accent.secondary} !important;
            }
            
            /* Fix dark mode links */
            .dark a {
                color: ${CONFIG.colors.accent.secondary} !important;
            }
            
            /* Fix menu items on dark */
            .dark [role="menuitem"] {
                color: ${CONFIG.colors.text} !important;
            }
            
            /* Dark mode strong text */
            .dark strong, .dark b {
                color: ${CONFIG.colors.accent.primary} !important;
            }
        `;
        document.head.appendChild(sidebarStyle);
        new MutationObserver(() => {
            if (!document.getElementById('typingmindVaporwaveDarkMode'))
                document.head.appendChild(sidebarStyle);
        }).observe(document.body, { childList: true, subtree: true });
        
        console.log('Vaporwave Dark Mode Theme loaded.');
    }

    /* ---------------- Text Parsing & Code Block Handling ---------------- */
    const multiStepParse = txt =>
        Utils.safe(() => {
            let res = txt;
            res = res.replace(
                /```(\w+)?\s*([\s\S]*?)\s*```/g,
                (_, lang, code) => {
                    lang = lang ? lang.toLowerCase() : '';
                    return `<pre style="background:#24133D; border:1px solid ${
                        CONFIG.colors.border
                    }; padding:6px; border-radius:${
                        CONFIG.borderRadius.small
                    }; overflow-x:auto; margin:0;" class="code-block${
                        lang ? ' language-' + lang : ''
                    }"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:#FF69B4;">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:#24133D; color:#FF69B4; padding:0.2em 0.4em; border-radius:3px;">${inline}</code>`
            );
            res = res.replace(
                /&#039;([^&#]+)&#039;/g,
                (_, content) =>
                    `<code style="background-color:#24133D; color:#FF69B4; padding:0.2em 0.4em; border-radius:3px;">${content}</code>`
            );
            return res;
        }, 'multiStepParse');

    const processMessageContent = safeTxt =>
        Utils.safe(() => {
            const tests = [];
            let proc = safeTxt.replace(
                /(&lt;test&gt;)([\s\S]*?)(&lt;\/test&gt;)/g,
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
                    `${open}<code style="background-color:#24133D; color:#FF69B4; padding:0.2em 0.4em; border-radius:3px;">${parsed}</code>${close}`
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
                    color: '#FF69B4',
                });
                const pre = codeEl.closest('pre');
                if (pre)
                    Object.assign(pre.style, {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: '#24133D',
                        border: `1px solid ${CONFIG.colors.border}`,
                        borderRadius: CONFIG.borderRadius.small,
                        boxShadow: '0 0 10px rgba(255, 0, 255, 0.2)',
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
                    background: '#24133D',
                    color: '#FF69B4',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(255, 0, 255, 0.2)',
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
                
                // Direct application of styles to buttons in vaporwave colors
                document.querySelectorAll('.bg-blue-500, .bg-blue-600, [class*="bg-blue-"]').forEach(el => {
                    el.style.backgroundColor = CONFIG.colors.button.primary;
                    el.style.color = '#ffffff';
                    el.style.border = `1px solid ${CONFIG.colors.border}`;
                    el.style.boxShadow = '0 0 8px rgba(255, 0, 255, 0.4)';
                });
                
                // Apply styles to the profile icon
                document.querySelectorAll('.rounded-full').forEach(el => {
                    if (el.classList.contains('bg-blue-500') || el.classList.contains('bg-blue-600')) {
                        el.style.background = 'linear-gradient(45deg, #FF00FF, #8A2BE2)';
                        el.style.border = '1px solid #ffffffaa';
                        el.style.boxShadow = '0 0 8px rgba(255, 0, 255, 0.5)';
                    }
                });
                
                // Specifically fix the input panel to match vaporwave theme
                const inputPanel = document.querySelector('[data-element-id="chat-space-end-part"] [role="presentation"]');
                if (inputPanel) {
                    inputPanel.style.backgroundColor = CONFIG.colors.panels;
                    inputPanel.style.border = `1px solid ${CONFIG.colors.border}`;
                    inputPanel.style.boxShadow = '0 0 10px rgba(255, 0, 255, 0.2)';
                }
                
                // Fix the chat input box
                const chatInput = document.getElementById('chat-input-textbox');
                if (chatInput) {
                    chatInput.style.backgroundColor = CONFIG.colors.input.background;
                    chatInput.style.color = CONFIG.colors.text;
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

    console.log('Vaporwave Dark Mode theme applied with magenta and purple aesthetics');
})();
