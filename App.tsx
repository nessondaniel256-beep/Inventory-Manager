
import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './hooks/useInventory';
import Sidebar from './components/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Sales from './components/pages/Sales';
import Products from './components/pages/Products';
import Suppliers from './components/pages/Suppliers';
import Analytics from './components/pages/Analytics';
import Account from './components/pages/Account';
import PlaceholderPage from './components/pages/PlaceholderPage';
import Login from './components/pages/Login';
import { UserRole } from './types';
import AccessDenied from './components/pages/AccessDenied';

export type Page = 'Dashboard' | 'Sales' | 'Accounting' | 'Credits' | 'Payments' | 'Products' | 'Suppliers' | 'Analytics' | 'Account';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const { userProfile, loading } = useInventory();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Login />;
  }
  
  const managerPages: Page[] = ['Suppliers', 'Analytics', 'Account', 'Accounting', 'Credits', 'Payments'];
  const isManager = userProfile.role === UserRole.MANAGER;

  const renderPage = () => {
    // If an employee tries to access a manager page, show access denied
    if (!isManager && managerPages.includes(activePage)) {
        return <AccessDenied />;
    }

    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Sales':
        return <Sales />;
      case 'Products':
        return <Products />;
      case 'Suppliers':
        return <Suppliers />;
      case 'Analytics':
        return <Analytics />;
      case 'Account':
        return <Account />;
      case 'Accounting':
      case 'Credits':
      case 'Payments':
        return <PlaceholderPage title={activePage} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
};

export default App;