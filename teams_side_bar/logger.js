/**
 * DOM Logger for TypingMind Navigation
 * This script logs DOM changes during normal navigation
 */

(function() {
  const Logger = {
    log: function(area, message, data = null) {
      const log = `[Logger] [${area}] ${message}`;
      if (data) {
        console.log(log, data);
      } else {
        console.log(log);
      }
    }
  };

  // Log button clicks
  document.addEventListener('click', (e) => {
    const button = e.target.closest('[data-element-id]');
    if (button) {
      Logger.log('Click', 'Sidebar button clicked:', {
        buttonId: button.getAttribute('data-element-id'),
        classList: button.className,
        innerHTML: button.innerHTML.substring(0, 100)
      });
    }
  }, true);

  // Log main content changes
  const mainObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        Logger.log('Content', 'Main content changed:', {
          addedNodes: mutation.addedNodes.length,
          removedNodes: mutation.removedNodes.length,
          target: mutation.target.className
        });

        // Log details of added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            Logger.log('Content', 'Added node:', {
              tagName: node.tagName,
              className: node.className,
              children: node.children.length
            });
          }
        });

        // Log details of removed nodes
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            Logger.log('Content', 'Removed node:', {
              tagName: node.tagName,
              className: node.className,
              children: node.children.length
            });
          }
        });
      }
    });
  });

  // Log sidebar button state changes
  const buttonObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const button = mutation.target.closest('[data-element-id]');
        if (button) {
          Logger.log('Button', 'Button state changed:', {
            buttonId: button.getAttribute('data-element-id'),
            oldClass: mutation.oldValue,
            newClass: mutation.target.className
          });
        }
      }
    });
  });

  // Start observing once the main elements are available
  function init() {
    Logger.log('Init', 'Starting logger');

    // Observe main content
    const mainContent = document.querySelector('main.relative.flex.flex-col.overflow-y-auto');
    if (mainContent) {
      mainObserver.observe(mainContent, {
        childList: true,
        subtree: true,
        attributes: true
      });
      Logger.log('Init', 'Main content observer started');
    }

    // Observe sidebar
    const sidebar = document.querySelector('.z-\\[60\\]');
    if (sidebar) {
      buttonObserver.observe(sidebar, {
        attributes: true,
        attributeOldValue: true,
        subtree: true,
        attributeFilter: ['class']
      });
      Logger.log('Init', 'Sidebar observer started');
    }

    // Log initial state
    Logger.log('Init', 'Initial main content:', {
      mainContent: mainContent ? mainContent.innerHTML.substring(0, 100) : null
    });

    Logger.log('Init', 'Initial sidebar buttons:', {
      buttons: Array.from(document.querySelectorAll('[data-element-id]')).map(btn => ({
        id: btn.getAttribute('data-element-id'),
        className: btn.className
      }))
    });
  }

  // Initialize after a short delay to ensure page is loaded
  setTimeout(init, 1000);
})(); 