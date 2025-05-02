import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function InputGroup({
  label,
  name,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">{label}</Label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="col-span-3 border rounded px-3 py-2 text-sm"
          rows={3}
        />
      ) : (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="col-span-3"
        />
      )}
    </div>
  );
}
