(function () {
    // Anthropics‑style Light Theme Configuration
    const CONFIG = {
        colors: {
            background: '#FFFFFF',          // pure white background
            text: '#1D1D1F',                // near-black text
            border: '#E0E0E0',              // light grey borders
            input: {
                background: '#F7F7F8',      // very light grey inputs
                text: '#1D1D1F',            // same near-black for input text
                placeholder: 'rgba(29,29,31,0.4)',
            },
            button: {
                primary: '#2563EB',         // calm blue accent
                hover: 'rgba(37,99,235,0.8)',
            },
        },
        spacing:    { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.25rem', medium: '0.5rem', large: '0.75rem' },
    };

    const SELECTORS = {
        CODE_BLOCKS:      'pre code',
        RESULT_BLOCKS:    'details pre',
        USER_MESSAGE:     'div[data-element-id="user-message"]',
        CHAT_AREA:        '[data-element-id="chat-space-middle-part"]',
    };

    const Utils = {
        debounce: (fn, ms) => {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn(...args), ms);
            };
        },
        safe: (fn, ctx = 'unknown') => {
            try { return fn(); }
            catch (e) {
                console.error(`Error in ${ctx}:`, e);
                return null;
            }
        },
        escapeHtml: s =>
            typeof s !== 'string' ? '' :
            s.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#039;'),
    };

    // Inject Light‑themed Sidebar and UI Styles
    if (!document.getElementById('anthropicLightUIDocs')) {
        const style = document.createElement('style');
        style.id = 'anthropicLightUIDocs';
        style.innerHTML = `
            body, [data-element-id="workspace-bar"],
            [data-element-id="side-bar-background"],
            [data-element-id="sidebar-beginning-part"],
            [data-element-id="sidebar-middle-part"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"],
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] {
                background-color: ${CONFIG.colors.input.background} !important;
            }
            [data-element-id="search-chats-bar"] {
                background: ${CONFIG.colors.input.background} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="search-chats-bar"]::placeholder {
                color: ${CONFIG.colors.placeholder} !important;
            }
            #headlessui-portal-root [role="menu"],
            #headlessui-portal-root [role="menuitem"] {
                background: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
            [data-element-id="tag-search-panel"] {
                background: ${CONFIG.colors.input.background} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
            }
            [data-element-id="tag-search-panel"] input,
            [data-element-id="tag-search-panel"] label,
            [data-element-id="tag-search-panel"] span,
            [data-element-id="tag-search-panel"] button {
                color: ${CONFIG.colors.text} !important;
            }
        `;
        document.head.appendChild(style);
        new MutationObserver(() => {
            if (!document.getElementById('anthropicLightUIDocs'))
                document.head.appendChild(style);
        }).observe(document.body, { childList: true, subtree: true });
    }

    // Main Chat & Code Block Styles
    const mainStyle = document.createElement('style');
    mainStyle.textContent = `
        ${SELECTORS.CHAT_AREA} {
            background: ${CONFIG.colors.background} !important;
        }
        ${SELECTORS.CHAT_AREA} [data-element-id="response-block"],
        ${SELECTORS.CHAT_AREA} ${SELECTORS.USER_MESSAGE} {
            color: ${CONFIG.colors.text} !important;
        }
        ${SELECTORS.CHAT_AREA} ${SELECTORS.USER_MESSAGE} {
            background: ${CONFIG.colors.input.background} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            padding: ${CONFIG.spacing.small} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
            max-width: 70% !important;
            margin-left: auto !important;
        }
        ${SELECTORS.CHAT_AREA} pre:has(div.relative) {
            background: ${CONFIG.colors.input.background} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
            overflow-x: auto !important;
        }
        ${SELECTORS.CHAT_AREA} pre > code {
            white-space: pre !important;
            display: block !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
        }
        ${SELECTORS.CHAT_AREA} ul, ${SELECTORS.CHAT_AREA} ol {
            margin: ${CONFIG.spacing.small} 0 !important;
        }
        ${SELECTORS.CHAT_AREA} li {
            margin: 0.25rem 0 !important;
        }
        ${SELECTORS.CHAT_AREA} li::marker {
            color: ${CONFIG.colors.text} !important;
            font-weight: bold !important;
        }
    `;
    document.head.appendChild(mainStyle);

    // Input Box & Button Styles
    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
        #chat-input-textbox {
            min-height: 44px !important;
            padding: 0.75rem 1rem !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            background: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.input.text} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            outline: none !important;
            white-space: pre-wrap !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
            opacity: 1 !important;
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
    document.head.appendChild(inputStyle);

    // Text Parsing & Code Handling
    const parseCode = text =>
        Utils.safe(() => {
            return text
                .replace(/```(\w+)?\s*([\s\S]*?)\s*```/g, (_, lang, code) =>
                    `<pre style="
                        background: ${CONFIG.colors.input.background};
                        border: 1px solid ${CONFIG.colors.border};
                        border-radius: ${CONFIG.borderRadius.small};
                        padding: 8px;
                        overflow-x: auto;
                        margin: 0;
                    " class="language-${lang || ''}"><code>${Utils.escapeHtml(code)}</code></pre>`
                )
                .replace(/`([^`]+)`/g, (_, inline) =>
                    `<code style="
                        background: ${CONFIG.colors.background};
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                        border: 1px solid ${CONFIG.colors.border};
                    ">${Utils.escapeHtml(inline)}</code>`
                );
        }, 'parseCode');

    const processMessage = txt =>
        Utils.safe(() => {
            let result = Utils.escapeHtml(txt);
            return parseCode(result);
        }, 'processMessage');

    const styleMessages = () => {
        document.querySelectorAll(SELECTORS.USER_MESSAGE).forEach(el => {
            if (el.hasAttribute('data-processed')) return;
            el.setAttribute('data-processed', 'true');
            const raw = el.textContent || '';
            if (/[<`]/.test(raw)) {
                const parsed = processMessage(raw);
                el.innerHTML = `<div>${parsed}</div>`;
            }
        });
    };

    // Observe for new chat content
    const debouncedStyle = Utils.debounce(styleMessages, 100);
    document.addEventListener('DOMContentLoaded', debouncedStyle);
    new MutationObserver(debouncedStyle).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    console.log('Anthropic‑style UI enhancements loaded.');
})();
