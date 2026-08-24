import { useEffect, useState, useCallback } from "react";
import {
  seedProducts,
  seedCustomers,
  seedEmployees,
  seedPurchases,
  seedActivities,
  seedVendors,
  seedMovements,
  seedInvoices,
  seedOrders,
  seedCategories,
  seedRefunds,
  type Product,
  type Customer,
  type Employee,
  type Purchase,
  type Activity,
  type Vendor,
  type InventoryMovement,
  type Invoice,
  type Order,
  type OrderStatus,
  type Category,
  type Refund,
} from "./mock-data";

const KEYS = {
  products: "erp:products",
  customers: "erp:customers",
  employees: "erp:employees",
  purchases: "erp:purchases",
  activities: "erp:activities",
  company: "erp:company",
  vendors: "erp:vendors",
  movements: "erp:movements",
  invoices: "erp:invoices",
  orders: "erp:orders",
  categories: "erp:categories",
  refunds: "erp:refunds",
} as const;

function load<T>(key: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

function save<T>(key: string, val: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Storage write failed", key, err);
    throw new Error(
      "Local storage is full — images are too large to save. Try a smaller image.",
    );
  }
  window.dispatchEvent(new CustomEvent(`store:${key}`));
}

function useStore<T>(key: string, seed: T) {
  const [data, setData] = useState<T>(seed);
  useEffect(() => {
    setData(load(key, seed));
    const handler = () => setData(load(key, seed));
    window.addEventListener(`store:${key}`, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(`store:${key}`, handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const setAll = useCallback((v: T) => save(key, v), [key]);
  return [data, setAll] as const;
}

export const genId = () => Math.random().toString(36).slice(2, 10);

// Direct localStorage helpers (for one-off writes across modules)
function readList<T>(key: string, seed: T[]): T[] {
  return load(key, seed);
}
function writeList<T>(key: string, val: T[]) {
  save(key, val);
}

export function useProducts() {
  const [items, setItems] = useStore<Product[]>(KEYS.products, seedProducts);
  return {
    items,
    add: (p: Omit<Product, "id" | "createdAt">) =>
      setItems([{ ...p, id: genId(), createdAt: new Date().toISOString() }, ...items]),
    update: (id: string, p: Partial<Product>) =>
      setItems(items.map((x) => (x.id === id ? { ...x, ...p } : x))),
    remove: (id: string) => setItems(items.filter((x) => x.id !== id)),
  };
}

export function useCustomers() {
  const [items, setItems] = useStore<Customer[]>(KEYS.customers, seedCustomers);
  return {
    items,
    add: (c: Omit<Customer, "id" | "createdAt" | "totalPurchases">) =>
      setItems([{ ...c, id: genId(), totalPurchases: 0, createdAt: new Date().toISOString() }, ...items]),
    update: (id: string, c: Partial<Customer>) =>
      setItems(items.map((x) => (x.id === id ? { ...x, ...c } : x))),
    remove: (id: string) => setItems(items.filter((x) => x.id !== id)),
  };
}

export function useEmployees() {
  const [items, setItems] = useStore<Employee[]>(KEYS.employees, seedEmployees);
  return {
    items,
    add: (e: Omit<Employee, "id" | "createdAt">) =>
      setItems([{ ...e, id: genId(), createdAt: new Date().toISOString() }, ...items]),
    update: (id: string, e: Partial<Employee>) =>
      setItems(items.map((x) => (x.id === id ? { ...x, ...e } : x))),
    remove: (id: string) => setItems(items.filter((x) => x.id !== id)),
  };
}

export function usePurchases() {
  const [items] = useStore<Purchase[]>(KEYS.purchases, seedPurchases);
  return { items };
}

export function useActivities() {
  const [items, setItems] = useStore<Activity[]>(KEYS.activities, seedActivities);
  const push = (a: Omit<Activity, "id" | "time">) =>
    setItems([{ ...a, id: genId(), time: "just now" }, ...items].slice(0, 30));
  return { items, push };
}

export function useVendors() {
  const [items, setItems] = useStore<Vendor[]>(KEYS.vendors, seedVendors);
  return {
    items,
    add: (v: Omit<Vendor, "id" | "createdAt">) =>
      setItems([{ ...v, id: genId(), createdAt: new Date().toISOString() }, ...items]),
    update: (id: string, v: Partial<Vendor>) =>
      setItems(items.map((x) => (x.id === id ? { ...x, ...v } : x))),
    remove: (id: string) => setItems(items.filter((x) => x.id !== id)),
  };
}

export function useCategories() {
  const [items, setItems] = useStore<Category[]>(KEYS.categories, seedCategories);
  return {
    items,
    add: (c: Omit<Category, "id" | "createdAt">) =>
      setItems([{ ...c, id: genId(), createdAt: new Date().toISOString() }, ...items]),
    update: (id: string, c: Partial<Category>) =>
      setItems(items.map((x) => (x.id === id ? { ...x, ...c } : x))),
    remove: (id: string) => setItems(items.filter((x) => x.id !== id)),
  };
}

export function useMovements() {
  const [items, setItems] = useStore<InventoryMovement[]>(KEYS.movements, seedMovements);
  const push = (m: Omit<InventoryMovement, "id" | "createdAt">) => {
    const rec: InventoryMovement = { ...m, id: genId(), createdAt: new Date().toISOString() };
    setItems([rec, ...items]);
    // update product stock
    const products = readList<Product>(KEYS.products, seedProducts);
    writeList<Product>(
      KEYS.products,
      products.map((p) => (p.id === m.productId ? { ...p, stock: Math.max(0, p.stock + m.qty) } : p)),
    );
    return rec;
  };
  return { items, push };
}

export function useInvoices() {
  const [items, setItems] = useStore<Invoice[]>(KEYS.invoices, seedInvoices);
  const add = (inv: Omit<Invoice, "id" | "number" | "createdAt">) => {
    const number = `INV-${String(items.length + 1).padStart(4, "0")}`;
    const rec: Invoice = { ...inv, id: genId(), number, createdAt: new Date().toISOString() };
    setItems([rec, ...items]);
    return rec;
  };
  const update = (id: string, patch: Partial<Invoice>) =>
    setItems(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  return { items, add, update };
}

export function useRefunds() {
  const [items, setItems] = useStore<Refund[]>(KEYS.refunds, seedRefunds);
  const add = (r: Omit<Refund, "id" | "number" | "createdAt">) => {
    const number = `RF-${String(items.length + 1).padStart(4, "0")}`;
    const rec: Refund = { ...r, id: genId(), number, createdAt: new Date().toISOString() };
    setItems([rec, ...items]);
    return rec;
  };
  return { items, add };
}

export function useOrders() {
  const [items, setItems] = useStore<Order[]>(KEYS.orders, seedOrders);
  const add = (o: Omit<Order, "id" | "number" | "createdAt" | "updatedAt" | "statusHistory" | "status">) => {
    const number = `ORD-${String(items.length + 1).padStart(4, "0")}`;
    const rec: Order = {
      ...o,
      id: genId(),
      number,
      status: "pending",
      statusHistory: [{ status: "pending", at: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems([rec, ...items]);
    return rec;
  };
  const updateStatus = (id: string, status: OrderStatus, note?: string) => {
    setItems(
      items.map((o) =>
        o.id === id
          ? {
              ...o,
              status,
              statusHistory: [...o.statusHistory, { status, at: new Date().toISOString(), note }],
              updatedAt: new Date().toISOString(),
            }
          : o,
      ),
    );
  };
  return { items, add, updateStatus };
}

// Per-user cart
export type CartItem = { productId: string; qty: number };
export function useCart(email: string) {
  const key = `erp:cart:${email}`;
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    if (!email) return;
    const raw = window.localStorage.getItem(key);
    setItems(raw ? JSON.parse(raw) : []);
    const handler = () => {
      const r = window.localStorage.getItem(key);
      setItems(r ? JSON.parse(r) : []);
    };
    window.addEventListener(`store:${key}`, handler);
    return () => window.removeEventListener(`store:${key}`, handler);
  }, [key, email]);
  const write = (v: CartItem[]) => {
    window.localStorage.setItem(key, JSON.stringify(v));
    window.dispatchEvent(new CustomEvent(`store:${key}`));
    setItems(v);
  };
  return {
    items,
    add: (productId: string, qty = 1) => {
      const existing = items.find((i) => i.productId === productId);
      if (existing) write(items.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i)));
      else write([...items, { productId, qty }]);
    },
    setQty: (productId: string, qty: number) => {
      if (qty <= 0) write(items.filter((i) => i.productId !== productId));
      else write(items.map((i) => (i.productId === productId ? { ...i, qty } : i)));
    },
    remove: (productId: string) => write(items.filter((i) => i.productId !== productId)),
    clear: () => write([]),
  };
}

export type CompanyInfo = { name: string; email: string; phone: string; address: string };
const defaultCompany: CompanyInfo = {
  name: "IntelliPOS",
  email: "hello@nimbus.io",
  phone: "+1 555-1000",
  address: "1 Cloud Plaza, San Francisco",
};
export function useCompany() {
  const [company, setCompany] = useStore<CompanyInfo>(KEYS.company, defaultCompany);
  return { company, setCompany };
}

export { KEYS };
