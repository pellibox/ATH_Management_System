
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { TennisBallLoader } from './components/ui/TennisBallLoader.tsx'
import './index.css'

// Add explicit error boundary
try {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML file.");
  }

  console.log("Mounting application");
  
  // Create a temporary loading state
  rootElement.innerHTML = '';
  const tempRoot = createRoot(rootElement);
  tempRoot.render(<TennisBallLoader />);
  
  // Then replace with the actual app
  setTimeout(() => {
    createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App mounted successfully");
  }, 100);
  
} catch (error) {
  console.error("Failed to mount application:", error);
  
  // Try to show an error message in the DOM if possible
  const rootElement = document.getElementById("root") || document.body;
  const errorDiv = document.createElement("div");
  errorDiv.style.padding = "20px";
  errorDiv.style.color = "red";
  errorDiv.textContent = `Error mounting app: ${error instanceof Error ? error.message : String(error)}`;
  rootElement.appendChild(errorDiv);
}
