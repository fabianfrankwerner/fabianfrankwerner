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
}

const state: AppState = {
    isPro: false,
    lightSelection: null,
    darkSelection: null,
    settings: {
        websiteName: 'My Website',
        themeColor: '#ffffff',
        bgColor: '#ffffff'
    }
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


// --- Event Listeners ---

proModeToggle.onchange = () => {
    state.isPro = proModeToggle.checked;
    if (state.isPro) {
        proFields.classList.remove('hidden');
        generateBtn.innerText = "Export Pro Bundle";
        updatePreview();
    } else {
        proFields.classList.add('hidden');
        generateBtn.innerText = "Export Favicon.ico";
    }
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
};

themeColorInput.onchange = (e: Event) => {
    state.settings.themeColor = (e.target as HTMLInputElement).value;
};

bgColorInput.onchange = (e: Event) => {
    state.settings.bgColor = (e.target as HTMLInputElement).value;
    updatePreview(); 
};

generateBtn.onclick = async () => {
    if (!state.lightSelection) return;

    statusDiv.innerText = "Generating...";
    generateBtn.disabled = true;

    try {
        await generateZip();
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
            
            // Generate preview immediately
            updatePreview();
        }
        
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
    
    // Create a data URL for the preview
    const smallUrl = await svgToPngDataUrl(state.lightSelection.svg, 32, 32);
    previewFavicon.src = smallUrl;

    // 180x180 for App Icon
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

async function generateZip() {
    if (!state.lightSelection) return;

    const zip = new JSZip();

    // 1. Always generate favicon.ico (32x32)
    const png32Blob = await renderPNG(state.lightSelection.svg, 32, 32);
    const png32Buffer = await png32Blob.arrayBuffer();
    zip.file("favicon.ico", createIcoFromPng(png32Buffer));

    // Casual Mode: Stop here
    if (!state.isPro) {
        const content = await zip.generateAsync({ type: "blob" });
        triggerDownload(content, "favicon.zip");
        return;
    }

    // Pro Mode: Full Suite
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
}

function triggerDownload(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Initial fetch
parent.postMessage({ pluginMessage: { type: 'request-selection', for: 'light' } }, '*');