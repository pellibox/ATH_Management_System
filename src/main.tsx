
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML file.");
}

createRoot(rootElement).render(<App />);
