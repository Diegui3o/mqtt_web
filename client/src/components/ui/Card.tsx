import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Agregar className opcional
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`p-4 border rounded-lg shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};
