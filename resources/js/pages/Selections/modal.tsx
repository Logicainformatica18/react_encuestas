import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SelectionModal({
  open,
  onClose,
  onSaved,
  selectionToEdit,
  associates,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  selectionToEdit?: any;
  associates: { id: number; description: string }[];
}) {
  const [form, setForm] = useState({
    description: '',
    detail: '',
    associate_id: '',
    state: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectionToEdit) {
      setForm({
        description: selectionToEdit.description || '',
        detail: selectionToEdit.detail || '',
        associate_id: selectionToEdit.associate_id || '',
        state: selectionToEdit.state || '',
      });
    } else {
      setForm({
        description: '',
        detail: '',
        associate_id: '',
        state: '',
      });
    }
  }, [selectionToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (selectionToEdit) {
        await axios.put(`/selections/${selectionToEdit.id}`, form);
        toast.success('✅ Selección actualizada correctamente');
      } else {
        await axios.post('/selections', form);
       // toast.success('✅ Selección creada correctamente');
      }
      onSaved();
    } catch (err) {
      toast.error('❌ Error al guardar');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{selectionToEdit ? 'Editar Selección' : 'Nueva Selección'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detail">Detalle</Label>
            <Input name="detail" value={form.detail} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="associate_id">Elegir Relación</Label>
            <select
              name="associate_id"
              value={form.associate_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Ninguno</option>
              {associates.map((assoc) => (
                <option key={assoc.id} value={assoc.id}>
                  {assoc.description}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">No</option>
              <option value="Padre">Padre</option>
              <option value="Hijo">Hijo</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
