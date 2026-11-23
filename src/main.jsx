import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider } from './lib/router.jsx';
import { ShopProvider } from './context/ShopContext.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
    </RouterProvider>
  </StrictMode>,
);
