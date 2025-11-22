import React from "react";

interface PillProps {
  color: "green" | "yellow" | "red" | "gray" | "blue";
  children: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ color, children }) => {
  return <span className={`pill pill-${color}`}>{children}</span>;
};
