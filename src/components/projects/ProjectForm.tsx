import React from "react";
import { Button } from "../common/Button";
import type { ApiError } from "../../services/dashboardService";

interface Props {
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

  onSubmit: () => void;
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
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      style={styles.form}
    >
      {/* Nombre */}
      <div style={styles.field}>
        <label style={styles.label}>Nombre del proyecto</label>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ej: Clinica RV4"
          style={styles.input}
        />
        {nameErr && <span style={styles.error}>{nameErr}</span>}
      </div>

      {/* Owner */}
      <div style={styles.field}>
        <label style={styles.label}>Responsable</label>
        <input
          value={owner}
          onChange={(e) => onOwnerChange(e.target.value)}
          placeholder="Ej: Frontend"
          style={styles.input}
        />
        {ownerErr && <span style={styles.error}>{ownerErr}</span>}
      </div>

      {/* Budget */}
      <div style={styles.field}>
        <label style={styles.label}>Presupuesto (PEN)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
          placeholder="0"
          style={styles.input}
        />
        {budgetErr && <span style={styles.error}>{budgetErr}</span>}
      </div>

      {/* Status */}
      <div style={styles.field}>
        <label style={styles.label}>Estado</label>
        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as "active" | "paused")
          }
          style={styles.input}
        >
          <option value="active">✅ Activo</option>
          <option value="paused">⏸ Pausado</option>
        </select>
      </div>

      {formErr && (
        <div style={styles.formError}>
          ⚠️ {formErr.status ? `(${formErr.status}) ` : ""}
          {formErr.message}
        </div>
      )}

      <Button type="submit" disabled={saving}>
        {saving ? "⏳ Guardando..." : "✨ Crear proyecto"}
      </Button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "grid",
    gap: 16,
    padding: 24,
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    borderRadius: 16,
    border: "1px solid #e0e4ff",
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
  },
  field: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "2px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s ease",
    background: "#ffffff",
    color: "#1f2937",
    caretColor: "#3b5bff",
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: 600,
  },
  formError: {
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    padding: "12px 16px",
    borderRadius: 10,
    color: "#991b1b",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #fca5a5",
  },
};
