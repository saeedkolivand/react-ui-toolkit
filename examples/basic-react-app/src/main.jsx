import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { StylesProvider } from '@saeedkolivand/react-ui-toolkit'
import '@saeedkolivand/react-ui-toolkit/dist/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StylesProvider>
      <App />
    </StylesProvider>
  </React.StrictMode>,
)
