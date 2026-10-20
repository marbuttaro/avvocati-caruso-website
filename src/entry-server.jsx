import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App.jsx';

export function render(path, articles) {
  return renderToString(<StaticRouter location={path}><AppContent initialNews={articles} /></StaticRouter>);
}
