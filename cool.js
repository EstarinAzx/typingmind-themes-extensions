(function () {
    const CONFIG = {
        colors: {
            background: '#F2F2F7',    // Very light gray with blue tint
            text: '#404050',          // Dark gray with blue/purple hint
            muted: '#72727F',         // Medium gray for secondary text
            border: '#E2E2EA',        // Light border color
            input: {
                background: '#FFFFFF', // White background for inputs
                text: '#404050',       // Dark gray text
                placeholder: '#9696A5', // Medium-light gray for placeholder
            },
            button: {
                primary: '#6E6EE8',    // Soft purple-blue for buttons
                hover: '#5D5DD6',      // Slightly darker on hover
            },
            accent: {
                primary: '#6E6EE8',    // Soft purple-blue accent
                secondary: '#9D9DF0',  // Lighter purple-blue accent
                tertiary: '#F0F0FF',   // Very light blue-purple for subtle highlights
            },
            panels: '#FFFFFF',         // White for panels/cards
            shadow: 'rgba(0, 0, 0, 0.06)', // Very subtle shadow color
            messageBg: '#F7F7FC',      // Very light purple-tinted gray for message bubbles
            codeBg: '#F7F7FC',         // Very light background for code blocks
        },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '6px', medium: '8px', large: '12px' },
        shadows: {
            small: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
            medium: '0 3px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
            large: '0 10px 20px rgba(0, 0, 0, 0.06), 0 6px 6px rgba(0, 0, 0, 0.04)',
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

    /* ---------------- Sidebar Modifications ---------------- */
    if (!document.getElementById('typingmindSidebarFixMerged')) {
        const sidebarStyle = document.createElement('style');
        sidebarStyle.id = 'typingmindSidebarFixMerged';
        sidebarStyle.type = 'text/css';
        sidebarStyle.innerHTML = `
            [data-element-id="workspace-bar"],
            [data-element-id="side-bar-background"],
            [data-element-id="sidebar-beginning-part"],
            [data-element-id="sidebar-middle-part"] { background-color: ${CONFIG.colors.background} !important; }
            [data-element-id="new-chat-button-in-side-bar"] { background-color: ${CONFIG.colors.button.primary} !important; color: white !important; border-radius: ${CONFIG.borderRadius.small} !important; box-shadow: ${CONFIG.shadows.small} !important; }
            [data-element-id="new-chat-button-in-side-bar"] * { color: white !important; }
            [data-element-id="new-chat-button-in-side-bar"]:hover { background-color: ${CONFIG.colors.button.hover} !important; box-shadow: ${CONFIG.shadows.medium} !important; transform: translateY(-1px) !important; }
            [data-element-id="search-chats-bar"] { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border: 1px solid ${CONFIG.colors.border} !important; border-radius: ${CONFIG.borderRadius.small} !important; box-shadow: ${CONFIG.shadows.small} !important; }
            [data-element-id="search-chats-bar"][placeholder]::placeholder,
            [data-element-id="search-chats-bar"]::-webkit-input-placeholder,
            [data-element-id="search-chats-bar"]::-moz-placeholder,
            [data-element-id="search-chats-bar"]:-ms-input-placeholder { color: ${CONFIG.colors.input.placeholder} !important; opacity:1 !important; -webkit-text-fill-color: ${CONFIG.colors.input.placeholder} !important; }
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-white/"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="workspace-bar"] *:not(svg):not(path)[class*="dark:text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-white/"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="text-gray-"],
            [data-element-id="side-bar-background"] *:not(svg):not(path)[class*="dark:text-white"]
            { color: ${CONFIG.colors.text} !important; opacity:1 !important; --tw-text-opacity:1 !important; }
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] { background-color: ${CONFIG.colors.accent.tertiary} !important; border-radius: ${CONFIG.borderRadius.small} !important; }
            [data-element-id="selected-chat-item"] { box-shadow: ${CONFIG.shadows.small} !important; }
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
            #headlessui-portal-root [role="menu"] { display: block !important; visibility: visible !important; background-color: ${CONFIG.colors.panels} !important; color: ${CONFIG.colors.text} !important; pointer-events: auto !important; border-radius: ${CONFIG.borderRadius.medium} !important; box-shadow: ${CONFIG.shadows.medium} !important; }
            #headlessui-portal-root [role="menuitem"] { display: flex !important; visibility: visible !important; pointer-events: auto !important; }
            #headlessui-portal-root [role="menuitem"]:hover { background-color: ${CONFIG.colors.accent.tertiary} !important; }
            [data-element-id="tag-search-panel"] { background-color: ${CONFIG.colors.panels} !important; border: 1px solid ${CONFIG.colors.border} !important; color: ${CONFIG.colors.text} !important; border-radius: ${CONFIG.borderRadius.small} !important; box-shadow: ${CONFIG.shadows.medium} !important; }
            [data-element-id="tag-search-panel"] input[type="search"] { background-color: ${CONFIG.colors.input.background} !important; border: 1px solid ${CONFIG.colors.border} !important; color: ${CONFIG.colors.text} !important; border-radius: ${CONFIG.borderRadius.small} !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"] { appearance: none !important; width: 16px !important; height: 16px !important; border: 1px solid ${CONFIG.colors.border} !important; border-radius: ${CONFIG.borderRadius.small} !important; background-color: ${CONFIG.colors.input.background} !important; position: relative !important; cursor: pointer !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked { background-color: ${CONFIG.colors.button.primary} !important; border-color: ${CONFIG.colors.button.primary} !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { content: '' !important; position: absolute !important; left: 5px !important; top: 2px !important; width: 4px !important; height: 8px !important; border: solid white !important; border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important; }
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] p,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button { color: ${CONFIG.colors.text} !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar { width: 6px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track { background: ${CONFIG.colors.background} !important; border-radius: 3px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb { background: ${CONFIG.colors.muted} !important; border-radius: 3px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { background: ${CONFIG.colors.button.primary} !important; }
            [data-element-id="tag-search-panel"] .overflow-auto { scrollbar-width: thin !important; scrollbar-color: ${CONFIG.colors.muted} ${CONFIG.colors.background} !important; }
            [data-element-id="chat-folder"] textarea,
            [data-element-id="custom-chat-item"] textarea,
            [data-element-id="selected-chat-item"] textarea,
            [data-element-id="side-bar-background"] textarea { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border: 1px solid ${CONFIG.colors.border} !important; border-radius: ${CONFIG.borderRadius.small} !important; }
            [data-element-id="chat-folder"] textarea:focus,
            [data-element-id="custom-chat-item"] textarea:focus,
            [data-element-id="selected-chat-item"] textarea:focus,
            [data-element-id="side-bar-background"] textarea:focus { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border-color: ${CONFIG.colors.accent.primary} !important; box-shadow: 0 0 0 2px rgba(110,110,232,0.2) !important; }
            [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
            [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
            [data-element-id="workspace-profile-button"]:hover { background-color: rgba(110,110,232,0.1) !important; }
            
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
            
            /* Top nav links - clean design */
            .flex.items-center a, 
            .nav-link,
            [data-element-id="workspace-bar"] a,
            [data-element-id="side-bar-background"] a {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                letter-spacing: 0.3px !important;
                font-weight: 500 !important;
                padding: 6px 10px !important;
                margin: 0 2px !important;
                transition: all 0.2s ease !important;
                border-radius: ${CONFIG.borderRadius.small} !important;
                color: ${CONFIG.colors.text} !important;
            }
            
            .flex.items-center a:hover, 
            .nav-link:hover {
                background-color: ${CONFIG.colors.accent.tertiary} !important;
                color: ${CONFIG.colors.accent.primary} !important;
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
        body, html { background-color: ${CONFIG.colors.background} !important; }
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
        }
        
        /* Clean, modern font for all text */
        body, html, p, span, div, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        
        /* Sleek headers */
        h1, h2, h3, h4, a, button, .title {
            font-weight: 500 !important;
            letter-spacing: 0.3px !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Target all text elements to ensure consistent color */
        p, span, div, h5, h6, li, input, textarea {
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Target specific gray text classes used in the UI */
        [class*="text-gray-"], 
        .text-gray-500, 
        .text-gray-600, 
        .text-gray-700, 
        .text-gray-800, 
        .text-gray-900 {
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Target timestamps and metadata */
        .text-xs.text-gray-500, 
        .italic.truncate,
        .truncate,
        [class*="text-black"] {
            color: ${CONFIG.colors.muted} !important;
        }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not(
            pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *
        ),
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
            color: ${CONFIG.colors.text} !important;
        }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full,
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            color: ${CONFIG.colors.text} !important;
        }
        
        [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:has([data-element-id="user-message"]) [data-element-id="chat-avatar-container"] {
            display: none !important;
        }
        
        /* User message bubbles - clean and minimal */
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            margin-left: auto !important;
            margin-right: 0 !important;
            display: block !important;
            max-width: 70% !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            background-color: ${CONFIG.colors.accent.primary} !important;
            color: white !important;
            padding: ${CONFIG.spacing.medium} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
            border: none !important;
            box-shadow: ${CONFIG.shadows.small} !important;
        }
        
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"],
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
            background-color: ${CONFIG.colors.accent.primary} !important;
            color: white !important;
        }
        
        /* AI message containers */
        [data-element-id="response-block"] {
            background-color: ${CONFIG.colors.background} !important;
            padding: ${CONFIG.spacing.small} !important;
        }
        
        [data-element-id="chat-space-middle-part"] [data-element-id="ai-message"] {
            background-color: ${CONFIG.colors.messageBg} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            padding: ${CONFIG.spacing.medium} !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
        }
        
        /* Fix main content sections - code blocks with clean styling */
        [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
            background-color: ${CONFIG.colors.codeBg} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            margin: ${CONFIG.spacing.medium} 0 !important;
        }
        
        [data-element-id="chat-space-middle-part"] pre.mb-2.overflow-auto.text-sm.border.border-gray-200.rounded.bg-gray-100 {
            background-color: ${CONFIG.colors.codeBg} !important;
            color: ${CONFIG.colors.accent.primary} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            padding: 12px !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-x: hidden !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            margin: ${CONFIG.spacing.medium} 0 !important;
        }
        
        [data-element-id="chat-space-middle-part"] pre > div.relative { position: relative !important; }
        
        [data-element-id="chat-space-middle-part"] pre > div.relative > div.sticky {
            position: sticky !important;
            top: 0 !important;
            z-index: 10 !important;
            background-color: ${CONFIG.colors.codeBg} !important;
            border-radius: ${CONFIG.borderRadius.medium} ${CONFIG.borderRadius.medium} 0 0 !important;
            border-bottom: 1px solid ${CONFIG.colors.border} !important;
        }
        
        [data-element-id="chat-space-middle-part"] pre > div.relative > div > pre {
            border: none !important;
            background: transparent !important;
            margin: 0 !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:hover { background-color: transparent !important; }
        
        /* Lists and markers */
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ul,
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ol { margin: 0.5rem 0 !important; }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full li { margin: 0.3rem 0 !important; }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker {
            color: ${CONFIG.colors.accent.primary} !important;
            font-weight: bold !important;
        }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ul > li {
            list-style-type: disc !important;
            padding-left: 0.5rem !important;
        }
        
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ol > li {
            list-style-type: decimal !important;
            padding-left: 0.5rem !important;
        }
        
        /* Code elements */
        [data-element-id="chat-space-middle-part"] code {
            color: ${CONFIG.colors.accent.primary} !important;
            background-color: ${CONFIG.colors.codeBg} !important;
            font-family: "SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace !important;
            font-size: 13px !important;
            padding: 0.2em 0.4em !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
        }
        
        /* Header/nav elements */
        nav, header {
            background-color: ${CONFIG.colors.background} !important;
            box-shadow: 0 1px 0 ${CONFIG.colors.border} !important;
        }
        
        /* Table elements */
        table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: ${CONFIG.spacing.medium} 0 !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            overflow: hidden !important;
            box-shadow: ${CONFIG.shadows.small} !important;
        }
        
        th, td {
            border: 1px solid ${CONFIG.colors.border} !important;
            padding: 8px 12px !important;
            text-align: left !important;
        }
        
        th {
            background-color: ${CONFIG.colors.accent.tertiary} !important;
            font-weight: 500 !important;
        }
        
        tr:nth-child(even) {
            background-color: ${CONFIG.colors.background} !important;
        }
        
        tr:nth-child(odd) {
            background-color: ${CONFIG.colors.panels} !important;
        }
        
        /* Fix any remaining gray backgrounds */
        [class*="bg-gray-"], 
        .bg-gray-50, 
        .bg-gray-100, 
        .bg-gray-200,
        .bg-white {
            background-color: ${CONFIG.colors.panels} !important;
        }
        
        /* Chat history items */
        [data-element-id="chat-history-item"] {
            background-color: ${CONFIG.colors.background} !important;
            color: ${CONFIG.colors.text} !important;
        }
        
        /* Clean code block styling */
        [data-element-id="chat-space-middle-part"] pre code {
            font-family: "SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
        }
        
        /* Function call blocks */
        [data-element-id="function-call-block"],
        .w-full.rounded-md.bg-gray-50.p-4 {
            background-color: ${CONFIG.colors.codeBg} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            margin: ${CONFIG.spacing.medium} 0 !important;
            padding: ${CONFIG.spacing.medium} !important;
        }
        
        /* Top navbar */
        [data-element-id="chat-space-beginning-part"] div {
            background-color: ${CONFIG.colors.background} !important;
        }
        
        /* Style the buttons with clean, minimal design */
        .bg-blue-500,
        .bg-blue-600,
        .bg-blue-700,
        [class*="bg-blue-"],
        button[class*="bg-blue-"],
        a[class*="bg-blue-"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            color: white !important;
            border: none !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            font-weight: 500 !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            transition: all 0.2s ease !important;
            padding: 8px 16px !important;
        }
        
        /* Button hover effects */
        .bg-blue-500:hover,
        .bg-blue-600:hover,
        .bg-blue-700:hover,
        [class*="bg-blue-"]:hover,
        button[class*="bg-blue-"]:hover,
        a[class*="bg-blue-"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
            transform: translateY(-1px) !important;
            box-shadow: ${CONFIG.shadows.medium} !important;
        }
        
        /* Make sure SVGs inside these buttons match the theme palette */
        .bg-blue-500 svg *,
        .bg-blue-600 svg *,
        .bg-blue-700 svg *,
        [class*="bg-blue-"] svg *,
        button[class*="bg-blue-"] svg *,
        a[class*="bg-blue-"] svg * {
            fill: white !important;
            stroke: white !important;
        }
        
        /* Specific fix for the bottom right buttons */
        .fixed.bottom-4.right-4 button,
        .fixed.bottom-0.right-0 button {
            background-color: ${CONFIG.colors.button.primary} !important;
            color: white !important;
            border: none !important;
            box-shadow: ${CONFIG.shadows.medium} !important;
            font-weight: 500 !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
        }
        
        /* Ensure all blue links are theme colored */
        a[class*="text-blue-"],
        button[class*="text-blue-"],
        [class*="text-blue-"] {
            color: ${CONFIG.colors.accent.primary} !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
        }
        
        /* Link hover effects */
        a:hover {
            text-decoration: none !important;
            color: ${CONFIG.colors.button.hover} !important;
        }
        
        /* Add a subtle background pattern */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background-image: 
                radial-gradient(${CONFIG.colors.border} 1px, transparent 1px),
                radial-gradient(${CONFIG.colors.border} 1px, transparent 1px);
            background-size: 40px 40px;
            background-position: 0 0, 20px 20px;
            opacity: 0.3;
            z-index: -1;
        }
    `;
    document.head.appendChild(mainStyle);

    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
        [data-element-id="chat-space-end-part"] { background-color: ${CONFIG.colors.background} !important; }
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: ${CONFIG.colors.panels};
            border-radius: ${CONFIG.borderRadius.large};
            margin-bottom: ${CONFIG.spacing.medium};
            border: 1px solid ${CONFIG.colors.border} !important;
            box-shadow: ${CONFIG.shadows.small} !important;
        }
        #chat-input-textbox {
            min-height: 44px !important;
            padding: 0.75rem 1rem !important;
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
            box-shadow: ${CONFIG.shadows.small} !important;
        }
        #chat-input-textbox:focus {
            border-color: ${CONFIG.colors.accent.primary} !important;
            box-shadow: 0 0 0 2px rgba(110,110,232,0.2) !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
            opacity: 1 !important;
        }
        [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]) {
            transition: all 0.2s ease !important;
            color: ${CONFIG.colors.text} !important;
        }
        [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]):not([data-element-id="replace-only-button"]):hover {
            background-color: ${CONFIG.colors.accent.tertiary} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            color: ${CONFIG.colors.accent.primary} !important;
        }
        [data-element-id="chat-input-actions"] {
            padding: 0.5rem 0.75rem !important;
        }
        [data-element-id="send-button"],
        [data-element-id="more-options-button"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            border-color: ${CONFIG.colors.button.primary} !important;
            color: white !important;
            border-radius: ${CONFIG.borderRadius.medium} !important;
            font-weight: 500 !important;
            box-shadow: ${CONFIG.shadows.small} !important;
            padding: 6px 12px !important;
        }
        [data-element-id="send-button"]:hover,
        [data-element-id="more-options-button"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
            border-color: ${CONFIG.colors.button.hover} !important;
            transform: translateY(-1px) !important;
            box-shadow: ${CONFIG.shadows.medium} !important;
        }
        
        /* Fix any remaining gray in the input area */
        [data-element-id="chat-input"],
        .rounded-xl.border.bg-white,
        .bg-white.rounded-xl.border {
            background-color: ${CONFIG.colors.panels} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            box-shadow: ${CONFIG.shadows.small} !important;
        }
        
        /* Bottom toolbar */
        [data-element-id="chat-space-end-part"] {
            background-color: ${CONFIG.colors.background} !important;
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
                    return `<pre style="background:${CONFIG.colors.codeBg}; border:1px solid ${
                        CONFIG.colors.border
                    }; padding:16px; border-radius:${
                        CONFIG.borderRadius.medium
                    }; overflow-x:auto; margin:16px 0; box-shadow:${CONFIG.shadows.small};" class="code-block${
                        lang ? ' language-' + lang : ''
                    }"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:${CONFIG.colors.text}; font-family:'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:13px; line-height:1.5;">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:${CONFIG.colors.codeBg}; color:${CONFIG.colors.accent.primary}; padding:0.2em 0.4em; border-radius:${CONFIG.borderRadius.small}; font-family:'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:13px; border:1px solid ${CONFIG.colors.border};">${inline}</code>`
            );
            res = res.replace(
                /&#039;([^&#]+)&#039;/g,
                (_, content) =>
                    `<code style="background-color:${CONFIG.colors.codeBg}; color:${CONFIG.colors.accent.primary}; padding:0.2em 0.4em; border-radius:${CONFIG.borderRadius.small}; font-family:'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:13px; border:1px solid ${CONFIG.colors.border};">${content}</code>`
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
                    `${open}<code style="background-color:${CONFIG.colors.codeBg}; color:${CONFIG.colors.accent.primary}; padding:0.2em 0.4em; border-radius:${CONFIG.borderRadius.small}; font-family:'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size:13px; border:1px solid ${CONFIG.colors.border};">${parsed}</code>${close}`
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
                    color: CONFIG.colors.text,
                    fontFamily: "'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    fontSize: '13px',
                    lineHeight: '1.5'
                });
                const pre = codeEl.closest('pre');
                if (pre)
                    Object.assign(pre.style, {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: CONFIG.colors.codeBg,
                        border: `1px solid ${CONFIG.colors.border}`,
                        borderRadius: CONFIG.borderRadius.medium,
                        boxShadow: CONFIG.shadows.small,
                        padding: '16px',
                        margin: '16px 0'
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
                    background: CONFIG.colors.codeBg,
                    color: CONFIG.colors.text,
                    padding: '16px',
                    borderRadius: CONFIG.borderRadius.medium,
                    boxShadow: CONFIG.shadows.small,
                    fontFamily: "'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: `1px solid ${CONFIG.colors.border}`,
                    margin: '16px 0'
                });
                const container = preEl.closest('.pb-6');
                if (container) container.style.overflowX = 'hidden';
            }
        });

    const improveTextDisplay = Utils.debounce(
        () =>
            Utils.safe(() => {
                // Additional global styling fix
                const globalFix = document.createElement('style');
                globalFix.textContent = `
                    * {
                        scrollbar-width: thin;
                        scrollbar-color: ${CONFIG.colors.muted} ${CONFIG.colors.background};
                    }
                    ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: ${CONFIG.colors.background};
                        border-radius: 4px;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: ${CONFIG.colors.muted};
                        border-radius: 4px;
                        border: 2px solid ${CONFIG.colors.background};
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: ${CONFIG.colors.button.primary};
                    }
                    
                    /* Fix all remaining gray elements */
                    [class*="bg-gray-"], 
                    [class*="bg-white"],
                    [class*="border-gray-"],
                    .bg-gray-50,
                    .bg-gray-100,
                    .bg-white {
                        background-color: ${CONFIG.colors.panels} !important;
                        border-color: ${CONFIG.colors.border} !important;
                    }
                    
                    [class*="text-gray-"],
                    [class*="text-white"],
                    [class*="text-black"] {
                        color: ${CONFIG.colors.text} !important;
                    }
                    
                    /* Target specific panels and dialog boxes */
                    [role="dialog"],
                    [role="menu"],
                    .fixed.inset-0,
                    .absolute.inset-0 {
                        background-color: rgba(242,242,247,0.8) !important;
                        backdrop-filter: blur(8px) !important;
                    }
                    
                    [role="dialog"] > div,
                    [role="menu"] > div {
                        background-color: ${CONFIG.colors.panels} !important;
                        border: 1px solid ${CONFIG.colors.border} !important;
                        border-radius: ${CONFIG.borderRadius.large} !important;
                        box-shadow: ${CONFIG.shadows.large} !important;
                    }
                    
                    /* Target blue links */
                    .text-blue-500,
                    .text-blue-600,
                    .text-blue-700,
                    a[class*="text-blue-"],
                    button[class*="text-blue-"],
                    [class*="text-blue-"] {
                        color: ${CONFIG.colors.accent.primary} !important;
                    }
                    
                    /* Button hover effects */
                    button:hover {
                        opacity: 0.95 !important;
                    }
                    
                    /* Target bottom right action buttons */
                    .fixed.bottom-4.right-4 button,
                    .fixed.bottom-0.right-0 button,
                    .bg-blue-500,
                    .bg-blue-600,
                    .bg-blue-700,
                    [class*="bg-blue-"],
                    button[class*="bg-blue-"],
                    a[class*="bg-blue-"] {
                        background-color: ${CONFIG.colors.button.primary} !important;
                        color: white !important;
                        border: none !important;
                        box-shadow: ${CONFIG.shadows.small} !important;
                        transition: all 0.2s ease !important;
                        border-radius: ${CONFIG.borderRadius.medium} !important;
                        font-weight: 500 !important;
                        padding: 8px 16px !important;
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
                        transform: translateY(-1px) !important;
                        box-shadow: ${CONFIG.shadows.medium} !important;
                    }
                    
                    /* Make sure SVG icons in these buttons match */
                    .fixed.bottom-4.right-4 button svg *,
                    .fixed.bottom-0.right-0 button svg *,
                    .bg-blue-500 svg *,
                    .bg-blue-600 svg *,
                    button[class*="bg-blue-"] svg *,
                    a[class*="bg-blue-"] svg * {
                        fill: white !important;
                        stroke: white !important;
                    }
                    
                    /* Make profile picture icon stylish */
                    .rounded-full,
                    .rounded-full.bg-blue-500,
                    .rounded-full.bg-blue-600,
                    [data-element-id="workspace-profile-button"] div {
                        background: ${CONFIG.colors.accent.primary} !important;
                        border: 2px solid white !important;
                        box-shadow: ${CONFIG.shadows.small} !important;
                    }
                    
                    /* Font weights for better readability */
                    h1 { font-weight: 600 !important; letter-spacing: -0.5px !important; font-size: 1.5rem !important; }
                    h2 { font-weight: 600 !important; letter-spacing: -0.3px !important; font-size: 1.3rem !important; }
                    h3 { font-weight: 500 !important; letter-spacing: -0.2px !important; font-size: 1.15rem !important; }
                    h4, h5, h6 { font-weight: 500 !important; }
                    p, li { font-weight: 400 !important; line-height: 1.6 !important; }
                    
                    /* Add a subtle shadow to message containers */
                    [data-element-id="ai-message"] {
                        box-shadow: ${CONFIG.shadows.small} !important;
                    }
                    
                    /* Custom accent for important elements */
                    b, strong {
                        color: ${CONFIG.colors.text} !important;
                        font-weight: 600 !important;
                    }
                    
                    /* Add subtle spacing between messages */
                    [data-element-id="ai-message"] {
                        margin-bottom: 16px !important;
                        border-radius: ${CONFIG.borderRadius.large} !important;
                        padding: ${CONFIG.spacing.medium} !important;
                        background-color: ${CONFIG.colors.messageBg} !important;
                    }
                    
                    /* Style all buttons to be more attractive */
                    button {
                        border-radius: ${CONFIG.borderRadius.medium} !important;
                        font-weight: 500 !important;
                        transition: all 0.2s ease !important;
                    }
                    
                    /* Make all inputs attractive */
                    input, textarea {
                        border-radius: ${CONFIG.borderRadius.medium} !important;
                        transition: all 0.2s ease !important;
                        border: 1px solid ${CONFIG.colors.border} !important;
                        background-color: ${CONFIG.colors.input.background} !important;
                        box-shadow: ${CONFIG.shadows.small} !important;
                        color: ${CONFIG.colors.text} !important;
                        padding: 8px 12px !important;
                    }
                    
                    input:focus, textarea:focus {
                        box-shadow: 0 0 0 2px rgba(110,110,232,0.2) !important;
                        border-color: ${CONFIG.colors.accent.primary} !important;
                        outline: none !important;
                    }
                    
                    /* Improve blockquotes */
                    blockquote {
                        border-left: 4px solid ${CONFIG.colors.accent.primary} !important;
                        padding-left: 16px !important;
                        margin: 16px 0 !important;
                        color: ${CONFIG.colors.muted} !important;
                        font-style: italic !important;
                        background-color: ${CONFIG.colors.accent.tertiary} !important;
                        padding: 12px 16px !important;
                        border-radius: 0 ${CONFIG.borderRadius.medium} ${CONFIG.borderRadius.medium} 0 !important;
                    }
                    
                    /* Improve horizontal rules */
                    hr {
                        border: none !important;
                        height: 1px !important;
                        background: linear-gradient(to right, transparent, ${CONFIG.colors.border}, transparent) !important;
                        margin: 24px 0 !important;
                    }
                    
                    /* Give a nice card design to elements that need it */
                    .card, .card-like, .box, .container {
                        background-color: ${CONFIG.colors.panels} !important;
                        border-radius: ${CONFIG.borderRadius.medium} !important;
                        box-shadow: ${CONFIG.shadows.small} !important;
                        border: 1px solid ${CONFIG.colors.border} !important;
                        padding: 16px !important;
                    }
                `;
                if (!document.getElementById('light-minimalist-theme-global-fix')) {
                    globalFix.id = 'light-minimalist-theme-global-fix';
                    document.head.appendChild(globalFix);
                }
            
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
                
                // Apply sleek styles to buttons
                document.querySelectorAll('.bg-blue-500, .bg-blue-600, [class*="bg-blue-"]').forEach(el => {
                    el.style.backgroundColor = CONFIG.colors.button.primary;
                    el.style.color = 'white';
                    el.style.border = 'none';
                    el.style.boxShadow = CONFIG.shadows.small;
                    el.style.borderRadius = CONFIG.borderRadius.medium;
                    el.style.fontWeight = '500';
                    el.style.transition = 'all 0.2s ease';
                    el.style.padding = '8px 16px';
                });
                
                // Apply styles to the profile icon - more aesthetic
                document.querySelectorAll('.rounded-full').forEach(el => {
                    if (el.classList.contains('bg-blue-500') || el.classList.contains('bg-blue-600')) {
                        el.style.background = CONFIG.colors.accent.primary;
                        el.style.border = '2px solid white';
                        el.style.boxShadow = CONFIG.shadows.small;
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

    console.log('Light, minimalist theme applied with comfortable aesthetics');
})();
