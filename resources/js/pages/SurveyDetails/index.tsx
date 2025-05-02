import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Paintbrush, Trash2 } from 'lucide-react';
import axios from 'axios';
import SurveyDetailModal from './modal';

type SurveyDetail = {
  id: number;
  question: string;
  type: string;
  option: string; // JSON string
  title?: string;
  state?: string;
  evaluate?: string;
  requerid?: string;
};

export default function SurveyDetails() {
  const { surveyDetails: initialData, survey } = usePage<{
    surveyDetails: SurveyDetail[];
    survey: { id: number; title: string };
  }>().props;

  const [details, setDetails] = useState<SurveyDetail[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editDetail, setEditDetail] = useState<SurveyDetail | null>(null);

  const fetchDetail = async (id: number) => {
    const res = await axios.get(`/survey-details/${id}/edit`);
    setEditDetail(res.data);
    setShowModal(true);
  };

  const handleSaved = () => {
    window.location.reload(); // o volver a cargar con axios si prefieres
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
            onClick={async () => {
              if (confirm(`¿Eliminar ${selectedIds.length} preguntas?`)) {
                try {
                  await Promise.all(
                    selectedIds.map((id) => axios.delete(`/survey-details/${id}`))
                  );
                  setDetails((prev) => prev.filter((d) => !selectedIds.includes(d.id)));
                  setSelectedIds([]);
                } catch (e) {
                  alert('Error al eliminar en lote');
                  console.error(e);
                }
              }
            }}
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
                <th className="px-4 py-2 text-black dark:text-white">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d) => (
                <tr
                  key={d.id}
                  className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) =>
                          e.target.checked
                            ? [...prev, d.id]
                            : prev.filter((id) => id !== d.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2 text-sm">
                    <button
                      onClick={() => fetchDetail(d.id)}
                      className="text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                    >
                      <Paintbrush className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`¿Eliminar pregunta "${d.question}"?`)) {
                          try {
                            await axios.delete(`/survey-details/${d.id}`);
                            setDetails((prev) => prev.filter((s) => s.id !== d.id));
                          } catch (e) {
                            alert('Error al eliminar');
                            console.error(e);
                          }
                        }
                      }}
                      className="text-red-600 hover:underline dark:text-red-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
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
                        return options.join(', ');
                      } catch {
                        return '';
                      }
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </AppLayout>
  );
}
