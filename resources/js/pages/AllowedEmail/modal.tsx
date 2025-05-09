// Modal.tsx para AllowedEmail
import {
    Dialog,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { Loader2 } from 'lucide-react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { toast } from 'sonner';
  import { Label } from '@/components/ui/label';

  export default function EmailModal({
    open,
    onClose,
    onSaved,
    emailToEdit,
    surveyId,
  }: {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    emailToEdit?: any;
    surveyId: number;
  }) {
    const [form, setForm] = useState({
      id: 0,
      email: '',
      quanty: 1,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (emailToEdit && typeof emailToEdit === 'object' && 'id' in emailToEdit) {
            setForm({
              id: emailToEdit.id ?? 0,
              email: emailToEdit.email ?? '',
              quanty: emailToEdit.quanty ?? 1,
            });
          }
          else {
        setForm({ id: 0, email: '', quanty: 1 });
      }
    }, [emailToEdit]);

    const handleSubmit = async () => {
      if (!form.email) {
        toast.error('El correo es obligatorio');
        return;
      }

      setSaving(true);
      try {
        const url = form.id ? `/allowed-emails/${form.id}` : '/allowed-emails';
        const method = form.id ? 'put' : 'post';

        await axios({
          method,
          url,
          data: {
            email: form.email,
            quanty: form.quanty,
            survey_id: surveyId,
          },
        });

        onSaved();
        onClose();
      } catch (err) {
        toast.error('❌ Error al guardar el correo');
        console.error(err);
      } finally {
        setSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-[90vw] max-w-md rounded-lg shadow-xl flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {form.id ? 'Editar Correo' : 'Nuevo Correo'}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              <div>
                <Label htmlFor="quanty">Cantidad de encuestas permitidas</Label>
                <input
                  id="quanty"
                  type="number"
                  placeholder="Ej. 1, 5, 10..."
                  value={form.quanty}
                  min={1}
                  onChange={(e) => setForm((f) => ({ ...f, quanty: Number(e.target.value) }))}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
