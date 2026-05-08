interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className = "" }: AdminCardProps) {
  return (
    <div
      className={`bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 bg-[#e3791d]/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <span className="text-[#e3791d]">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {trend && <p className="text-slate-500 text-xs mt-1">{trend}</p>}
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-white text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-16 h-16 bg-[#12122a] rounded-2xl flex items-center justify-center mb-4 text-slate-600">
          {icon}
        </div>
      )}
      <p className="text-slate-300 font-semibold text-base">{title}</p>
      {description && (
        <p className="text-slate-600 text-sm mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function AdminInput({ label, error, className = "", ...props }: AdminInputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-slate-400 text-sm font-medium">{label}</label>
      )}
      <input
        {...props}
        className={`w-full bg-[#080818] border ${error ? "border-red-500/50" : "border-[#1a1a35]"} rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#e3791d]/60 focus:ring-1 focus:ring-[#e3791d]/30 transition-all text-sm ${className}`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function AdminTextarea({ label, error, className = "", ...props }: AdminTextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-slate-400 text-sm font-medium">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full bg-[#080818] border ${error ? "border-red-500/50" : "border-[#1a1a35]"} rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#e3791d]/60 focus:ring-1 focus:ring-[#e3791d]/30 transition-all text-sm resize-none ${className}`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function AdminSelect({ label, options, error, className = "", ...props }: AdminSelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-slate-400 text-sm font-medium">{label}</label>
      )}
      <select
        {...props}
        className={`w-full bg-[#080818] border ${error ? "border-red-500/50" : "border-[#1a1a35]"} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#e3791d]/60 transition-all text-sm ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function AdminButton({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: AdminButtonProps) {
  const variants = {
    primary: "bg-[#e3791d] hover:bg-[#cc6a18] text-white",
    secondary: "bg-[#12122a] hover:bg-[#1a1a3a] border border-[#1a1a35] text-slate-200",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-[#12122a]",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
