figma.showUI(__html__, { width: 312, height: 108, themeColors: true });

async function handleSelection() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    return;
  }

  const node = selection[0];

  try {
    if (!("exportAsync" in node)) {
      return;
    }

    const svgBytes = await node.exportAsync({ format: "SVG" });

    let svgString = "";
    for (let i = 0; i < svgBytes.length; i++) {
      svgString += String.fromCharCode(svgBytes[i]);
    }

    figma.ui.postMessage({
      type: "selection-response",
      svgString: svgString,
      name: node.name,
    });
  } catch (e) {
    console.error(e)
  }
}

figma.on("selectionchange", handleSelection);
handleSelection();
