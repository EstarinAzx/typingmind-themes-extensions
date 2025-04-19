(function () {
    // Softer Anthropic‑style theme
    const CONFIG = {
        colors: {
            background: '#F4F6F8',            // off‑white, less glaring
            text:       '#2E3A46',            // slightly warmer slate
            border:     '#D1D9E0',            // gentle gray borders
            input: {
                background:  '#E9ECEF',       // muted light gray
                text:        '#2E3A46',       // match content text
                placeholder: '#A0AAB5',       // softer placeholder
            },
            button: {
                primary: '#0A74DA',           // deeper blue accent
                hover:   'rgba(10,116,218,0.8)', // translucent hover
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
                : str.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&#039;'),
    };

    /* Sidebar */
    if (!document.getElementById('softAnthropicSidebar')) {
        const s = document.createElement('style');
        s.id = 'softAnthropicSidebar';
        s.innerHTML = `
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
                background: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
                border: 1px solid ${CONFIG.colors.border} !important;
            }
            [data-element-id="search-chats-bar"]::placeholder {
                color: ${CONFIG.colors.input.placeholder} !important;
            }
            [data-element-id="custom-chat-item"]:hover,
            [data-element-id="selected-chat-item"] {
                background-color: ${CONFIG.colors.input.background} !important;
            }
            #headlessui-portal-root [role="menu"] {
                background-color: ${CONFIG.colors.background} !important;
                color: ${CONFIG.colors.text} !important;
            }
        `;
        document.head.appendChild(s);
        new MutationObserver(() => {
            if (!document.getElementById('softAnthropicSidebar'))
                document.head.appendChild(s);
        }).observe(document.body, { childList: true, subtree: true });
    }

    /* Main & Input */
    const mainStyle = document.createElement('style');
    mainStyle.textContent = `
        ${SELECTORS.CHAT_SPACE} {
            background-color: ${CONFIG.colors.background} !important;
        }
        ${SELECTORS.CHAT_SPACE} .prose.max-w-full *:not(
            pre, pre *, code, code *, .flex.items-start.justify-center.flex-col.gap-2 *,
            .text-xs.text-gray-500.truncate, .italic.truncate.hover\\:underline, h1,h2,h3,h4,h5,h6
        ),
        ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] > div {
            color: ${CONFIG.colors.text} !important;
        }
        ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] {
            background-color: ${CONFIG.colors.input.background} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
            padding: ${CONFIG.spacing.small} !important;
            color: ${CONFIG.colors.text} !important;
        }
        ${SELECTORS.CHAT_SPACE} pre:has(div.relative) {
            background: ${CONFIG.colors.background} !important;
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
        #chat-input-textbox {
            background: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.text} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            border-radius: ${CONFIG.borderRadius.large} !important;
        }
        #chat-input-textbox::placeholder {
            color: ${CONFIG.colors.input.placeholder} !important;
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

    /* Minimal code‑block styling */
    const multiStepParse = txt =>
        Utils.safe(() =>
            txt.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_,lang,code)=>`
                <pre style="
                    background:${CONFIG.colors.background};
                    border:1px solid ${CONFIG.colors.border};
                    padding:6px;
                    border-radius:${CONFIG.borderRadius.small};
                    overflow-x:auto;
                " class="language-${lang||''}"><code>${code}</code></pre>
            `)
        , 'multiStepParse');

    const styleUser = msgEl =>
        Utils.safe(()=>{
            msgEl.setAttribute('data-processed','true');
            const raw=msgEl.textContent||'';
            if(!/[<`]/.test(raw))return;
            const safe=Utils.escapeHtml(raw);
            msgEl.innerHTML=`<div>${multiStepParse(safe)}</div>`;
        },'styleUser');

    const update = Utils.debounce(()=>{
        document.querySelectorAll(SELECTORS.USER_MESSAGE_BLOCK)
            .forEach(el=>{
                if(el.hasAttribute('data-processed')||el.closest('.editing'))return;
                styleUser(el);
            });
    },100);

    document.addEventListener('DOMContentLoaded', update);
    new MutationObserver(muts=>{
        if(muts.some(m=>m.addedNodes.length||m.type==='characterData'))
            setTimeout(update,0);
    }).observe(document.body,{childList:true,subtree:true,characterData:true});

    console.log('Soft Anthropic theme loaded.');
})();
