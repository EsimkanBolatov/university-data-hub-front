import { cn } from '../../utils/cn';

export const Card = ({ children, className, hover = false, padding = "p-6", ...props }) => {
  return (
    <div
      className={cn(
        "bg-white border border-slate-100 rounded-2xl shadow-card",
        hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};