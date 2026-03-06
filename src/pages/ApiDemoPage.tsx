import React, { useState } from "react";
import { UsersPage } from "./UsersPage";
import { UserPostsPage } from "./UserPostsPage";
import { PostDetailPage } from "./PostDetailPage";

type View = "users" | "posts" | "detail";

export function ApiDemoPage() {
  const [view, setView] = useState<View>("users");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    setView("posts");
  };

  const handleSelectPost = (postId: number) => {
    setSelectedPostId(postId);
    setView("detail");
  };

  const handleBackToUsers = () => {
    setView("users");
    setSelectedUserId(null);
    setSelectedPostId(null);
  };

  const handleBackToPosts = () => {
    setView("posts");
    setSelectedPostId(null);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>🌐 API Demo</h1>
          <p style={styles.headerSubtitle}>
            Consumo profesional de JSONPlaceholder API
          </p>
        </div>
      </header>

      <main style={styles.main}>
        {view === "users" && <UsersPage onSelectUser={handleSelectUser} />}

        {view === "posts" && selectedUserId && (
          <UserPostsPage
            userId={selectedUserId}
            onSelectPost={handleSelectPost}
            onBack={handleBackToUsers}
          />
        )}

        {view === "detail" && selectedPostId && (
          <PostDetailPage postId={selectedPostId} onBack={handleBackToPosts} />
        )}
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
  },
  header: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "24px 32px",
  },
  headerContent: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  main: {
    minHeight: "calc(100vh - 100px)",
  },
};
