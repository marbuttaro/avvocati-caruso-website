import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root');
const newsData = document.getElementById('news-data');
const initialNews = newsData ? JSON.parse(newsData.textContent) : undefined;
const app = (
  <StrictMode>
    <App initialNews={initialNews} />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
