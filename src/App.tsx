import { useState } from "react";
import "./App.css";
import { DashboardPage } from "./pages/DashboardPage";
import { ApiDemoPage } from "./pages/ApiDemoPage";

type Page = "dashboard" | "api-demo";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  return (
    <div>
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

      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "api-demo" && <ApiDemoPage />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    background: "#111827",
    padding: "12px 24px",
    display: "flex",
    gap: 12,
  },
  navButton: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  navButtonActive: {
    background: "#374151",
    color: "#ffffff",
  },
};
