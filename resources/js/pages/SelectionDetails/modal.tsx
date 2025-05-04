import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface SelectionDetail {
  id: number;
  description: string;
}

interface Selection {
  id: number;
  description: string;
}

interface PaginatedResponse {
  data: SelectionDetail[];
  current_page: number;
  last_page: number;
}

export default function SelectionDetailModal({
  open,
  onClose,
  selection,
}: {
  open: boolean;
  onClose: () => void;
  selection: Selection;
}) {
  const [details, setDetails] = useState<SelectionDetail[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  const loadDetails = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`/selection-details/by-selection/${selection.id}?page=${page}`);
      setDetails(res.data.data);
      setPagination(res.data);
    } catch (err) {
      toast.error('❌ Error al cargar listas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!description.trim()) return toast.warning('Ingrese una descripción');
    setLoading(true);
    try {
      await axios.post('/selection-details', {
        description,
        primary: selection.id,
      });
      toast.success('✅ Agregado correctamente');
      setDescription('');
      loadDetails(pagination?.current_page || 1);
    } catch (err) {
      toast.error('❌ Error al agregar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`¿Eliminar ítem con ID ${id}?`)) {
      try {
        await axios.delete(`/selection-details/${id}`);
        toast.success('✅ Ítem eliminado');
        loadDetails(pagination?.current_page || 1);
      } catch (err) {
        toast.error('❌ Error al eliminar');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (open && selection?.id) {
      loadDetails();
    }
  }, [open, selection]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Listas de: {selection.description}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-end mt-2">
          <Input
            placeholder="Nueva descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={loading}>
            Agregar
          </Button>
        </div>

        <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : (
            <>
              <table className="w-full table-auto text-sm bg-white dark:bg-gray-900">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Descripción</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {details.length > 0 ? (
                    details.map((d, i) => (
                      <tr key={d.id} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">{(pagination?.current_page - 1) * 7 + i + 1}</td>
                        <td className="px-4 py-2">{d.description}</td>
                        <td className="px-4 py-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(d.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                        No hay listas asociadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {pagination && pagination.last_page > 1 && (
                <div className="flex flex-wrap justify-center mt-4 gap-2 overflow-x-auto px-2">
                  {[...Array(pagination.last_page)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => loadDetails(page)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          pagination.current_page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
