import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export default function Select({ label, options, id, className = '', ...props }: Props) {
  const selectId = id || label.toLowerCase().replace(/\s/g, '-');
  
  return (
    <div className="group">
      <label 
        htmlFor={selectId} 
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-puskesmas-600 transition-colors duration-200"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          className={`
            block w-full appearance-none
            rounded-xl border border-gray-200
            bg-white/80 backdrop-blur-sm
            px-4 py-2.5 pr-10
            text-sm text-gray-800 font-medium
            shadow-sm
            hover:border-puskesmas-300 hover:bg-white hover:shadow-md
            focus:border-puskesmas-500 focus:bg-white
            focus:ring-4 focus:ring-puskesmas-500/20 focus:shadow-lg
            focus:outline-none
            transition-all duration-300 ease-out
            cursor-pointer
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="py-2">
              {opt}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown 
            size={18} 
            className="text-gray-400 group-focus-within:text-puskesmas-500 group-focus-within:rotate-180 transition-all duration-300 ease-out" 
          />
        </div>
      </div>
    </div>
  );
}