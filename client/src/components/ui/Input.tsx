import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const input = cva(
  "px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return <input className={input({ className })} {...props} />;
};
