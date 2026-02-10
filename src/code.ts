figma.showUI(__html__, { width: 400, height: 400, themeColors: true });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'request-selection') {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1) {
      figma.notify("Please select exactly one vector node (Frame, Component, or Vector).");
      return;
    }

    const node = selection[0];

    // Ensure it's something we can export
    if (!('exportAsync' in node)) {
      figma.notify("Selection is not exportable.");
      return;
    }

    try {
      // 1. Export as SVG (the source of truth)
      const svgBytes = await node.exportAsync({ format: 'SVG' });
      
      // Convert Uint8Array to String for passing to UI
      // Use a more compatible method than TextDecoder which might not be available in all environments
      let svgString = "";
      for (let i = 0; i < svgBytes.length; i++) {
        svgString += String.fromCharCode(svgBytes[i]);
      }

      // 2. Send data to the UI
      figma.ui.postMessage({
        type: 'selection-response',
        svgString: svgString,
        name: node.name,
        forMode: msg.for // 'light' or 'dark'
      });
      
      figma.notify(`Loaded selection: ${node.name}`);

    } catch (error) {
      console.error(error);
      figma.notify(`Error exporting selection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};