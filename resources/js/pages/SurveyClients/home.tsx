import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'sonner';

interface Survey {
    id: number;
    title: string;
    description: string;
    state: 'public' | 'private';
    date_end: string;
    front_page: string | null;
}

export default function Home() {
    const { survey } = usePage<{ survey: Survey }>().props;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (survey.state === 'private' && !code.trim()) {
            toast.warning('⚠️ Ingrese el código de acceso');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/survey-clients/start', {
                survey_id: survey.id,
                code: code || null,
            });

            const client_id = res.data.client_id;

            router.visit(`/encuesta/${survey.url}/preguntas`, {
                data: { client_id },
                method: 'get',
                preserveState: true,
              });
              
        } catch (err) {
            toast.error('❌ No se pudo iniciar la encuesta');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                    <img
                        src={survey.front_page ? `/imageusers/${survey.front_page}` : '/imagen-de-encuesta1.png'}
                        alt="Portada de Encuesta"
                        className="rounded-lg shadow-md w-full"
                    />


                </div>
                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {survey.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">{survey.description}</p>

                    {survey.state === 'private' && (
                        <Input
                            placeholder="Ingrese código de acceso"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    )}

                    <Button onClick={handleStart} disabled={loading} className="bg-red-600 text-white">
                        Comenzar Encuesta
                    </Button>
                </div>
            </div>
        </div>
    );
}
