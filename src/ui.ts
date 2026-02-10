import JSZip from 'jszip';
import './ui.css';

interface AppState {
    selection: { name: string, svg: string } | null;
    settings: {
        websiteName: string;
        themeColor: string;
        bgColor: string;
    };
    previewDarkMode: boolean;
}

const state: AppState = {
    selection: null,
    settings: {
        websiteName: '',
        themeColor: '#ffffff',
        bgColor: '#ffffff'
    },
    previewDarkMode: false
};

// --- Elements ---
const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
const statusText = document.getElementById('status') as HTMLDivElement;
const siteNameInput = document.getElementById('siteName') as HTMLInputElement;
const themeColorInput = document.getElementById('themeColor') as HTMLInputElement;
const bgColorInput = document.getElementById('bgColor') as HTMLInputElement;
const toggleThemeBtn = document.getElementById('togglePreviewTheme') as HTMLButtonElement;

const faviconImage = document.getElementById('faviconImage') as HTMLImageElement;
const appIconImage = document.getElementById('appIconImage') as HTMLImageElement;
const tabTitle = document.getElementById('tabTitle') as HTMLSpanElement;
const mockupBrowser = document.getElementById('mockupBrowser') as HTMLDivElement;

const codeArea = document.getElementById('codeOutput') as HTMLDivElement;
const htmlCode = document.getElementById('htmlCode') as HTMLPreElement;
const copyBtn = document.getElementById('copyBtn') as HTMLButtonElement;

// --- Listeners ---

siteNameInput.oninput = () => {
    state.settings.websiteName = siteNameInput.value;
    tabTitle.innerText = state.settings.websiteName || 'New Tab';
};

themeColorInput.onchange = () => {
    state.settings.themeColor = themeColorInput.value;
};

bgColorInput.onchange = () => {
    state.settings.bgColor = bgColorInput.value;
    updatePreview();
};

toggleThemeBtn.onclick = () => {
    state.previewDarkMode = !state.previewDarkMode;
    updatePreview();
};

copyBtn.onclick = () => {
    const text = htmlCode.innerText;
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copyBtn.innerText = 'Copied';
    setTimeout(() => copyBtn.innerText = 'Copy', 2000);
};

exportBtn.onclick = async () => {
    if (!state.selection) return;
    exportBtn.disabled = true;
    statusText.innerText = 'Generating...';
    
    try {
        await runExport();
        statusText.innerText = 'Exported';
    } catch (e) {
        statusText.innerText = 'Error';
    } finally {
        exportBtn.disabled = false;
    }
};

// --- Messaging ---

window.onmessage = (event) => {
    const msg = event.data.pluginMessage;
    if (msg.type === 'selection-response') {
        const { svgString, name } = msg;
        if (!svgString) {
            state.selection = null;
            exportBtn.disabled = true;
            statusText.innerText = 'Select a frame';
            document.getElementById('previewArea')?.classList.remove('visible');
        } else {
            state.selection = { name, svg: svgString };
            exportBtn.disabled = false;
            statusText.innerText = 'Ready';
            document.getElementById('previewArea')?.classList.add('visible');
            updatePreview();
        }
    }
};

// --- Logic ---

async function updatePreview() {
    if (!state.selection) return;

    mockupBrowser.classList.toggle('dark', state.previewDarkMode);
    
    const smallUrl = await svgToPngDataUrl(state.selection.svg, 32, 32);
    faviconImage.src = smallUrl;

    const largeUrl = await svgToPngDataUrl(state.selection.svg, 180, 180, 20, state.settings.bgColor);
    appIconImage.src = largeUrl;
}

async function runExport() {
    if (!state.selection) return;

    const zip = new JSZip();
    
    // Ico
    const png32 = await renderPNG(state.selection.svg, 32, 32);
    const ico = createIcoFromPng(await png32.arrayBuffer());
    zip.file('favicon.ico', ico);
    
    // SVG
    zip.file('icon.svg', state.selection.svg);

    // Apple
    const apple = await renderPNG(state.selection.svg, 180, 180, 20, state.settings.bgColor);
    zip.file('apple-touch-icon.png', apple);

    // PWA
    zip.file('icon-192.png', await renderPNG(state.selection.svg, 192, 192));
    zip.file('icon-512.png', await renderPNG(state.selection.svg, 512, 512));

    const manifest = {
        name: state.settings.websiteName || 'App',
        icons: [
            { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
            { src: '/icon-512.png', type: 'image/png', sizes: '512x512' }
        ],
        theme_color: state.settings.themeColor,
        background_color: state.settings.bgColor,
        display: 'standalone'
    };
    zip.file('manifest.webmanifest', JSON.stringify(manifest, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'favicon-bundle.zip';
    link.click();

    // Show Code
    let code = `<link rel="icon" href="/favicon.ico" sizes="any">\n`;
    code += `<link rel="icon" href="/icon.svg" type="image/svg+xml">\n`;
    code += `<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n`;
    code += `<link rel="manifest" href="/manifest.webmanifest">`;
    htmlCode.innerText = code;
    codeArea.classList.remove('hidden');
}

// Re-use existing helper functions (svgToPngDataUrl, renderPNG, createIcoFromPng)
async function svgToPngDataUrl(svgString: string, width: number, height: number, padding = 0, bgColor: string | null = null): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject();
            if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); }
            const drawSize = width - (padding * 2);
            ctx.drawImage(img, padding, padding, drawSize, drawSize); 
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
        };
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
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject();
            if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, width, height); }
            const drawSize = width - (padding * 2);
            ctx.drawImage(img, padding, padding, drawSize, drawSize);
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                if (blob) resolve(blob); else reject();
            }, 'image/png');
        };
        img.src = url;
    });
}

function createIcoFromPng(pngBuffer: ArrayBuffer) {
    const header = new Uint8Array([0, 0, 1, 0, 1, 0]); 
    const entry = new Uint8Array(16);
    const view = new DataView(entry.buffer);
    view.setUint8(0, 32); view.setUint8(1, 32); view.setUint8(2, 0); view.setUint8(3, 0);  
    view.setUint16(4, 1, true); view.setUint16(6, 32, true); 
    view.setUint32(8, pngBuffer.byteLength, true); view.setUint32(12, 22, true); 
    const ico = new Uint8Array(22 + pngBuffer.byteLength);
    ico.set(header, 0); ico.set(entry, 6); ico.set(new Uint8Array(pngBuffer), 22);
    return ico;
}