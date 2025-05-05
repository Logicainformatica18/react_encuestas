import InputGroup from './components/InputGroup';
import SelectGroup from './components/SelectGroup';
import SurveyPreview from './components/SurveyPreview';
import { Label } from '@radix-ui/react-label';

export default function SurveyDetailForm({
  form,
  setForm,
}: {
  form: any;
  setForm: (val: any) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev: any) => ({ ...prev, options: newOptions }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev: any) => ({ ...prev, file_1: e.target.files?.[0] }));
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <InputGroup label="Título" name="title" value={form.title} onChange={handleChange} />
      <InputGroup label="Pregunta" name="question" value={form.question} onChange={handleChange} multiline />
      <InputGroup label="Detalle" name="detail" value={form.detail} onChange={handleChange} multiline />

      <SelectGroup
        label="Requerido"
        name="requerid"
        value={form.requerid || 'yes'}
        onChange={handleChange}
        options={[
          { value: 'yes', label: 'Sí' },
          { value: 'not', label: 'No' },
        ]}
      />

<SelectGroup
  label="Tipo de Pregunta"
  name="type"
  value={form.type || 'short_answer'} // este sí es un value válido
  onChange={handleChange}
  options={[
    { value: 'short_answer', label: 'Respuesta Corta' },
    { value: 'multiple_option', label: 'Varias Opciones' },
    { value: 'selection', label: 'Selección' },
    { value: 'date', label: 'Fecha' },
    { value: 'number', label: 'Número' },
    { value: 'code', label: 'Código' },
    { value: 'file', label: 'Archivo' },
    { value: 'email', label: 'Email' },
  ]}
/>


      {form.type === 'multiple_option' && (
        <div className="col-span-2">
          <p className="text-sm text-gray-600 mb-2">Opciones:</p>
          <div className="grid grid-cols-2 gap-4">
            {form.options.map((opt: string, i: number) => (
              <InputGroup
                key={i}
                label={`Opción ${i + 1}`}
                name={`option${i}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
            ))}
          </div>
        </div>
      )}

      {form.type === 'selection' && (
        <SelectGroup
          label="Seleccionar elemento"
          name="selection_id"
          value={form.selection_id || ''}
          onChange={(e) => setForm({ ...form, selection_id: e.target.value })}
          options={[
            { value: '1', label: 'Alternativa A' },
            { value: '2', label: 'Alternativa B' },
          ]}
        />
      )}

      {/* Nuevo campo de archivo */}
      <div>
        <Label className="block mb-1 text-sm text-gray-600">Archivo adjunto (opcional)</Label>
        <input
          type="file"
          name="file_1"
          onChange={handleFileChange}
          className="w-full border rounded p-2"
        />
      </div>

      <br />
      <SurveyPreview form={form} />
    </div>
  );
}
