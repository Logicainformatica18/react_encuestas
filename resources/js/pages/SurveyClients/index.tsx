import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SurveyDetail {
  id: number;
  question: string;
  type: string;
  option: string;
  title?: string;
  detail?: string;
  selection_id?: number;
  selection?: {
    id: number;
    state: string;
    selection_detail: { id: number; description: string }[];
  };
  requerid?: string;
}

interface Survey {
  id: number;
  title: string;
  description: string;
  state: string;
}

export default function SurveyClientIndex() {
  const { survey, survey_details, client_id: initialClientId } = usePage<{
    survey: Survey;
    survey_details: SurveyDetail[];
    client_id: number;
  }>().props;

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [clientId, setClientId] = useState<number | null>(initialClientId ?? null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [invalidFields, setInvalidFields] = useState<number[]>([]);

  useEffect(() => {
    if (!clientId) {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get('client_id');
      if (id) {
        setClientId(Number(id));
      } else {
        toast.error('❌ No se encontró el ID del cliente');
      }
    }
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
    setInvalidFields((prev) => prev.filter(id => String(id) !== name));
  };

  const handleMassSubmit = async () => {
    if (!clientId) {
      toast.error('❌ Cliente no definido');
      return;
    }

    const missingRequired = survey_details.filter(q =>
      q.requerid === 'yes' && (!answers[q.id] || answers[q.id].toString().trim() === '')
    ).map(q => q.id);

    if (missingRequired.length > 0) {
      setInvalidFields(missingRequired);
      toast.error('⚠️ Debe responder todas las preguntas obligatorias.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const total = survey_details.length;
    let completed = 0;

    for (const q of survey_details) {
      try {
        await axios.post('/survey-clients', {
          survey_detail_id: q.id,
          client_id: clientId,
          answer: answers[q.id] || '',
        });
        completed++;
        setProgress(Math.round((completed / total) * 100));
      } catch (e) {
        toast.error(`❌ Error al guardar la respuesta de la pregunta ID ${q.id}`);
      }
    }

    setLoading(false);
    toast.success('✅ Encuesta finalizada');
    window.location.href = '/gracias';
  };

  if (!survey || !survey_details || survey_details.length === 0) {
    return <div className="text-center py-10">Cargando encuesta...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded space-y-8">
      <h1 className="text-2xl font-bold text-center mb-2">{survey.title}</h1>
      <p className="text-center text-gray-600">{survey.description}</p>
      <p className="text-center text-sm text-red-600 mt-2">(*) Campos obligatorios</p>

      {survey_details.map((q, index) => (
        <div key={q.id} className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-1">{q.title}</h3>
          <p className="text-sm text-gray-600 mb-1">{q.detail}</p>
          <p className="text-md font-medium mb-2">
            {index + 1}. {q.question}{q.requerid === 'yes' && <span className="text-red-600"> *</span>}
          </p>

          {q.type === 'short_answer' && (
            <input
              name={String(q.id)}
              value={answers[q.id] || ''}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${invalidFields.includes(q.id) ? 'border-red-500' : ''}`}
            />
          )}

          {q.type === 'multiple_option' &&
            Array.isArray(JSON.parse(q.option || '[]')) &&
            JSON.parse(q.option || '[]').map((opt: string, i: number) => (
              <label key={i} className="block">
                <input
                  type="radio"
                  name={String(q.id)}
                  value={opt}
                  onChange={handleChange}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}

          {q.type === 'selection' && q.selection && (
            <select
              name={String(q.id)}
              value={answers[q.id] || ''}
              onChange={handleChange}
              className={`w-full border px-2 py-1 rounded ${invalidFields.includes(q.id) ? 'border-red-500' : ''}`}
            >
              <option value="">-- Seleccione --</option>
              {q.selection.selection_detail.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.description}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="text-center pt-8">
        <Button
          onClick={handleMassSubmit}
          disabled={loading}
          className="relative"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" /> Enviando... {progress}%
            </span>
          ) : (
            'Enviar formulario'
          )}
        </Button>
        {loading && (
          <div className="w-full h-2 bg-gray-200 mt-4 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
