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
        file_1: null as File | null, // ← Nuevo campo para plantilla Word
        visible: '1',
        email_confirmation: '0',
        password: '',
        type: '',
        state: '',
        quanty: '0',
    });

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [file1Name, setFile1Name] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const file1InputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (surveyToEdit) {
            setFormData((prev) => ({
                ...prev,
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
                quanty: surveyToEdit.quanty || 0,
                front_page: null,
                file_1: null,
            }));

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
                    form.append(key, value);
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
            <DialogContent className="sm:max-w-2xl">
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

                <div className="grid gap-4 py-4">
                    {[{ name: 'title', label: 'Título' }, { name: 'description', label: 'Descripción' }, { name: 'detail', label: 'Detalle' }, { name: 'url', label: 'URL' }].map(({ name, label }) => (
                        <div className="grid grid-cols-4 items-center gap-4" key={name}>
                            <Label className="text-right">{label}</Label>
                            <Input className="col-span-3" name={name} value={(formData as any)[name]} onChange={handleChange} />
                        </div>
                    ))}

                    {[{ name: 'date_start', label: 'Fecha de Inicio' }, { name: 'date_end', label: 'Fecha de Fin' }].map(({ name, label }) => (
                        <div className="grid grid-cols-4 items-center gap-4" key={name}>
                            <Label className="text-right">{label}</Label>
                            <Input className="col-span-3" name={name} type="date" value={(formData as any)[name]} onChange={handleChange} />
                        </div>
                    ))}

                    {/* Portada */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">Portada</Label>
                        <div className="col-span-3">
                            <Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                            {previewUrl && (
                                <div className="mt-2">
                                    <img src={previewUrl} alt="Vista previa" className="w-24 h-24 object-cover rounded border" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Plantilla Word */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">Plantilla Word</Label>
                        <div className="col-span-3">
                            <Input type="file" accept=".doc,.docx" onChange={handleFile1Change} ref={file1InputRef} />
                            {file1Name && (
                                <div className="mt-2 text-sm text-gray-700">{file1Name}</div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Visible</Label>
                        <select name="visible" value={formData.visible} onChange={handleChange} className="col-span-3 border rounded px-3 py-2">
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Confirmación por Email</Label>
                        <select name="email_confirmation" value={formData.email_confirmation} onChange={handleChange} className="col-span-3 border rounded px-3 py-2">
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Contraseña</Label>
                        <Input className="col-span-3" name="password" value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tipo</Label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="col-span-3 border rounded px-3 py-2"
                        >
                            <option value="">Seleccione...</option>
                            <option value="publico">Público</option>
                            <option value="privado">Privado</option>
                        </select>
                    </div>


                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Estado</Label>
                        <Input className="col-span-3" name="state" value={formData.state} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Cantidad Solicitudes</Label>
                        <Input type='number' className="col-span-3" name="quanty" value={formData.quanty} onChange={handleChange} />
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
