
import React from 'react';
import Header from '../Header';
import Card from '../Card';
import { useInventory } from '../../hooks/useInventory';

const Dashboard: React.FC = () => {
  const { products, sales, suppliers } = useInventory();
  
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const inventoryValue = products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;

  return (
    <div>
      <Header title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          title="Total Revenue" 
          value={`$${totalSales.toFixed(2)}`} 
          icon={<CurrencyDollarIcon />}
          color="bg-green-100 text-green-600"
        />
        <Card 
          title="Inventory Value" 
          value={`$${inventoryValue.toFixed(2)}`} 
          icon={<ArchiveIcon />}
          color="bg-blue-100 text-blue-600"
        />
        <Card 
          title="Products" 
          value={totalProducts.toString()} 
          icon={<PackageIcon />}
          color="bg-indigo-100 text-indigo-600"
        />
        <Card 
          title="Suppliers" 
          value={totalSuppliers.toString()} 
          icon={<TruckIcon />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="mt-8 bg-card shadow-md rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-3">Product</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Total Price</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.slice(0, 5).map(sale => (
                        <tr key={sale.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{sale.productName}</td>
                            <td className="p-3">{sale.quantity}</td>
                            <td className="p-3 font-medium text-green-600">${sale.totalPrice.toFixed(2)}</td>
                            <td className="p-3 text-text-secondary">{new Date(sale.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {children}
    </svg>
);
const CurrencyDollarIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v4m0 4v.01M5 12a7 7 0 1114 0 7 7 0 01-14 0z" /></IconWrapper>;
const ArchiveIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></IconWrapper>;
const PackageIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m0-14l8 4-8 4-8-4 8-4z" /></IconWrapper>;
const TruckIcon = () => <IconWrapper><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17H6V6h10v4l4 4H13zM6 6L3 9h3v8h1" /></IconWrapper>;

export default Dashboard;
