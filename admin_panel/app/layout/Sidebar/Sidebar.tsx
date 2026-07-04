"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";
import { motion } from "framer-motion";
import { logoutAction } from "@/auth/actions";
import AdminsIcon from "@/assets/admins.svg";
import CalendarIcon from "@/assets/calendar.svg";
import DashboardIcon from "@/assets/dashboard.svg";
import MenuIcon from "@/assets/menu.svg";
import OrdersIcon from "@/assets/orders.svg";
import ServicesIcon from "@/assets/services.svg";
import SignOutIcon from "@/assets/sign_out.svg";
import XIcon from "@/assets/close.svg";
import { useWindowWidth } from "@/hooks";
import styles from "./style.module.scss";
import type { SidebarProps } from "./Sidebar.props";

const navigation = [
  { href: "/", label: "Tableau de bord", icon: DashboardIcon, superadminOnly: false },
  { href: "/services", label: "Services", icon: ServicesIcon, superadminOnly: false },
  { href: "/orders", label: "Commandes", icon: OrdersIcon, superadminOnly: false },
  { href: "/calendar", label: "Calendrier", icon: CalendarIcon, superadminOnly: false },
  { href: "/admins", label: "Administrateurs", icon: AdminsIcon, superadminOnly: true },
] as const;

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  superadmin: "Superadmin",
  client: "Client",
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const width = useWindowWidth();

  if (width == null) return null;

  const isMobile = width <= 760;

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
          aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <MenuIcon aria-hidden="true" /> : <XIcon aria-hidden="true" />}
        </button>
        {!collapsed || isMobile ? <span className={styles.productName}>Services de location</span> : null}
      </div>

      <nav
        className={cn(styles.nav, collapsed ? styles.collapsed_nav : styles.uncollapsed_nav)}
        aria-label="Navigation admin"
      >
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
            <span>{roleLabels[user.role] ?? user.role}</span>
          </div>
        ) : null}
        <form action={logoutAction}>
          <button className={styles.logoutButton} type="submit">
            <SignOutIcon aria-hidden="true" /> {!collapsed && "Déconnexion"}
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
