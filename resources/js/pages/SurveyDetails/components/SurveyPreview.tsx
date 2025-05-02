export default function SurveyPreview({ form }: { form: any }) {
    const renderInputByType = () => {
      switch (form.type) {
        case 'short_answer':
          return <input disabled className="mt-2 w-full border rounded px-3 py-2" placeholder="Respuesta corta..." />;
        case 'number':
          return <input type="number" disabled className="mt-2 w-full border rounded px-3 py-2" placeholder="123" />;
        case 'date':
          return <input type="date" disabled className="mt-2 w-full border rounded px-3 py-2" />;
        case 'email':
          return <input type="email" disabled className="mt-2 w-full border rounded px-3 py-2" placeholder="correo@ejemplo.com" />;
        case 'file':
          return <input type="file" disabled className="mt-2 w-full border rounded px-3 py-2" />;
        case 'multiple_option':
          return (
            <div className="mt-2 space-y-2">
              {form.options.filter((o: string) => o.trim() !== '').map((opt: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input type="radio" disabled />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="p-4 border rounded-md bg-gray-50 mt-6 md:col-span-2">
        {form.title && <h4 className="text-lg font-semibold mb-1">{form.title}</h4>}
        <p className="font-medium text-gray-800">{form.question}</p>
        {renderInputByType()}
      </div>
    );
  }
  