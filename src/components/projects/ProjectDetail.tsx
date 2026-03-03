import React from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { money } from "../../utils/formatters";
import type { Project } from "../../services/dashboardService";

interface ProjectDetailProps {
  project: Project | null;
  onToggleStatus: (id: string) => void;
}

export function ProjectDetail({ project, onToggleStatus }: ProjectDetailProps) {
  const detailStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    border: "1px solid #e0e4ff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
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

  const kvStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
  };

  const kStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  };

  const vStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#1f2937",
  };

  if (!project) {
    return (
      <div style={noticeStyle}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
        Selecciona un proyecto
      </div>
    );
  }

  return (
    <div style={detailStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: "#1f2937",
              lineHeight: 1.2,
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#9ca3af",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            ID: {project.id}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" onClick={() => onToggleStatus(project.id)}>
            🔄 Toggle
          </Button>
        </div>
      </div>
      <div style={kvStyle}>
        <div style={kStyle}>👤 Owner</div>
        <div style={vStyle}>{project.owner}</div>
      </div>
      <div style={kvStyle}>
        <div style={kStyle}>📊 Status</div>
        <div style={vStyle}>
          <Badge tone={project.status === "active" ? "success" : "warn"}>
            {project.status}
          </Badge>
        </div>
      </div>
      <div style={{ ...kvStyle, borderBottom: "none" }}>
        <div style={kStyle}>💰 Budget</div>
        <div style={vStyle}>{money(project.budget)}</div>
      </div>
      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
          borderRadius: 10,
          fontSize: 12,
          color: "#4338ca",
          fontWeight: 500,
          lineHeight: 1.6,
          border: "1px solid #c7d2fe",
        }}
      >
        ℹ️ <b>Nota:</b> Arquitectura refactorizada con separación de
        responsabilidades, hooks personalizados, componentes reutilizables y
        tipado estricto TypeScript.
      </div>
    </div>
  );
}
