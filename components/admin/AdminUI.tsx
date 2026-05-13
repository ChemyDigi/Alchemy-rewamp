interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({ children, className = "" }: AdminCardProps) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-5 lg:p-6 shadow-sm ${className}`}
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
  color?: string;
}

export function StatCard({ label, value, icon, trend, color = "#e3791d" }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 text-2xl font-bold mt-0.5">{value}</p>
        {trend && <p className="text-gray-400 text-xs mt-0.5">{trend}</p>}
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
        <h1 className="text-gray-900 text-xl font-bold leading-tight">{title}</h1>
        {description && (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
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
        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
          {icon}
        </div>
      )}
      <p className="text-gray-700 font-semibold text-base">{title}</p>
      {description && (
        <p className="text-gray-400 text-sm mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
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
        <label className="block text-gray-600 text-sm font-medium">{label}</label>
      )}
      <input
        {...props}
        className={`w-full bg-white border ${
          error ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"
        } rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#e3791d] focus:ring-2 focus:ring-orange-100 transition-all text-sm ${className}`}
      />
      {error && <p className="text-red-500 text-xs flex items-center gap-1">{error}</p>}
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
        <label className="block text-gray-600 text-sm font-medium">{label}</label>
      )}
      <textarea
        {...props}
        className={`w-full bg-white border ${
          error ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"
        } rounded-xl px-4 py-2.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-[#e3791d] focus:ring-2 focus:ring-orange-100 transition-all text-sm resize-none ${className}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
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
        <label className="block text-gray-600 text-sm font-medium">{label}</label>
      )}
      <select
        {...props}
        className={`w-full bg-white border ${
          error ? "border-red-300" : "border-gray-200"
        } rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#e3791d] focus:ring-2 focus:ring-orange-100 transition-all text-sm ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
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
    primary: "bg-[#e3791d] hover:bg-[#cc6a18] text-white shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200",
    secondary: "bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 shadow-sm hover:shadow",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200",
    ghost: "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

interface SectionHeadingProps {
  children: React.ReactNode;
  description?: string;
}

export function SectionHeading({ children, description }: SectionHeadingProps) {
  return (
    <div className="mb-5">
      <h2 className="text-gray-800 font-semibold text-sm uppercase tracking-wider">{children}</h2>
      {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
    </div>
  );
}
