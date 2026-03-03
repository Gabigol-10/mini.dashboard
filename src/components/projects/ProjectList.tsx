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
    gap: 10,
    alignContent: "start",
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

  if (projects.length === 0) {
    return <div style={noticeStyle}>Sin resultados.</div>;
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
              border: "1px solid #e5e7ff",
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 900, fontSize: 13 }}>{p.name}</div>
              <Badge tone={tone}>{p.status}</Badge>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              Owner: <b>{p.owner}</b> • Budget: <b>{money(p.budget)}</b>
            </div>
          </button>
        );
      })}
    </div>
  );
}
