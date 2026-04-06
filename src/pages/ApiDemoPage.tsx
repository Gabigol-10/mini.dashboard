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
        <div style={styles.container}>
          {view === "users" && (
            <div style={styles.fullWidth}>
              <UsersPage onSelectUser={handleSelectUser} />
            </div>
          )}

          {view === "posts" && selectedUserId && (
            <div style={styles.horizontalLayout}>
              <div style={styles.leftPanel}>
                <UsersPage onSelectUser={handleSelectUser} />
              </div>
              <div style={styles.rightPanel}>
                <UserPostsPage
                  userId={selectedUserId}
                  onSelectPost={handleSelectPost}
                  onBack={handleBackToUsers}
                />
              </div>
            </div>
          )}

          {view === "detail" && selectedPostId && (
            <div style={styles.horizontalLayout}>
              <div style={styles.leftPanel}>
                {selectedUserId && (
                  <UserPostsPage
                    userId={selectedUserId}
                    onSelectPost={handleSelectPost}
                    onBack={handleBackToUsers}
                  />
                )}
              </div>
              <div style={styles.rightPanel}>
                <PostDetailPage postId={selectedPostId} onBack={handleBackToPosts} />
              </div>
            </div>
          )}
        </div>
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
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    color: "#ffffff",
  },
  header: {
    background: "rgba(0, 0, 0, 0.8)",
    borderBottom: "1px solid #00d4ff",
    padding: "32px 40px",
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
  },
  headerContent: {
    maxWidth: 1400,
    margin: "0 auto",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#00d4ff",
    marginBottom: 8,
    letterSpacing: "-0.3px",
    textShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#7dd3fc",
    fontWeight: 400,
    textShadow: "0 0 10px rgba(125, 211, 252, 0.5)",
  },
  main: {
    minHeight: "calc(100vh - 140px)",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "32px",
  },
  fullWidth: {
    width: "100%",
  },
  horizontalLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    height: "calc(100vh - 200px)",
  },
  leftPanel: {
    background: "rgba(0, 0, 0, 0.7)",
    borderRadius: 16,
    border: "2px solid #00d4ff",
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
  },
  rightPanel: {
    background: "rgba(0, 0, 0, 0.7)",
    borderRadius: 16,
    border: "2px solid #00d4ff",
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
  },
};
