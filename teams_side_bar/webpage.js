/**
 * Proscris Button Extension
 * Customize the button name and target URL below:
 */

// ===== CUSTOMIZE HERE =====
const CUSTOM_BUTTON_NAME = 'Proscris';  // Change this to your desired button name
const CUSTOM_URL = 'https://example.com';  // Change this to your desired website URL
// =========================

(function() {
  // Configuration
  const CONFIG = {
    targetUrl: CUSTOM_URL,
    sidebarSelector: '[data-element-id="workspace-tab-teams"]',
    contentSelector: 'main.relative.flex.flex-col.overflow-y-auto'
  };

  // Debug logging
  const Debug = {
    log: function(area, message, data = null) {
      const log = `[${CUSTOM_BUTTON_NAME} Extension] [${area}] ${message}`;
      if (data) {
        console.log(log, data);
      } else {
        console.log(log);
      }
    }
  };

  // Create a container for our portal outside React's control
  function createPortalContainer() {
    const portalContainer = document.createElement('div');
    portalContainer.id = 'proscris-portal';
    document.body.appendChild(portalContainer);
    return portalContainer;
  }

  // Create the iframe content
  function createIframeContent() {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'fixed inset-0 z-50';
    
    const iframe = document.createElement('iframe');
    iframe.src = CONFIG.targetUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    containerDiv.appendChild(iframe);
    return containerDiv;
  }

  // Update button states without touching React's DOM
  function updateButtonStates(proscrisButton, active) {
    // Use a timeout to ensure React's updates are done
    setTimeout(() => {
      if (active) {
        // Deactivate other buttons
        document.querySelectorAll('span.bg-white\\/20').forEach(btn => {
          btn.classList.remove('bg-white/20');
          btn.classList.add('hover:bg-white/20');
          const textSpan = btn.querySelector('span:last-child');
          if (textSpan) {
            textSpan.parentElement.classList.remove('font-semibold');
            textSpan.parentElement.classList.add('font-normal');
          }
        });

        // Activate Proscris button
        const buttonSpan = proscrisButton.querySelector('span');
        if (buttonSpan) {
          buttonSpan.classList.remove('hover:bg-white/20');
          buttonSpan.classList.add('bg-white/20');
          const textSpan = buttonSpan.querySelector('span:last-child');
          if (textSpan) {
            textSpan.parentElement.classList.remove('font-normal');
            textSpan.parentElement.classList.add('font-semibold');
          }
        }
      }
    }, 0);
  }

  // Create the Proscris button
  function createProscrisButton() {
    Debug.log('Init', 'Creating Proscris button');
    const teamsButton = document.querySelector(CONFIG.sidebarSelector);
    if (!teamsButton) {
      Debug.log('Init', 'Teams button not found');
      return null;
    }

    const proscrisButton = teamsButton.cloneNode(true);
    Debug.log('Init', 'Teams button cloned');
    
    proscrisButton.removeAttribute('data-element-id');
    proscrisButton.setAttribute('data-proscris-button', 'true');
    
    const textSpan = proscrisButton.querySelector('span > span:last-child');
    if (textSpan) {
      textSpan.textContent = CUSTOM_BUTTON_NAME;
      Debug.log('Init', 'Button text updated');
    }

    let portalContainer = null;
    let isActive = false;

    // Handle clicks on any navigation element
    const handleNavigation = (e) => {
      const button = e.target.closest('[data-element-id]');
      if (button && isActive) {
        Debug.log('Navigation', 'Other button clicked, cleaning up portal');
        if (portalContainer) {
          portalContainer.innerHTML = '';
          isActive = false;
          updateButtonStates(proscrisButton, false);
        }
      }
    };

    // Add navigation listener
    document.addEventListener('click', handleNavigation, true);

    // Add click handler for Proscris button
    proscrisButton.addEventListener('click', (e) => {
      Debug.log('Click', 'Proscris button clicked');
      e.preventDefault();
      e.stopPropagation();

      if (!portalContainer) {
        portalContainer = createPortalContainer();
      }

      if (!isActive) {
        const content = createIframeContent();
        portalContainer.innerHTML = '';
        portalContainer.appendChild(content);
        isActive = true;
        updateButtonStates(proscrisButton, true);
        Debug.log('Content', 'Portal content added');
      } else {
        portalContainer.innerHTML = '';
        isActive = false;
        updateButtonStates(proscrisButton, false);
        Debug.log('Content', 'Portal content removed');
      }
    });

    return proscrisButton;
  }

  // Initialize
  function init() {
    Debug.log('Init', 'Starting initialization');
    const interval = setInterval(() => {
      const teamsButton = document.querySelector(CONFIG.sidebarSelector);
      if (teamsButton && !document.querySelector('[data-proscris-button]')) {
        Debug.log('Init', 'Teams button found, creating Proscris button');
        const proscrisButton = createProscrisButton();
        if (proscrisButton) {
          teamsButton.parentNode.insertBefore(proscrisButton, teamsButton.nextSibling);
          clearInterval(interval);
          Debug.log('Init', 'Initialization complete');
        }
      }
    }, 1000);
  }

  init();
})();
