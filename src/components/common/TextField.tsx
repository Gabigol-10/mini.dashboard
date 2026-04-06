interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  type?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: TextFieldProps) {
  return (
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
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: error ? "2px solid #ef4444" : "2px solid #e5e7eb",
          outline: "none",
          fontSize: 14,
          transition: "all 0.2s ease",
          background: error ? "#fef2f2" : "#ffffff",
          color: "#1f2937",
          caretColor: "#3b5bff",
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "#3b5bff";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 91, 255, 0.1)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.boxShadow = "none";
          }
        }}
      />
      {error ? (
        <span
          style={{
            color: "#dc2626",
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ⚠ {error}
        </span>
      ) : null}
    </label>
  );
}
