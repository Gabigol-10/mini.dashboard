import React from "react";
import { useFetch } from "../hooks/useFetch";
import { apiClient } from "../services/apiClient";
import { Button } from "../components/common/Button";
import type { Post } from "../types/api";

interface UserPostsPageProps {
  userId: number;
  onSelectPost: (postId: number) => void;
  onBack: () => void;
}

export function UserPostsPage({
  userId,
  onSelectPost,
  onBack,
}: UserPostsPageProps) {
  const { data, loading, error, refetch } = useFetch<Post[]>(
    () => apiClient.get(`/posts?userId=${userId}`),
    { immediate: true }
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Error al cargar posts</h3>
          <p style={styles.errorMessage}>{error.message}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button onClick={refetch}>🔄 Reintentar</Button>
            <Button variant="ghost" onClick={onBack}>
              ← Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>Sin posts</h3>
          <p style={styles.emptyText}>
            Este usuario no tiene posts publicados
          </p>
          <Button onClick={onBack}>← Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Button variant="ghost" onClick={onBack}>
          ← Volver a usuarios
        </Button>
        <h1 style={styles.title}>📝 Posts del Usuario #{userId}</h1>
        <p style={styles.subtitle}>{data.length} posts encontrados</p>
      </div>

      <div style={styles.list}>
        {data.map((post) => (
          <div
            key={post.id}
            style={styles.postCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 16px rgba(0, 0, 0, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 1px 3px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.postHeader}>
              <span style={styles.postId}>#{post.id}</span>
              <h3 style={styles.postTitle}>{post.title}</h3>
            </div>
            <p style={styles.postBody}>
              {post.body.substring(0, 120)}
              {post.body.length > 120 ? "..." : ""}
            </p>
            <div style={styles.postFooter}>
              <Button onClick={() => onSelectPost(post.id)}>
                👁️ Ver detalle
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
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: 400,
  },
  list: {
    display: "grid",
    gap: 20,
  },
  postCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
    transition: "all 0.3s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  postId: {
    fontSize: 12,
    fontWeight: 700,
    color: "#667eea",
    background: "#f0f4ff",
    padding: "6px 12px",
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    flex: 1,
    lineHeight: 1.4,
  },
  postBody: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  postFooter: {
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
    marginBottom: 32,
  },
};
