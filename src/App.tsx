import { useState } from "react";
import "./App.css";
import { DashboardPage } from "./pages/DashboardPage";
import { ApiDemoPage } from "./pages/ApiDemoPage";

type Page = "dashboard" | "api-demo";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={styles.app}>
      {isLoggedIn && (
        <nav style={styles.nav}>
          <button
            onClick={() => setCurrentPage("dashboard")}
            style={{
              ...styles.navButton,
              ...(currentPage === "dashboard" ? styles.navButtonActive : {}),
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("api-demo")}
            style={{
              ...styles.navButton,
              ...(currentPage === "api-demo" ? styles.navButtonActive : {}),
            }}
          >
            🌐 API Demo
          </button>
        </nav>
      )}

      {currentPage === "dashboard" && (
        <DashboardPage onLoginStateChange={setIsLoggedIn} />
      )}
      {currentPage === "api-demo" && isLoggedIn && <ApiDemoPage />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  },
  nav: {
    background: "rgba(0, 0, 0, 0.8)",
    padding: "12px 24px",
    display: "flex",
    gap: 12,
    borderBottom: "1px solid #00d4ff",
    boxShadow: "0 0 15px rgba(0, 212, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
  navButton: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "2px solid transparent",
    background: "transparent",
    color: "#7dd3fc",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textShadow: "0 0 5px rgba(125, 211, 252, 0.3)",
  },
  navButtonActive: {
    background: "rgba(0, 212, 255, 0.1)",
    color: "#00d4ff",
    border: "2px solid #00d4ff",
    boxShadow: "0 0 15px rgba(0, 212, 255, 0.4), inset 0 0 15px rgba(0, 212, 255, 0.1)",
    textShadow: "0 0 10px #00d4ff",
  },
};
