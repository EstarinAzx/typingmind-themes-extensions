(function () {
    const CONFIG = {
        colors: {
            background: '#F6F3EE',    // Soft beige/cream background (from Anthropic)
            text: '#1A1A1A',          // Near black text
            mutedText: '#4D4D4D',     // Darker gray text for secondary content
            border: '#E0DCD4',        // Very light border color (from Anthropic)
            input: {
                background: '#FFFFFF', // White input background
                text: '#1A1A1A',       // Near black text
                placeholder: '#767676', // Medium gray for placeholder
            },
            button: {
                primary: '#E7E2DB',    // Light beige for buttons (from Anthropic)
                hover: '#DDD8D0',      // Slightly darker beige on hover
                text: '#1A1A1A',       // Near black text for buttons
            },
            accent: {
                primary: '#E8DBC5',    // Warm beige accent (your preference)
                secondary: '#D9CBB3',  // Slightly darker beige for hover states
                tertiary: '#F6F3EE',   // Light cream tertiary accent
            },
            panels: '#E8E4DD',         // Slightly darker cream for panels (from Anthropic)
        },
        spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
        borderRadius: { small: '0.25rem', medium: '0.5rem', large: '0.75rem' },
    };

    // Rest of your code...

    // Add this specific section to the globalFix style for the agents list
    globalFix.textContent += `
        /* Simplified agents list - focus on logos and text only */
        .agent-card, 
        .agent-list-item,
        [class*="agent-card"],
        [class*="agent-item"],
        [class*="agent-list-item"],
        [class*="ai-agent"],
        [data-element-id*="agent"] {
            background-color: transparent !important;
            color: ${CONFIG.colors.text} !important;
            border: none !important;
            box-shadow: none !important;
            padding: 6px !important;
            margin-bottom: 8px !important;
        }
        
        /* Logo/avatar styling */
        .agent-icon,
        .agent-image,
        .agent-avatar,
        .agent-card img,
        .agent-list-item img,
        [class*="agent-"] img,
        [id*="agent-"] img,
        [data-agent] img,
        .avatar-container img,
        [class*="ai-agent"] img {
            border-radius: ${CONFIG.borderRadius.small} !important;
            border: none !important;
            margin-right: 8px !important;
            width: 32px !important;
            height: 32px !important;
            object-fit: cover !important;
        }
        
        /* Agent names - make them stand out */
        .agent-title,
        .agent-name,
        .agent-card h3,
        .agent-card h4,
        .agent-list-item h3,
        .agent-list-item h4,
        [class*="agent-card"] h3,
        [class*="agent-card"] h4,
        [class*="agent-item"] h3,
        [class*="agent-item"] h4,
        [class*="agent-"] h3,
        [class*="agent-"] h4,
        [data-agent] h3,
        [data-agent] h4 {
            color: ${CONFIG.colors.text} !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important;
        }
        
        /* Agent descriptions - simpler and subtler */
        .agent-description,
        .agent-card p,
        .agent-list-item p,
        [class*="agent-card"] p,
        [class*="agent-item"] p,
        .agent-subtitle,
        .agent-meta,
        [class*="agent-"] p {
            color: ${CONFIG.colors.mutedText} !important;
            font-size: 0.85rem !important;
            margin-top: 0 !important;
        }
        
        /* Simple hover effect */
        .agent-card:hover,
        .agent-list-item:hover,
        [class*="agent-card"]:hover,
        [class*="agent-item"]:hover,
        [class*="agent-list-item"]:hover,
        [class*="ai-agent"]:hover {
            background-color: rgba(0,0,0,0.02) !important;
            border-radius: ${CONFIG.borderRadius.small} !important;
        }
        
        /* Make containing divs transparent */
        [id*="agents-list"],
        [class*="agents-list"],
        [class*="agent-list-container"],
        [id*="agent-list-container"],
        [data-element-id*="agent-list"],
        .agents-container,
        .agents-section,
        .agent-grid {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }
        
        /* Fix the agent section title */
        .agent-section-title,
        .agents-title,
        [class*="agent-section"] h2,
        [id*="agent-section"] h2,
        [class*="agent-list"] h2,
        [id*="agent-list"] h2 {
            color: ${CONFIG.colors.text} !important;
            font-weight: 600 !important;
            margin-bottom: 16px !important;
        }
        
        /* For any list-view specific styling */
        [class*="agent-list-view"],
        [id*="agent-list-view"] {
            background-color: transparent !important;
            display: flex !important;
            flex-direction: column !important;
        }
        
        /* Remove any dividers between agents */
        [class*="agent-list"] hr,
        [id*="agent-list"] hr,
        [class*="agent-divider"],
        [id*="agent-divider"] {
            display: none !important;
        }
    `;
    
    // Additional direct styling for agent elements
    document.addEventListener('DOMContentLoaded', function() {
        const applyAgentStyles = () => {
            document.querySelectorAll('[class*="agent-"], [id*="agent-"], [class*="ai-agent"]').forEach(el => {
                // Keep background transparent
                el.style.backgroundColor = 'transparent';
                el.style.borderColor = 'transparent';
                el.style.boxShadow = 'none';
                
                // Simple flex layout for logo and text
                if (!el.style.display || el.style.display !== 'grid') {
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                }
                
                // Fix text elements - simplify to just title and description
                const textElements = el.querySelectorAll('div:not(:has(img))');
                textElements.forEach(textEl => {
                    textEl.style.display = 'flex';
                    textEl.style.flexDirection = 'column';
                });
                
                // Style any images
                const images = el.querySelectorAll('img');
                images.forEach(img => {
                    img.style.width = '32px';
                    img.style.height = '32px';
                    img.style.borderRadius = CONFIG.borderRadius.small;
                    img.style.marginRight = '8px';
                });
            });
        };
        
        // Run immediately and also observe for changes
        applyAgentStyles();
        new MutationObserver(applyAgentStyles).observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    console.log('Minimalist theme applied with simplified agent list');
})();
