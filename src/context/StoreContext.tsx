import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Types
export interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  category?: string;
}

export interface CartItem {
  medicine: Medicine;
  qty: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: 'UPI' | 'COD';
  items: CartItem[];
  total: number;
  status: 'new' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface StoreSettings {
  name: string;
  phone: string;
  whatsapp: string;
  upiId: string;
  address: string;
  logo?: string;
}

interface StoreContextType {
  medicines: Medicine[];
  cart: CartItem[];
  orders: Order[];
  settings: StoreSettings;
  isAdmin: boolean;
  // Cart
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Admin
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, med: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  updateSettings: (settings: StoreSettings) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const defaultSettings: StoreSettings = {
  name: 'Electrohomeopathy Store',
  phone: '+91 9876543210',
  whatsapp: '919876543210',
  upiId: 'store@upi',
  address: '123 Health Street, Medical District, City - 400001',
};

const defaultMedicines: Medicine[] = [
  { id: '1', name: 'S1 - Scrofoloso', price: 150, stock: 25, image: '', description: 'For lymphatic system disorders', category: 'Scrofoloso' },
  { id: '2', name: 'C1 - Canceroso', price: 180, stock: 30, image: '', description: 'Blood purifier and anti-inflammatory', category: 'Canceroso' },
  { id: '3', name: 'A1 - Angiotico', price: 160, stock: 20, image: '', description: 'For circulatory system support', category: 'Angiotico' },
  { id: '4', name: 'F1 - Febrifugo', price: 140, stock: 35, image: '', description: 'Natural fever reducer', category: 'Febrifugo' },
  { id: '5', name: 'V1 - Vermifugo', price: 130, stock: 15, image: '', description: 'Anti-parasitic formulation', category: 'Vermifugo' },
  { id: '6', name: 'L1 - Linfatico', price: 170, stock: 22, image: '', description: 'Lymphatic drainage support', category: 'Linfatico' },
  { id: '7', name: 'P1 - Pettorale', price: 155, stock: 18, image: '', description: 'Respiratory system tonic', category: 'Pettorale' },
  { id: '8', name: 'WR - White Remedy', price: 200, stock: 10, image: '', description: 'Universal healing compound', category: 'Special' },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(() => loadFromStorage('medicines', defaultMedicines));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('cart', []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('orders', []));
  const [settings, setSettings] = useState<StoreSettings>(() => loadFromStorage('settings', defaultSettings));
  const [isAdmin, setIsAdmin] = useState(() => loadFromStorage('isAdmin', false));

  useEffect(() => { localStorage.setItem('medicines', JSON.stringify(medicines)); }, [medicines]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('isAdmin', JSON.stringify(isAdmin)); }, [isAdmin]);

  const addToCart = useCallback((medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item => item.medicine.id === medicine.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { medicine, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== id));
  }, []);

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCart(prev => prev.map(item => item.medicine.id === id ? { ...item, qty } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.medicine.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAdmin(false), []);

  const addMedicine = useCallback((med: Omit<Medicine, 'id'>) => {
    const newMed = { ...med, id: Date.now().toString() };
    setMedicines(prev => [...prev, newMed]);
  }, []);

  const updateMedicine = useCallback((id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings: StoreSettings) => {
    setSettings(newSettings);
  }, []);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const order: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  return (
    <StoreContext.Provider value={{
      medicines, cart, orders, settings, isAdmin,
      addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, cartCount,
      login, logout, addMedicine, updateMedicine, deleteMedicine,
      updateSettings, addOrder, updateOrderStatus,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
