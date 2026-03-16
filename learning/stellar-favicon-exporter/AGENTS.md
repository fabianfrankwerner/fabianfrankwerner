# AGENTS.md - Developer Guidelines

This is a Figma plugin for exporting favicons. The plugin generates favicon.ico, apple-touch-icon.png, icon.svg, icon-192.png, icon-512.png, manifest.webmanifest, and an HTML snippet.

## Build Commands

```bash
npm install          # Install dependencies
npm run build        # Build the plugin (outputs to dist/)
npm run watch        # Watch mode for development
npm run format       # Format code with Prettier
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

There are **no tests** in this project.

## Project Structure

```
src/
├── code.ts      # Figma plugin sandbox code (runs in Figma context)
├── ui.ts        # Plugin UI code (runs in browser context)
├── ui.html      # HTML template for plugin UI
├── ui.css       # Styles for plugin UI
├── declarations.d.ts  # TypeScript declarations
└── stellar.png  # Placeholder image
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - all TypeScript strict checks are on
- Use explicit types for function parameters and return types
- Use `interface` for object shapes (see `AppState` in `ui.ts:5-12`)
- Use `null` rather than `undefined` where appropriate
- Use `string | null` for optional string values (see `ui.ts:237`)

### Naming Conventions

- **CamelCase** for functions, variables, and interfaces
- **PascalCase** for types and interfaces
- Prefix unused parameters with `_` (e.g., `_event` in event handlers)
- Use descriptive names: `svgString`, `faviconImage`, `previewTimeout`

### Imports

- Use default imports for libraries: `import JSZip from "jszip"`
- Use named imports for local files: `import "./ui.css"`
- Group imports: external libraries first, then local files

### Formatting

- Use Prettier for formatting (configured in `.prettierrc`)
- Multi-line function parameters: one param per line with trailing commas
- Object properties: multi-line with trailing commas
- Use template literals over string concatenation

### Error Handling

- Use try/catch blocks for async operations
- Always log errors with `console.error(e)`
- Use meaningful error messages: `new Error("Could not load SVG image.")`

### Code Patterns

**Event handlers:**

```typescript
element.onclick = () => {
  /* ... */
};
element.oninput = () => {
  /* ... */
};
```

**Async operations with loading state:**

```typescript
async function handler() {
  element.disabled = true;
  try {
    await doWork();
  } catch (e) {
    console.error(e);
  } finally {
    element.disabled = false;
  }
}
```

**Promise-based utilities:**

```typescript
async function utility(): Promise<ReturnType> {
  return new Promise((resolve, reject) => {
    // work
    if (success) resolve(result);
    else reject(new Error("message"));
  });
}
```

**Type guards:**

```typescript
if (!("exportAsync" in node)) {
  return;
}
```

### CSS

- Use BEM-like class naming with `--` for modifier states
- Use CSS custom properties for theming
- Prefix placeholder classes with `is-`

### Figma Plugin Specifics

- `code.ts` runs in Figma sandbox - use `figma.*` APIs
- `ui.ts` runs in browser - use standard DOM APIs
- Communication via `figma.ui.postMessage()` and `window.onmessage`
- Message type strings: `"selection-response"`, etc.
