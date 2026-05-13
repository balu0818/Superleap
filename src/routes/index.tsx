import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import LeadsPage from '../features/leads/pages/LeadsPage';
import BoardPage from '../features/leads/pages/BoardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/leads" replace /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'board', element: <BoardPage /> }
    ]
  }
]);
