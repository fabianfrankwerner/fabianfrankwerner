import JSZip from 'jszip';
import './ui.css';

// --- State ---
interface AppState {
    isPro: boolean;
    lightSelection: { name: string, svg: string } | null;
    darkSelection: { name: string, svg: string } | null;
    settings: {
        websiteName: string;
        themeColor: string;
        bgColor: string;
    };
    previewDarkMode: boolean;
}

const state: AppState = {
    isPro: false,
    lightSelection: null,
    darkSelection: null,
    settings: {
        websiteName: 'My Website',
        themeColor: '#ffffff',
        bgColor: '#ffffff'
    },
    previewDarkMode: false
};

// --- Elements ---
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;
const proModeToggle = document.getElementById('proModeToggle') as HTMLInputElement;
const proFields = document.getElementById('proFields') as HTMLDivElement;
const selectionNameFn = document.getElementById('selectionName') as HTMLSpanElement;
const darkModeSelectionName = document.getElementById('darkModeSelectionName') as HTMLSpanElement;
const refreshBtn = document.getElementById('refreshSelection') as HTMLButtonElement;
const selectDarkModeBtn = document.getElementById('selectDarkModeBtn') as HTMLButtonElement;

// Inputs
const websiteNameInput = document.getElementById('websiteName') as HTMLInputElement;
const themeColorInput = document.getElementById('themeColor') as HTMLInputElement;
const bgColorInput = document.getElementById('bgColor') as HTMLInputElement;

// Previews
const previewContainer = document.getElementById('previewContainer') as HTMLDivElement;
const previewFavicon = document.getElementById('previewFavicon') as HTMLImageElement;
const previewAppIcon = document.getElementById('previewAppIcon') as HTMLImageElement;
const previewAppName = document.getElementById('previewAppName') as HTMLSpanElement;
const previewTabTitle = document.getElementById('previewTabTitle') as HTMLSpanElement;
const mockupBrowserContainer = document.getElementById('mockupBrowserContainer') as HTMLDivElement;
const mockupBrowserTab = document.getElementById('mockupBrowserTab') as HTMLDivElement;

const previewThemeToggleContainer = document.getElementById('previewThemeToggleContainer') as HTMLDivElement;
const previewThemeToggle = document.getElementById('previewThemeToggle') as HTMLInputElement;

// HTML Code Section
const htmlCodeSection = document.getElementById('htmlCodeSection') as HTMLDivElement;
const htmlCodeDisplay = document.getElementById('htmlCodeDisplay') as HTMLPreElement;
const copyHtmlBtn = document.getElementById('copyHtmlBtn') as HTMLButtonElement;


// --- Event Listeners ---

proModeToggle.onchange = () => {
    state.isPro = proModeToggle.checked;
    if (state.isPro) {
        proFields.classList.remove('hidden');
        generateBtn.innerText = "Export Pro Bundle";
        updatePreview();
    } else {
        proFields.classList.add('hidden');
        htmlCodeSection.classList.add('hidden');
        generateBtn.innerText = "Export Favicon.ico";
    }
};

previewThemeToggle.onchange = () => {
    state.previewDarkMode = previewThemeToggle.checked;
    updatePreview();
};

refreshBtn.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'request-selection', for: 'light' } }, '*');
};

selectDarkModeBtn.onclick = () => {
    parent.postMessage({ pluginMessage: { type: 'request-selection', for: 'dark' } }, '*');
};

websiteNameInput.oninput = (e: Event) => {
    state.settings.websiteName = (e.target as HTMLInputElement).value;
    previewAppName.innerText = state.settings.websiteName || 'App';
    if (previewTabTitle) previewTabTitle.innerText = state.settings.websiteName || 'New Tab';
};

themeColorInput.onchange = (e: Event) => {
    state.settings.themeColor = (e.target as HTMLInputElement).value;
};

bgColorInput.onchange = (e: Event) => {
    state.settings.bgColor = (e.target as HTMLInputElement).value;
    updatePreview(); 
};

copyHtmlBtn.onclick = () => {
    const text = htmlCodeDisplay.innerText;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    
    const originalText = copyHtmlBtn.innerText;
    copyHtmlBtn.innerText = "Copied!";
    setTimeout(() => copyHtmlBtn.innerText = originalText, 2000);
};

generateBtn.onclick = async () => {
    if (!state.lightSelection) return;

    statusDiv.innerText = "Generating...";
    generateBtn.disabled = true;

    try {
        await generateExport();
        statusDiv.innerText = "Done! Download started.";
    } catch (e) {
        console.error(e);
        statusDiv.innerText = "Error generating files.";
    } finally {
        generateBtn.disabled = false;
    }
};

// --- Messaging ---

window.onmessage = async (event: MessageEvent) => {
    const msg = event.data.pluginMessage;
    if (!msg) return;

    if (msg.type === 'selection-response') {
        const { svgString, name, forMode } = msg;

        if (forMode === 'dark') {
            state.darkSelection = { name, svg: svgString };
            darkModeSelectionName.innerText = name;
        } else {
            // Default to light/main
            state.lightSelection = { name, svg: svgString };
            selectionNameFn.innerText = name;
        }
        
        // Always update preview to reflect potential changes
        updatePreview();
        validateState();
    }
};

// --- Helpers ---

function validateState() {
    if (state.lightSelection) {
        generateBtn.disabled = false;
        statusDiv.innerText = "Ready to export.";
    } else {
        generateBtn.disabled = true;
        statusDiv.innerText = "Select a frame to begin.";
    }
}

