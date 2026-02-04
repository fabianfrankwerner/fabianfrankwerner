figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-favicons') {
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
      const svgString = String.fromCharCode.apply(null, Array.from(svgBytes));

      // 2. Send data to the UI to handle image generation and zipping
      figma.ui.postMessage({
        type: 'processing-start',
        svgString: svgString,
        name: node.name
      });

    } catch (error) {
      console.error(error);
      figma.notify("Error exporting selection.");
    }
  }
};