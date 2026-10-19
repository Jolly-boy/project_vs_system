"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, AlertTriangle, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulator", label: "Simulator", icon: Car },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <Shield className="h-6 w-6 text-primary" />
          Driver Safety
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Monitoring Prototype v1.0</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Handle active state for nested routes like /incidents/[id]
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t text-xs text-muted-foreground">
        <p>Local-first architecture.</p>
        <p>No cloud data uploaded.</p>
      </div>
    </aside>
  );
}