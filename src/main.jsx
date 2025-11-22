// inside src/main.jsx (or wherever you have BrowserRouter)

import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // ADD THIS LINE BELOW 👇
  <BrowserRouter basename="/Myportfolio">
    <App />
  </BrowserRouter>,
)