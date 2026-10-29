// Reusable Badge component for tags and labels
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full transition-colors";

  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-lightbg text-dark border border-gray-200",
    outline: "bg-transparent text-dark border border-gray-300",
    dark: "bg-dark text-white",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2 text-base",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return <span className={classes}>{children}</span>;
};
