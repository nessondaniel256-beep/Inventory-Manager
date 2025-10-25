
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Supplier, Sale, User } from '../types';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  writeBatch,
  setDoc,
} from 'firebase/firestore';


interface InventoryContextType {
  loading: boolean;
  user: FirebaseUser | null;
  userProfile: User | null;
  products: Product[];
  suppliers: Supplier[];
  sales: Sale[];
  users: User[];
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<any>;
  registerEmployee: (name: string, email: string, pass: string, role: any, limits: any) => Promise<any>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<any>;
  updateProduct: (product: Product) => Promise<any>;
  recordSale: (sale: Omit<Sale, 'id'>) => Promise<any>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUserProfile({ id: doc.id, ...doc.data() } as User);
        } else {
            // Handle case where user exists in Auth but not in Firestore
            setUserProfile(null);
        }
        setLoading(false);
      });

      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
          setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      });
      const unsubSuppliers = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
          setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier)));
      });
      const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
          setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      });
      const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
          setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      });


      return () => {
        unsubProfile();
        unsubProducts();
        unsubSuppliers();
        unsubSales();
        unsubUsers();
      };
    } else {
        // Clear data when logged out
        setProducts([]);
        setSuppliers([]);
        setSales([]);
        setUsers([]);
    }
  }, [user]);

  const login = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
  const logout = () => signOut(auth);

  const registerEmployee = async (name: string, email: string, pass: string, role: any, limits: any) => {
    // This is a simplified registration. In a real app, you'd use Firebase Functions
    // to create the user to avoid exposing credentials for a temporary admin user.
    // For this example, we assume the current user (a manager) can do this.
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    // Create user profile in Firestore
    const userDocRef = doc(db, "users", newUser.uid);
    await setDoc(userDocRef, {
      name,
      email,
      role,
      limits
    });

    // Note: This flow logs the manager out and logs the new user in.
    // A better flow might use a backend function. For now, we just log back in the manager
    if(auth.currentUser?.email !== user?.email && user?.email && user.providerData[0]?.providerId) {
       // This part is tricky and error-prone without a backend.
       // We'll skip auto-re-login for simplicity. The manager will have to log in again.
    }
  }

  const addProduct = (product: Omit<Product, 'id'>) => addDoc(collection(db, 'products'), product);
  
  const updateProduct = (product: Product) => {
    const { id, ...data } = product;
    const productDocRef = doc(db, 'products', id);
    return updateDoc(productDocRef, data);
  };

  const recordSale = async (sale: Omit<Sale, 'id'>) => {
      const productRef = doc(db, 'products', sale.productId);
      
      const product = products.find(p => p.id === sale.productId);
      if(!product) throw new Error("Product not found");

      const newStock = product.stock - sale.quantity;

      const batch = writeBatch(db);
      
      // Add the sale document
      const saleRef = doc(collection(db, 'sales'));
      batch.set(saleRef, sale);

      // Update product stock
      batch.update(productRef, { stock: newStock });

      return batch.commit();
  }


  const value = {
    loading,
    user,
    userProfile,
    products,
    suppliers,
    sales,
    users,
    login,
    logout,
    registerEmployee,
    addProduct,
    updateProduct,
    recordSale,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};