import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Thanks() {
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('slug');
    const timeout = setTimeout(() => {
      if (slug) {
        router.visit(`/encuesta/${slug}`);
      } else {
        router.visit('/');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          ¡Gracias por completar la encuesta!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Tus respuestas han sido registradas correctamente.
        </p>
        <p className="text-sm text-gray-500">
          Serás redirigido automáticamente a la encuesta...
        </p>
      </div>
    </div>
  );
}
