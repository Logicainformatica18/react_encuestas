import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
      type: '',
      title: '',
      state: '',
      evaluate: '',
      requerid: '',
        detail: '',
        code: '',
        selection_id: '',
      options: Array(10).fill(''),
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
            type: detailToEdit.type || '',
            title: detailToEdit.title || '',
            state: detailToEdit.state || '',
            evaluate: detailToEdit.evaluate || '',
            requerid: detailToEdit.requerid || '',
            detail: detailToEdit.detail || '',
            code: detailToEdit.code || '',
            selection_id: detailToEdit.selection_id || '',
            options: [...parsed, ...Array(10 - parsed.length).fill('')],
          });
          
      } else {
        setForm({
          question: '',
          type: '',
          title: '',
          state: '',
          evaluate: '',
          requerid: '',
            detail: '',
            code: '',
            selection_id: '',
          options: Array(10).fill(''),
        });
      }
    }, [detailToEdit]);

    const handleSubmit = async () => {
        setSaving(true);
        try {
          const payload = {
            ...form,
            option: form.options.filter((o) => o.trim() !== ''), // ✅ corregido: se envía como "option"
            survey_id: surveyId,
          };
      
          let response;
          if (detailToEdit) {
            response = await axios.put(`/survey-details/${detailToEdit.id}`, payload);
          //  toast.success('Pregunta actualizada ✅');
          } else {
            response = await axios.post('/survey-details', payload);
            toast.success('Pregunta registrada ✅');
          }
      
          onSaved(); // ya hace fetch en SurveyDetails.tsx
          onClose();
        } catch (err) {
          toast.error('Error al guardar');
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
              <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
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
