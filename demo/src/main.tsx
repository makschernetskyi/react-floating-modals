import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {WindowManagerProvider} from "react-floating-modals"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WindowManagerProvider>
      <App />
    </WindowManagerProvider>
  </StrictMode>,
)
