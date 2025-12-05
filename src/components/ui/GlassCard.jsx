import { cn } from '../../utils/cn';

export const GlassCard = ({ children, className, hover = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-glass border border-white/20 rounded-3xl p-6",
        hover && "hover:bg-white/15 hover:shadow-2xl hover:shadow-neon-blue/20",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};