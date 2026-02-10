figma.showUI(__html__, { width: 320, height: 500, themeColors: true });

async function handleSelection() {
  const selection = figma.currentPage.selection;
  
  if (selection.length !== 1) {
    figma.ui.postMessage({
      type: 'selection-response',
      svgString: null,
      name: null
    });
    return;
  }

  const node = selection[0];
  
  if (!('exportAsync' in node)) {
    figma.ui.postMessage({
      type: 'selection-response',
      svgString: null,
      name: null
    });
    return;
  }

  try {
    const svgBytes = await node.exportAsync({ format: 'SVG' });
    let svgString = "";
    for (let i = 0; i < svgBytes.length; i++) {
      svgString += String.fromCharCode(svgBytes[i]);
    }

    figma.ui.postMessage({
      type: 'selection-response',
      svgString: svgString,
      name: node.name
    });
    
  } catch (error) {
    console.error(error);
  }
}

figma.on('selectionchange', handleSelection);
handleSelection();