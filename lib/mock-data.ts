export type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  brand?: string;
  supplierId?: string;
  description: string;
  image?: string;
  gallery?: string[];
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  tax: number;
  unit: string;
  tags: string[];
  stock: number;
  minStock: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type Purchase = {
  id: string;
  customerId: string;
  product: string;
  amount: number;
  date: string;
};

export type Activity = {
  id: string;
  type: "product" | "customer" | "employee" | "sale" | "inventory" | "order";
  message: string;
  time: string;
};

export type Vendor = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  notes?: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type InventoryMovement = {
  id: string;
  productId: string;
  type: "purchase" | "sale" | "adjustment" | "return";
  qty: number;
  vendorId?: string;
  reference?: string;
  note?: string;
  userEmail?: string;
  cost?: number;
  createdAt: string;
};

export type InvoiceItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
  lineTotal: number;
};

export type Invoice = {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  employeeEmail: string;
  employeeName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: "cash" | "card" | "bank" | "pending";
  paymentStatus: "paid" | "pending" | "refunded" | "partially_refunded";
  notes?: string;
  createdAt: string;
};

export type RefundLine = {
  productId: string;
  name: string;
  qty: number;          // qty being refunded / returned
  price: number;        // unit price at time of sale
  lineTotal: number;    // refund amount for this line (pre-tax proportion applied)
  restock: boolean;     // put units back into inventory
};

export type ExchangeLine = {
  productId: string;
  name: string;
  qty: number;
  price: number;
  lineTotal: number;
};

export type Refund = {
  id: string;
  number: string;              // RF-0001
  invoiceId: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  employeeEmail: string;
  employeeName: string;
  type: "full" | "partial" | "exchange";
  reason: string;
  returnedItems: RefundLine[];
  exchangedItems: ExchangeLine[];   // items given out in exchange
  refundSubtotal: number;           // sum of returned line totals
  exchangeSubtotal: number;         // sum of exchanged line totals
  taxAdjustment: number;            // proportional tax refunded
  exchangeTax?: number;             // tax charged on exchanged (outgoing) items
  netRefund: number;                // amount paid back to customer (can be negative if customer owes more)
  refundMethod: "cash" | "card" | "bank" | "store_credit" | "exchange_only";
  amountDue?: number;               // positive when the exchange costs more than the return credit
  settlementMethod?: "cash" | "card" | "bank";  // how the customer paid the difference
  exchangeInvoiceId?: string;       // invoice generated for the outgoing exchange items
  exchangeInvoiceNumber?: string;
  status: "processed" | "pending";
  notes?: string;
  createdAt: string;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type Order = {
  id: string;
  number: string;
  customerEmail: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  paymentMethod: "cash" | "card" | "bank";
  paymentStatus: "paid" | "pending";
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string; note?: string }[];
  shippingAddress: { name: string; phone: string; address: string; city: string; zip: string };
  createdAt: string;
  updatedAt: string;
};

const now = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

const mk = (o: Partial<Product> & Pick<Product, "id" | "name" | "category" | "sku" | "description" | "purchasePrice" | "sellingPrice" | "stock" | "minStock">): Product => ({
  discount: 0,
  tax: 5,
  unit: "Piece",
  tags: [],
  status: "active",
  createdAt: now(),
  brand: "",
  barcode: "",
  gallery: [],
  ...o,
});

