figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

async function handleSelection(forMode = 'light') {
  const selection = figma.currentPage.selection;
  
  if (selection.length !== 1) {
    figma.ui.postMessage({
      type: 'selection-response',
      svgString: null,
      name: null,
      forMode: forMode
    });
    return;
  }

  const node = selection[0];
  
  // Ensure it's something we can export
  if (!('exportAsync' in node)) {
    figma.ui.postMessage({
      type: 'selection-response',
      svgString: null,
      name: null,
      forMode: forMode
    });
    return;
  }

  try {
    // 1. Export as SVG (the source of truth)
    const svgBytes = await node.exportAsync({ format: 'SVG' });
    
    // Convert Uint8Array to String for passing to UI
    let svgString = "";
    for (let i = 0; i < svgBytes.length; i++) {
      svgString += String.fromCharCode(svgBytes[i]);
    }

    // 2. Send data to the UI
    figma.ui.postMessage({
      type: 'selection-response',
      svgString: svgString,
      name: node.name,
      forMode: forMode
    });
    
  } catch (error) {
    console.error(error);
  }
}

// Auto-fetch on selection change
figma.on('selectionchange', () => {
  handleSelection('light');
});

// Handle explicit requests (e.g., for Dark Mode selection)
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'request-selection') {
    handleSelection(msg.for);
  }
};

// Initial fetch
handleSelection('light');
