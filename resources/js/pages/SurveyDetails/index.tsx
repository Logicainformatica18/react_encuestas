import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Paintbrush, Trash2 } from 'lucide-react';
import axios from 'axios';
import SurveyDetailModal from './modal';
import { toast } from 'sonner';

interface SurveyDetail {
  id: number;
  question: string;
  type: string;
  option: string;
  title?: string;
  state?: string;
  evaluate?: string;
  requerid?: string;
  visible?: string;
}

interface Pagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export default function SurveyDetails() {
  const { surveyDetails: initialPagination, survey } = usePage<{
    surveyDetails: Pagination<SurveyDetail>;
    survey: { id: number; title: string };
  }>().props;

  const [details, setDetails] = useState<SurveyDetail[]>(initialPagination?.data || []);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editDetail, setEditDetail] = useState<SurveyDetail | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchDetail = async (id: number) => {
    const res = await axios.get(`/survey-details/${id}/edit`);
    setEditDetail(res.data.survey_detail); // ✅

    setShowModal(true);
  };

  const handleSaved = async () => {
    await fetchPage(`/survey-details/fetch?page=${pagination.current_page}&survey_id=${survey.id}`);
    setEditDetail(null);
    setShowModal(false);
    toast.success('✅ Pregunta guardada');
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      setDetails(res.data.surveyDetails.data);
      setPagination(res.data.surveyDetails);
    } catch (err) {
      toast.error('❌ Error al cargar página');
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Eliminar ${selectedIds.length} preguntas?`)) {
      try {
        await axios.post('/survey-details/bulk-delete', { ids: selectedIds });
        setDetails((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
        setSelectedIds([]);
        toast.success('✅ Preguntas eliminadas correctamente');
      } catch (e) {
        toast.error('❌ Error al eliminar en lote');
        console.error(e);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`¿Eliminar pregunta ID ${id}?`)) {
      try {
        await axios.delete(`/survey-details/${id}`);
        setDetails((prev) => prev.filter((s) => s.id !== id));
        toast.success('✅ Pregunta eliminada');
      } catch (e) {
        toast.error('❌ Error al eliminar');
        console.error(e);
      }
    }
  };

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Preguntas de: {survey.title}</h1>

        <button
          onClick={() => {
            setEditDetail(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nueva Pregunta
        </button>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Eliminar seleccionadas
          </button>
        )}

        <a
          href={`/survey-details/export/${survey.id}`}
          className="px-4 ml-2 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          target="_blank"
        >
          Exportar a Excel
        </a>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === details.length}
                    onChange={(e) =>
                      setSelectedIds(e.target.checked ? details.map((d) => d.id) : [])
                    }
                  />
                </th>
                <th className="px-4 py-2 text-black dark:text-white">Acciones</th>
                <th className="px-4 py-2 text-black dark:text-white">ID</th>
                <th className="px-4 py-2 text-black dark:text-white">Pregunta</th>
                <th className="px-4 py-2 text-black dark:text-white">Tipo</th>
                <th className="px-4 py-2 text-black dark:text-white">Título</th>
                <th className="px-4 py-2 text-black dark:text-white whitespace-pre-wrap break-words max-w-xs">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d) => (
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
                  <td className="px-4 py-2 space-y-1">
                    <button
                      onClick={() => fetchDetail(d.id)}
                      className="block w-full text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <Paintbrush className="w-4 h-4 inline" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="block w-full text-red-600 hover:underline dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 inline" /> Eliminar
                    </button>
                  </td>
                  <td className="px-4 py-2">{d.id}</td>
                  <td className="px-4 py-2">{d.question}</td>
                  <td className="px-4 py-2">{d.type}</td>
                  <td className="px-4 py-2">{d.title}</td>
                  <td className="px-4 py-2">
                    {(() => {
                      try {
                        const options = JSON.parse(d.option || '[]');
                        return Array.isArray(options) ? options.join(', ') : '-';
                      } catch {
                        return '-';
                      }
                    })()}
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
                onClick={() => fetchPage(`/survey-details/fetch?page=${page}&survey_id=${survey.id}`)}
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
        <SurveyDetailModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditDetail(null);
          }}
          onSaved={handleSaved}
          detailToEdit={editDetail}
          surveyId={survey.id}
        />
      )}
    </AppLayout>
  );
}