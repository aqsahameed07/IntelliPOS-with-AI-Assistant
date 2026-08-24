// app/(manager)/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import {
  Package,
  Users,
  UserCog,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProducts } from "@/app/hooks/useProducts";
import { useCustomers } from "@/app/hooks/useCustomers";
import { useOrders } from "@/app/hooks/useOrders";
import { useInvoices } from "@/app/hooks/useInvoices";
import { useEmployees } from "@/app/hooks/useEmployees";
import { useActivities } from "@/app/hooks/useActivities";
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

export default function Dashboard() {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { customers, loading: customersLoading, fetchCustomers } = useCustomers();
  const { employees, loading: employeesLoading, fetchEmployees } = useEmployees();
  const { orders, fetchOrders } = useOrders();
  const { invoices, fetchInvoices } = useInvoices();
  const { activities, loading: activitiesLoading, fetchRecentActivities } = useActivities();

  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCustomers(),
        fetchEmployees(),
        fetchOrders(),
        fetchInvoices(),
        fetchRecentActivities(10),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Calculate low stock products
  const lowStock = products.filter(
    (p) => p.stock <= p.minStock && p.status === "active"
  );

  // POS invoices + online orders both count toward revenue
  const salesRecords = useMemo(() => {
    const fromInvoices = invoices
      .filter((i) => i.status !== "cancelled" && i.paymentStatus === "paid")
      .map((i) => ({
        createdAt: new Date(i.createdAt),
        amount: i.grandTotal || 0,
      }));

    const fromOrders = orders
      .filter((o) => o.paymentStatus === "paid" && o.orderStatus !== "cancelled")
      .map((o) => ({
        createdAt: new Date(o.createdAt),
        amount: o.grandTotal || 0,
      }));

    return [...fromInvoices, ...fromOrders];
  }, [invoices, orders]);

  const totalRevenue = salesRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalSales = salesRecords.length;

  const chartData = useMemo(() => {
    const months = 12;
    const now = new Date();
    const startDate = subMonths(now, months - 1);

    const monthRange = eachMonthOfInterval({
      start: startDate,
      end: now,
    });

    return monthRange.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthSales = salesRecords.filter(
        (r) => r.createdAt >= monthStart && r.createdAt <= monthEnd
      );

      const monthRevenue = monthSales.reduce((sum, r) => sum + r.amount, 0);

      return {
        month: format(month, "MMM"),
        revenue: Math.round(monthRevenue),
        orders: monthSales.length,
      };
    });
  }, [salesRecords]);

  // Stats for dashboard
  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      delta: "+4.2%",
    },
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
      delta: "+1.8%",
    },
    {
      label: "Total Employees",
      value: employees.length,
      icon: UserCog,
      delta: "+0.0%",
    },
    {
      label: "Low Stock",
      value: lowStock.length,
      icon: AlertTriangle,
      delta: "alert",
      danger: true,
    },
    {
      label: "Total Sales",
      value: totalSales,
      icon: ShoppingCart,
      delta: "+12.4%",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      delta: "+8.6%",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your business at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {s.label}
                </span>
                <s.icon
                  className={`h-4 w-4 ${
                    s.danger ? "text-destructive" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div
                className={`mt-1 flex items-center gap-1 text-xs ${
                  s.danger ? "text-destructive" : "text-emerald-600"
                }`}
              >
                {!s.danger && <ArrowUpRight className="h-3 w-3" />}
                {s.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales / month</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="var(--color-primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!activitiesLoading && activities.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
            {!activitiesLoading && activities.map((a) => (
              <div key={a._id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(a.createdAt), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Low stock alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 && (
              <p className="text-sm text-muted-foreground">
                All products are well stocked.
              </p>
            )}
            {lowStock.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                </div>
                <Badge variant="destructive">
                  {p.stock} left / min {p.minStock}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}