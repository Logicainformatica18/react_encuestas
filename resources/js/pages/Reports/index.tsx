import { usePage } from '@inertiajs/react';

export default function ReportIndex() {
  const { survey, results, questions, types } = usePage().props;
  const ids = Object.keys(questions).map(Number);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Reporte de respuestas: {survey.title}</h1>

      {survey.file_1 && (
        <div className="mb-6">
          <a
            href={`/plantillas_encuestas/${survey.file_1}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            📄 Ver plantilla de encuesta
          </a>
        </div>
      )}

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
                {ids.map((id) => {
                  const value = row[`pregunta_${id}`];
                  const isFile = types[id] === 'file';
                  return (
                    <td key={id} className="border px-2 py-1">
                      {isFile && value ? (
                        <a
                          href={`/contratos_aybar/${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          📎 Archivo
                        </a>
                      ) : (
                        value || '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
