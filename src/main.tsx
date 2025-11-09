import '@/background/loadDefaults'
import '@/content/loadCustoms'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './popup/Popup'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Popup />
    </StrictMode>
)