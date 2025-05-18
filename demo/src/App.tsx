import { useState } from 'react'
import {
  useWindowManager
} from 'react-floating-modals';





const DemoWindow: React.FC<{ windowId?: number }> = ({ windowId }) => {
  const wm = useWindowManager();

  return (
    <div
      style={{
        width: 320,
        background: '#fff',
        borderRadius: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}
    >
      <header
        data-drag-handle
        style={{
          background: '#4f46e5',
          color: '#fff',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'move',
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6
        }}
      >
        Demo Window
        <button
          onClick={() => windowId !== undefined && wm.close(windowId)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            fontSize: '1.25rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </header>

      <div style={{ padding: 16 }}>Drag me by the purple header.</div>
    </div>
  );
};

/* ───────── launcher button ───────── */
const Launcher: React.FC = () => {
  const wm = useWindowManager();
  return (
    <button
      style={{
        padding: '0.6rem 1.2rem',
        fontSize: '1rem',
        border: 'none',
        borderRadius: 6,
        background: '#4f46e5',
        color: '#fff',
        cursor: 'pointer'
      }}
      onClick={() => wm.spawn(<DemoWindow />, false)}
    >
      Open Window
    </button>
  );
};


function App() {
  const [count, setCount] = useState(0)

  return (
    <div
    style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa'
    }}
  >
    <Launcher />
  </div>
  )
}

export default App
