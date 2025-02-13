import React from "react";
import { useTheme } from "../context/ThemeContext";

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
