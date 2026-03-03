import React from "react";
import { Badge } from "../common/Badge";
import { money } from "../../utils/formatters";
import type { Project } from "../../services/dashboardService";

interface ProjectListProps {
  projects: Project[];
  selectedId: string | null;
  onSelectProject: (id: string) => void;
}

export function ProjectList({
  projects,
  selectedId,
  onSelectProject,
}: ProjectListProps) {
  const listStyle: React.CSSProperties = {
    display: "grid",
    gap: 12,
    alignContent: "start",
  };

  const noticeStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 32,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
  };

  if (projects.length === 0) {
    return (
      <div style={noticeStyle}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
        Sin resultados
      </div>
    );
  }

  return (
    <div style={listStyle}>
      {projects.map((p) => {
        const active = p.id === selectedId;
        const tone = p.status === "active" ? "success" : "warn";
        return (
          <button
            key={p.id}
            onClick={() => onSelectProject(p.id)}
            className={active ? "rowActive" : "rowIdle"}
            style={{
              textAlign: "left",
              width: "100%",
              border: active ? "2px solid #3b5bff" : "2px solid #e5e7eb",
              background: active
                ? "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)"
                : "#ffffff",
              borderRadius: 12,
              padding: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: active
                ? "0 8px 20px rgba(59, 91, 255, 0.15)"
                : "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#c7d2fe";
                e.currentTarget.style.transform = "translateX(4px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0, 0, 0, 0.05)";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 14,
                  color: active ? "#3b5bff" : "#1f2937",
                }}
              >
                {p.name}
              </div>
              <Badge tone={tone}>{p.status}</Badge>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              👤 <b>{p.owner}</b> • 💰 <b>{money(p.budget)}</b>
            </div>
          </button>
        );
      })}
    </div>
  );
}
