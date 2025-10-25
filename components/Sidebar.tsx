
import React from 'react';
import type { Page } from '../App';
import { useInventory } from '../hooks/useInventory';
import { UserRole } from '../types';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: Page | 'Sign Out';
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg text-sidebar-text hover:bg-gray-700 transition-colors duration-200 ${isActive ? 'bg-sidebar-active text-white' : ''}`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { userProfile, logout } = useInventory();

  const allNavItems: { label: Page; icon: React.ReactNode; managerOnly: boolean }[] = [
    { label: 'Dashboard', icon: <CubeIcon />, managerOnly: false },
    { label: 'Sales', icon: <ShoppingCartIcon />, managerOnly: false },
    { label: 'Products', icon: <PackageIcon />, managerOnly: false },
    { label: 'Suppliers', icon: <TruckIcon />, managerOnly: true },
    { label: 'Accounting', icon: <CalculatorIcon />, managerOnly: true },
    { label: 'Credits', icon: <CreditCardIcon />, managerOnly: true },
    { label: 'Payments', icon: <CurrencyDollarIcon />, managerOnly: true },
    { label: 'Analytics', icon: <ChartBarIcon />, managerOnly: true },
    { label: 'Account', icon: <UserCircleIcon />, managerOnly: true },
  ];

  const visibleNavItems = allNavItems.filter(item => {
    if (!item.managerOnly) return true;
    return userProfile?.role === UserRole.MANAGER;
  });

  return (
    <aside className="w-64 bg-sidebar text-white flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        <SparklesIcon />
        Gemini<span className="font-light">Invent</span>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {visibleNavItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activePage === item.label}
              onClick={() => setActivePage(item.label)}
            />
          ))}
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <NavItem
            icon={<LogoutIcon />}
            label={'Sign Out'}
            isActive={false}
            onClick={logout}
        />
      </div>
    </aside>
  );
};

// SVG Icons
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {children}
    </svg>
);

const CubeIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></IconWrapper>;
const ShoppingCartIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></IconWrapper>;
const PackageIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m0-14l8 4-8 4-8-4 8-4z" /></IconWrapper>;
const TruckIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 S11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H6V6h10v4l4 4H13zM6 6L3 9h3v8h1" /></IconWrapper>;
const CalculatorIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 0l-3 3m3-3l-3-3m-4 10h.01M12 10h.01M15 13h.01M15 17h.01M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></IconWrapper>;
const CreditCardIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></IconWrapper>;
const CurrencyDollarIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v4m0 4v.01M5 12a7 7 0 1114 0 7 7 0 01-14 0z" /></IconWrapper>;
const ChartBarIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></IconWrapper>;
const UserCircleIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></IconWrapper>;
const LogoutIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></IconWrapper>;
const SparklesIcon = () => <svg className="w-8 h-8 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" /><path d="M6.5 7.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" /></svg>;


export default Sidebar;
