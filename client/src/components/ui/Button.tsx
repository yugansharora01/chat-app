
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <button className={button({ className })} {...props} />;
};
