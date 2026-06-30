import { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, id, className = '', ...props }: Props) {
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');
  
  return (
    <div className="group">
      <label 
        htmlFor={inputId} 
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-puskesmas-600 transition-colors duration-200"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`
          block w-full
          rounded-xl border border-gray-200
          bg-white/80 backdrop-blur-sm
          px-4 py-2.5
          text-sm text-gray-800 font-medium
          placeholder:text-gray-400 placeholder:font-normal
          shadow-sm
          hover:border-puskesmas-300 hover:bg-white hover:shadow-md
          focus:border-puskesmas-500 focus:bg-white
          focus:ring-4 focus:ring-puskesmas-500/20 focus:shadow-lg
          focus:outline-none
          transition-all duration-300 ease-out
          ${className}
        `}
        {...props}
      />
    </div>
  );
}