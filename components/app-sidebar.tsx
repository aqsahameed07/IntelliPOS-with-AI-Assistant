"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Sparkles,
  Package,
  Tags,
  Users,
  UserCog,
  Settings,
  Boxes,
  Warehouse,
  Truck,
  Receipt,
  ScrollText,
  ShoppingBag,
  Undo2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth, type Role } from "@/lib/auth";

const ALL = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "Employee"],
  },
  {
    title: "AI Assistant",
    url: "/ai-assistant",
    icon: Sparkles,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Warehouse,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Vendors",
    url: "/vendors",
    icon: Truck,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Billing (POS)",
    url: "/billing",
    icon: Receipt,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ScrollText,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Refunds",
    url: "/refunds",
    icon: Undo2,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingBag,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    roles: ["Admin", "Employee"],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: UserCog,
    roles: ["Admin"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["Admin", "Employee"],
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { user } = useAuth();

  const collapsed = state === "collapsed";
  const role = user?.role ?? "Admin";

  const items = ALL.filter((item) =>
    (item.roles as readonly Role[]).includes(role)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="h-4 w-4" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">
                IntelliPOS
              </span>
              <span className="text-xs text-muted-foreground">
                {role}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active =
                  pathname === item.url ||
                  pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}