import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface Option {
  label: string;
  value: number | string;
}

export interface SelectProps {
  id?: string;
  value: number | string;
  onChange: (value: number | string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  disabled,
  className = "",
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-gray-50 border ${
          isOpen ? "border-red-400 ring-4 ring-red-500/10" : "border-gray-200"
        } text-sm rounded-xl px-4 py-3 hover:bg-white transition-all duration-200 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-red-500" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-60 overflow-y-auto p-1.5 focus:outline-none">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                  {isSelected && <Check className="w-4 h-4 text-red-600" />}
                </li>
              );
            })}
            {options.length === 0 && (
              <li className="px-3 py-3 text-sm text-gray-500 text-center">
                Nenhuma opção disponível
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
