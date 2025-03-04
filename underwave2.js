(function () {
    const CONFIG = {
        colors: {
            background: '#050510',      // Ultra-dark background with slight blue/purple undertones
            panels: '#0A0A1A',          // Slightly lighter panels
            deepAccent: '#1A1A2E',      // Dark blue/purple for interface elements
            mediumAccent: '#202040',    // Medium dark accent for borders and highlights
            lightAccent: '#3A3A8C',     // Low-saturation blue accent
            text: {
                primary: '#AAAACC',     // Soft blue-tinted text
                secondary: '#6F6F9B',   // Muted secondary text
                highlight: '#8F8FC6',   // Brighter text for highlights
            },
            input: {
                background: '#0D0D18',  // Dark input areas
                text: '#AAAACC',        // Matching text color
                placeholder: '#464670', // Muted placeholder text
            },
            button: {
                primary: '#202050',     // Dark blue button
                hover: '#2A2A60',       // Slightly lighter on hover
            },
            code: {
                background: '#0F0F20',  // Dark code background
                text: '#7F7FC0',        // Muted blue code text
                border: '#2A2A50',      // Dark border for code blocks
            },
            border: '#1A1A3F',          // Dark borders
            shadow: 'rgba(10, 10, 40, 0.5)', // Dark shadow color
            glow: 'rgba(65, 65, 150, 0.2)',  // Subtle blue glow
        },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.3rem', medium: '0.5rem', large: '0.7rem' },
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

    /* ---------------- Main Theme Implementation ---------------- */
    if (!document.getElementById('typingmindUnderwaveTheme')) {
        const mainStyle = document.createElement('style');
        mainStyle.id = 'typingmindUnderwaveTheme';
        mainStyle.type = 'text/css';
        mainStyle.innerHTML = `
            /* Base elements - force backgrounds to underwave dark */
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
            .bg-gray-50.dark\\:bg-gray-800 { 
                background-color: ${CONFIG.colors.background} !important;
            }
            
            /* Typography - muted blue text */
            body, html,
            p, div, span, li, a, button, input, textarea,
            .dark\\:text-white,
            .dark\\:text-gray-300,
            .dark\\:text-gray-400,
            .text-white,
            .text-gray-300,
            .text-gray-400 {
                color: ${CONFIG.colors.text.primary} !important;
                font-family: "Inter", "Segoe UI", Arial, sans-serif !important;
            }
            
            /* FIX: Ensure text doesn't turn white on hover */
            p:hover, div:hover, span:hover, li:hover, a:hover, 
            h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover,
            .dark\\:text-white:hover,
            .dark\\:text-gray-300:hover,
            .dark\\:text-gray-400:hover,
            .text-white:hover,
            .text-gray-300:hover,
            .text-gray-400:hover,
            *:hover > span,
            *:hover > p,
            *:hover > div:not(.bg-blue-500):not(.bg-blue-600):not([class*="bg-blue-"]):not([role="menuitem"]):not(button):not([role="button"]) {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* FIX: Force text color for spans inside hovered elements */
            *:hover span,
            *:hover div > span,
            *:hover p > span {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Headings with slightly brighter text */
            h1, h2, h3, h4, h5, h6,
            .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
                color: ${CONFIG.colors.text.highlight} !important;
                font-weight: 500 !important;
                letter-spacing: 0.5px !important;
            }
            
            /* Secondary text */
            .text-xs.text-gray-500, 
            .italic.truncate,
            .truncate,
            [class*="text-black"],
            .dark [class*="text-gray-500"],
            .dark [class*="text-gray-600"] {
                color: ${CONFIG.colors.text.secondary} !important;
            }
            
            /* Button styling - dark blue with subtle border */
            [data-element-id="new-chat-button-in-side-bar"] { 
                background-color: ${CONFIG.colors.button.primary} !important; 
                color: ${CONFIG.colors.text.primary} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
            }
            
            [data-element-id="new-chat-button-in-side-bar"] * { 
                color: ${CONFIG.colors.text.primary} !important; 
            }
            
            /* Button hover color fix */
            [data-element-id="new-chat-button-in-side-bar"]:hover * { 
                color: ${CONFIG.colors.text.primary} !important; 
            }
            
            /* Search bar styling */
            [data-element-id="search-chats-bar"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.input.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
            }
            
            [data-element-id="search-chats-bar"][placeholder]::placeholder,
            [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
            [data-element-id="search-chats-bar"]::-moz-placeholder,
            [data-element-id="search-chats-bar"]:-ms-input-placeholder { 
                color: ${CONFIG.colors.input.placeholder} !important; 
                opacity: 1 !important; 
                -webkit-text-fill-color: ${CONFIG.colors.input.placeholder} !important; 
            }
            
            /* Selected/hover chat items - slightly lighter background */
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"],
            .dark\\:hover\\:bg-gray-800:hover,
            .dark\\:bg-gray-800 { 
                background-color: ${CONFIG.colors.panels} !important; 
                border-left: 2px solid ${CONFIG.colors.lightAccent} !important;
            }
            
            /* Fix text color in hovered chat items */
            [data-element-id="custom-chat-item"]:hover *,
            [data-element-id="selected-chat-item"]:hover *,
            .dark\\:hover\\:bg-gray-800:hover *,
            .dark\\:bg-gray-800:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Chat actions */
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
                background-color: ${CONFIG.colors.panels} !important; 
                color: ${CONFIG.colors.text.primary} !important; 
                pointer-events: auto !important; 
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 4px 12px ${CONFIG.colors.shadow} !important;
            }
            
            #headlessui-portal-root [role="menuitem"] { 
                display: flex !important; 
                visibility: visible !important; 
                pointer-events: auto !important; 
            }
            
            #headlessui-portal-root [role="menuitem"]:hover { 
                background-color: ${CONFIG.colors.deepAccent} !important; 
            }
            
            /* Fix menu item text color */
            #headlessui-portal-root [role="menuitem"] *,
            #headlessui-portal-root [role="menuitem"]:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Tag panel */
            [data-element-id="tag-search-panel"] { 
                background-color: ${CONFIG.colors.panels} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.text.primary} !important; 
                box-shadow: 0 4px 12px ${CONFIG.colors.shadow} !important;
            }
            
            [data-element-id="tag-search-panel"] input[type="search"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.input.text} !important; 
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
                background-color: ${CONFIG.colors.lightAccent} !important; 
                border-color: ${CONFIG.colors.text.primary} !important; 
            }
            
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { 
                content: '' !important; 
                position: absolute !important; 
                left: 5px !important; 
                top: 2px !important; 
                width: 4px !important; 
                height: 8px !important; 
                border: solid ${CONFIG.colors.background} !important; 
                border-width: 0 2px 2px 0 !important; 
                transform: rotate(45deg) !important; 
            }
            
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] p,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button { 
                color: ${CONFIG.colors.text.primary} !important; 
            }
            
            /* Scrollbars - thin and minimal */
            * {
                scrollbar-width: thin;
                scrollbar-color: ${CONFIG.colors.button.primary} ${CONFIG.colors.panels};
            }
            
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            ::-webkit-scrollbar-track {
                background: ${CONFIG.colors.background};
            }
            
            ::-webkit-scrollbar-thumb {
                background: ${CONFIG.colors.mediumAccent};
                border-radius: 3px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: ${CONFIG.colors.lightAccent};
            }
            
            /* SVG icon color fixes */
            [data-element-id="sidebar-beginning-part"] svg *, 
            [data-element-id="workspace-bar"] svg *,
            [data-element-id="side-bar-background"] svg * {
                stroke: ${CONFIG.colors.text.primary} !important;
                fill: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Folder icons and sidebar elements */
            [data-element-id="chat-folder"],
            [data-element-id="folder-header"],
            [data-element-id="folder-children"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Chat item titles and text */
            [data-element-id="custom-chat-item"] span,
            [data-element-id="custom-chat-item"] div,
            [data-element-id="selected-chat-item"] span,
            [data-element-id="selected-chat-item"] div {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* User message bubbles - dark with subtle border */
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
                margin-left: auto !important;
                margin-right: 0 !important;
                display: block !important;
                max-width: 70% !important;
                border-radius: ${CONFIG.borderRadius.medium} !important;
                background-color: ${CONFIG.colors.mediumAccent} !important;
                color: ${CONFIG.colors.text.highlight} !important;
                padding: ${CONFIG.spacing.small} !important;
                margin-bottom: ${CONFIG.spacing.small} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 1px 3px ${CONFIG.colors.shadow} !important;
            }
            
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
                color: ${CONFIG.colors.text.highlight} !important;
                background-color: transparent !important;
            }
            
            /* Fix user message hover text color */
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"]:hover > div,
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"]:hover span,
            [data-element-id="chat-space-middle-part"] [data-element-id="user-message"]:hover p {
                color: ${CONFIG.colors.text.highlight} !important;
            }
            
            /* Code blocks - darker background with subtle border */
            .dark pre,
            .dark .bg-gray-50,
            .dark [class*="bg-gray-"],
            pre, code {
                background-color: ${CONFIG.colors.code.background} !important;
                border: 1px solid ${CONFIG.colors.code.border} !important;
                box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
                border-radius: ${CONFIG.borderRadius.small} !important;
            }
            
            .dark pre code,
            .dark code,
            pre code, code {
                color: ${CONFIG.colors.code.text} !important;
                font-family: "Menlo", "Consolas", monospace !important;
                font-size: 0.9em !important;
            }
            
            /* Fix code hover text color */
            .dark pre:hover code,
            .dark code:hover,
            pre:hover code, 
            code:hover,
            .dark pre code:hover,
            pre code:hover {
                color: ${CONFIG.colors.code.text} !important;
            }
            
            /* Input area */
            .dark .bg-gray-800,
            .bg-gray-800,
            .dark\\:bg-gray-800,
            [data-element-id="chat-space-end-part"] [role="presentation"],
            .dark [data-element-id="chat-space-end-part"] [role="presentation"] {
                background-color: ${CONFIG.colors.panels} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
                border-radius: ${CONFIG.borderRadius.medium} !important;
            }
            
            /* Input box styling */
            #chat-input-textbox {
                background-color: ${CONFIG.colors.input.background} !important;
                color: ${CONFIG.colors.text.primary} !important;
                border: none !important;
                min-height: 44px !important;
            }
            
            #chat-input-textbox::placeholder {
                color: ${CONFIG.colors.input.placeholder} !important;
                opacity: 1 !important;
            }
            
            /* Button styling */
            .dark .bg-gray-800 button,
            [data-element-id="send-button"],
            [data-element-id="more-options-button"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                border-color: ${CONFIG.colors.button.primary} !important;
                color: ${CONFIG.colors.text.primary} !important;
                border-radius: ${CONFIG.borderRadius.small} !important;
            }
            
            .dark .bg-gray-800 button:hover,
            [data-element-id="send-button"]:hover,
            [data-element-id="more-options-button"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
                border-color: ${CONFIG.colors.button.hover} !important;
            }
            
            /* Fix button hover text color */
            .dark .bg-gray-800 button:hover *,
            [data-element-id="send-button"]:hover *,
            [data-element-id="more-options-button"]:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Input control actions */
            [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]) {
                color: ${CONFIG.colors.text.secondary} !important;
                opacity: 0.8 !important;
                transition: all 0.2s ease !important;
            }
            
            [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):hover {
                color: ${CONFIG.colors.text.primary} !important;
                opacity: 1 !important;
                background-color: ${CONFIG.colors.deepAccent} !important;
            }
            
            /* Fix hover text color for input buttons */
            [data-element-id="chat-input-actions"] button:hover svg *,
            [data-element-id="chat-input-actions"] button:hover span {
                color: ${CONFIG.colors.text.primary} !important;
                fill: ${CONFIG.colors.text.primary} !important;
                stroke: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Bottom action buttons */
            .fixed.bottom-4.right-4 button,
            .fixed.bottom-0.right-0 button,
            .bg-blue-500,
            .bg-blue-600,
            .bg-blue-700,
            [class*="bg-blue-"],
            button[class*="bg-blue-"],
            a[class*="bg-blue-"] {
                background-color: ${CONFIG.colors.button.primary} !important;
                color: ${CONFIG.colors.text.primary} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
                transition: all 0.3s ease !important;
                border-radius: ${CONFIG.borderRadius.small} !important;
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
                box-shadow: 0 2px 8px ${CONFIG.colors.glow} !important;
            }
            
            /* Fix hover text color for buttons */
            .fixed.bottom-4.right-4 button:hover *,
            .fixed.bottom-0.right-0 button:hover *,
            .bg-blue-500:hover *,
            .bg-blue-600:hover *,
            button[class*="bg-blue-"]:hover *,
            a[class*="bg-blue-"]:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Make sure SVG icons in these buttons match */
            .fixed.bottom-4.right-4 button svg *,
            .fixed.bottom-0.right-0 button svg *,
            .bg-blue-500 svg *,
            .bg-blue-600 svg *,
            button[class*="bg-blue-"] svg *,
            a[class*="bg-blue-"] svg * {
                fill: ${CONFIG.colors.text.primary} !important;
                stroke: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Profile picture icon */
            .rounded-full,
            .rounded-full.bg-blue-500,
            .rounded-full.bg-blue-600,
            [data-element-id="workspace-profile-button"] div {
                background: ${CONFIG.colors.lightAccent} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
            }
            
            /* Subtle underwave glow effect for code blocks */
            @keyframes subtleGlow {
                0% { box-shadow: 0 0 4px ${CONFIG.colors.glow}; }
                50% { box-shadow: 0 0 8px ${CONFIG.colors.glow}; }
                100% { box-shadow: 0 0 4px ${CONFIG.colors.glow}; }
            }
            
            .dark pre, pre {
                animation: subtleGlow 8s infinite;
            }
            
            /* Add a subtle geometric grid to the chat background */
            [data-element-id="chat-space-middle-part"]::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: 
                    linear-gradient(0deg, transparent 24%, 
                    rgba(58, 58, 140, 0.02) 25%, 
                    rgba(58, 58, 140, 0.02) 26%, 
                    transparent 27%, transparent 74%, 
                    rgba(58, 58, 140, 0.02) 75%, 
                    rgba(58, 58, 140, 0.02) 76%, 
                    transparent 77%, transparent), 
                    linear-gradient(90deg, transparent 24%, 
                    rgba(58, 58, 140, 0.02) 25%, 
                    rgba(58, 58, 140, 0.02) 26%, 
                    transparent 27%, transparent 74%, 
                    rgba(58, 58, 140, 0.02) 75%, 
                    rgba(58, 58, 140, 0.02) 76%, 
                    transparent 77%, transparent);
                background-size: 50px 50px;
                z-index: -1;
                pointer-events: none;
            }
            
            /* Add a subtle accent line at the top */
            [data-element-id="chat-space-beginning-part"]::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    ${CONFIG.colors.lightAccent}, 
                    transparent);
                z-index: 100;
                opacity: 0.5;
            }
            
            /* Add subtle separation lines below AI responses */
            [data-element-id="ai-message"]::after {
                content: '';
                display: block;
                width: 100%;
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    ${CONFIG.colors.border}, 
                    transparent);
                margin-top: 12px;
                opacity: 0.3;
            }
            
            /* Link styling */
            a, .dark a {
                color: ${CONFIG.colors.lightAccent} !important;
                text-decoration: none !important;
                transition: all 0.2s ease !important;
            }
            
            a:hover, .dark a:hover {
                text-decoration: underline !important;
                color: ${CONFIG.colors.text.highlight} !important;
            }
            
            /* Fix link hover text */
            a:hover *, .dark a:hover * {
                color: ${CONFIG.colors.text.highlight} !important;
            }
            
            /* Tables with subtle borders */
            table, th, td {
                border-color: ${CONFIG.colors.border} !important;
                background-color: ${CONFIG.colors.panels} !important;
            }
            
            th {
                background-color: ${CONFIG.colors.deepAccent} !important;
                color: ${CONFIG.colors.text.highlight} !important;
            }
            
            /* Fix table hover text */
            table:hover td, table:hover th, 
            tr:hover td, tr:hover th,
            td:hover, th:hover,
            table:hover *, tr:hover *, td:hover *, th:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Blockquotes */
            blockquote, .dark blockquote {
                border-left: 3px solid ${CONFIG.colors.lightAccent} !important;
                background-color: ${CONFIG.colors.panels} !important;
                padding: 0.5rem 1rem !important;
                color: ${CONFIG.colors.text.secondary} !important;
            }
            
            /* Fix blockquote hover text */
            blockquote:hover, blockquote:hover *,
            .dark blockquote:hover, .dark blockquote:hover * {
                color: ${CONFIG.colors.text.secondary} !important;
            }
            
            /* Function call blocks */
            [data-element-id="function-call-block"],
            .w-full.rounded-md.bg-gray-50.p-4 {
                background-color: ${CONFIG.colors.deepAccent} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                border-radius: ${CONFIG.borderRadius.small} !important;
            }
            
            /* Bold and strong text */
            strong, b, .dark strong, .dark b {
                color: ${CONFIG.colors.text.highlight} !important;
                font-weight: 500 !important;
            }
            
            /* Fix strong/bold hover text */
            strong:hover, b:hover, 
            .dark strong:hover, .dark b:hover,
            *:hover strong, *:hover b {
                color: ${CONFIG.colors.text.highlight} !important;
            }
            
            /* Lists */
            ul, ol {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            li::marker {
                color: ${CONFIG.colors.lightAccent} !important;
            }
            
            /* Fix list hover text */
            ul:hover, ol:hover, li:hover,
            ul:hover *, ol:hover *, li:hover * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* AI message text color adjustment */
            [data-element-id="ai-message"] p,
            [data-element-id="ai-message"] div,
            [data-element-id="ai-message"] span {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Fix AI message hover text */
            [data-element-id="ai-message"] p:hover,
            [data-element-id="ai-message"] div:hover,
            [data-element-id="ai-message"] span:hover,
            [data-element-id="ai-message"]:hover p,
            [data-element-id="ai-message"]:hover div,
            [data-element-id="ai-message"]:hover span {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Text selection color */
            ::selection {
                background-color: ${CONFIG.colors.lightAccent} !important;
                color: ${CONFIG.colors.background} !important;
            }
            
            /* Force all other elements to maintain text color on hover */
            *:hover {
                color: inherit !important;
            }
            
            /* Additional text color overrides for specific hover cases */
            [class*="hover\\:text-white"]:hover,
            [class*="hover\\:text-gray"]:hover,
            [class*="hover\\:text-black"]:hover,
            [class*="dark\\:hover\\:text"]:hover {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Force specific text elements to maintain color */
            .prose :where(p):not(:where([class~="not-prose"],[class~="not-prose"] *)):hover {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Keep the right text color for the AI messages */
            [data-element-id="ai-message"] * {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Special case for code-related hovering */
            code *, code:hover, code:hover * {
                color: ${CONFIG.colors.code.text} !important;
            }
        `;
        document.head.appendChild(mainStyle);
        new MutationObserver(() => {
            if (!document.getElementById('typingmindUnderwaveTheme'))
                document.head.appendChild(mainStyle);
        }).observe(document.body, { childList: true, subtree: true });
        
        console.log('Underwave/Darkwave Theme loaded with hover text fix.');
    }

    /* ---------------- Text Parsing & Code Block Handling ---------------- */
    const multiStepParse = txt =>
        Utils.safe(() => {
            let res = txt;
            res = res.replace(
                /```(\w+)?\s*([\s\S]*?)\s*```/g,
                (_, lang, code) => {
                    lang = lang ? lang.toLowerCase() : '';
                    return `<pre style="background:${
                        CONFIG.colors.code.background
                    }; border:1px solid ${
                        CONFIG.colors.code.border
                    }; padding:6px; border-radius:${
                        CONFIG.borderRadius.small
                    }; overflow-x:auto; margin:0;" class="code-block${
                        lang ? ' language-' + lang : ''
                    }"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:${CONFIG.colors.code.text};">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:${CONFIG.colors.code.background}; color:${CONFIG.colors.code.text}; padding:0.2em 0.4em; border-radius:3px;">${inline}</code>`
            );
            res = res.replace(
                /&#039;([^&#]+)&#039;/g,
                (_, content) =>
                    `<code style="background-color:${CONFIG.colors.code.background}; color:${CONFIG.colors.code.text}; padding:0.2em 0.4em; border-radius:3px;">${content}</code>`
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
                    `${open}<code style="background-color:${CONFIG.colors.code.background}; color:${CONFIG.colors.code.text}; padding:0.2em 0.4em; border-radius:3px;">${parsed}</code>${close}`
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
                    color: CONFIG.colors.code.text,
                });
                const pre = codeEl.closest('pre');
                if (pre)
                    Object.assign(pre.style, {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: CONFIG.colors.code.background,
                        border: `1px solid ${CONFIG.colors.code.border}`,
                        borderRadius: CONFIG.borderRadius.small,
                        boxShadow: `0 2px 6px ${CONFIG.colors.shadow}`,
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
                    background: CONFIG.colors.code.background,
                    color: CONFIG.colors.code.text,
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: `0 2px 6px ${CONFIG.colors.shadow}`,
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
                
                // Direct application of styles to buttons
                document.querySelectorAll('.bg-blue-500, .bg-blue-600, [class*="bg-blue-"]').forEach(el => {
                    el.style.backgroundColor = CONFIG.colors.button.primary;
                    el.style.color = CONFIG.colors.text.primary;
                    el.style.border = `1px solid ${CONFIG.colors.border}`;
                    el.style.boxShadow = `0 2px 6px ${CONFIG.colors.shadow}`;
                    el.style.borderRadius = CONFIG.borderRadius.small;
                });
                
                // Apply styles to the profile icon
                document.querySelectorAll('.rounded-full').forEach(el => {
                    if (el.classList.contains('bg-blue-500') || el.classList.contains('bg-blue-600')) {
                        el.style.backgroundColor = CONFIG.colors.lightAccent;
                        el.style.border = `1px solid ${CONFIG.colors.border}`;
                        el.style.boxShadow = `0 2px 6px ${CONFIG.colors.shadow}`;
                    }
                });
                
                // Specifically fix the input panel
                const inputPanel = document.querySelector('[data-element-id="chat-space-end-part"] [role="presentation"]');
                if (inputPanel) {
                    inputPanel.style.backgroundColor = CONFIG.colors.panels;
                    inputPanel.style.border = `1px solid ${CONFIG.colors.border}`;
                    inputPanel.style.boxShadow = `0 2px 6px ${CONFIG.colors.shadow}`;
                    inputPanel.style.borderRadius = CONFIG.borderRadius.medium;
                }
                
                // Fix the chat input box
                const chatInput = document.getElementById('chat-input-textbox');
                if (chatInput) {
                    chatInput.style.backgroundColor = CONFIG.colors.input.background;
                    chatInput.style.color = CONFIG.colors.text.primary;
                }
                
                // Force hover text fixes for all elements (added dynamically)
                document.querySelectorAll('p, div, span, li, h1, h2, h3, h4, h5, h6, a').forEach(el => {
                    if (!el.getAttribute('data-hover-fixed')) {
                        el.addEventListener('mouseenter', function() {
                            if (this.style.color) {
                                this.setAttribute('data-original-color', this.style.color);
                            }
                            if (this.classList.contains('code') || this.closest('code') || this.closest('pre')) {
                                this.style.color = CONFIG.colors.code.text;
                            } else if (this.nodeName === 'A' || this.closest('a')) {
                                this.style.color = CONFIG.colors.lightAccent;
                            } else if (this.closest('[data-element-id="user-message"]')) {
                                this.style.color = CONFIG.colors.text.highlight;
                            } else {
                                this.style.color = CONFIG.colors.text.primary;
                            }
                        });
                        
                        el.addEventListener('mouseleave', function() {
                            const originalColor = this.getAttribute('data-original-color');
                            if (originalColor) {
                                this.style.color = originalColor;
                            }
                        });
                        
                        el.setAttribute('data-hover-fixed', 'true');
                    }
                });
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

    // Extra fix for hover colors - add a global event listener
    document.addEventListener('mouseover', function(e) {
        const target = e.target;
        if (target.nodeType === 1 && !target.classList.contains('bg-blue-500') && !target.classList.contains('bg-blue-600') && target.tagName !== 'BUTTON' && !target.hasAttribute('role')) {
            // Fix the text color for non-button elements on hover
            const allTextElements = target.querySelectorAll('p, span, div:not([class*="bg-blue"]):not([role="menuitem"]), h1, h2, h3, h4, h5, h6');
            allTextElements.forEach(el => {
                if (el.closest('code') || el.closest('pre')) {
                    el.style.color = CONFIG.colors.code.text;
                } else if (el.closest('a')) {
                    el.style.color = CONFIG.colors.lightAccent;
                } else if (el.closest('[data-element-id="user-message"]')) {
                    el.style.color = CONFIG.colors.text.highlight;
                } else if (el.tagName === 'STRONG' || el.tagName === 'B') {
                    el.style.color = CONFIG.colors.text.highlight;
                } else {
                    el.style.color = CONFIG.colors.text.primary;
                }
            });
        }
    }, true);

    console.log('Underwave/Darkwave theme applied with fix for hover text colors');
})();
