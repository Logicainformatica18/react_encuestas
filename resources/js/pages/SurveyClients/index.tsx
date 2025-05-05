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
  slug: string;
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
  const [documentGenerated, setDocumentGenerated] = useState(false);

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
    const processedValue = typeof value === 'string' ? value.toUpperCase() : value;
    setAnswers((prev) => ({ ...prev, [name]: processedValue }));
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
        const form = new FormData();
        form.append('survey_detail_id', String(q.id));
        form.append('client_id', String(clientId));

        if (q.type === 'file') {
          const file = answers[q.id];
          if (file instanceof File) {
            form.append('answer', file);
          } else {
            continue;
          }
        } else {
          const value = answers[q.id] || '';
          form.append('answer', typeof value === 'string' ? value.toUpperCase() : value);
        }

        await axios.post('/survey-clients', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        completed++;
        setProgress(Math.round((completed / total) * 100));
      } catch (e) {
        toast.error(`❌ Error al guardar la respuesta de la pregunta ID ${q.id}`);
      }
    }

    setLoading(false);
    toast.success('✅ Encuesta finalizada');
    window.location.href = `/gracias?slug=${survey.slug}`;
  };

  const handleGenerateDocument = async () => {
    try {
      const response = await axios.post('/generate-document', {
        client_id: clientId,
        survey_id: survey.id,
        answers,
      });
      toast.success('✅ Documento generado correctamente');
      setDocumentGenerated(true);
      window.open(response.data.download_url, '_blank');
    } catch (e) {
      toast.error('❌ Error al generar el documento');
    }
  };

  if (!survey || !survey_details || survey_details.length === 0) {
    return <div className="text-center py-10">Cargando encuesta...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow rounded space-y-8">
      <h1 className="text-2xl font-bold text-center mb-2">{survey.title}</h1>
      <p className="text-center text-gray-600">{survey.description}</p>
      <p className="text-center text-sm text-red-600 mt-2">(*) Campos obligatorios</p>

      {survey_details.map((q, index) => {
        const isFileQuestion = q.type === 'file';
        if (isFileQuestion && !documentGenerated) return null;

        return (
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

            {q.type === 'file' && (
              <div className={`p-4 mt-2 border-2 rounded bg-green-100 border-green-500 animate-pulse`}>
                <label className="block font-semibold text-green-900 mb-1">
                  📎 Adjunta el documento generado
                </label>
                <input
                  type="file"
                  name={String(q.id)}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.files?.[0] }))
                  }
                  className="block w-full"
                />
              </div>
            )}
          </div>
        );
      })}

      <div className="text-center mt-6 space-x-4">
        <Button onClick={handleGenerateDocument} disabled={loading}>
          Generar documento
        </Button>
        <br />
        <Button
          onClick={handleMassSubmit}
          disabled={loading || !documentGenerated}
          className="relative mt-2"
        >
          {!documentGenerated && (
            <p className="mt-3 text-sm px-4 py-2 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded">
              ⚠️ Debe generar el documento antes de poder enviar el formulario.
            </p>
          )}
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" /> Enviando... {progress}%
            </span>
          ) : (
            'Enviar formulario'
          )}
        </Button>
      </div>

      {loading && (
        <div className="w-full h-2 bg-gray-200 mt-4 rounded">
          <div
            className="h-full bg-green-500 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
