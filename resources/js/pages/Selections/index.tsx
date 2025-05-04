import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Paintbrush, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import SelectionModal from './modal';
import SelectionDetailModal from '../SelectionDetails/modal'; // Modal de detalles

interface Selection {
  id: number;
  description: string;
  detail?: string;
  associate_id?: number;
  associate?: { description: string } | null;
  state?: string;
}

interface SelectionDetail {
  id: number;
  description: string;
  detail?: string;
}

interface Pagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export default function Selections() {
  const { selections: initialPagination, associates } = usePage<{
    selections: Pagination<Selection>;
    associates: { id: number; description: string }[];
  }>().props;

  const [selections, setSelections] = useState<Selection[]>(initialPagination?.data || []);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editSelection, setEditSelection] = useState<Selection | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [selectionDetails, setSelectionDetails] = useState<SelectionDetail[]>([]);

  const fetchSelection = async (id: number) => {
    try {
      const res = await axios.get(`/selections/${id}`);
      setEditSelection(res.data.selection);
      setShowModal(true);
    } catch (err) {
      toast.error('❌ Error al obtener los datos');
      console.error(err);
    }
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      setSelections(res.data.selections.data);
      setPagination(res.data.selections);
    } catch (err) {
      toast.error('❌ Error al cargar página');
      console.error(err);
    }
  };

  const handleSaved = async () => {
    await fetchPage(`/selections/fetch?page=${pagination.current_page}`);
    setEditSelection(null);
    setShowModal(false);
    toast.success('✅ Registro guardado');
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Eliminar ${selectedIds.length} registros?`)) {
      try {
        await axios.post('/selections/bulk-delete', { ids: selectedIds });
        setSelections((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
        setSelectedIds([]);
        toast.success('✅ Registros eliminados correctamente');
      } catch (e) {
        toast.error('❌ Error al eliminar en lote');
        console.error(e);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`¿Eliminar registro ID ${id}?`)) {
      try {
        await axios.delete(`/selections/${id}`);
        setSelections((prev) => prev.filter((s) => s.id !== id));
        toast.success('✅ Registro eliminado');
      } catch (e) {
        toast.error('❌ Error al eliminar');
        console.error(e);
      }
    }
  };

  const openDetailModal = async (selection: Selection) => {
    try {
      const res = await axios.get(`/selection-details/by-selection/${selection.id}`);
      setCurrentSelection(selection);
      setSelectionDetails(res.data.details);
      setShowDetailModal(true);
    } catch (error) {
      toast.error('❌ Error al obtener detalles');
      console.error(error);
    }
  };

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Tabla de mantenimiento</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setEditSelection(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Eliminar seleccionados
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === selections.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? selections.map((d) => d.id) : [])
                    }
                  />
                </th>
                <th className="px-4 py-2 text-black dark:text-white">ID</th>
                <th className="px-4 py-2 text-black dark:text-white">Descripción</th>
                <th className="px-4 py-2 text-black dark:text-white">Conectado con</th>
                <th className="px-4 py-2 text-black dark:text-white">Estado</th>
                <th className="px-4 py-2 text-black dark:text-white">Detalle</th>
                <th className="px-4 py-2 text-black dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {selections.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked ? [...prev, d.id] : prev.filter((id) => id !== d.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-2">{d.id}</td>
                  <td className="px-4 py-2">{d.description}</td>
                  <td className="px-4 py-2">{d.associate?.description || 'Ninguno'}</td>
                  <td className={`px-4 py-2 ${d.state === 'Padre' ? 'bg-yellow-300' : d.state === 'Hijo' ? 'bg-orange-400' : ''}`}>{d.state || 'No'}</td>
                  <td className="px-4 py-2">{d.detail || ''}</td>
                  <td className="px-4 py-2 flex gap-1">
                    <button
                      onClick={() => fetchSelection(d.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      <Paintbrush className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => openDetailModal(d)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Listas
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(pagination.last_page)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => fetchPage(`/selections/fetch?page=${page}`)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  pagination.current_page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                disabled={pagination.current_page === page}
              >
                {page}
              </button>
            );
          })}
        </div>
      </div>

      {showModal && (
        <SelectionModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditSelection(null);
          }}
          onSaved={handleSaved}
          selectionToEdit={editSelection}
          associates={associates}
        />
      )}

      {showDetailModal && currentSelection && (
        <SelectionDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setCurrentSelection(null);
          }}
          selection={currentSelection}
          details={selectionDetails}
          onDeleted={(id) => {
            setSelectionDetails((prev) => prev.filter((d) => d.id !== id));
          }}
        />
      )}
    </AppLayout>
  );
}
