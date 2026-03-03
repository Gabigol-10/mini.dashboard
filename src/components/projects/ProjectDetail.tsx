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
    background: "#fff",
    border: "1px solid #e5e7ff",
    borderRadius: 12,
    padding: 16,
  };

  const noticeStyle: React.CSSProperties = {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.75,
  };

  const kvStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #f3f4f6",
  };

  const kStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    opacity: 0.6,
  };

  const vStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
  };

  if (!project) {
    return <div style={noticeStyle}>Selecciona un proyecto.</div>;
  }

  return (
    <div style={detailStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 900 }}>{project.name}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>ID: {project.id}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" onClick={() => onToggleStatus(project.id)}>
            Toggle status
          </Button>
        </div>
      </div>
      <div style={{ height: 12 }} />
      <div style={kvStyle}>
        <div style={kStyle}>Owner</div>
        <div style={vStyle}>{project.owner}</div>
      </div>
      <div style={kvStyle}>
        <div style={kStyle}>Status</div>
        <div style={vStyle}>
          <Badge tone={project.status === "active" ? "success" : "warn"}>
            {project.status}
          </Badge>
        </div>
      </div>
      <div style={kvStyle}>
        <div style={kStyle}>Budget</div>
        <div style={vStyle}>{money(project.budget)}</div>
      </div>
      <div style={{ height: 16 }} />
      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Nota: este panel está hecho "a propósito" con malas prácticas
        (acoplamiento, estado mezclado, validación a mano, servicios en el mismo
        archivo). El refactor debe arreglar eso.
      </div>
    </div>
  );
}
