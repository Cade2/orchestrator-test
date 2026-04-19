import type { JSX } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionDetailPage } from './pages/InspectionDetailPage';
import { InspectionsListPage } from './pages/InspectionsListPage';
import { LoginPage } from './pages/LoginPage';
import { NewInspectionPage } from './pages/NewInspectionPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inspections" element={<InspectionsListPage />} />
          <Route path="/inspections/new" element={<NewInspectionPage />} />
          <Route path="/inspections/:inspectionId" element={<InspectionDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
