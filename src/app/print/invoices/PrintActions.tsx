"use client";

export function PrintActions() {
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 99, display: "flex", gap: 8 }}
      className="no-print">
      <button
        onClick={() => window.print()}
        style={{ background: "#E8521A", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
      >
        Print / Save PDF
      </button>
      <button
        onClick={() => window.close()}
        style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
      >
        Close
      </button>
    </div>
  );
}
