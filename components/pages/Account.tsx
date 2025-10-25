
import React, { useState } from 'react';
import Header from '../Header';
import Modal from '../Modal';
import { useInventory } from '../../hooks/useInventory';
import { UserRole } from '../../types';

const AddUserForm: React.FC<{ onSave: (data: any) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: UserRole.EMPLOYEE,
        maxSaleValue: 1000,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="p-2 border rounded w-full" required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="p-2 border rounded w-full" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded w-full" required minLength={6} />
            <input type="number" name="maxSaleValue" placeholder="Max Sale Value Limit" value={formData.maxSaleValue} onChange={handleChange} className="p-2 border rounded w-full" required />
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add Employee</button>
            </div>
        </form>
    )
}


const Account: React.FC = () => {
    const { userProfile, users, registerEmployee } = useInventory();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEmployee = async (data: any) => {
        try {
            await registerEmployee(data.name, data.email, data.password, data.role, { maxSaleValue: Number(data.maxSaleValue) });
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Failed to register employee:", error);
            alert(`Error: ${error.message}`);
        }
    }

    return (
        <div>
            <Header title="Account Management">
                {userProfile?.role === UserRole.MANAGER && (
                     <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Add Employee
                    </button>
                )}
            </Header>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
                <AddUserForm onSave={handleAddEmployee} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <div className="bg-card shadow-md rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Current User</h2>
                {userProfile && (
                    <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg mb-8">
                         <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {userProfile.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-lg">{userProfile.name}</p>
                            <p className="text-text-secondary">{userProfile.email}</p>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-secondary bg-green-200">
                                {userProfile.role}
                            </span>
                        </div>
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4">All Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Account;
