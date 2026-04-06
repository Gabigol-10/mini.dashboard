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
          <div
            key={user.id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
          >
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
    padding: "40px 32px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    marginBottom: 40,
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: 400,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 24,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
    transition: "all 0.3s ease",
    cursor: "default",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: "1px solid #f3f4f6",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  userName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
    lineHeight: 1.3,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 400,
  },
  cardBody: {
    display: "grid",
    gap: 16,
    marginBottom: 20,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#f9fafb",
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: 600,
  },
  cardFooter: {
    paddingTop: 20,
    borderTop: "1px solid #f3f4f6",
  },
  loadingBox: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 80,
    textAlign: "center",
    maxWidth: 500,
    margin: "60px auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  spinner: {
    width: 56,
    height: 56,
    border: "4px solid #f3f4f6",
    borderTop: "4px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: 500,
  },
  errorBox: {
    background: "#ffffff",
    border: "1px solid #fecaca",
    borderRadius: 16,
    padding: 80,
    textAlign: "center",
    maxWidth: 500,
    margin: "60px auto",
    boxShadow: "0 4px 12px rgba(254, 202, 202, 0.2)",
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#991b1b",
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 15,
    color: "#dc2626",
    marginBottom: 32,
    lineHeight: 1.6,
  },
  emptyBox: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 80,
    textAlign: "center",
    maxWidth: 500,
    margin: "60px auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
  },
};
