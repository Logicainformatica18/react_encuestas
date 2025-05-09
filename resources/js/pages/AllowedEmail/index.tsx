// index.tsx para AllowedEmail
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Paintbrush, Trash2 } from 'lucide-react';
import axios from 'axios';
import EmailModal from './Modal';
import { toast } from 'sonner';

interface AllowedEmail {
  id: number;
  email: string;
  quanty: number;
}

interface Pagination<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export default function AllowedEmailIndex() {
  const { emails: initialPagination, survey_id } = usePage<{
    emails: Pagination<AllowedEmail>;
    survey_id: number;
  }>().props;

  const [emails, setEmails] = useState<AllowedEmail[]>(initialPagination?.data || []);
  const [pagination, setPagination] = useState(initialPagination);
  const [showModal, setShowModal] = useState(false);
  const [editEmail, setEditEmail] = useState<AllowedEmail | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchEmail = async (id: number) => {
    try {
        const res = await axios.get(`/allowed-emails/email/${id}`);


      setEditEmail(res.data.email);
      setShowModal(true);
    } catch (e) {
      toast.error('❌ Error al cargar el correo');
      console.error(e);
    }
  };


  const handleSaved = async () => {
    await fetchPage(`/allowed-emails/fetch?page=${pagination.current_page}&survey_id=${survey_id}`);
    setEditEmail(null);
    setShowModal(false);
    toast.success('✅ Correo guardado');
  };

  const fetchPage = async (url: string) => {
    try {
      const res = await axios.get(url);
      if (res.data.emails?.data) {
        setEmails(res.data.emails.data);
        setPagination(res.data.emails);
      } else if (Array.isArray(res.data.emails)) {
        setEmails(res.data.emails);
        setPagination({
          data: res.data.emails,
          current_page: 1,
          last_page: 1,
          next_page_url: null,
          prev_page_url: null,
        });
      } else {
        throw new Error('Formato de datos inesperado');
      }
    } catch (err) {
      toast.error('❌ Error al cargar página');
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Eliminar ${selectedIds.length} correos?`)) {
      try {
        await axios.post('/allowed-emails/bulk-delete', { ids: selectedIds });
        setEmails((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
        setSelectedIds([]);
        toast.success('✅ Correos eliminados');
      } catch (e) {
        toast.error('❌ Error al eliminar en lote');
        console.error(e);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(`¿Eliminar correo ID ${id}?`)) {
      try {
        await axios.delete(`/allowed-emails/${id}`);
        setEmails((prev) => prev.filter((e) => e.id !== id));
        toast.success('✅ Correo eliminado');
      } catch (e) {
        toast.error('❌ Error al eliminar');
        console.error(e);
      }
    }
  };

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Correos permitidos de la encuesta #{survey_id}</h1>

        <button
          onClick={() => {
            setEditEmail(null);
            setShowModal(true);
          }}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Nuevo Correo
        </button>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Eliminar seleccionados
          </button>
        )}

<div className="mb-6">
  <label
    htmlFor="excelImport"
    className="inline-flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded shadow transition"
  >
    📥 Importar Excel
    <input
      id="excelImport"
      type="file"
      accept=".xlsx,.xls"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('survey_id', String(survey_id));

          axios
            .post('/allowed-emails/import', formData)
            .then(() => {
              toast.success('✅ Correos importados');
              handleSaved();
            })
            .catch(() => toast.error('❌ Error al importar el archivo'));
        }
      }}
    />
  </label>
  <p className="text-xs text-gray-500 mt-1">
    Sube un archivo Excel con las columnas: <code>Email</code> y <code>Quanty</code>
  </p>
</div>



        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm divide-y divide-gray-200 bg-white dark:bg-black shadow-md rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === emails.length}
                    onChange={(e) => setSelectedIds(e.target.checked ? emails.map((e) => e.id) : [])}
                  />
                </th>
                <th className="px-4 py-2 text-black dark:text-white">Acciones</th>
                <th className="px-4 py-2 text-black dark:text-white">ID</th>
                <th className="px-4 py-2 text-black dark:text-white">Correo</th>
                <th className="px-4 py-2 text-black dark:text-white">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((e) => (
                <tr key={e.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(e.id)}
                      onChange={(ev) =>
                        setSelectedIds((prev) =>
                          ev.target.checked ? [...prev, e.id] : prev.filter((id) => id !== e.id)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-2 space-y-1">
                    <button
                      onClick={() => fetchEmail(e.id)}
                      className="block w-full text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <Paintbrush className="w-4 h-4 inline" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="block w-full text-red-600 hover:underline dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 inline" /> Eliminar
                    </button>
                  </td>
                  <td className="px-4 py-2">{e.id}</td>
                  <td className="px-4 py-2">{e.email}</td>
                  <td className="px-4 py-2">{e.quanty}</td>
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
                onClick={() => fetchPage(`/allowed-emails/fetch?page=${page}&survey_id=${survey_id}`)}
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
        <EmailModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditEmail(null);
          }}
          onSaved={handleSaved}
          emailToEdit={editEmail}
          surveyId={survey_id}
        />
      )}
    </AppLayout>
  );
}
