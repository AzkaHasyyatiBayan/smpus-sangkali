interface BadgeProps {
  status: 'past' | 'today' | 'soon' | 'future';
  children: React.ReactNode;
}

const statusClasses = {
  past: 'bg-gray-100 text-gray-600 border-gray-200',
  today: 'bg-green-100 text-green-700 border-green-200 shadow-sm shadow-green-100',
  soon: 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm shadow-blue-100',
  future: 'bg-yellow-100 text-yellow-700 border-yellow-200 shadow-sm shadow-yellow-100',
};

const dotClasses = {
  past: 'bg-gray-400',
  today: 'bg-green-500 animate-pulse',
  soon: 'bg-blue-500',
  future: 'bg-yellow-500',
};

export default function Badge({ status, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusClasses[status]} transition-all duration-200 hover:scale-105`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[status]}`} />
      {children}
    </span>
  );
}