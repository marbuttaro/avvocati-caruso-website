import { createContext, useContext } from 'react';
import { newsItems } from './newsData.js';

export const NewsContext = createContext(newsItems);
export function useNews() { return useContext(NewsContext); }
