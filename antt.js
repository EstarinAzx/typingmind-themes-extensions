(function () {
    // Anthropics‑style light theme
    const CONFIG = {
        colors: {
            background: '#FFFFFF',            // pure white canvas
            text:       '#263238',            // Anthropic slate‑dark text
            border:     '#ECEFF1',            // light gray borders
            input: {
                background:  '#F0F4F8',       // very light blue‑gray
                text:        '#263238',       // same slate‑dark for contrast
                placeholder: '#78909C',       // muted slate placeholder
            },
            button: {
                primary: '#14ACF5',           // Anthropics blue accent
                hover:   'rgba(20,172,245,0.8)', // slightly translucent on hover
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
                      .replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')
                      .replace(/'/g, '&#039;'),
    };

    /* ---------------- Sidebar Modifications ---------------- */
    if (!document.getElementById('anthropicSidebarTheme')) {
        const sidebarStyle = document.createElement('style');
        sidebarStyle.id = 'anthropicSidebarTheme';
        sidebarStyle.type = 'text/css';
        sidebarStyle.innerHTML = `
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
            [data-element-id="search-chats-bar"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
            }
            [data-element-id="search-chats-bar"]::placeholder {
                color: ${CONFIG.colors.input.placeholder} !important;
                opacity: 1 !important;
            }
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] {
                background-color: ${CONFIG.colors.input.background} !important;
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
            [data-element-id="tag-search-panel"] input[type="checkbox"]:checked {
                background-color: ${CONFIG.colors.button.primary} !important;
                border-color: ${CONFIG.colors.button.primary} !important;
            }
        `;
        document.head.appendChild(sidebarStyle);

        new MutationObserver(() => {
            if (!document.getElementById('anthropicSidebarTheme'))
                document.head.appendChild(sidebarStyle);
        }).observe(document.body, { childList: true, subtree: true });
    }

    /* ---------------- Main Chat & Input Styles ---------------- */
    const mainStyle = document.createElement('style');
    mainStyle.textContent = `
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full *:not(
            pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *,
            .text-xs.text-gray-500.truncate, .italic.truncate.hover\\:underline,
            h1, h2, h3, h4, h5, h6
        ),
        ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] > div {
            color: ${CONFIG.colors.text} !important;
        }
        ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] {
            margin-left: auto !important;
            margin-right: 0 !important;
            max-width: 70% !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            background-color: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.text} !important;
            padding: ${CONFIG.spacing.small} !important;
            margin-bottom: ${CONFIG.spacing.small} !important;
        }
        ${SELECTORS.CHAT_SPACE} pre:has(div.relative) {
            background-color: ${CONFIG.colors.background} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
        }
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full ul,
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full ol {
            margin: 0.5rem 0 !important;
        }
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full li {
            margin: 0.3rem 0 !important;
        }
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full li::marker {
            color: ${CONFIG.colors.text} !important;
            font-weight: bold !important;
        }
    `;
    document.head.appendChild(mainStyle);

    const inputStyle = document.createElement('style');
    inputStyle.textContent = `
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: ${CONFIG.colors.input.background};
            border-radius: ${CONFIG.borderRadius.large};
            margin-bottom: ${CONFIG.spacing.medium};
        }
        #chat-input-textbox {
            min-height: 44px !important;
            padding: 0.75rem 1rem !important;
            border-radius: 1.5rem !important;
            color: ${CONFIG.colors.text} !important;
            border: 0 solid ${CONFIG.colors.border} !important;
            outline: none !important;
            margin: 8px 0 !important;
            white-space: pre-wrap !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
            opacity: 1 !important;
        }
        [data-element-id="send-button"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            border-color: ${CONFIG.colors.button.primary} !important;
        }
        [data-element-id="send-button"]:hover {
            background-color: ${CONFIG.colors.button.hover} !important;
            border-color: ${CONFIG.colors.button.hover} !important;
        }
    `;
    document.head.appendChild(inputStyle);

    /* ---------------- Content & Code Handling ---------------- */
    const multiStepParse = txt =>
        Utils.safe(() => {
            let res = txt;
            res = res.replace(
                /```(\w+)?\s*([\s\S]*?)\s*```/g,
                (_, lang, code) => {
                    lang = lang ? lang.toLowerCase() : '';
                    return `<pre style="
                        background: ${CONFIG.colors.background};
                        border: 1px solid ${CONFIG.colors.border};
                        padding: 6px;
                        border-radius: ${CONFIG.borderRadius.small};
                        overflow-x: auto;
                        margin: 0;
                    " class="code-block${lang ? ' language-' + lang : ''}">
                        <code style="white-space: pre; display: block; word-break: normal;">${code}</code>
                    </pre>`;
                }
            );
            res = res.replace(
                /`([^`]+)`/g,
                (_, inline) =>
                    `<code style="
                        background-color: #F5F5F5;
                        padding: 0.2em 0.4em;
                        border-radius: 3px;
                    ">${inline}</code>`
            );
            return res;
        }, 'multiStepParse');

    const processMessageContent = safeTxt =>
        Utils.safe(() => {
            return multiStepParse(safeTxt);
        }, 'processMessageContent');

    const styleUserMessageEl = msgEl =>
        Utils.safe(() => {
            msgEl.setAttribute('data-processed', 'true');
            const raw = msgEl.textContent || '';
            if (!/[<`]/.test(raw)) return;
            const safeText = Utils.escapeHtml(raw);
            const processed = processMessageContent(safeText);
            const container = msgEl.querySelector('div');
            if (container) {
                container.innerHTML = processed;
            } else {
                msgEl.innerHTML = `<div>${processed}</div>`;
            }
        }, 'styleUserMessageEl');

    const improveTextDisplay = Utils.debounce(
        () => {
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
            }, 'improveTextDisplay');
        },
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

    console.log('Anthropic‑style theme loaded.');
})();
