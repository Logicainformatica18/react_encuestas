import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

const csrf = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

interface Survey {
  id: number;
  title: string;
  description: string;
  type: 'publico' | 'privado';
  state: string;
  url: string;
  front_page: string | null;
}

export default function Home() {
  const { survey } = usePage<{ survey: Survey }>().props;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (survey.type === 'privado' && !email.trim()) {
      toast.warning('⚠️ Ingrese su correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        '/survey-clients/start',
        {
          survey_id: survey.id,
          email: email || null,
        },
        {
          headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrf || '',
          },
        }
      );

      const client_id = res.data.client_id;

      router.visit(`/encuesta/${survey.url}/preguntas`, {
        data: { client_id },
        method: 'get',
        preserveState: true,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        '❌ No se pudo iniciar la encuesta';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {survey.front_page && (
        <img
          src={`/imageusers/${survey.front_page}`}
          alt="Fondo desenfocado"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
      )}

      <div className="relative z-10 w-full max-w-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm p-8 rounded shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">{survey.title}</h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">{survey.description}</p>

        {survey.type === 'privado' && (
          <Input
            type="email"
            placeholder="Ingrese su correo"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <Button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-red-600 text-white"
        >
          Comenzar Encuesta
        </Button>
      </div>
    </div>
  );
}