export const seedProducts: Product[] = [
  mk({ id: "p1", name: "Dell XPS 15 Laptop", category: "Electronics", sku: "DL-XPS-15", brand: "Dell", supplierId: "v1", description: "15-inch performance laptop with Intel i7", purchasePrice: 1200, sellingPrice: 1799, stock: 24, minStock: 5, tags: ["laptop","dell"], tax: 8 }),
  mk({ id: "p2", name: "Logitech MX Master 3", category: "Accessories", sku: "LG-MX3", brand: "Logitech", supplierId: "v2", description: "Wireless productivity mouse", purchasePrice: 60, sellingPrice: 99, stock: 3, minStock: 10, tags: ["mouse"] }),
  mk({ id: "p3", name: "Samsung 27\" Monitor", category: "Electronics", sku: "SM-M27", brand: "Samsung", supplierId: "v1", description: "4K UHD monitor with USB-C", purchasePrice: 250, sellingPrice: 399, stock: 12, minStock: 5, tags: ["monitor"] }),
  mk({ id: "p4", name: "Herman Miller Chair", category: "Furniture", sku: "HM-CHR", brand: "Herman Miller", supplierId: "v3", description: "Ergonomic office chair", purchasePrice: 800, sellingPrice: 1299, stock: 6, minStock: 3 }),
  mk({ id: "p5", name: "Apple Magic Keyboard", category: "Accessories", sku: "AP-MKB", brand: "Apple", supplierId: "v2", description: "Bluetooth keyboard", purchasePrice: 80, sellingPrice: 129, stock: 2, minStock: 8 }),
  mk({ id: "p6", name: "USB-C Hub 8-in-1", category: "Accessories", sku: "UC-HUB8", brand: "Anker", supplierId: "v2", description: "Multi-port adapter", purchasePrice: 25, sellingPrice: 49, stock: 45, minStock: 10 }),
  mk({ id: "p7", name: "Standing Desk", category: "Furniture", sku: "SD-001", brand: "Uplift", supplierId: "v3", description: "Electric height adjustable", purchasePrice: 400, sellingPrice: 649, stock: 8, minStock: 4 }),
  mk({ id: "p8", name: "Webcam 4K Pro", category: "Electronics", sku: "WC-4K", brand: "Logitech", supplierId: "v2", description: "Streaming webcam", purchasePrice: 90, sellingPrice: 149, stock: 1, minStock: 5 }),
];

export const seedVendors: Vendor[] = [
  { id: "v1", name: "TechDistro Wholesale", contactName: "Marcus Lee", email: "sales@techdistro.com", phone: "+1 555-2001", address: "220 Supply St, San Jose", gstin: "TD-88291", createdAt: now() },
  { id: "v2", name: "Peripheral Partners", contactName: "Nina Patel", email: "orders@pparts.io", phone: "+1 555-2002", address: "77 Cable Ln, Austin", createdAt: now() },
  { id: "v3", name: "Office Furnish Co.", contactName: "Erik Hansen", email: "hello@officefurnish.co", phone: "+1 555-2003", address: "4 Workspace Ave, Chicago", createdAt: now() },
];

export const seedCategories: Category[] = [
  { id: "cat1", name: "Electronics", description: "Laptops, monitors, and electronic devices", status: "active", createdAt: now() },
  { id: "cat2", name: "Accessories", description: "Keyboards, mice, cables, and add-ons", status: "active", createdAt: now() },
  { id: "cat3", name: "Furniture", description: "Chairs, desks, and office furniture", status: "active", createdAt: now() },
  { id: "cat4", name: "Software", description: "Software licenses and subscriptions", status: "active", createdAt: now() },
  { id: "cat5", name: "Other", description: "Uncategorized items", status: "active", createdAt: now() },
];

export const seedCustomers: Customer[] = [
  { id: "c1", name: "Acme Corp", email: "billing@acme.com", phone: "+1 555-0101", address: "123 Market St, SF", totalPurchases: 12480, status: "active", createdAt: now() },
  { id: "c2", name: "Globex Ltd", email: "orders@globex.io", phone: "+1 555-0102", address: "500 Tech Ave, NYC", totalPurchases: 8320, status: "active", createdAt: now() },
  { id: "c3", name: "Initech", email: "hello@initech.com", phone: "+1 555-0103", address: "88 Office Rd, Austin", totalPurchases: 4150, status: "active", createdAt: now() },
  { id: "c4", name: "Umbrella Inc", email: "sales@umbrella.co", phone: "+1 555-0104", address: "9 Raccoon St, Chicago", totalPurchases: 21900, status: "active", createdAt: now() },
  { id: "c5", name: "Wayne Enterprises", email: "b@wayne.com", phone: "+1 555-0105", address: "1 Wayne Tower, Gotham", totalPurchases: 34200, status: "active", createdAt: now() },
];

