import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App.jsx';

export function render(path) {
  return renderToString(<StaticRouter location={path}><AppContent /></StaticRouter>);
}
