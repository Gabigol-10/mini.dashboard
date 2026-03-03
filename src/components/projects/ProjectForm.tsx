import React from "react";
import { Button } from "../common/Button";
import { TextField } from "../common/TextField";

interface ProjectFormProps {
  name: string;
  owner: string;
  budget: string;
  status: "active" | "paused";
  nameErr: string | null;
  ownerErr: string | null;
  budgetErr: string | null;
  formErr: string | null;
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
    background: "#fff",
    border: "1px solid #e5e7ff",
    borderRadius: 12,
    padding: 16,
    display: "grid",
    gap: 12,
  };

  const formRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  };

  const formErrStyle: React.CSSProperties = {
    background: "#ffe7e7",
    color: "#a11a1a",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
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
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Status</span>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as "active" | "paused")}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d9d9e3",
              fontSize: 14,
            }}
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
          </select>
        </label>
      </div>
      {formErr ? <div style={formErrStyle}>{formErr}</div> : null}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Button disabled={saving}>{saving ? "Guardando…" : "Crear"}</Button>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          Reglas: nombre ≥ 3, owner requerido, budget numérico.
        </span>
      </div>
    </form>
  );
}
