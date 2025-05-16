Thought for a couple of seconds

```markdown
# React Floating Modals 🪟✨
A **zero-dependency**, batteries-included window system for React 18+.  
Drag any window by any element, spawn unlimited instances, and let the provider keep the stack in order—all fully typed.

* **Pointer-Events drag** – smooth on mouse, touch & pen.
* **Headless styling** – bring your own CSS or Tailwind; nothing is hard-coded.
* **Window manager** – one context handles z-index and cleanup.
* **Tiny bundle** – no external libraries, tree-shakeable.
* **100 % TypeScript** – autocompletion for every prop & hook.

---

## Installation

```bash
npm i react-floating-modals          # or pnpm add / yarn add
```

> **Peer dependencies:** `react >= 18`, `react-dom >= 18`.

---

## Quick start

```tsx
import {
  WindowManagerProvider,
  useWindowManager,
  FloatingModal
} from 'react-floating-modals';

function App() {
  return (
    <WindowManagerProvider>
      <LauncherButton />
    </WindowManagerProvider>
  );
}

function LauncherButton() {
  const wm = useWindowManager();

  return (
    <button onClick={() => wm.spawn(<MyWindow />)}>
      Open window
    </button>
  );
}

function MyWindow({ windowId }: { windowId?: number }) {
  const wm = useWindowManager();

  return (
    <div className="my-window">
      <header data-drag-handle>
        Drag me!
        <button onClick={() => windowId !== undefined && wm.close(windowId)}>
          ×
        </button>
      </header>
      <main>Any content…</main>
    </div>
  );
}
```

1. Wrap your app (or a subtree) with **`<WindowManagerProvider>`**.  
2. Call **`wm.spawn(<YourComponent />)`** to open a new window.  
3. Inside the window, read **`windowId`** and call **`wm.close(windowId)`** to dismiss it.  
4. Add `data-drag-handle` to any element (or pass `handleSelector` prop) to make it draggable.

---

## API reference

### `<FloatingModal />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialX` | `number \| 'center'` | `'center'` | Starting left (px) or center. |
| `initialY` | `number \| 'center'` | `'center'` | Starting top (px) or center. |
| `handleSelector` | `string` | `'[data-drag-handle]'` | CSS selector for the drag handle, searched relative to the modal root. |
| `onDrag` | `(coords ⇒ void)` | — | Callback on every move `{ x, y }`. |
| `…div props` | — | — | Regular `<div>` attributes (`style`, `className`, etc.). |

**Imperative handle**

```ts
const ref = useRef<FloatingModalHandle>(null);

ref.current?.resetPosition(0, 0);      // snap to top-left
ref.current?.resetPosition('center');  // recenter
```

### `<WindowManagerProvider />`

Provides a store for all windows.

```ts
const wm = useWindowManager();

const id = wm.spawn(<Window />);   // open
wm.focus(id);                      // bring to front
wm.close(id);                      // close
```

---

## Styling

`react-floating-modals` ships **no CSS** by default—it’s headless.  
Assign your own classes or inline styles. A minimal Tailwind look:

```jsx
<div className="w-80 bg-white rounded shadow-lg">
  <header
    data-drag-handle
    className="bg-indigo-600 text-white px-4 py-2 rounded-t cursor-move flex justify-between"
  >
    …
```

---

## Roadmap

* Bounding-box constraints.  
* Optional backdrop / portal helper.  
* Keyboard shortcuts (Esc = close, arrow = nudge).  

PRs welcome!

---

## License

MIT
```