import { useMemo, useState, type CSSProperties } from "react";
import { activeFilterColor } from "./active-filter-color";
import FilterIconActive from "./assets/filter-icon-active.svg?react";
import FilterIcon from "./assets/filter-icon.svg?react";
import SearchFilterIconActive from "./assets/search-filter-icon-active.svg?react";
import SearchFilterIcon from "./assets/search-filter-icon.svg?react";
import { textColorFromBackground } from "./get-text-color";

function Swatch({ title, hex }: { title: string; hex: string }) {
  return (
    <div style={{ display: "grid", justifyContent: "center", gap: 8 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: hex,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          title={hex}
        />
        <code style={{ fontSize: 14 }}>{hex}</code>
      </div>
    </div>
  );
}

export default function App() {
  const [base, setBase] = useState("#94e3fe");
  const active = useMemo(() => activeFilterColor(base), [base]);

  const examples = [
    { in: "#fff7d8", out: "#FFE100" },
    { in: "#3ea4e8", out: "#CFEEFF" },
    { in: "#f94230", out: "#8d3229" },
  ];

  return (
    <div
      style={{
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        padding: 24,
        maxWidth: 860,
        margin: "0 auto",
        display: "grid",
        gap: 18,
      }}
    >
      <h1 style={{ margin: 0, fontSize: 20 }}>
        Hex → OKLCH (culori) → Active filter color
      </h1>

      <div
        style={{
          display: "grid",
          gap: 10,
          padding: 16,
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Входной цвет (hex)</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="color"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              style={{
                width: 60,
                height: 60,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            />
          </div>
        </label>

        <div
          style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}
        >
          <Swatch title="Base" hex={base} />
          <Swatch title="Active (computed)" hex={active} />
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderRadius: 14,
            border: "1px dashed rgba(0,0,0,0.2)",
            background: base,
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.75, color: "#000" }}>
            Пример “иконки фильтра”
          </span>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: active,
              border: "1px solid rgba(0,0,0,0.18)",
            }}
            title="icon"
          />
        </div>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 40,
            padding: 12,
            borderRadius: 14,
            border: "1px dashed rgba(0,0,0,0.2)",
            backgroundColor: base,
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <FilterIcon
              style={{
                width: 48,
                height: 48,
                color: textColorFromBackground(base),
              }}
            />
            <FilterIconActive
              style={
                {
                  width: 48,
                  height: 48,
                  "--filter-icon-accent": active!,
                  "--filter-icon-base": textColorFromBackground(active),
                } as CSSProperties
              }
            />
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <SearchFilterIcon
              style={{
                width: 48,
                height: 48,
                color: textColorFromBackground(base),
              }}
            />
            <SearchFilterIconActive
              style={
                {
                  width: 48,
                  height: 48,
                  "--filter-icon-accent": active!,
                  "--filter-icon-base": textColorFromBackground(active),
                } as CSSProperties
              }
            />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          Твои примеры (ожидаемое vs формула)
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {examples.map((ex) => {
            const got = activeFilterColor(ex.in);
            const ok = got.toLowerCase() === ex.out.toLowerCase();
            return (
              <div
                key={ex.in}
                style={{
                  display: "grid",
                  gap: 8,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Swatch title="In" hex={ex.in} />
                  <Swatch title="Expected" hex={ex.out} />
                  <Swatch title="Got" hex={got} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  match: <b>{ok ? "YES" : "NO"}</b>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
