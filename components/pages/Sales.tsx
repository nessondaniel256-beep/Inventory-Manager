
import React, { useState } from 'react';
import Header from '../Header';
import { useInventory } from '../../hooks/useInventory';
import { Sale } from '../../types';

const Sales: React.FC = () => {
    const { products, sales, users, userProfile, recordSale } = useInventory();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRecordSale = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const product = products.find(p => p.id === selectedProduct);
        if (!product || !userProfile) {
            setError('Please select a valid product.');
            return;
        }

        if (quantity > product.stock) {
            setError(`Not enough stock. Only ${product.stock} available.`);
            return;
        }

        const newSale: Omit<Sale, 'id'> = {
            productId: product.id,
            productName: product.name,
            quantity: Number(quantity),
            totalPrice: product.price * quantity,
            date: new Date().toISOString(),
            employeeId: userProfile.id,
        };

        try {
            await recordSale(newSale);
            setSuccess(`Sale of ${quantity} x ${product.name} recorded successfully!`);
            // Reset form
            setSelectedProduct('');
            setQuantity(1);
        } catch (err) {
            console.error(err);
            setError('Failed to record sale. Please try again.');
        }

    };

    return (
        <div>
            <Header title="Sales" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-card shadow-md rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Record a New Sale</h2>
                    <form onSubmit={handleRecordSale} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="p-2 border rounded w-full"
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                                        {p.name} (Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max={products.find(p => p.id === selectedProduct)?.stock || 1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="p-2 border rounded w-full"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                            Record Sale
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                    </form>
                </div>
                <div className="lg:col-span-2 bg-card shadow-md rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Sales History</h2>
                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3">Product</th>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3">Total Price</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Sold By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(sale => (
                                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{sale.productName}</td>
                                        <td className="p-3">{sale.quantity}</td>
                                        <td className="p-3 font-medium text-green-600">${sale.totalPrice.toFixed(2)}</td>
                                        <td className="p-3 text-text-secondary">{new Date(sale.date).toLocaleString()}</td>
                                        <td className="p-3">{users.find(u => u.id === sale.employeeId)?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;
