import { cn } from '../../utils/cn';

export const Card = ({ children, className, hover = true, padding = "p-6", ...props }) => {
  return (
    <div
      className={cn(
        "bg-white border border-slate-100 rounded-2xl shadow-soft overflow-hidden",
        hover && "transition-all duration-500 hover:shadow-hover hover:-translate-y-1",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};