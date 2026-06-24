import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AppBootstrap from './components/AppBootstrap.tsx'
import { StoreProvider } from './context/StoreContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <AppBootstrap>
        <App />
      </AppBootstrap>
    </StoreProvider>
  </StrictMode>,
)
