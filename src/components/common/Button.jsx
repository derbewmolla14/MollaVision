const Button = ({ children, variant = 'primary', className = '', type = 'button', ...props }) => {
  const baseClass = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

  const variantClass = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300',
    outline: 'border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  }[variant] || 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';

  return (
    <button type={type} className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
