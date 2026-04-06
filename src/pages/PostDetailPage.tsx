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
              <div
                key={comment.id}
                style={styles.commentCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 0, 0, 0.05)";
                }}
              >
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
    padding: "40px 32px",
    maxWidth: 1000,
    margin: "0 auto",
  },
  header: {
    marginBottom: 32,
  },
  postCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 40,
    marginBottom: 40,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  postHeader: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  postId: {
    fontSize: 13,
    fontWeight: 700,
    color: "#667eea",
    background: "#f0f4ff",
    padding: "8px 16px",
    borderRadius: 8,
  },
  userId: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "8px 16px",
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 20,
    lineHeight: 1.3,
    letterSpacing: "-0.5px",
  },
  postBody: {
    fontSize: 17,
    color: "#374151",
    lineHeight: 1.8,
  },
  commentsSection: {
    marginTop: 40,
  },
  commentsTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 24,
    letterSpacing: "-0.3px",
  },
  commentsList: {
    display: "grid",
    gap: 20,
  },
  commentCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: "1px solid #f3f4f6",
  },
  commentName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  commentEmail: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  commentBody: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 1.7,
  },
  noComments: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 48,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 15,
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
    marginBottom: 32,
  },
};
