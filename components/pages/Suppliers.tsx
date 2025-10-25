
import React from 'react';
import Header from '../Header';
import { useInventory } from '../../hooks/useInventory';

const Suppliers: React.FC = () => {
    const { suppliers } = useInventory();

    return (
        <div>
            <Header title="Suppliers">
                <button onClick={() => alert('Add Supplier form would go here.')} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Add Supplier
                </button>
            </Header>
            <div className="bg-card shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Name</th>
                            <th className="p-3">Contact Person</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{supplier.name}</td>
                                <td className="p-3">{supplier.contactPerson}</td>
                                <td className="p-3">{supplier.email}</td>
                                <td className="p-3">{supplier.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Suppliers;
