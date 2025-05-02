import { Label } from '@/components/ui/label';

export default function SelectGroup({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">{label}</Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="col-span-3 border rounded px-3 py-2 text-sm"
      >
        <option value="">Selecciona...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
