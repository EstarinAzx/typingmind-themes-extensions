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

    // First, let's inject a style element with !important rules to override hover effects
    const mainStyle = document.createElement('style');
    mainStyle.id = 'typingmindUnderwaveTheme';
    mainStyle.textContent = `
        /* Base elements and backgrounds */
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
        
        /* Typography */
        body, html,
        p, div, span, li, a, button, input, textarea,
        .dark\\:text-white,
        .dark\\:text-gray-300,
        .dark\\:text-gray-400,
        .text-white,
        .text-gray-300,
        .text-gray-400,
        .dark .prose p {
            color: ${CONFIG.colors.text.primary} !important;
        }
        
        /* Heading styles */
        h1, h2, h3, h4, h5, h6,
        .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 {
            color: ${CONFIG.colors.text.highlight} !important;
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
        
        /* User messages */
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            background-color: ${CONFIG.colors.mediumAccent} !important;
            color: ${CONFIG.colors.text.highlight} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            box-shadow: 0 1px 3px ${CONFIG.colors.shadow} !important;
        }
        
        /* Code blocks */
        .dark pre,
        .dark .bg-gray-50,
        .dark [class*="bg-gray-"],
        pre, code,
        code span {
            background-color: ${CONFIG.colors.code.background} !important;
            color: ${CONFIG.colors.code.text} !important;
        }
        
        /* Input area */
        .dark .bg-gray-800,
        .bg-gray-800,
        .dark\\:bg-gray-800,
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: ${CONFIG.colors.panels} !important;
        }
        
        /* Buttons */
        .dark .bg-gray-800 button,
        [data-element-id="send-button"],
        [data-element-id="more-options-button"],
        .bg-blue-500,
        .bg-blue-600,
        .bg-blue-700,
        [class*="bg-blue-"],
        button[class*="bg-blue-"],
        a[class*="bg-blue-"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            color: ${CONFIG.colors.text.primary} !important;
        }
        
        /* Specific fix for ALL hover styles - we force our color rules */
        .hover\\:text-white:hover,
        .hover\\:text-gray-800:hover,
        .hover\\:text-black:hover,
        .dark\\:hover\\:text-white:hover,
        .dark\\:hover\\:text-gray-800:hover,
        .dark\\:hover\\:text-black:hover,
        [class*="hover\\:text-"]:hover,
        [class*="dark\\:hover\\:text-"]:hover,
        .hover\\:bg-white:hover,
        .hover\\:bg-gray-800:hover,
        .dark\\:hover\\:bg-white:hover,
        .dark\\:hover\\:bg-gray-800:hover,
        *:hover > span,
        *:hover > p,
        *:hover > div,
        span:hover,
        p:hover,
        div:hover,
        li:hover,
        a:hover { 
            color: ${CONFIG.colors.text.primary} !important; 
        }
        
        /* Strong & bold text */
        strong, b, 
        .dark strong, .dark b,
        strong:hover, b:hover,
        .dark strong:hover, .dark b:hover,
        *:hover strong, *:hover b {
            color: ${CONFIG.colors.text.highlight} !important;
        }
        
        /* Code text in any context */
        code, code *, pre *, 
        code:hover, code:hover *, pre:hover *,
        *:hover code, *:hover code *,
        *:hover pre * {
            color: ${CONFIG.colors.code.text} !important;
        }
        
        /* User message text */
        [data-element-id="user-message"] *, 
        [data-element-id="user-message"]:hover *,
        *:hover [data-element-id="user-message"] * {
            color: ${CONFIG.colors.text.highlight} !important;
        }
    `;
    document.head.appendChild(mainStyle);
    
    // Function to aggressively fix hover text colors
    function fixHoverTextColors() {
        // First, let's define our CSS rules
        const textFixStyles = `
            /* Extreme measures - force color via inline styles */
            [style*="color: rgb(255, 255, 255)"],
            [style*="color: white"],
            [style*="color:#fff"],
            [style*="color: #fff"],
            [style*="color:#ffffff"],
            [style*="color: #ffffff"] {
                color: ${CONFIG.colors.text.primary} !important;
            }
            
            /* Code elements */
            code[style*="color: rgb(255, 255, 255)"],
            code[style*="color: white"],
            pre[style*="color: rgb(255, 255, 255)"],
            pre[style*="color: white"] {
                color: ${CONFIG.colors.code.text} !important;
            }
            
            /* User message elements */
            [data-element-id="user-message"] [style*="color: rgb(255, 255, 255)"],
            [data-element-id="user-message"] [style*="color: white"] {
                color: ${CONFIG.colors.text.highlight} !important;
            }
        `;
        
        // Create a style element if it doesn't exist
        if (!document.getElementById('underwaveHoverFix')) {
            const hoverFixStyle = document.createElement('style');
            hoverFixStyle.id = 'underwaveHoverFix';
            hoverFixStyle.textContent = textFixStyles;
            document.head.appendChild(hoverFixStyle);
        }
        
        // Function to force text color on elements
        function forceTextColor(el) {
            // Skip buttons and interactive elements
            if (el.tagName === 'BUTTON' || el.hasAttribute('role') || 
                el.classList.contains('bg-blue-500') || 
                el.classList.contains('bg-blue-600') ||
                el.closest('[class*="bg-blue-"]')) {
                return;
            }
            
            // Get computed style
            const style = window.getComputedStyle(el);
            const color = style.color;
            
            // Check if color is white or close to white
            if (color.includes('rgb(255, 255, 255)') || 
                color === 'white' || 
                color === '#fff' || 
                color === '#ffffff') {
                
                // Determine appropriate color based on context
                if (el.closest('code') || el.closest('pre')) {
                    el.style.color = CONFIG.colors.code.text;
                } else if (el.closest('[data-element-id="user-message"]')) {
                    el.style.color = CONFIG.colors.text.highlight;
                } else if (el.tagName === 'STRONG' || el.tagName === 'B') {
                    el.style.color = CONFIG.colors.text.highlight;
                } else {
                    el.style.color = CONFIG.colors.text.primary;
                }
            }
        }
        
        // Apply fix to all text elements
        document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, a, strong, b, code').forEach(forceTextColor);
    }
    
    // Call the fix function immediately
    fixHoverTextColors();
    
    // Set up a MutationObserver to watch for changes
    const observer = new MutationObserver(mutations => {
        fixHoverTextColors();
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
    });
    
    // Also handle mouseover events to catch hover changes
    document.addEventListener('mouseover', function(e) {
        // Delay slightly to let the browser apply hover styles
        setTimeout(fixHoverTextColors, 10);
    }, true);
    
    // Also apply the fix on scroll (for lazy-loaded content)
    document.addEventListener('scroll', Utils.debounce(fixHoverTextColors, 100), true);
    
    // Create a full underwave theme interval check
    const fullThemeConfig = `
        /* ===== COMPLETE UNDERWAVE THEME ===== */
        body, html { background: ${CONFIG.colors.background} !important; color: ${CONFIG.colors.text.primary} !important; }
        
        /* Main layout */
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
        
        /* Text elements */
        p, div, span, h1, h2, h3, h4, h5, h6, li, a, button, input, textarea,
        .dark\\:text-white,
        .dark\\:text-gray-300,
        .dark\\:text-gray-400,
        .text-white,
        .text-gray-300,
        .text-gray-400,
        .prose p {
            color: ${CONFIG.colors.text.primary} !important;
        }
        
        /* Button styling */
        [data-element-id="new-chat-button-in-side-bar"] { 
            background-color: ${CONFIG.colors.button.primary} !important; 
            color: ${CONFIG.colors.text.primary} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
        }
        
        /* Search bar styling */
        [data-element-id="search-chats-bar"] { 
            background-color: ${CONFIG.colors.input.background} !important; 
            color: ${CONFIG.colors.input.text} !important; 
            border: 1px solid ${CONFIG.colors.border} !important; 
        }
        
        /* Selected items */
        [data-element-id="custom-chat-item"]:hover,
        [data-element-id="selected-chat-item"],
        .dark\\:hover\\:bg-gray-800:hover,
        .dark\\:bg-gray-800 { 
            background-color: ${CONFIG.colors.panels} !important; 
            border-left: 2px solid ${CONFIG.colors.lightAccent} !important;
        }
        
        /* User message bubbles */
        [data-element-id="chat-space-middle-part"] [data-element-id="user-message"] {
            background-color: ${CONFIG.colors.mediumAccent} !important;
            color: ${CONFIG.colors.text.highlight} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            box-shadow: 0 1px 3px ${CONFIG.colors.shadow} !important;
        }
        
        /* Code blocks */
        .dark pre,
        .dark .bg-gray-50,
        .dark [class*="bg-gray-"],
        pre, code {
            background-color: ${CONFIG.colors.code.background} !important;
            border: 1px solid ${CONFIG.colors.code.border} !important;
            box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
        }
        
        .dark pre code,
        .dark code,
        pre code, code {
            color: ${CONFIG.colors.code.text} !important;
        }
        
        /* Input area */
        .dark .bg-gray-800,
        .bg-gray-800,
        .dark\\:bg-gray-800,
        [data-element-id="chat-space-end-part"] [role="presentation"] {
            background-color: ${CONFIG.colors.panels} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
            box-shadow: 0 2px 6px ${CONFIG.colors.shadow} !important;
        }
        
        /* Input box */
        #chat-input-textbox {
            background-color: ${CONFIG.colors.input.background} !important;
            color: ${CONFIG.colors.text.primary} !important;
        }
        
        /* Buttons */
        .dark .bg-gray-800 button,
        [data-element-id="send-button"],
        [data-element-id="more-options-button"],
        .bg-blue-500,
        .bg-blue-600,
        .bg-blue-700,
        [class*="bg-blue-"],
        button[class*="bg-blue-"],
        a[class*="bg-blue-"] {
            background-color: ${CONFIG.colors.button.primary} !important;
            color: ${CONFIG.colors.text.primary} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
        }
        
        /* Profile icon */
        .rounded-full,
        .rounded-full.bg-blue-500,
        .rounded-full.bg-blue-600,
        [data-element-id="workspace-profile-button"] div {
            background: ${CONFIG.colors.lightAccent} !important;
            border: 1px solid ${CONFIG.colors.border} !important;
        }
    `;
    
    // Set up an interval to constantly check and reapply styles
    setInterval(() => {
        if (!document.getElementById('typingmindUnderwaveTheme')) {
            const mainStyle = document.createElement('style');
            mainStyle.id = 'typingmindUnderwaveTheme';
            mainStyle.textContent = fullThemeConfig;
            document.head.appendChild(mainStyle);
        }
        
        if (!document.getElementById('underwaveHoverFix')) {
            fixHoverTextColors();
        }
    }, 500);
    
    // Create a global style for the more specific hover issue
    const Utils = {
        debounce: (fn, delay) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn(...args), delay);
            };
        }
    };
    
    console.log('Underwave/Darkwave theme with super-aggressive hover text fix applied');
})();