export const seedEmployees: Employee[] = [
  { id: "e1", name: "Sarah Johnson", email: "sarah@company.com", phone: "+1 555-0201", role: "Manager", department: "Sales", salary: 85000, status: "active", createdAt: now() },
  { id: "e2", name: "Michael Chen", email: "michael@company.com", phone: "+1 555-0202", role: "Developer", department: "Engineering", salary: 110000, status: "active", createdAt: now() },
  { id: "e3", name: "Emily Davis", email: "emily@company.com", phone: "+1 555-0203", role: "Designer", department: "Product", salary: 92000, status: "active", createdAt: now() },
  { id: "e4", name: "James Wilson", email: "james@company.com", phone: "+1 555-0204", role: "Accountant", department: "Finance", salary: 78000, status: "active", createdAt: now() },
  { id: "e5", name: "Olivia Brown", email: "olivia@company.com", phone: "+1 555-0205", role: "HR Specialist", department: "HR", salary: 68000, status: "active", createdAt: now() },
];

export const seedPurchases: Purchase[] = [
  { id: "pu1", customerId: "c1", product: "Dell XPS 15 Laptop", amount: 1799, date: "2026-07-10" },
  { id: "pu2", customerId: "c1", product: "Herman Miller Chair", amount: 1299, date: "2026-06-22" },
  { id: "pu3", customerId: "c2", product: "Samsung 27\" Monitor", amount: 798, date: "2026-07-01" },
  { id: "pu4", customerId: "c4", product: "Standing Desk", amount: 1298, date: "2026-05-14" },
  { id: "pu5", customerId: "c5", product: "Dell XPS 15 Laptop", amount: 3598, date: "2026-07-15" },
];

export const seedActivities: Activity[] = [
  { id: "a1", type: "sale", message: "New order #10245 from Wayne Enterprises", time: "2h ago" },
  { id: "a2", type: "product", message: "Product 'Logitech MX Master 3' is low on stock", time: "4h ago" },
  { id: "a3", type: "customer", message: "New customer 'Initech' registered", time: "1d ago" },
];

export const seedMovements: InventoryMovement[] = [
  { id: "m1", productId: "p1", type: "purchase", qty: 10, vendorId: "v1", cost: 1200, note: "Initial stock", createdAt: daysAgo(20), userEmail: "demo@nimbus.io" },
  { id: "m2", productId: "p2", type: "purchase", qty: 20, vendorId: "v2", cost: 60, createdAt: daysAgo(15), userEmail: "demo@nimbus.io" },
  { id: "m3", productId: "p1", type: "sale", qty: -2, reference: "INV-0001", createdAt: daysAgo(3), userEmail: "demo@nimbus.io" },
];

export const seedInvoices: Invoice[] = [
  {
    id: "i1", number: "INV-0001", customerId: "c1", customerName: "Acme Corp",
    employeeEmail: "demo@nimbus.io", employeeName: "Demo Admin",
    items: [{ productId: "p1", name: "Dell XPS 15 Laptop", qty: 2, price: 1799, discount: 0, tax: 8, lineTotal: 3886 }],
    subtotal: 3598, discount: 0, tax: 288, grandTotal: 3886,
    paymentMethod: "card", paymentStatus: "paid", createdAt: daysAgo(3),
  },
];

export const seedOrders: Order[] = [
  {
    id: "o1", number: "ORD-0001", customerEmail: "shopper@nimbus.io", customerName: "Jamie Shopper",
    items: [{ productId: "p6", name: "USB-C Hub 8-in-1", qty: 1, price: 49, discount: 0, tax: 5, lineTotal: 51.45 }],
    subtotal: 49, tax: 2.45, shipping: 5, discount: 0, grandTotal: 56.45,
    paymentMethod: "card", paymentStatus: "paid",
    status: "shipped",
    statusHistory: [
      { status: "pending", at: daysAgo(5) },
      { status: "confirmed", at: daysAgo(4) },
      { status: "processing", at: daysAgo(3) },
      { status: "shipped", at: daysAgo(1) },
    ],
    shippingAddress: { name: "Jamie Shopper", phone: "+1 555-9999", address: "77 Buyer Ave", city: "SF", zip: "94102" },
    createdAt: daysAgo(5), updatedAt: daysAgo(1),
  },
];

export const salesChartData = [
  { month: "Jan", revenue: 24000, orders: 42 },
  { month: "Feb", revenue: 28500, orders: 51 },
  { month: "Mar", revenue: 32000, orders: 58 },
  { month: "Apr", revenue: 29000, orders: 49 },
  { month: "May", revenue: 38500, orders: 67 },
  { month: "Jun", revenue: 42000, orders: 74 },
  { month: "Jul", revenue: 46800, orders: 82 },
];

export const seedRefunds: Refund[] = [];
