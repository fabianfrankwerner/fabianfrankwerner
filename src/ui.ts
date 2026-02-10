import JSZip from 'jszip';
import './ui.css';

// --- State ---
interface AppState {
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
const darkModeSelectionName = document.getElementById('darkModeSelectionName') as HTMLSpanElement;
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

previewThemeToggle.onchange = () => {
    state.previewDarkMode = previewThemeToggle.checked;
    updatePreview();
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

        // Handle case where selection was cleared/invalid
        if (svgString === null && forMode === 'light') {
            state.lightSelection = null;
            validateState();
            return;
        }

        if (forMode === 'dark') {
            if (svgString) {
                state.darkSelection = { name, svg: svgString };
                darkModeSelectionName.innerText = name;
            } else {
               // Optional: Handle if user tries to select nothing for dark mode?
               // For now, assume if they clicked the button, they expect a selection.
            }
        } else {
            // Default to light/main
            state.lightSelection = { name, svg: svgString };
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
        // Ensure preview is visible if selection exists
        previewContainer.classList.add('visible');
    } else {
        generateBtn.disabled = true;
        statusDiv.innerText = "Select a frame to begin.";
        // Optionally hide preview or show placeholder state
    }
}

async function updatePreview() {
    if (!state.lightSelection) return;

    // Logic: 
    // If Dark Mode Icon is set, we can toggle between Light Icon (Light Mode) and Dark Icon (Dark Mode).
    // If NO Dark Mode Icon is set, we can still toggle the Browser Theme (Light/Dark), but the icon remains the Light Icon.
    
    // Determine which SVG to show in the browser tab
    let browserFaviconSvg = state.lightSelection.svg;
    
    // If preview is in dark mode AND we have a specific dark selection, use it.
    if (state.previewDarkMode && state.darkSelection) {
        browserFaviconSvg = state.darkSelection.svg;
    }

    if (state.previewDarkMode) {
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
    const largeUrl = await svgToPngDataUrl(state.lightSelection.svg, 180, 180, 20, state.settings.bgColor);
    previewAppIcon.src = largeUrl;
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

    // Full Suite ZIP
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
    triggerDownload(content, "favicon-bundle.zip");

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

// Check for current theme to set initial preview state
function initTheme() {
    // Basic detection based on body class or computed style if Figma injects it.
    // Figma usually injects 'figma-dark' or similar classes, or we can check a CSS variable.
    // Let's check the background color of the body.
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    // Simple heuristic: if it's dark, we assume dark mode.
    // rgb(30, 30, 30) etc.
    const rgb = bodyBg.match(/\d+/g);
    if (rgb) {
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        if (brightness < 128) {
             state.previewDarkMode = true;
             previewThemeToggle.checked = true;
        }
    }
}

initTheme();
// Note: Selection is auto-fetched by the plugin code sending an event on startup.
