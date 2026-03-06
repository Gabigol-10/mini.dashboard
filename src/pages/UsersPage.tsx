import React from "react";
import { useFetch } from "../hooks/useFetch";
import { apiClient } from "../services/apiClient";
import { Button } from "../components/common/Button";
import type { User } from "../types/api";

interface UsersPageProps {
  onSelectUser: (userId: number) => void;
}

export function UsersPage({ onSelectUser }: UsersPageProps) {
  const { data, loading, error, refetch } = useFetch<User[]>(
    () => apiClient.get("/users"),
    { immediate: true }
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Error al cargar usuarios</h3>
          <p style={styles.errorMessage}>{error.message}</p>
          <Button onClick={refetch}>🔄 Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>Sin resultados</h3>
          <p style={styles.emptyText}>No se encontraron usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Usuarios</h1>
        <p style={styles.subtitle}>
          Lista de usuarios de JSONPlaceholder API
        </p>
      </div>

      <div style={styles.grid}>
        {data.map((user) => (
          <div key={user.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.avatar}>{user.name.charAt(0)}</div>
              <div>
                <h3 style={styles.userName}>{user.name}</h3>
                <p style={styles.userEmail}>{user.email}</p>
              </div>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Empresa:</span>
                <span style={styles.infoValue}>{user.company.name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Usuario:</span>
                <span style={styles.infoValue}>@{user.username}</span>
              </div>
            </div>
            <div style={styles.cardFooter}>
              <Button onClick={() => onSelectUser(user.id)}>
                📝 Ver Posts
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 32,
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    transition: "all 0.2s ease",
    cursor: "default",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #f3f4f6",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#6b7280",
  },
  cardBody: {
    display: "grid",
    gap: 12,
    marginBottom: 16,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
  },
  cardFooter: {
    paddingTop: 16,
    borderTop: "1px solid #f3f4f6",
  },
  loadingBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 60,
    textAlign: "center",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: 500,
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 16,
    padding: 60,
    textAlign: "center",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#991b1b",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#dc2626",
    marginBottom: 24,
  },
  emptyBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 60,
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },
};
