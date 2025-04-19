(function () {
  // Dark‑theme configuration
  const CONFIG = {
    colors: {
      background: '#1E1E1E',        // Dark background
      text:       '#E0E0E0',        // Light text
      border:     '#333333',        // Dark border lines
      input: {
        background:  '#2E2E2E',     // Darker input fields
        text:        '#E0E0E0',     // Light input text
        placeholder: 'rgba(224,224,224,0.6)', // Muted placeholder
      },
      button: {
        primary: '#E0E0E0',         // Light buttons
        hover:   'rgba(224,224,224,0.8)', // Hover state
      },
    },
    spacing:      { small: '0.5rem', medium: '1rem', large: '1.5rem' },
    borderRadius: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
  };

  // Helpful selectors
  const SELECTORS = {
    CODE_BLOCKS:        'pre code',
    RESULT_BLOCKS:      'details pre',
    USER_MESSAGE_BLOCK: 'div[data-element-id="user-message"]',
    CHAT_SPACE:         '[data-element-id="chat-space-middle-part"]',
  };

  // Utility functions
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

  /* ---------------- Header Override ---------------- */
  const headerStyle = document.createElement('style');
  headerStyle.textContent = `
    /* Top bar behind logo, model picker, nav arrows, etc. */
    [data-element-id="workspace-content-bar"],
    [data-element-id="workspace-header"],
    header[role="banner"] {
      background-color: ${CONFIG.colors.background} !important;
      color:            ${CONFIG.colors.text}       !important;
    }
    /* Force logo/buttons SVG to light */
    [data-element-id="workspace-content-bar"] svg,
    [data-element-id="workspace-header"] svg {
      fill: ${CONFIG.colors.text} !important;
    }
  `;
  document.head.appendChild(headerStyle);

  /* ---------------- Sidebar Modifications ---------------- */
  if (!document.getElementById('typingmindSidebarFixMerged')) {
    const sidebarStyle = document.createElement('style');
    sidebarStyle.id = 'typingmindSidebarFixMerged';
    sidebarStyle.type = 'text/css';
    sidebarStyle.innerHTML = `
      /* Sidebar bg */
      [data-element-id="workspace-bar"],
      [data-element-id="side-bar-background"],
      [data-element-id="sidebar-beginning-part"],
      [data-element-id="sidebar-middle-part"] {
        background-color: ${CONFIG.colors.background} !important;
      }

      /* New‑chat button */
      [data-element-id="new-chat-button-in-side-bar"] {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.text} !important;
      }
      [data-element-id="new-chat-button-in-side-bar"] * {
        color: ${CONFIG.colors.text} !important;
      }

      /* Search chats input */
      [data-element-id="search-chats-bar"] {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.text} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
      }
      [data-element-id="search-chats-bar"]::placeholder {
        color: ${CONFIG.colors.input.placeholder} !important;
        opacity: 1 !important;
      }

      /* Sidebar text */
      [data-element-id="workspace-bar"] *,
      [data-element-id="side-bar-background"] * {
        color: ${CONFIG.colors.text} !important;
        opacity: 1 !important;
        --tw-text-opacity: 1 !important;
      }

      /* Chat list hover/selected */
      [data-element-id="custom-chat-item"]:hover,
      [data-element-id="selected-chat-item"] {
        background-color: ${CONFIG.colors.input.background} !important;
      }
      /* Hide default chat-item buttons */
      [data-element-id="custom-chat-item"] button[aria-label],
      [data-element-id="selected-chat-item"] button[aria-label] {
        display: none !important;
      }
      /* Show when expanded */
      [data-element-id="custom-chat-item"] button[aria-expanded="true"],
      [data-element-id="selected-chat-item"] button[aria-expanded="true"] {
        display: inline-block !important;
      }

      /* HeadlessUI menus */
      #headlessui-portal-root {
        display: block !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      #headlessui-portal-root [role="menu"] {
        background-color: ${CONFIG.colors.background} !important;
        color: ${CONFIG.colors.text} !important;
      }

      /* Tag‑search panel */
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
        background-color: ${CONFIG.colors.input.background} !important;
      }
      [data-element-id="tag-search-panel"] input[type="checkbox"]:checked {
        background-color: ${CONFIG.colors.button.primary} !important;
        border-color:     ${CONFIG.colors.button.primary} !important;
      }
      [data-element-id="tag-search-panel"] input[type="checkbox"]:checked::after {
        content: '' !important;
        position: absolute !important;
        left: 5px !important; top: 2px !important;
        width: 4px !important; height: 8px !important;
        border: solid ${CONFIG.colors.background} !important;
        border-width: 0 2px 2px 0 !important;
        transform: rotate(45deg) !important;
      }
      [data-element-id="tag-search-panel"] label,
      [data-element-id="tag-search-panel"] p,
      [data-element-id="tag-search-panel"] span,
      [data-element-id="tag-search-panel"] button {
        color: ${CONFIG.colors.text} !important;
      }
      [data-element-id="tag-search-panel"] .overflow-auto {
        scrollbar-width: thin !important;
        scrollbar-color: #4a4a4a #2e2e2e !important;
      }
      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar {
        width: 8px !important;
      }
      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-track {
        background: #2e2e2e !important;
      }
      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb {
        background: #4a4a4a !important;
      }
      [data-element-id="tag-search-panel"] .overflow-auto::-webkit-scrollbar-thumb:hover {
        background: #6a6a6a !important;
      }

      /* Sidebar textareas */
      [data-element-id="chat-folder"] textarea,
      [data-element-id="side-bar-background"] textarea {
        background-color: ${CONFIG.colors.input.background} !important;
        color: ${CONFIG.colors.text} !important;
        border: 1px solid ${CONFIG.colors.border} !important;
      }
      [data-element-id="chat-folder"] textarea:focus,
      [data-element-id="side-bar-background"] textarea:focus {
        border-color: ${CONFIG.colors.button.primary} !important;
        box-shadow: 0 0 0 2px rgba(224,224,224,0.2) !important;
      }

      /* Profile‑button hover */
      [data-element-id="workspace-bar"] button:hover span {
        background-color: rgba(255,255,255,0.1) !important;
      }
    `;
    document.head.appendChild(sidebarStyle);

    new MutationObserver(() => {
      if (!document.getElementById('typingmindSidebarFixMerged'))
        document.head.appendChild(sidebarStyle);
    }).observe(document.body, { childList: true, subtree: true });

    // Fix missing placeholder
    const fixSearchPlaceholder = () => {
      const input = document.querySelector('[data-element-id="search-chats-bar"]');
      if (input && !input.placeholder) input.setAttribute('placeholder', 'Search chats');
    };
    document.addEventListener('DOMContentLoaded', fixSearchPlaceholder);
    fixSearchPlaceholder();

    console.log('TypingMind Sidebar Mods (dark) loaded.');
  }

  /* ---------------- Main Chat & Messages ---------------- */
  const mainStyle = document.createElement('style');
  mainStyle.textContent = `
    /* Text color in chat */
    ${SELECTORS.CHAT_SPACE} .prose.max-w-full *,
    ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] {
      color: ${CONFIG.colors.text} !important;
    }

    /* Hide avatar on user messages */
    ${SELECTORS.CHAT_SPACE} [data-element-id="response-block"]:has([data-element-id="user-message"])
      [data-element-id="chat-avatar-container"] {
      display: none !important;
    }

    /* User bubble */
    ${SELECTORS.CHAT_SPACE} [data-element-id="user-message"] {
      margin-left: auto !important;
      max-width: 70% !important;
      border-radius: ${CONFIG.borderRadius.large} !important;
      background-color: ${CONFIG.colors.input.background} !important;
      padding: ${CONFIG.spacing.small} !important;
      margin-bottom: ${CONFIG.spacing.small} !important;
    }

    /* Code block backgrounds */
    ${SELECTORS.CHAT_SPACE} pre:has(div.relative) {
      background-color: ${CONFIG.colors.background} !important;
      border: 1px solid ${CONFIG.colors.border} !important;
      border-radius: ${CONFIG.borderRadius.small} !important;
    }
    /* Inline code & test blocks */
    ${SELECTORS.CHAT_SPACE} code {
      background-color: #2e2e2e !important;
      color: ${CONFIG.colors.text} !important;
      padding: 0.2em 0.4em !important;
      border-radius: 3px !important;
    }

    /* Lists & markers */
    ${SELECTORS.CHAT_SPACE} ul,
    ${SELECTORS.CHAT_SPACE} ol {
      margin: 0.5rem 0 !important;
    }
    ${SELECTORS.CHAT_SPACE} li {
      margin: 0.3rem 0 !important;
    }
    ${SELECTORS.CHAT_SPACE} li::marker {
      color: ${CONFIG.colors.text} !important;
      font-weight: bold !important;
    }
    ${SELECTORS.CHAT_SPACE} ul > li { list-style-type: disc !important; padding-left: 0.5rem !important; }
    ${SELECTORS.CHAT_SPACE} ol > li { list-style-type: decimal !important; padding-left: 0.5rem !important; }
  `;
  document.head.appendChild(mainStyle);

  /* ---------------- Input Area Styles ---------------- */
  const inputStyle = document.createElement('style');
  inputStyle.textContent = `
    /* Input container */
    [data-element-id="chat-space-end-part"] [role="presentation"] {
      background-color: ${CONFIG.colors.input.background} !important;
      border-radius: ${CONFIG.borderRadius.large} !important;
      margin-bottom: ${CONFIG.spacing.medium} !important;
    }

    /* Textbox */
    #chat-input-textbox {
      min-height: 44px !important;
      padding: 0.75rem 1rem !important;
      border-radius: 1.5rem !important;
      color: ${CONFIG.colors.text} !important;
      border: 0 solid ${CONFIG.colors.border} !important;
      margin: 8px 0 !important;
      white-space: pre-wrap !important;
      overflow-wrap: break-word !important;
    }
    #chat-input-textbox::placeholder {
      color: ${CONFIG.colors.input.placeholder} !important;
      opacity: 1 !important;
    }

    /* Action buttons */
    [data-element-id="chat-input-actions"] button:not([data-element-id="send-button"]):not([data-element-id="more-options-button"]) {
      color: ${CONFIG.colors.text} !important;
      transition: all 0.2s ease !important;
    }
    [data-element-id="chat-input-actions"] button:hover {
      background-color: rgba(255,255,255,0.1) !important;
      border-radius: 0.5rem !important;
    }

    /* Send/more buttons */
    [data-element-id="send-button"],
    [data-element-id="more-options-button"] {
      background-color: ${CONFIG.colors.button.primary} !important;
      border-color:     ${CONFIG.colors.button.primary} !important;
    }
    [data-element-id="send-button"]:hover,
    [data-element-id="more-options-button"]:hover {
      background-color: ${CONFIG.colors.button.hover} !important;
      border-color:     ${CONFIG.colors.button.hover} !important;
    }
  `;
  document.head.appendChild(inputStyle);

  /* ---------------- Text Parsing & Code Blocks ---------------- */
  const multiStepParse = txt =>
    Utils.safe(() => {
      let res = txt;
      res = res.replace(
        /```(\w+)?\s*([\s\S]*?)\s*```/g,
        (_, lang, code) => {
          const language = lang ? ' language-' + lang.toLowerCase() : '';
          return `<pre style="
            background:${CONFIG.colors.background};
            border:1px solid ${CONFIG.colors.border};
            padding:6px;
            border-radius:${CONFIG.borderRadius.small};
            overflow-x:auto;
            margin:0;
          " class="code-block${language}">
            <code style="white-space:pre;display:block;">${code}</code>
          </pre>`;
        }
      );
      res = res.replace(
        /`([^`]+)`/g,
        (_, inline) =>
          `<code style="
            background-color:#2e2e2e;
            color:${CONFIG.colors.text};
            padding:0.2em 0.4em;
            border-radius:3px;">
            ${inline}
          </code>`
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
          `${open}<code style="
            background-color:#2e2e2e;
            color:${CONFIG.colors.text};
            padding:0.2em 0.4em;
            border-radius:3px;
          ">${parsed}</code>${close}`
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
      if (container) container.innerHTML = processed;
      else msgEl.innerHTML = `<div>${processed}</div>`;
    }, 'styleUserMessageEl');

  const handleJsonCodeBlock = codeEl =>
    Utils.safe(() => {
      const content = codeEl.textContent.trim();
      if (!(content.startsWith('{') && content.endsWith('}') && content.includes('"code"')))
        return;
      try {
        const json = JSON.parse(content);
        if (typeof json.code !== 'string') return;
        const clean = json.code.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
        codeEl.textContent = clean;
        Object.assign(codeEl.style, {
          whiteSpace: 'pre-wrap',
          wordWrap:   'break-word',
        });
        const pre = codeEl.closest('pre');
        if (pre) {
          Object.assign(pre.style, {
            whiteSpace:     'pre-wrap',
            wordWrap:       'break-word',
            backgroundColor:${CONFIG.colors.background},
            border:         `1px solid ${CONFIG.colors.border}`,
            borderRadius:   CONFIG.borderRadius.small,
          });
        }
      } catch (e) {
        console.error('Error parsing JSON code block:', e);
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
          wordWrap:   'break-word',
          overflowX:  'hidden',
          background: '#000',
          color:      '#fff',
          padding:    '8px',
          borderRadius:'4px',
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
            if (msg.closest('.editing') || msg.hasAttribute('data-processed')) return;
            styleUserMessageEl(msg);
          });
        document
          .querySelectorAll(SELECTORS.CODE_BLOCKS)
          .forEach(code => {
            if (!code.closest('.editing')) handleJsonCodeBlock(code);
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
          (m.type === 'childList' && m.target.matches && m.target.matches(SELECTORS.USER_MESSAGE_BLOCK))
      )
    ) {
      setTimeout(improveTextDisplay, 0);
    }
  }).observe(document.body, {
    childList:     true,
    subtree:       true,
    attributes:    true,
    characterData: true,
  });

  console.log('typingmind-custom-dark-full.js: Loaded.');
})();