async function updatePreview() {
    if (!state.lightSelection) return;

    // Show/Hide Dark Mode Toggle based on availability
    if (state.darkSelection) {
        previewThemeToggleContainer.style.display = 'flex';
    } else {
        previewThemeToggleContainer.style.display = 'none';
        state.previewDarkMode = false; // Reset if no dark selection
        previewThemeToggle.checked = false;
    }

    // Determine which SVG to show in the browser tab
    let browserFaviconSvg = state.lightSelection.svg;
    if (state.previewDarkMode && state.darkSelection) {
        browserFaviconSvg = state.darkSelection.svg;
        mockupBrowserContainer.classList.add('dark');
        mockupBrowserTab.classList.add('dark');
    } else {
        mockupBrowserContainer.classList.remove('dark');
        mockupBrowserTab.classList.remove('dark');
    }
    
    // Create a data URL for the preview
    const smallUrl = await svgToPngDataUrl(browserFaviconSvg, 32, 32);
    previewFavicon.src = smallUrl;

    // 180x180 for App Icon (Always uses light/main selection + bg color)
    const bg = state.isPro ? state.settings.bgColor : null;
    const largeUrl = await svgToPngDataUrl(state.lightSelection.svg, 180, 180, 20, bg);
    previewAppIcon.src = largeUrl;

    if (state.isPro) {
        previewContainer.classList.add('visible');
    }
}

async function svgToPngDataUrl(svgString: string, width: number, height: number, padding = 0, bgColor: string | null = null): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No context');

            if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
            }
            
            const drawSize = width - (padding * 2);
            ctx.drawImage(img, padding, padding, drawSize, drawSize); 
            
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = url;
    });
}

async function renderPNG(svgString: string, width: number, height: number, padding = 0, bgColor: string | null = null): Promise<Blob> {
     return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No context');

            if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, width, height);
            }
            
            const drawSize = width - (padding * 2);
            ctx.drawImage(img, padding, padding, drawSize, drawSize);
            
            canvas.toBlob((blob: Blob | null) => {
                URL.revokeObjectURL(url);
                if (blob) resolve(blob);
                else reject('Canvas to blob failed');
            }, 'image/png');
        };
        img.onerror = reject;
        img.src = url;
    });
}

function createIcoFromPng(pngBuffer: ArrayBuffer) {
      const header = new Uint8Array([0, 0, 1, 0, 1, 0]); 
      const entry = new Uint8Array(16);
      const view = new DataView(entry.buffer);
      view.setUint8(0, 32); 
      view.setUint8(1, 32); 
      view.setUint8(2, 0);  
      view.setUint8(3, 0);  
      view.setUint16(4, 1, true); 
      view.setUint16(6, 32, true); 
      view.setUint32(8, pngBuffer.byteLength, true); 
      view.setUint32(12, 22, true); 

      const ico = new Uint8Array(22 + pngBuffer.byteLength);
      ico.set(header, 0);
      ico.set(entry, 6);
      ico.set(new Uint8Array(pngBuffer), 22);
      return ico;
}

// --- Generator ---

async function generateExport() {
    if (!state.lightSelection) return;

    // 1. Generate the .ico logic
    const png32Blob = await renderPNG(state.lightSelection.svg, 32, 32);
    const png32Buffer = await png32Blob.arrayBuffer();
    const icoBuffer = createIcoFromPng(png32Buffer);

    // Casual Mode: Download .ico directly
    if (!state.isPro) {
        const icoBlob = new Blob([icoBuffer], { type: 'image/x-icon' });
        triggerDownload(icoBlob, "favicon.ico");
        return;
    }

    // Pro Mode: Full Suite ZIP
    const zip = new JSZip();
    zip.file("favicon.ico", icoBuffer);
    zip.file("icon.svg", state.lightSelection.svg);

    if (state.darkSelection) {
        zip.file("icon-dark.svg", state.darkSelection.svg);
    }

    const appleBlob = await renderPNG(state.lightSelection.svg, 180, 180, 20, state.settings.bgColor);
    zip.file("apple-touch-icon.png", appleBlob);

    const icon192Blob = await renderPNG(state.lightSelection.svg, 192, 192);
    zip.file("icon-192.png", icon192Blob);

    const icon512Blob = await renderPNG(state.lightSelection.svg, 512, 512);
    zip.file("icon-512.png", icon512Blob);

    const manifest = {
        name: state.settings.websiteName,
        short_name: state.settings.websiteName,
        icons: [
            { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
            { src: "/icon-512.png", type: "image/png", sizes: "512x512" }
        ],
        theme_color: state.settings.themeColor,
        background_color: state.settings.bgColor,
        display: "standalone"
    };
    zip.file("manifest.webmanifest", JSON.stringify(manifest, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    triggerDownload(content, "favicon-pro.zip");

    // Show HTML Code
    let htmlSnippet = `<link rel="icon" href="/favicon.ico" sizes="any">\n`;
    htmlSnippet += `<link rel="icon" href="/icon.svg" type="image/svg+xml">\n`;
    if (state.darkSelection) {
        htmlSnippet += `<link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">\n`;
    }
    htmlSnippet += `<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n`;
    htmlSnippet += `<link rel="manifest" href="/manifest.webmanifest">`;
    
    htmlCodeDisplay.innerText = htmlSnippet;
    htmlCodeSection.classList.remove('hidden');
}

function triggerDownload(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Initial fetch
parent.postMessage({ pluginMessage: { type: 'request-selection', for: 'light' } }, '*');