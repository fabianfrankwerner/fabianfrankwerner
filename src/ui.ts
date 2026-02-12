import JSZip from "jszip";
import "./ui.css";
import placeholder from "./placeholder.png";

interface AppState {
  selection: { name: string; svg: string } | null;
  settings: {
    websiteName: string;
    bgColor: string;
  };
  previewDarkMode: boolean;
}

function getDefaultBgColor(): string {
  const root = document.documentElement;
  if (root.classList.contains("figma-light")) return "#202020";
  if (root.classList.contains("figma-dark")) return "#e0e0e0";

  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const rgb = bodyBg.match(/\d+/g);
  if (rgb && rgb.length >= 3) {
    const brightness =
      (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
      1000;
    return brightness < 128 ? "#e0e0e0" : "#202020";
  }
  return "#808080";
}

const state: AppState = {
  selection: null,
  settings: {
    websiteName: "",
    bgColor: "",
  },
  previewDarkMode: false,
};

const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement;
const siteNameInput = document.getElementById("siteName") as HTMLInputElement;
const bgColorInput = document.getElementById("bgColor") as HTMLInputElement;
const toggleThemeBtn = document.getElementById(
  "togglePreviewTheme",
) as HTMLButtonElement;
const faviconImage = document.getElementById(
  "faviconImage",
) as HTMLImageElement;
const appIconImage = document.getElementById(
  "appIconImage",
) as HTMLImageElement;
const appIconContainer = document.querySelector(
  ".app-icon-container",
) as HTMLDivElement;
const tabTitle = document.getElementById("tabTitle") as HTMLSpanElement;
const mockupBrowser = document.getElementById(
  "mockupBrowser",
) as HTMLDivElement;

let previewTimeout: number | undefined;
let lastRenderId = 0;

function initThemeAwareDefaults() {
  const defaultBgColor = getDefaultBgColor();
  state.settings.bgColor = defaultBgColor;
  bgColorInput.value = defaultBgColor;
  syncPickerColorToCss();
  setPlaceholder();
}

requestAnimationFrame(() => {
  initThemeAwareDefaults();
  initTheme();
});

siteNameInput.oninput = () => {
  state.settings.websiteName = siteNameInput.value;
  tabTitle.innerText = state.settings.websiteName || "Stella";
};

function syncPickerColorToCss() {
  document.documentElement.style.setProperty(
    "--picker-color",
    state.settings.bgColor,
  );
}

bgColorInput.onchange = () => {
  state.settings.bgColor = bgColorInput.value;
  syncPickerColorToCss();
  updatePreview();
};

toggleThemeBtn.onclick = () => {
  state.previewDarkMode = !state.previewDarkMode;
  updatePreview();
};

exportBtn.onclick = async () => {
  if (!state.selection) return;
  exportBtn.disabled = true;
  try {
    await runExport();
  } catch (e) {
    console.error(e);
  } finally {
    exportBtn.disabled = false;
  }
};

window.onmessage = (event) => {
  const msg = event.data.pluginMessage;
  if (msg.type === "selection-response") {
    const { svgString, name } = msg;

    if (svgString) {
      state.selection = { name, svg: svgString };
      exportBtn.disabled = false;
      faviconImage.classList.remove("is-placeholder");
      appIconImage.classList.remove("is-placeholder");

      updatePreview(true);
    }
  }
};

function setPlaceholder() {
  faviconImage.src = placeholder;
  appIconImage.src = placeholder;
  faviconImage.classList.add("is-placeholder");
  appIconImage.classList.add("is-placeholder");
  appIconContainer.style.backgroundColor = state.settings.bgColor;
  mockupBrowser.style.backgroundColor = state.settings.bgColor;
}

async function updatePreview(immediate = false) {
  if (previewTimeout) {
    window.clearTimeout(previewTimeout);
    previewTimeout = undefined;
  }

  const renderId = ++lastRenderId;

  const render = async () => {
    if (!state.selection || renderId !== lastRenderId) return;

    mockupBrowser.classList.toggle("dark", state.previewDarkMode);
    toggleThemeBtn.classList.toggle("active", state.previewDarkMode);
    mockupBrowser.style.backgroundColor = state.settings.bgColor;
    appIconContainer.style.backgroundColor = state.settings.bgColor;

    try {
      const img = await svgToImage(state.selection.svg);

      if (renderId !== lastRenderId) return;

      const [smallUrl, largeUrl] = [
        renderToDataUrl(img, 32, 32),
        renderToDataUrl(img, 180, 180, 20, state.settings.bgColor),
      ];

      if (renderId !== lastRenderId) return;

      faviconImage.src = smallUrl;
      appIconImage.src = largeUrl;
    } catch (e) {
      console.error("Preview render failed:", e);
    }
  };

  if (immediate) {
    render();
  } else {
    previewTimeout = window.setTimeout(render, 50);
  }
}

async function runExport() {
  if (!state.selection) return;
  const zip = new JSZip();

  const img = await svgToImage(state.selection.svg);

  const [png32, apple, png192, png512] = await Promise.all([
    renderToBlob(img, 32, 32),
    renderToBlob(img, 180, 180, 20, state.settings.bgColor),
    renderToBlob(img, 192, 192),
    renderToBlob(img, 512, 512),
  ]);

  const ico = createIcoFromPng(await png32.arrayBuffer());
  zip.file("favicon.ico", ico);
  zip.file("icon.svg", state.selection.svg);
  zip.file("apple-touch-icon.png", apple);
  zip.file("icon-192.png", png192);
  zip.file("icon-512.png", png512);

  const snippet = `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
`;
  zip.file("favicon-links.txt", snippet);

  const manifest = {
    name: state.settings.websiteName || "Stella",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    theme_color: state.settings.bgColor,
    background_color: state.settings.bgColor,
    display: "standalone",
  };
  zip.file("manifest.webmanifest", JSON.stringify(manifest, null, 2));
  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "favicon-bundle.zip";
  link.click();
}

async function svgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load SVG image"));
    };

    img.src = url;
  });
}

function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
  padding = 0,
  bgColor: string | null = null,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  const drawSize = width - padding * 2;
  ctx.drawImage(img, padding, padding, drawSize, drawSize);
  return canvas;
}

function renderToDataUrl(
  img: HTMLImageElement,
  width: number,
  height: number,
  padding = 0,
  bgColor: string | null = null,
): string {
  const canvas = drawToCanvas(img, width, height, padding, bgColor);
  return canvas.toDataURL("image/png");
}

async function renderToBlob(
  img: HTMLImageElement,
  width: number,
  height: number,
  padding = 0,
  bgColor: string | null = null,
): Promise<Blob> {
  const canvas = drawToCanvas(img, width, height, padding, bgColor);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/png");
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

function initTheme() {
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  const rgb = bodyBg.match(/\d+/g);
  if (rgb) {
    const brightness =
      (parseInt(rgb[0]) * 299 +
        parseInt(rgb[1]) * 587 +
        parseInt(rgb[2]) * 114) /
      1000;
    if (brightness < 128) {
      state.previewDarkMode = true;
    }
  }
  updatePreview();
}
