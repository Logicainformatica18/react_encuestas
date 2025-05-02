import InputGroup from './components/InputGroup';
import SelectGroup from './components/SelectGroup';
import SurveyPreview from './components/SurveyPreview';
export default function SurveyDetailForm({
  form,
  setForm,
}: {
  form: any;
  setForm: (val: any) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev: any) => ({ ...prev, options: newOptions }));
  };

  return (
    <div className="grid gap-4 py-4">
      <InputGroup label="Título" name="title" value={form.title} onChange={handleChange} />
      <InputGroup label="Pregunta" name="question" value={form.question} onChange={handleChange} multiline />
      <InputGroup label="Detalle" name="detail" value={form.detail} onChange={handleChange} multiline />
      <InputGroup label="Evaluar" name="evaluate" value={form.evaluate} onChange={handleChange} />
      <InputGroup label="Requerido" name="requerid" value={form.requerid} onChange={handleChange} />

      <SelectGroup
        label="Tipo de Pregunta"
        name="type"
        value={form.type}
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

      <SelectGroup
        label="Estado"
        name="state"
        value={form.state}
        onChange={handleChange}
        options={[
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
        ]}
      />
{/* Campos adicionales según el tipo */}
{form.type === 'multiple_option' && (
  <>
    <p className="text-sm col-span-4 text-gray-600">Opciones:</p>
    {form.options.map((opt: string, i: number) => (
      <InputGroup
        key={i}
        label={`Opción ${i + 1}`}
        name={`option${i}`}
        value={opt}
        onChange={(e) => handleOptionChange(i, e.target.value)}
      />
    ))}
  </>
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

{form.type === 'code' && (
  <InputGroup
    label="Código Generado"
    name="code"
    value={form.code || ''}
    onChange={(e) => setForm({ ...form, code: e.target.value })}
  />
)}


 
<SurveyPreview form={form} />

      {/* {form.options.map((opt: string, i: number) => (
        <InputGroup
          key={i}
          label={`Opción ${i + 1}`}
          name={`option${i}`}
          value={opt}
          onChange={(e) => handleOptionChange(i, e.target.value)}
        />
      ))} */}
    </div>


  );
}
