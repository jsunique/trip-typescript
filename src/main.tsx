import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import AppProvider from './context/AppContext.tsx'

createRoot(document.getElementById('root')!).render(
<BrowserRouter>
  <AppProvider>
    <App />
  </AppProvider>
  </BrowserRouter>,
)
