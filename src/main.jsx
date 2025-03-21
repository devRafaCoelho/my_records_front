import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './routes'
import { AppProvider } from './contexts/AppProvider' // Importa o AppProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
)
