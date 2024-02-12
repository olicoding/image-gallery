const Button = ({
  children,
  className,
  onClick,
  size = "normal",
  variant = "primary",
  ...props
}) => {
  const baseStyle = "rounded-md focus:outline-none mb-2";

  const sizeStyle = {
    small: "text-sm px-2 py-1",
    normal: "text-md px-4 py-2",
    icon: "p-2",
  };

  const variantStyle = {
    primary: "bg-gray-900 text-white",
    ghost: "bg-transparent",
  };

  const classes = `${baseStyle} ${sizeStyle[size]} ${variantStyle[variant]} ${className}`;

  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
