
import React, { useState, useCallback } from 'react';
import Header from '../Header';
import Modal from '../Modal';
import { useInventory } from '../../hooks/useInventory';
import { Product, UserRole } from '../../types';
import { generateProductDescription } from '../../services/geminiService';

const ProductForm: React.FC<{ product?: Product | null, onSave: (product: Omit<Product, 'id'> | Product) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const { suppliers } = useInventory();
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        category: product?.category || '',
        supplierId: product?.supplierId || '',
        stock: product?.stock || 0,
        price: product?.price || 0,
        cost: product?.cost || 0,
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = useCallback(async () => {
        if (!formData.name || !formData.category) {
            alert("Please enter a product name and category first.");
            return;
        }
        setIsGenerating(true);
        const description = await generateProductDescription(formData.name, formData.category);
        setFormData(prev => ({ ...prev, description }));
        setIsGenerating(false);
    }, [formData.name, formData.category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            stock: Number(formData.stock),
            price: Number(formData.price),
            cost: Number(formData.cost)
        };
        if(product) {
            onSave({ ...product, ...dataToSave });
        } else {
            onSave(dataToSave);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="p-2 border rounded w-full" required />
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded w-full" required />
            </div>
            <div className="relative">
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded w-full h-24" required />
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 bg-secondary text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 disabled:bg-gray-400">
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="supplierId" value={formData.supplierId} onChange={handleChange} className="p-2 border rounded w-full" required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded w-full" required />
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded w-full" required />
                <input type="number" step="0.01" name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" className="p-2 border rounded w-full" required />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Product</button>
            </div>
        </form>
    );
}


const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, suppliers, addProduct, updateProduct, userProfile } = useInventory();
  const isManager = userProfile?.role === UserRole.MANAGER;

  const handleOpenModal = (product?: Product) => {
      setEditingProduct(product || null);
      setIsModalOpen(true);
  }

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingProduct(null);
  }

  const handleSaveProduct = async (productData: Omit<Product, 'id'> | Product) => {
    try {
        if('id' in productData) {
            await updateProduct(productData);
        } else {
            await addProduct(productData);
        }
        handleCloseModal();
    } catch (error) {
        console.error("Failed to save product:", error);
        alert("Error saving product. Please try again.");
    }
  };

  return (
    <div>
      <Header title="Products">
        {isManager && (
            <button onClick={() => handleOpenModal()} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Add Product
            </button>
        )}
      </Header>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? "Edit Product" : "Add New Product"}>
          <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseModal} />
      </Modal>

      <div className="bg-card shadow-md rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Supplier</th>
              {isManager && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className={`p-3 font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{product.stock}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{suppliers.find(s => s.id === product.supplierId)?.name || 'N/A'}</td>
                {isManager && (
                    <td className="p-3">
                        <button onClick={() => handleOpenModal(product)} className="text-primary hover:underline">Edit</button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
