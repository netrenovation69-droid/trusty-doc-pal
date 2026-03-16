import type { ToolOption } from '@/lib/pdf/types';

interface ToolOptionsProps {
  options: ToolOption[];
  values: Record<string, string | number>;
  onChange: (values: Record<string, string | number>) => void;
}

export const ToolOptions = ({ options, values, onChange }: ToolOptionsProps) => {
  const update = (key: string, value: string | number) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Options</h3>
      {options.map((opt) => (
        <div key={opt.key} className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{opt.label}</label>
          {opt.type === 'select' && (
            <select
              value={values[opt.key] as string || opt.defaultValue || ''}
              onChange={(e) => update(opt.key, e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/30"
            >
              {opt.choices?.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          )}
          {opt.type === 'text' && (
            <input
              type="text"
              value={values[opt.key] as string || ''}
              onChange={(e) => update(opt.key, e.target.value)}
              placeholder={opt.placeholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/30"
            />
          )}
          {opt.type === 'password' && (
            <input
              type="password"
              value={values[opt.key] as string || ''}
              onChange={(e) => update(opt.key, e.target.value)}
              placeholder={opt.placeholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/30"
            />
          )}
          {opt.type === 'number' && (
            <input
              type="number"
              value={values[opt.key] as number ?? opt.defaultValue ?? ''}
              onChange={(e) => update(opt.key, Number(e.target.value))}
              min={opt.min}
              max={opt.max}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-trust-blue/30"
            />
          )}
        </div>
      ))}
    </div>
  );
};
