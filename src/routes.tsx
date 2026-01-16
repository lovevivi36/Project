import HomePage from './pages/HomePage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'DopaList',
    path: '/',
    element: <HomePage />
  }
];

export default routes;
