(function () {
    const CONFIG = {
        colors: {
            background: '#1E1E1E',
            text: '#D4D4D4',
            border: '#3C3C3C',
            input: {
                background: '#252526',
                text: '#D4D4D4',
                placeholder: '#808080',
            },
            button: {
                primary: '#D4D4D4',
                hover: '#B0B0B0',
            },
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
            [data-element-id="sidebar-middle-part"],
            [data-element-id="sidebar-end-part"] { /* Added sidebar-end-part */
                 background-color: ${CONFIG.colors.background} !important; 
            }
            [data-element-id="new-chat-button-in-side-bar"] { background-color: #2A2A2D !important; color: ${CONFIG.colors.text} !important; }
            [data-element-id="new-chat-button-in-side-bar"] * { color: ${CONFIG.colors.text} !important; }
            [data-element-id="search-chats-bar"] { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border: 1px solid ${CONFIG.colors.border} !important; }
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
            [data-element-id="selected-chat-item"] { background-color: #2A2A2D !important; }
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
            #headlessui-portal-root [role="menu"] { display: block !important; visibility: visible !important; background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; pointer-events: auto !important; }
            #headlessui-portal-root [role="menuitem"] { display: flex !important; visibility: visible !important; pointer-events: auto !important; }
            [data-element-id="tag-search-panel"] { background-color: ${CONFIG.colors.background} !important; border: 1px solid ${CONFIG.colors.border} !important; color: ${CONFIG.colors.text} !important; }
            [data-element-id="tag-search-panel"] input[type="search"] { background-color: ${CONFIG.colors.input.background} !important; border: 1px solid ${CONFIG.colors.border} !important; color: ${CONFIG.colors.text} !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"] { appearance: none !important; width: 16px !important; height: 16px !important; border: 1px solid ${CONFIG.colors.border} !important; border-radius: 3px !important; background-color: ${CONFIG.colors.input.background} !important; position: relative !important; cursor: pointer !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked { background-color: #0E639C !important; border-color: #0E639C !important; }
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after { content: '' !important; position: absolute !important; left: 5px !important; top: 2px !important; width: 4px !important; height: 8px !important; border: solid ${CONFIG.colors.text} !important; border-width: 0 2px 2px 0 !important; transform: rotate(45deg) !important; }
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] p,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button { color: ${CONFIG.colors.text} !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar { width: 8px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track { background: ${CONFIG.colors.input.background} !important; border-radius: 4px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb { background: #505050 !important; border-radius: 4px !important; }
            [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover { background: #707070 !important; }
            [data-element-id="tag-search-panel"] .overflow-auto { scrollbar-width: thin !important; scrollbar-color: #505050 ${CONFIG.colors.input.background} !important; }
            [data-element-id="chat-folder"] textarea,
            [data-element-id="custom-chat-item"] textarea,
            [data-element-id="selected-chat-item"] textarea,
            [data-element-id="side-bar-background"] textarea { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border: 1px solid ${CONFIG.colors.border} !important; }
            [data-element-id="chat-folder"] textarea:focus,
            [data-element-id="custom-chat-item"] textarea:focus,
            [data-element-id="selected-chat-item"] textarea:focus,
            [data-element-id="side-bar-background"] textarea:focus { background-color: ${CONFIG.colors.input.background} !important; color: ${CONFIG.colors.text} !important; border-color: #584975 !important; box-shadow: 0 0 0 2px rgba(14, 99, 156, 0.3) !important; }
            [data-element-id="workspace-bar"] button span.hover\\:bg-white\\/20:hover,
            [data-element-id="workspace-bar"] button:hover span.text-white\\/70,
            [data-element-id="workspace-profile-button"]:hover { background-color: rgba(255,255,255,0.08) !important; }
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
        [data-element-id="chat-space-beginning-part"],
        [data-element-id="chat-space-middle-part"],
        [data-element-id="chat-space-end-part"] { /* Added chat-space-end-part */
            background-color: ${CONFIG.colors.background} !important;
        }
        [data-element-id="chat-space-beginning-part"] {
            border-bottom: 1px solid ${CONFIG.colors.border} !important;
        }
        /* Ensure general text within chat area uses theme color, excluding specific elements */
        [data-element-id="chat-space-middle-part"] .prose.max-w-full *:not(
            pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *,
            .text-xs.text-gray-500.truncate, .italic.truncate.hover\\:underline, h1, h2, h3, h4, h5, h6
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
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            margin-left: auto !important;
            margin-right: 0 !important;
            display: block !important;
            max-width: 70% !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            background-color: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.text} !important;
            padding: ${CONFIG.spacing.small} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
        }
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"],
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] > div {
            background-color: ${CONFIG.colors.input.background} !important;
        }
        /* Code block styling */
        [data-element-id="chat-space-middle-part"] pre { /* General pre styling */
             background-color: ${CONFIG.colors.input.background} !important; /* Darker background for code */
             color: ${CONFIG.colors.text} !important;
             border: 1px solid ${CONFIG.colors.border} !important;
             border-radius: ${CONFIG.borderRadius.small} !important;
             padding: ${CONFIG.spacing.small} !important;
             white-space: pre-wrap !important;
             word-wrap: break-word !important;
             margin: ${CONFIG.spacing.small} 0 !important;
        }
         [data-element-id="chat-space-middle-part"] code { /* General inline code styling */
             background-color: ${CONFIG.colors.input.background} !important;
             color: ${CONFIG.colors.text} !important;
             padding: 0.2em 0.4em !important;
             border-radius: 3px !important;
             font-size: 85% !important; /* Slightly smaller font for inline code */
         }
        [data-element-id="chat-space-middle-part"] pre code { /* Reset styles for code inside pre */
             background-color: transparent !important;
             padding: 0 !important;
             border-radius: 0 !important;
             font-size: inherit !important;
             color: inherit !important; /* Inherit color from pre */
         }
        /* Specific pre for code blocks with header */
        [data-element-id="chat-space-middle-part"] pre:has(div.relative) {
            background-color: ${CONFIG.colors.background} !important; /* Match main background */
            padding: 0 !important; /* Remove padding, handled by inner elements */
        }
        /* Sandbox output styling */
        [data-element-id="chat-space-middle-part"] pre.mb-2.overflow-auto.text-sm.border.border-gray-200.rounded.bg-gray-100 {
            background-color: #111 !important;
            color: #eee !important;
            border: none !important;
            padding: 8px !important;
            border-radius: 4px !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-x: hidden !important;
        }
        [data-element-id="chat-space-middle-part"] pre > div.relative { position: relative !important; }
        [data-element-id="chat-space-middle-part"] pre > div.relative > div.sticky { /* Header */
            position: sticky !important;
            top: 0 !important;
            z-index: 10 !important;
            background-color: ${CONFIG.colors.input.background} !important; /* Header background */
            color: ${CONFIG.colors.text} !important;
            border-radius: ${CONFIG.borderRadius.small} ${CONFIG.borderRadius.small} 0 0 !important;
            border-bottom: 1px solid ${CONFIG.colors.border} !important;
            padding: ${CONFIG.spacing.small} !important;
        }
        [data-element-id="chat-space-middle-part"] pre > div.relative > div > pre { /* Code within header block */
            border: none !important;
            background: transparent !important;
            margin: 0 !important;
            padding: ${CONFIG.spacing.small} !important; /* Add padding back */
            color: ${CONFIG.colors.text} !important;
        }
        [data-element-id="chat-space-middle-part"] [data-element-id="response-block"]:hover { background-color: transparent !important; }
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ul,
        [data-element-id="chat-space-middle-part"] .prose.max-w-full ol { margin: 0.5rem 0 !important; }
        [data-element-id="chat-space-middle-part"] .prose.max-w-full li { margin: 0.3rem 0 !important; }
        [data-element-id="chat-space-middle-part"] .prose.max-w-full li::marker {
            color: ${CONFIG.colors.text} !important;
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
    `;
    document.head.appendChild(mainStyle);

    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
        /* Input area specific styles */
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            border-radius: ${CONFIG.borderRadius.large};
            margin-bottom: ${CONFIG.spacing.medium};
            /* border-top: 1px solid ${CONFIG.colors.border}; */ /* Optional border */
        }
        #chat-input-textbox {
            min-height: 44px !important;
            padding: 0.75rem 1rem !important;
            border-radius: 1.5rem !important;
            color: ${CONFIG.colors.text} !important;
            background-color: ${CONFIG.colors.input.background} !important; /* Keep input distinct */
            border: 1px solid ${CONFIG.colors.border} !important; /* Add border to input */
            outline: none !important;
            margin: 8px 0 !important;
            overflow-wrap: break-word !important;
            tab-size: 4 !important;
            text-size-adjust: 100% !important;
            white-space: pre-wrap !important;
            font-variant-ligatures: none !important;
            -webkit-tap-highlight-color: transparent !important;
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
            background-color: rgba(255,255,255,0.1) !important; /* Adjusted hover for dark theme */
            border-radius: 0.5rem !important;
        }
        [data-element-id="chat-input-actions"] {
            padding: 0.5rem 0.75rem !important;
        }
        [data-element-id="send-button"],
        [data-element-id="more-options-button"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            border-color: ${CONFIG.colors.button.primary} !important;
            color: ${CONFIG.colors.background} !important; /* Ensure button text is visible */
        }
        [data-element-id="send-button"]:hover,
        [data-element-id="more-options-button"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
            border-color: ${CONFIG.colors.button.hover} !important;
            color: ${CONFIG.colors.background} !important; /* Ensure button text is visible on hover */
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
                    return `<pre style="background:${CONFIG.colors.background}; color:${CONFIG.colors.text}; border:1px solid ${CONFIG.colors.border}; padding:6px; border-radius:${CONFIG.borderRadius.small}; overflow-x:auto; margin:0;" class="code-block${lang ? ' language-' + lang : ''}"><code style="white-space:pre; display:block; overflow-wrap:normal; word-break:normal; color:inherit;">${code}</code></pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="background-color:${CONFIG.colors.input.background}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${inline}</code>`
            );
            res = res.replace(
                /&#039;([^&#]+)&#039;/g,
                (_, content) =>
                    `<code style="background-color:${CONFIG.colors.input.background}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${content}</code>`
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
                    `${open}<code style="background-color:${CONFIG.colors.input.background}; color:${CONFIG.colors.text}; padding:0.2em 0.4em; border-radius:3px;">${parsed}</code>${close}`
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
                    color: CONFIG.colors.text, // Ensure text color
                });
                const pre = codeEl.closest('pre');
                if (pre)
                    Object.assign(pre.style, {
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        backgroundColor: CONFIG.colors.background,
                        border: `1px solid ${CONFIG.colors.border}`,
                        borderRadius: CONFIG.borderRadius.small,
                        color: CONFIG.colors.text, // Ensure text color
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
                    background: '#000', // Keep sandbox output distinct
                    color: '#fff',      // Keep sandbox output distinct
                    padding: '8px',
                    borderRadius: '4px',
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

    console.log('typingmind-custom-with-sidebar.js: Loaded.');
})();
