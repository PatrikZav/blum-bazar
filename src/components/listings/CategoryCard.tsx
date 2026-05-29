// Klikací karta pro výběr kategorie inzerátů, která se ukazuje na hlavní stránce.
"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  label: string;
  emoji: string;
  image: string;
  color: string;
}

export function CategoryCard({ label, emoji, image, color }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/cs/inzeraty?kategorie=${encodeURIComponent(label)}`} style={{ textDecoration: "none" }}>
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          aspectRatio: "4/3",
          cursor: "pointer",
          background: color,
          width: "100%",
          minHeight: "200px",
          border: "none",
          padding: 0,
          display: "block",
        }}
      >
        {/* Obrázek */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Liquid glass */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        />

        {/* Text a emoji */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px",
            opacity: hovered ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          <span style={{ fontSize: "2rem" }}>{emoji}</span>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          >
            {label}
          </span>
        </div>
      </button>
    </Link>
  );
}
