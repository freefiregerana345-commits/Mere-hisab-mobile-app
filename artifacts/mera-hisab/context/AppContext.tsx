import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank' | 'Credit' | 'Other';
export type Unit = 'Piece' | 'Kg' | 'Gram' | 'Liter' | 'Meter' | 'Box' | 'Packet' | 'Dozen';

export type Business = {
  name: string;
  owner: string;
  phone: string;
  address: string;
  gstin: string;
  upiId: string;
  upiName: string;
  invoicePrefix: string;
  nextInvoice: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  openingBalance: number;
  notes: string;
  createdAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  openingBalance: number;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: Unit;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
};

export type SaleItem = {
  productId: string;
  name: string;
  quantity: number;
  unit: Unit;
  rate: number;
  total: number;
};

export type Sale = {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  due: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
};

export type LedgerEntry = {
  id: string;
  customerId: string;
  description: string;
  credit: number;
  debit: number;
  method?: PaymentMethod;
  createdAt: string;
};

export type Expense = {
  id: string;
  category: string;
  amount: number;
  description: string;
  method: PaymentMethod;
  createdAt: string;
};

type AppState = {
  business: Business;
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  sales: Sale[];
  ledger: LedgerEntry[];
  expenses: Expense[];
};

type AppContextValue = AppState & {
  ready: boolean;
  updateBusiness: (values: Partial<Business>) => void;
  addCustomer: (values: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  addProduct: (values: Omit<Product, 'id' | 'createdAt'>) => Product;
  addSale: (values: { customerId?: string; customerName: string; items: SaleItem[]; discount: number; tax: number; paid: number; paymentMethod: PaymentMethod }) => Sale;
  addPayment: (customerId: string, amount: number, method: PaymentMethod) => void;
  addExpense: (values: Omit<Expense, 'id' | 'createdAt'>) => void;
  addPurchase: (productId: string, quantity: number, price: number) => void;
  seedDemo: () => void;
  clearDemo: () => void;
  exportBackup: () => Promise<string>;
  importBackup: (raw: string) => Promise<boolean>;
  resetProfile: () => Promise<void>;
};

const STORAGE_KEY = 'mera-hisab-v1';
const now = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialState: AppState = {
  business: {
    name: 'Mera General Store',
    owner: 'Shop owner',
    phone: '',
    address: 'Add your shop address',
    gstin: '',
    upiId: 'merastore@upi',
    upiName: 'Mera General Store',
    invoicePrefix: 'INV-',
    nextInvoice: 1,
  },
  customers: [],
  suppliers: [],
  products: [],
  sales: [],
  ledger: [],
  expenses: [],
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) setState({ ...initialState, ...JSON.parse(value) });
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, ready]);

  const updateBusiness = (values: Partial<Business>) => setState((prev) => ({ ...prev, business: { ...prev.business, ...values } }));

  const addCustomer = (values: Omit<Customer, 'id' | 'createdAt'>) => {
    const customer = { ...values, id: makeId('customer'), createdAt: now() };
    setState((prev) => ({ ...prev, customers: [customer, ...prev.customers] }));
    return customer;
  };

  const addProduct = (values: Omit<Product, 'id' | 'createdAt'>) => {
    const product = { ...values, id: makeId('product'), createdAt: now() };
    setState((prev) => ({ ...prev, products: [product, ...prev.products] }));
    return product;
  };

  const addSale = (values: { customerId?: string; customerName: string; items: SaleItem[]; discount: number; tax: number; paid: number; paymentMethod: PaymentMethod }) => {
    const subtotal = values.items.reduce((sum, item) => sum + item.total, 0);
    const total = Math.max(0, subtotal - values.discount + values.tax);
    const due = Math.max(0, total - values.paid);
    const sale: Sale = {
      ...values,
      id: makeId('sale'),
      invoiceNo: `${state.business.invoicePrefix}${String(state.business.nextInvoice).padStart(4, '0')}`,
      subtotal,
      total,
      due,
      createdAt: now(),
    };
    setState((prev) => {
      const updatedProducts = prev.products.map((product) => {
        const line = values.items.find((item) => item.productId === product.id);
        return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
      });
      const newLedger = sale.customerId && due > 0
        ? [{ id: makeId('ledger'), customerId: sale.customerId, description: `Sale ${sale.invoiceNo}`, credit: due, debit: 0, createdAt: sale.createdAt }, ...prev.ledger]
        : prev.ledger;
      return {
        ...prev,
        products: updatedProducts,
        sales: [sale, ...prev.sales],
        ledger: newLedger,
        business: { ...prev.business, nextInvoice: prev.business.nextInvoice + 1 },
      };
    });
    return sale;
  };

  const addPayment = (customerId: string, amount: number, method: PaymentMethod) => {
    if (!amount || amount <= 0) return;
    const entry: LedgerEntry = { id: makeId('ledger'), customerId, description: 'Payment received', credit: 0, debit: amount, method, createdAt: now() };
    setState((prev) => ({ ...prev, ledger: [entry, ...prev.ledger] }));
  };

  const addExpense = (values: Omit<Expense, 'id' | 'createdAt'>) => {
    setState((prev) => ({ ...prev, expenses: [{ ...values, id: makeId('expense'), createdAt: now() }, ...prev.expenses] }));
  };

  const addPurchase = (productId: string, quantity: number, price: number) => {
    if (quantity <= 0) return;
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) => product.id === productId ? { ...product, stock: product.stock + quantity, purchasePrice: price } : product),
    }));
  };

  const seedDemo = () => {
    const customer: Customer = { id: 'demo-rahul', name: 'Rahul Kumar', phone: '9876543210', address: 'Main market', openingBalance: 0, notes: 'Regular customer', createdAt: now() };
    const products: Product[] = [
      { id: 'demo-rice', name: 'Rice', sku: 'RICE-25', category: 'Grocery', unit: 'Kg', purchasePrice: 38, sellingPrice: 50, stock: 100, minStock: 10, createdAt: now() },
      { id: 'demo-sugar', name: 'Sugar', sku: 'SUGAR-1', category: 'Grocery', unit: 'Kg', purchasePrice: 42, sellingPrice: 48, stock: 30, minStock: 5, createdAt: now() },
      { id: 'demo-oil', name: 'Oil', sku: 'OIL-1L', category: 'Grocery', unit: 'Liter', purchasePrice: 120, sellingPrice: 150, stock: 18, minStock: 4, createdAt: now() },
    ];
    setState((prev) => ({ ...prev, customers: [customer, ...prev.customers.filter((item) => item.id !== customer.id)], products: [...products, ...prev.products.filter((item) => !item.id.startsWith('demo-'))] }));
  };

  const clearDemo = () => setState((prev) => ({ ...prev, customers: prev.customers.filter((item) => !item.id.startsWith('demo-')), products: prev.products.filter((item) => !item.id.startsWith('demo-')), sales: prev.sales.filter((item) => !item.id.startsWith('demo-')), ledger: prev.ledger.filter((item) => !item.id.startsWith('demo-')) }));

  const exportBackup = async () => JSON.stringify({ exportedAt: now(), app: 'Mera Hisab', data: state }, null, 2);
  const importBackup = async (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as { data?: Partial<AppState> };
      if (!parsed.data || !parsed.data.business || !Array.isArray(parsed.data.customers) || !Array.isArray(parsed.data.products)) return false;
      setState({
        ...initialState,
        ...parsed.data,
        business: { ...initialState.business, ...parsed.data.business },
        customers: parsed.data.customers ?? [],
        suppliers: parsed.data.suppliers ?? [],
        products: parsed.data.products ?? [],
        sales: parsed.data.sales ?? [],
        ledger: parsed.data.ledger ?? [],
        expenses: parsed.data.expenses ?? [],
      });
      return true;
    } catch {
      return false;
    }
  };
  const resetProfile = async () => { await AsyncStorage.removeItem(STORAGE_KEY); setState(initialState); };

  const value = useMemo(() => ({ ...state, ready, updateBusiness, addCustomer, addProduct, addSale, addPayment, addExpense, addPurchase, seedDemo, clearDemo, exportBackup, importBackup, resetProfile }), [state, ready]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}