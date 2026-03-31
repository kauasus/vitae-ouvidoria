import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({ label, icon, className = "", children, ...props }) => {
  return (
    <button className={`btn-primary ${className}`} {...props}>
      {icon && <i className={`${icon} mr-2`}></i>}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
};

export default Button;