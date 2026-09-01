const Badge = ({ children, variant = "default", className = "", ...props }) => {
  const variantClass = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  }[variant];

  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
