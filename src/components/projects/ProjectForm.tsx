import React from "react";
import { Button } from "../common/Button";
import { TextField } from "../common/TextField";
import type { ApiError } from "../../services/dashboardService";

interface ProjectFormProps {
  name: string;
  owner: string;
  budget: string;
  status: "active" | "paused";
  nameErr: string | null;
  ownerErr: string | null;
  budgetErr: string | null;
  formErr: ApiError | null;
  saving: boolean;
  onNameChange: (value: string) => void;
  onOwnerChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onStatusChange: (value: "active" | "paused") => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ProjectForm({
  name,
  owner,
  budget,
  status,
  nameErr,
  ownerErr,
  budgetErr,
  formErr,
  saving,
  onNameChange,
  onOwnerChange,
  onBudgetChange,
  onStatusChange,
  onSubmit,
}: ProjectFormProps) {
  const formStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    border: "1px solid #e0e4ff",
    borderRadius: 16,
    padding: 24,
    display: "grid",
    gap: 16,
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
  };

  const formRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  };

  const formErrStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #fca5a5",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <form onSubmit={onSubmit} style={formStyle}>
      <div style={formRowStyle}>
        <TextField
          label="Nombre"
          value={name}
          onChange={onNameChange}
          placeholder="Ej: Clinica RV4"
          error={nameErr}
        />
        <TextField
          label="Owner"
          value={owner}
          onChange={onOwnerChange}
          placeholder="Ej: Frontend"
          error={ownerErr}
        />
      </div>
      <div style={formRowStyle}>
        <TextField
          label="Budget (PEN)"
          value={budget}
          onChange={onBudgetChange}
          placeholder="0"
          error={budgetErr}
        />
        <label style={{ display: "grid", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Status
          </span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as "active" | "paused")}
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "2px solid #e5e7eb",
              fontSize: 14,
              outline: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: "#ffffff",
              color: "#1f2937",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3b5bff";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(59, 91, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="active">✅ Active</option>
            <option value="paused">⏸ Paused</option>
          </select>
        </label>
      </div>
      {formErr ? (
        <div style={formErrStyle}>
          <span>⚠️</span>
          {formErr.status ? `(${formErr.status}) ` : ""}
          {formErr.message}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Button type="submit" disabled={saving}>
          {saving ? "⏳ Guardando..." : "✨ Crear Proyecto"}
        </Button>
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 500,
            padding: "8px 12px",
            background: "#f3f4f6",
            borderRadius: 6,
          }}
        >
          📋 Reglas: nombre ≥ 3, owner requerido, budget numérico
        </span>
      </div>
    </form>
  );
}
