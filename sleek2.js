(function () {
    const CONFIG = {
        colors: {
            background: '#F6F3EE',    // Soft beige/cream background
            darkBackground: '#E8E4DD', // Slightly darker shade for panels
            text: '#1A1A1A',          // Near black text
            mutedText: '#666666',     // Muted gray text for secondary content
            border: '#E0DCD4',        // Very light border color
            input: {
                background: '#FFFFFF', // White input background
                text: '#1A1A1A',       // Near black text
                placeholder: '#999999', // Medium gray for placeholder
            },
            button: {
                primary: '#E5E1D9',    // Light beige for buttons
                hover: '#DAD6CE',      // Slightly darker beige on hover
                text: '#1A1A1A',       // Near black text for buttons
            },
            accent: {
                primary: '#E06A53',    // Coral/orange accent (from your image)
                secondary: '#1A1A1A',  // Near black secondary accent
                tertiary: '#F6F3EE',   // Light cream tertiary accent
            },
            panels: '#E8E4DD',         // Slightly darker cream for panels
        },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.25rem', medium: '0.5rem', large: '0.75rem' },
        fonts: {
            primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        }
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

    /* ---------------- Load Inter Font ---------------- */
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    /* ---------------- Sidebar Modifications ---------------- */
    if (!document.getElementById('typingmindSidebarFixMerged')) {
        const sidebarStyle = document.createElement('style');
        sidebarStyle.id = 'typingmindSidebarFixMerged';
        sidebarStyle.type = 'text/css';
        sidebarStyle.innerHTML = `
            [data-element-id="workspace-bar"],
            [data-element-id="side-bar-background"],
            [data-element-id="sidebar-beginning-part"],
            [data-element-id="sidebar-middle-part"] { 
                background-color: ${CONFIG.colors.background} !important; 
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"] { 
                background-color: ${CONFIG.colors.button.primary} !important; 
                color: ${CONFIG.colors.button.text} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                font-family: ${CONFIG.fonts.primary} !important;
                font-weight: 500 !important;
                transition: background-color 0.2s ease !important;
                border: none !important;
            }
            [data-element-id="new-chat-button-in-side-bar"]:hover {
                background-color: ${CONFIG.colors.button.hover} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"] * { 
                color: ${CONFIG.colors.button.text} !important; 
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="search-chats-bar"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.input.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="search-chats-bar"][placeholder]::placeholder,
            [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
            [data-element-id="search-chats-bar"]::-moz-placeholder,
            [data-element-id="search-chats-bar"]:-ms-input-placeholder { 
                color: ${CONFIG.colors.input.placeholder} !important; 
                opacity:1 !important; 
                -webkit-text-fill-color: ${CONFIG.colors.input.placeholder} !important; 
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white/"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="dark:text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white/"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="dark:text-white"]
            { 
                color: ${CONFIG.colors.text} !important; 
                opacity:1 !important; 
                --tw-text-opacity:1 !important; 
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] { 
                background-color: ${CONFIG.colors.panels} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
            }
            [data-element-id="custom-chat-item"] button[aria-label="Delete Chat"],
            [data-element-id="custom-chat-item"] button[aria-label="Favorite Chat"],
            [data-element-id="custom-chat-item"] button[aria-label="Chat settings"],
            [data-element-id="selected-chat-item"] button[aria-label="Delete Chat"],
            [data-element-id="selected-chat-item"] button[aria-label="Favorite Chat"],
            [data-element-id="selected-chat-item"] button[aria-label="Chat settings"] { display: none !important; }
            [data-element-id="custom-chat-item"]:hover button[aria-label="Delete Chat"],
            [data-element-id="custom-chat-item"]:hover button[aria-label="Favorite Chat"],
            [data-element-id="custom-chat-item"]:hover button[aria-label="Chat settings"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Delete Chat"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Favorite Chat"],
            [data-element-id="selected-chat-item"]:hover button[aria-label="Chat settings"],
            [data-element-id="custom-chat-item"] button[aria-expanded="true"],
            [data-element-id="selected-chat-item"] button[aria-expanded="true"] { display: inline-block !important; }
            #headlessui-portal-root { display: block !important; visibility: visible !important; pointer-events: auto !important; }
            #headlessui-portal-root [role="menu"] { 
                display: block !important; 
                visibility: visible !important; 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                pointer-events: auto !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08) !important;
                border: 1px solid ${CONFIG.colors.border} !important;
            }
            #headlessui-portal-root [role="menuitem"] { 
                display: flex !important; 
                visibility: visible !important; 
                pointer-events: auto !important; 
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="tag-search-panel"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.text} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08) !important;
            }
            [data-element-id="tag-search-panel"] input[type="search"] { 
                background-color: ${CONFIG.colors.input.background} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                color: ${CONFIG.colors.text} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                font-family: ${CONFIG.fonts.primary} !important;
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
                border-color: ${CONFIG.colors.accent.primary} !important; 
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
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar { width: 4px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track { background: ${CONFIG.colors.background} !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb { background: ${CONFIG.colors.border} !important; border-radius: 4px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { background: ${CONFIG.colors.mutedText} !important; }
            [data-element-id="tag-search-panel"] .overflow-auto { scrollbar-width: thin !important; scrollbar-color: ${CONFIG.colors.border} ${CONFIG.colors.background} !important; }
            [data-element-id="chat-folder"] textarea,
            [data-element-id="custom-chat-item"] textarea,
            [data-element-id="selected-chat-item"] textarea,
            [data-element-id="side-bar-background"] textarea { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border: 1px solid ${CONFIG.colors.border} !important; 
                border-radius: ${CONFIG.borderRadius.small} !important;
                font-family: ${CONFIG.fonts.primary} !important;
            }
            [data-element-id="chat-folder"] textarea:focus,
            [data-element-id="custom-chat-item"] textarea:focus,
            [data-element-id="selected-chat-item"] textarea:focus,
            [data-element-id="side-bar-background"] textarea:focus { 
                background-color: ${CONFIG.colors.input.background} !important; 
                color: ${CONFIG.colors.text} !important; 
                border-color: ${CONFIG.colors.mutedText} !important; 
                box-shadow: 0 0 0 2px rgba(0,0,0,0.05) !important; 
                outline: none !important;
            }
            [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
            [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
            [data-element-id="workspace-profile-button"]:hover { 
                background-color: ${CONFIG.colors.panels} !important; 
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
                font-family: ${CONFIG.fonts.primary} !important;
            }
            
            /* Chat item titles and text */
            [data-element-id="custom-chat-item"] span,
            [data-element-id="custom-chat-item"] div,
            [data-element-id="selected-chat-item"] span,
            [data-element-id="selected-chat-item"] div {
                color: ${CONFIG.colors.text} !important;
                font-family: ${CONFIG.fonts.primary} !important;
            }
            
            /* Nav links styling */
            .flex.items-center a, 
            .nav-link,
            [data-element-id="workspace-bar"] a,
            [data-element-id="side-bar-background"] a {
                font-family: ${CONFIG.fonts.primary} !important;
                font-weight: 500 !important;
            }
        `;
        document.head.appendChild(sidebarStyle);
        new MutationObserver(() => {
            if (!document.getElementById('typingmindSidebarFixMerged'))
                document.head.appendChild(sidebarStyle);
        }).observe(document.body, { childList: true, subtree: true });
        const fixSearchPlaceholder = () => {
            const input = document.querySelector(
                '[data-element-id="search-chats-bar"]'
            );
            if (input && !input.placeholder)
                input.setAttribute('placeholder', 'Search chats');
        };
        document.addEventListener('DOMContentLoaded', fixSearchPlaceholder);
        fixSearchPlaceholder();
        console.log('TypingMind Sidebar Mods loaded.');
    }

    /* ---------------- Main Chat & Input Styles ---------------- */
    const mainStyle = document.createElement('style');
    mainStyle.textContent = `
        body, html { 
            background-color: ${CONFIG.colors.background} !important; 
            font-family: ${CONFIG.fonts.primary} !important;
            color: ${CONFIG.colors.text} !important;
        }
        [data-element-id="chat-space-middle-part"],
        [data-element-id="chat-space-beginning-part"], 
        [data-element-id="chat-space-end-part"],
        [data-element-id="chat-space"],
        main, 
        div[class*="bg-gray-"],
        div[class*="bg-white"],
        .bg-gray-50,
        .bg-white { 
            background-color: ${CONFIG.colors.background} !important; 
            font-family: ${CONFIG.fonts.primary} !important;
        }
        
        /* Headings */
        h1, h2, h3 {
            font-family: ${CONFIG.fonts.heading} !important;
            font-weight: 600 !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Target all text elements to ensure consistent color */
        p, span, div, h4, h5, h6, li, a, button, input, textarea {
            font-family: ${CONFIG.fonts.primary} !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Target secondary text */
        .text-xs.text-gray-500, 
        .italic.truncate,
        .truncate,
        [class*="text-gray-500"],
        [class*="text-gray-400"] {
            color: ${CONFIG.colors.mutedText} !important;
            font-family: ${CONFIG.fonts.primary} !important;
        }
        
        /* Special label styling similar to the image */
        .label, 
        [data-element-id="badge"],
        [class*="label-"],
        [class*="badge-"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            color: ${CONFIG.colors.text} !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            padding: 2px 8px !important;
            border-radius: 50px !important;
            display: inline-block !important;
            line-height: 1.5 !important;
            margin-right: 6px !important;
        }
        
        /* Special styling for accent labels like the "Hard-working" in image */
        .label-accent,
        [data-element-id="accent-badge"] {
            background-color: ${CONFIG.colors.accent.primary} !important;
            color: white !important;
        }
        
        /* Fix the chat message containers - simpler design */
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            margin-left: auto !important;
            margin-right: 0 !important;
            display: block !important;
            max-width: 70% !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            background-color: ${CONFIG.colors.darkBackground} !important;
            color: ${CONFIG.colors.text} !important;
            padding: ${CONFIG.spacing.medium} !important;
            margin-bottom: ${CONFIG.spacing.medium} !important;
            border: none !important;
            box-shadow: none !important;
        }
        
        [data-element-id="response-block"] {
            background-color: ${CONFIG.colors.background} !important;
            padding: ${CONFIG.spacing.medium} 0 !important;
        }
        
        /* Fix code sections */
        [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
            background-color: ${CONFIG.colors.darkBackground} !important;
            border: none !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            box-shadow: none !important;
        }
        
        [data-element-id="chat-space-middle-part"] pre.mb-2.overflow-auto.text-sm {
            background-color: ${CONFIG.colors.darkBackground} !important;
            color: ${CONFIG.colors.text} !important;
            border: none !important;
            padding: 16px !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-x: hidden !important;
            font-family: ${CONFIG.fonts.mono} !important;
            font-size: 14px !important;
        }
        
        [data-element-id="chat-space-middle-part"] pre > div.relative > div.sticky {
            position: sticky !important;
            top: 0 !important;
            z-index: 10 !important;
            background-color: ${CONFIG.colors.darkBackground} !important;
            border-radius: ${CONFIG.borderRadius.small} ${CONFIG.borderRadius.small} 0 0 !important;
            border-bottom: 1px solid ${CONFIG.colors.border} !important;
        }
        
        /* Code elements */
        [data-element-id="chat-space-middle-part"] code {
            color: #1A1A1A !important;
            background-color: ${CONFIG.colors.darkBackground} !important;
            font-family: ${CONFIG.fonts.mono} !important;
            padding: 2px 5px !important;
            border-radius: 3px !important;
        }
        
        /* Header/nav elements */
        nav, header {
            background-color: ${CONFIG.colors.background} !important;
            font-family: ${CONFIG.fonts.primary} !important;
        }
        
        /* Table elements */
        table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 16px 0 !important;
            font-family: ${CONFIG.fonts.primary} !important;
        }
        
        th, td {
            padding: 12px 16px !important;
            text-align: left !important;
            border-bottom: 1px solid ${CONFIG.colors.border} !important;
        }
        
        th {
            font-weight: 600 !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        tr:last-child td {
            border-bottom: none !important;
        }
        
        /* Button styling similar to the Anthropic design */
        button, 
        .button,
        [class*="button-"] {
            font-family: ${CONFIG.fonts.primary} !important;
            font-weight: 500 !important;
            padding: 8px 16px !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            border: none !important;
            background-color: ${CONFIG.colors.button.primary} !important;
            color: ${CONFIG.colors.text} !important;
            cursor: pointer !important;
            transition: background-color 0.2s ease !important;
        }
        
        button:hover, 
        .button:hover,
        [class*="button-"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
        }
        
        /* Special styling for cards as shown in image */
        .card,
        [class*="card-"],
        [data-element-id="card"] {
            background-color: ${CONFIG.colors.darkBackground} !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            padding: 24px !important;
            margin-bottom: 16px !important;
        }
    `;
    document.head.appendChild(mainStyle);

    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
        [data-element-id="chat-space-end-part"] { 
            background-color: ${CONFIG.colors.background} !important; 
        }
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: transparent !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            margin-bottom: ${CONFIG.spacing.medium} !important;
            border: none !important;
            box-shadow: none !important;
        }
        #chat-input-textbox {
            min-height: 44px !important;
            padding: 12px 16px !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            color: ${CONFIG.colors.text} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            outline: none !important;
            margin: 8px 0 !important;
            overflow-wrap: break-word !important;
            tab-size: 4 !important;
            text-size-adjust: 100% !important;
            white-space: pre-wrap !important;
            font-variant-ligatures: none !important;
            -webkit-tap-highlight-color: transparent !important;
            background-color: ${CONFIG.colors.input.background} !important;
            font-family: ${CONFIG.fonts.primary} !important;
            font-size: 15px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        }
        #chat-input-textbox:focus {
            border-color: ${CONFIG.colors.mutedText} !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
            opacity: 1 !important;
            font-family: ${CONFIG.fonts.primary} !important;
        }
        [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]) {
            transition: all 0.2s ease !important;
            color: ${CONFIG.colors.text} !important;
        }
        [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]):hover {
            background-color: ${CONFIG.colors.button.primary} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
        }
        [data-element-id="chat-input-actions"] {
            padding: 0.5rem 0.75rem !important;
        }
        [data-element-id="send-button"],
        [data-element-id="more-options-button"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            border: none !important;
            color: ${CONFIG.colors.button.text} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            font-family: ${CONFIG.fonts.primary} !important;
            font-weight: 500 !important;
            transition: background-color 0.2s ease !important;
        }
        [data-element-id="send-button"]:hover,
        [data-element-id="more-options-button"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
        }
        
        /* Chat input container */
        [data-element-id="chat-input"],
        .rounded-xl.border.bg-white,
        .bg-white.rounded-xl.border {
            background-color: transparent !important;
            border: none !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
        }
        
        /* Global scrollbar styling */
        * {
            scrollbar-width: thin;
            scrollbar-color: ${CONFIG.colors.border} ${CONFIG.colors.background};
        }
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        ::-webkit-scrollbar-track {
            background: ${CONFIG.colors.background};
        }
        ::-webkit-scrollbar-thumb {
            background: ${CONFIG.colors.border};
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: ${CONFIG.colors.mutedText};
        }
    `;
    document.head.appendChild(inputStyle);

    /* ---------------- Text Parsing & Code Block Handling ---------------- */
    const multiStepParse = txt =>
        Utils.safe(() => {
            let res = txt;
            res = res.replace(
                /```(\w+)?\s*([\s\S]*?)\s*```/g,
                (_, lang, code) => {
                    lang = lang ? lang.toLowerCase() : '';
                    return `<pre style="background:${CONFIG.colors.darkBackground}; padding:16px; border-radius:${CONFIG.borderRadius.small}; overflow-x:auto; margin:16px 0;" class="code-block${
                        lang ? ' language-' + lang : ''
                    }"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:${CONFIG.colors.text}; font-family:${CONFIG.fonts.mono}; font-size:14px;">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:${CONFIG.colors.darkBackground}; color:${CONFIG.colors.text}; padding:2px 5px; border-radius:3px; font-family:${CONFIG.fonts.mono};">${inline}</code>`
            );
            res = res.replace(
                /&#039;([^&#]+)&#039;/g,
                (_, content) =>
                    `<code style="background-color:${CONFIG.colors.darkBackground}; color:${CONFIG.colors.text}; padding:2px 5px; border-radius:3px; font-family:${CONFIG.fonts.mono};">${content}</code>`
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
                    `${open}<code style="background-color:${CONFIG.colors.darkBackground}; color:${CONFIG.colors.text}; padding:2px 5px; border-radius:3px; font-family:${CONFIG.fonts.mono};">${parsed}</code>${close}`
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
                Object.assign(codeEl.style
