import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ variant = 'primary', loading, icon, children, className = '', ...props }: Props) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-puskesmas-700 text-white hover:bg-puskesmas-800 focus:ring-puskesmas-500 active:scale-[0.98] shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-[0.98]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="animate-spin" size={16} /> : icon} {children}
    </button>
  );
}