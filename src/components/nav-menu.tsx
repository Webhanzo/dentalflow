"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, User, DollarSign, Calendar, Settings } from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/appointments", label: "المواعيد", icon: Calendar },
  { href: "/employees", label: "الموظفون", icon: Users },
  { href: "/clients", label: "العملاء", icon: User },
  { href: "/accounting", label: "المحاسبة", icon: DollarSign },
  { href: "/profile", label: "الملف الشخصي", icon: Settings },
];

export function NavMenu() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {menuItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
