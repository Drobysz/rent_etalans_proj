"use client";

import { useState } from "react";
import type { User } from "@/interfaces";
import { AdminsHeader, AdminsTable, UserModal } from "./_components";
import styles from "./style.module.scss";
import type { AdminsListProps } from "./AdminsList.props";

export function AdminsList({ users }: AdminsListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <section className={styles.section}>
      <AdminsHeader count={users.length} onCreate={() => setIsCreateOpen(true)} />
      <AdminsTable users={users} onEdit={setEditingUser} />
      {isCreateOpen ? (
        <UserModal mode="create" open onClose={() => setIsCreateOpen(false)} />
      ) : null}
      {editingUser ? (
        <UserModal mode="edit" open user={editingUser} onClose={() => setEditingUser(null)} />
      ) : null}
    </section>
  );
}
