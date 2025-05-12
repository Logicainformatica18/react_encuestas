import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SurveyModal({
    open,
    onClose,
    onSaved,
    surveyToEdit
}: {
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
    surveyToEdit?: any;
}) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        detail: '',
        url: '',
        date_start: '',
        date_end: '',
        front_page: null as File | null,
        file_1: null as File | null,
        visible: '1',
        email_confirmation: '0',
        password: '',
        type: '',
        state: '',
        quanty: '0',
        contract_end_type: 'by_day_and_months',
        contract_duration_months: '',
        contract_end_day: '',
        contract_duration_days: '',
        contract_end_date: '',
    });

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file1Name, setFile1Name] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const file1InputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (surveyToEdit) {
            setFormData({
                ...formData,
                title: surveyToEdit.title || '',
                description: surveyToEdit.description || '',
                detail: surveyToEdit.detail || '',
                url: surveyToEdit.url || '',
                date_start: surveyToEdit.date_start || '',
                date_end: surveyToEdit.date_end || '',
                visible: surveyToEdit.visible ?? '1',
                email_confirmation: surveyToEdit.email_confirmation ?? '0',
                password: surveyToEdit.password || '',
                type: surveyToEdit.type || '',
                state: surveyToEdit.state || '',
                quanty: surveyToEdit.quanty || '0',
                front_page: null,
                file_1: null,
                contract_end_type: surveyToEdit.contract_end_type ?? 'by_day_and_months',
                contract_duration_months: surveyToEdit.contract_duration_months ?? '',
                contract_end_day: surveyToEdit.contract_end_day ?? '',
                contract_duration_days: surveyToEdit.contract_duration_days ?? '',
                contract_end_date: surveyToEdit.contract_end_date ?? '',
            });

            setPreviewUrl(surveyToEdit.front_page ? `/imageusers/${surveyToEdit.front_page}` : null);
            setFile1Name(surveyToEdit.file_1 ? surveyToEdit.file_1.split('/').pop() : null);

            if (fileInputRef.current) fileInputRef.current.value = '';
            if (file1InputRef.current) file1InputRef.current.value = '';
        } else {
            setFormData({
                title: '',
                description: '',
                detail: '',
                url: '',
                date_start: '',
                date_end: '',
                front_page: null,
                file_1: null,
                visible: '1',
                email_confirmation: '0',
                password: '',
                type: '',
                state: '',
                quanty: '0',
                contract_end_type: 'by_day_and_months',
                contract_duration_months: '',
                contract_end_day: '',
                contract_duration_days: '',
                contract_end_date: '',
            });
            setPreviewUrl(null);
            setFile1Name(null);
        }
    }, [surveyToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData((prev) => ({ ...prev, front_page: file }));
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData((prev) => ({ ...prev, file_1: file }));
        setFile1Name(file ? file.name : null);
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            toast.error('El título es obligatorio');
            return;
        }

        try {
            setUploading(true);
            setProgress(0);
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
    if (value !== null) {
        const numberFields = ['contract_duration_days', 'contract_duration_months', 'contract_end_day', 'quanty'];
        if (numberFields.includes(key)) {
            const parsed = parseInt(value as string);
            console.log(`🧪 Campo numérico '${key}' =`, parsed);
            form.append(key, isNaN(parsed) ? '0' : String(parsed));
        } else {
            form.append(key, value);
        }
    }
});

            const url = surveyToEdit ? `/surveys/${surveyToEdit.id}` : '/surveys';
            const method = surveyToEdit ? 'post' : 'post';

            await axios[method](url, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            onSaved();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error('Error al guardar');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{surveyToEdit ? 'Editar Encuesta' : 'Nueva Encuesta'}</DialogTitle>
                </DialogHeader>

                {uploading && (
                    <div className="w-full mb-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-1">{progress}%</p>
                    </div>
                )}

                <div className="grid gap-6 py-4 grid-cols-2">
                    {[ 
                        { name: 'title', label: 'Título' },
                        { name: 'description', label: 'Descripción' },
                        { name: 'detail', label: 'Detalle' },
                        { name: 'url', label: 'URL' },
                        { name: 'date_start', label: 'Fecha de Inicio', type: 'date' },
                        { name: 'date_end', label: 'Fecha de Fin', type: 'date' },
                        { name: 'password', label: 'Contraseña' },
                        { name: 'state', label: 'Estado' },
                        { name: 'quanty', label: 'Cantidad Solicitudes', type: 'number' },
                    ].map(({ name, label, type }) => (
                        <div key={name} className="flex flex-col">
                            <Label className="mb-1">{label}</Label>
                            <Input
                                name={name}
                                type={type || 'text'}
                                value={(formData as any)[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    <div className="flex flex-col">
                        <Label className="mb-1">Tipo</Label>
                        <select name="type" value={formData.type} onChange={handleChange} className="border rounded px-3 py-2">
                            <option value="">Seleccione...</option>
                            <option value="publico">Público</option>
                            <option value="privado">Privado</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <Label className="mb-1">Visible</Label>
                        <select name="visible" value={formData.visible} onChange={handleChange} className="border rounded px-3 py-2">
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <Label className="mb-1">Confirmación por Email</Label>
                        <select name="email_confirmation" value={formData.email_confirmation} onChange={handleChange} className="border rounded px-3 py-2">
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    {/* Portada */}
                    <div className="flex flex-col col-span-2">
                        <Label className="mb-1">Portada</Label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                        {previewUrl && (
                            <div className="mt-2">
                                <img src={previewUrl} alt="Vista previa" className="w-24 h-24 object-cover rounded border" />
                            </div>
                        )}
                    </div>

                    {/* Plantilla Word */}
                    <div className="flex flex-col col-span-2">
                        <Label className="mb-1">Plantilla Word</Label>
                        <Input type="file" accept=".doc,.docx" onChange={handleFile1Change} ref={file1InputRef} />
                        {file1Name && (
                            <div className="mt-2 text-sm text-gray-700">{file1Name}</div>
                        )}
                    </div>

                    {/* Vencimiento de contrato */}
                    <div className="col-span-2">
                        <hr className="my-4" />
                        <h3 className="text-lg font-semibold mb-2">Vencimiento de Contrato</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label className="mb-1">Tipo de vencimiento</Label>
                                <select
                                    name="contract_end_type"
                                    value={formData.contract_end_type}
                                    onChange={handleChange}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="by_day_and_months">Por meses + día fijo</option>
                                    <option value="by_days">Por días</option>
                                    <option value="fixed">Fecha fija</option>
                                </select>
                            </div>

                            {formData.contract_end_type === 'by_day_and_months' && (
                                <>
                                    <div className="flex flex-col">
                                        <Label className="mb-1">Duración (meses)</Label>
                                        <Input
                                            type="number"
                                            name="contract_duration_months"
                                            value={formData.contract_duration_months}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Label className="mb-1">Día del mes</Label>
                                        <Input
                                            type="number"
                                            name="contract_end_day"
                                            value={formData.contract_end_day}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}

                            {formData.contract_end_type === 'by_days' && (
                                <div className="flex flex-col">
                                    <Label className="mb-1">Duración (días)</Label>
                                    <Input
                                        type="number"
                                        name="contract_duration_days"
                                        value={formData.contract_duration_days}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {formData.contract_end_type === 'fixed' && (
                                <div className="flex flex-col">
                                    <Label className="mb-1">Fecha fin exacta</Label>
                                    <Input
                                        type="date"
                                        name="contract_end_date"
                                        value={formData.contract_end_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={uploading}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={uploading}>
                        {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
