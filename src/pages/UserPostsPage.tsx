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
          <div key={post.id} style={styles.postCard}>
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
    padding: 32,
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  list: {
    display: "grid",
    gap: 16,
  },
  postCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    transition: "all 0.2s ease",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  postId: {
    fontSize: 12,
    fontWeight: 700,
    color: "#667eea",
    background: "#f0f4ff",
    padding: "4px 10px",
    borderRadius: 6,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
    flex: 1,
  },
  postBody: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  postFooter: {
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
    marginBottom: 24,
  },
};
