import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import SurveyModal from './modal';
import axios from 'axios';
import { Paintbrush, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Encuestas', href: '/surveys' },
];

type Survey = {
  id: number;
  title: string;
  description?: string;
  detail?: string;
  url?: string;
  date_start?: string;
  date_end?: string;
  front_page?: string;
  visible?: boolean;
  email_confirmation?: boolean;
  password?: string;
  type?: string;
  state?: string;
};

type Pagination<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

export default function Surveys() {
  const { surveys: initialPagination } = usePage<{ surveys: Pagination<Survey> }>().props;
  const [surveys, setSurveys] = useState<Survey[]>(initialPagination.data);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editSurvey, setEditSurvey] = useState<Survey | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchSurvey = async (id: number) => {
    const res = await axios.get(`/surveys/${id}`);
    setEditSurvey(res.data.survey);
    setShowModal(true);
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      setSurveys(res.data.surveys.data);
      setPagination(res.data.surveys);
    } catch (e) {
      toast.error('❌ Error al cargar la página');
      console.error(e);
    }
  };

  const handleSurveySaved = async () => {
    await fetchPage(`/surveys/fetch?page=${pagination.current_page}`);
    setShowModal(false);
    setEditSurvey(null);
    toast.success('✅ Encuesta guardada');
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Eliminar ${selectedIds.length} encuestas?`)) {
      try {
        await axios.post('/surveys/bulk-delete', { ids: selectedIds });
        setSurveys((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
        setSelectedIds([]);
        toast.success('✅ Encuestas eliminadas correctamente');
      } catch (e) {
        toast.error('❌ Error al eliminar en lote');
        console.error(e);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`¿Eliminar encuesta ID ${id}?`)) {
      try {
        await axios.delete(`/surveys/${id}`);
        setSurveys((prev) => prev.filter((s) => s.id !== id));
        toast.success('✅ Encuesta eliminada');
      } catch (e) {
        toast.error('❌ Error al eliminar encuesta');
        console.error(e);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Listado de Encuestas</h1>
        <button
          onClick={() => {
            setEditSurvey(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nueva Encuesta
        </button>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Eliminar seleccionadas
          </button>
        )}

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === surveys.length}
                    onChange={(e) => {
                      setSelectedIds(e.target.checked ? surveys.map((s) => s.id) : []);
                    }}
                  />
                </th>
                <th className="px-4 py-2 text-black dark:text-white">Acciones</th>
                <th className="px-4 py-2 text-black dark:text-white">ID</th>
                <th className="px-4 py-2 text-black dark:text-white">Título</th>
                <th className="px-4 py-2 text-black dark:text-white">Descripción</th>
                <th className="px-4 py-2 text-black dark:text-white">Detalle</th>
                <th className="px-4 py-2 text-black dark:text-white">URL</th>
                <th className="px-4 py-2 text-black dark:text-white">Inicio</th>
                <th className="px-4 py-2 text-black dark:text-white">Fin</th>
                <th className="px-4 py-2 text-black dark:text-white">Portada</th>
                <th className="px-4 py-2 text-black dark:text-white">Visible</th>
                <th className="px-4 py-2 text-black dark:text-white">Confirmación</th>
                <th className="px-4 py-2 text-black dark:text-white">Contraseña</th>
                <th className="px-4 py-2 text-black dark:text-white">Tipo</th>
                <th className="px-4 py-2 text-black dark:text-white">Estado</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(s.id)}
                      onChange={(e) => {
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, s.id]
                            : prev.filter((id) => id !== s.id)
                        );
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 text-sm space-y-1">
                   <button


  onClick={() => router.visit(`/survey-details/${s.id}`)}
  className="block text-center w-full bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 transition"
>
  Ver preguntas
</button>

                    <button
                      onClick={() => fetchSurvey(s.id)}
                      className="block text-center w-full text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <Paintbrush className="w-4 h-4 inline" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="block text-center w-full text-red-600 hover:underline dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 inline" /> Eliminar
                    </button>
                  </td>
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2">{s.title}</td>
                  <td className="px-4 py-2">{s.description}</td>
                  <td className="px-4 py-2">{s.detail}</td>
                  <td className="px-4 py-2">{s.url}</td>
                  <td className="px-4 py-2">{s.date_start}</td>
                  <td className="px-4 py-2">{s.date_end}</td>
                  <td className="px-4 py-2">
                    {s.front_page && (
                      <a
                        href={`/imageusers/${s.front_page}`}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        Ver
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-2">{s.visible ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-2">{s.email_confirmation ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-2">{s.password}</td>
                  <td className="px-4 py-2">{s.type}</td>
                  <td className="px-4 py-2">{s.state}</td>
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
                onClick={() => fetchPage(`/surveys/fetch?page=${page}`)}
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
        <SurveyModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditSurvey(null);
          }}
          onSaved={handleSurveySaved}
          surveyToEdit={editSurvey}
        />
      )}
    </AppLayout>
  );
}
