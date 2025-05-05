import { usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
  survey: {
    id: number;
    title: string;
  };
  results: any[];
  questions: { [id: number]: string }; // clave: id, valor: pregunta
}

export default function ReportIndex() {
  const { survey, results, questions } = usePage<Props>().props;
  const [showAll, setShowAll] = useState(false);

  const ids = Object.keys(questions).map(Number); // extraemos los ids de las preguntas

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Reporte de respuestas: {survey.title}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white text-sm shadow">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">ID Cliente</th>
              {ids.map((id) => (
                <th key={id} className="px-4 py-2 border">{questions[id]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{i + 1}</td>
                <td className="border px-2 py-1">{row.client_id}</td>
                {ids.map((id) => (
                  <td key={id} className="border px-2 py-1">
                    {row[`pregunta_${id}`] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
