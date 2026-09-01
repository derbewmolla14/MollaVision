const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
