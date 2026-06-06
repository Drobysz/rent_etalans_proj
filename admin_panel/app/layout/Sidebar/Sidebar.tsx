"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";
import { motion } from "framer-motion";
import { logoutAction } from "@/auth/actions";
import AdminsIcon from "@/assets/admins.svg";
import DashboardIcon from "@/assets/dashboard.svg";
import MenuIcon from "@/assets/menu.svg";
import OrdersIcon from "@/assets/orders.svg";
import ServicesIcon from "@/assets/services.svg";
import styles from "./style.module.scss";
import type { SidebarProps } from "./Sidebar.props";

const navigation = [
  { href: "/admin_panel/dashboard", label: "Dashboard", icon: DashboardIcon, superadminOnly: false },
  { href: "/admin_panel/services", label: "Services", icon: ServicesIcon, superadminOnly: false },
  { href: "/admin_panel/orders", label: "Orders", icon: OrdersIcon, superadminOnly: false },
  { href: "/admin_panel/admins", label: "Admins", icon: AdminsIcon, superadminOnly: true },
] as const;

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className={cn(styles.sidebar, collapsed && styles.collapsed)}
      animate={{ width: collapsed ? 72 : 244 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.top}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
        >
          <MenuIcon aria-hidden="true" />
        </button>
        {!collapsed ? <span className={styles.productName}>Rent services</span> : null}
      </div>

      <nav className={styles.nav} aria-label="Admin navigation">
        {navigation
          .filter((item) => !item.superadminOnly || user.role === "superadmin")
          .map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                className={cn(styles.navLink, isActive && styles.active)}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
      </nav>

      <div className={styles.account}>
        {!collapsed ? (
          <div className={styles.accountText}>
            <span>{user.name}</span>
            <span>{user.role}</span>
          </div>
        ) : null}
        <form action={logoutAction}>
          <button className={styles.logoutButton} type="submit">
            {collapsed ? "Out" : "Log out"}
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
