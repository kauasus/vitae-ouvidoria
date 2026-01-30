import React from "react";
import { Button as PrimeButton, type ButtonProps } from "primereact/button";

const Button: React.FC<ButtonProps> = (props) => {
  return <PrimeButton {...props} />;
};

export default Button;