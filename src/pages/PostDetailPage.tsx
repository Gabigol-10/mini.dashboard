import React from "react";
import { useFetch } from "../hooks/useFetch";
import { apiClient } from "../services/apiClient";
import { Button } from "../components/common/Button";
import type { Post, Comment } from "../types/api";

interface PostDetailPageProps {
  postId: number;
  onBack: () => void;
}

export function PostDetailPage({ postId, onBack }: PostDetailPageProps) {
  const {
    data: post,
    loading: loadingPost,
    error: errorPost,
    refetch: refetchPost,
  } = useFetch<Post>(() => apiClient.get(`/posts/${postId}`), {
    immediate: true,
  });

  const {
    data: comments,
    loading: loadingComments,
    error: errorComments,
    refetch: refetchComments,
  } = useFetch<Comment[]>(() => apiClient.get(`/comments?postId=${postId}`), {
    immediate: true,
  });

  const loading = loadingPost || loadingComments;
  const error = errorPost || errorComments;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Cargando post y comentarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Error al cargar el post</h3>
          <p style={styles.errorMessage}>{error.message}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button
              onClick={() => {
                refetchPost();
                refetchComments();
              }}
            >
              🔄 Reintentar
            </Button>
            <Button variant="ghost" onClick={onBack}>
              ← Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>Post no encontrado</h3>
          <Button onClick={onBack}>← Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Button variant="ghost" onClick={onBack}>
          ← Volver a posts
        </Button>
      </div>

      <div style={styles.postCard}>
        <div style={styles.postHeader}>
          <span style={styles.postId}>Post #{post.id}</span>
          <span style={styles.userId}>Usuario #{post.userId}</span>
        </div>
        <h1 style={styles.postTitle}>{post.title}</h1>
        <p style={styles.postBody}>{post.body}</p>
      </div>

      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          💬 Comentarios ({comments?.length || 0})
        </h2>

        {!comments || comments.length === 0 ? (
          <div style={styles.noComments}>
            <p>Sin comentarios aún</p>
          </div>
        ) : (
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} style={styles.commentCard}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentName}>{comment.name}</span>
                  <span style={styles.commentEmail}>{comment.email}</span>
                </div>
                <p style={styles.commentBody}>{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 32,
    maxWidth: 800,
    margin: "0 auto",
  },
  header: {
    marginBottom: 24,
  },
  postCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 32,
    marginBottom: 32,
  },
  postHeader: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  postId: {
    fontSize: 12,
    fontWeight: 700,
    color: "#667eea",
    background: "#f0f4ff",
    padding: "6px 12px",
    borderRadius: 6,
  },
  userId: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "6px 12px",
    borderRadius: 6,
  },
  postTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
    lineHeight: 1.3,
  },
  postBody: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 1.7,
  },
  commentsSection: {
    marginTop: 32,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 20,
  },
  commentsList: {
    display: "grid",
    gap: 16,
  },
  commentCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: "1px solid #e5e7eb",
  },
  commentName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
  },
  commentEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
  commentBody: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.6,
  },
  noComments: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 40,
    textAlign: "center",
    color: "#6b7280",
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
    marginBottom: 24,
  },
};
