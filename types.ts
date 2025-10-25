
export enum UserRole {
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee'
}

export interface User {
  id: string; // Corresponds to Firebase Auth UID
  name: string;
  email?: string;
  role: UserRole;
  limits?: {
    maxSaleValue: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplierId: string;
  stock: number;
  price: number;
  cost: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  date: string; // Should be ISO string
  employeeId: string;
}