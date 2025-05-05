import {
    Dialog,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { Loader2 } from 'lucide-react';
  import { useEffect, useState } from 'react';
  import SurveyDetailForm from './SurveyDetailForm';
  import axios from 'axios';
  import { toast } from 'sonner';

  export default function SurveyDetailModal({
    open,
    onClose,
    onSaved,
    detailToEdit,
    surveyId,
  }: {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    detailToEdit?: any;
    surveyId: number;
  }) {
    const [form, setForm] = useState({
      question: '',
      type: 'short_answer', // ✅ valor por defecto
      title: '',
      state: '',
      evaluate: '',
      requerid: 'Sí',
      detail: '',
      code: '',
      selection_id: '',
      options: Array(10).fill(''),
      file_1: null as File | null,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
      if (detailToEdit) {
        const parsed = (() => {
          try {
            return JSON.parse(detailToEdit.option || '[]');
          } catch {
            return [];
          }
        })();
        setForm({
          question: detailToEdit.question || '',
          type: detailToEdit.type || 'short_answer',
          title: detailToEdit.title || '',
          state: detailToEdit.state || '',
          evaluate: detailToEdit.evaluate || '',
          requerid: detailToEdit.requerid || 'Sí',
          detail: detailToEdit.detail || '',
          code: detailToEdit.code || '',
          selection_id: detailToEdit.selection_id || '',
          options: [...parsed, ...Array(10 - parsed.length).fill('')],
          file_1: null,
        });
      } else {
        setForm({
          question: '',
          type: 'short_answer',
          title: '',
          state: '',
          evaluate: '',
          requerid: 'Sí',
          detail: '',
          code: '',
          selection_id: '',
          options: Array(10).fill(''),
          file_1: null,
        });
      }
    }, [detailToEdit]);

    const handleSubmit = async () => {
      if (!form.type) {
        toast.error('El tipo de pregunta es requerido');
        return;
      }

      setSaving(true);
      try {
        const formData = new FormData();
        formData.append('question', form.question);
        formData.append('type', form.type);
        formData.append('title', form.title || '');
        formData.append('state', form.state || '');
        formData.append('evaluate', form.evaluate || '');
        formData.append('requerid', form.requerid || 'Sí');
        formData.append('detail', form.detail || '');
        formData.append('code', form.code || '');
        formData.append('selection_id', form.selection_id || '');
        formData.append('survey_id', String(surveyId));

        form.options
          .filter((opt) => opt.trim() !== '')
          .forEach((opt, i) => formData.append(`option[${i}]`, opt));

        if (form.file_1) {
          formData.append('file_1', form.file_1);
        }

        const response = await axios({
          method: detailToEdit ? 'post' : 'post',
          url: detailToEdit ? `/survey-details/${detailToEdit.id}` : '/survey-details',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(detailToEdit && { 'X-HTTP-Method-Override': 'PUT' }),
          },
        });

      //  toast.success(`✅ Pregunta ${detailToEdit ? 'actualizada' : 'registrada'} correctamente`);
        onSaved();
        onClose();
      } catch (err) {
        toast.error('❌ Error al guardar');
        console.error(err);
      } finally {
        setSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white w-[90vw] h-[90vh] rounded-lg shadow-xl flex flex-col">
            {/* HEADER */}
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {detailToEdit ? 'Editar Pregunta' : 'Nueva Pregunta'}
              </h2>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <SurveyDetailForm form={form} setForm={setForm} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
