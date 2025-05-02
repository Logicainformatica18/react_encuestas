<?php

namespace App\Exports;

use App\Models\SurveyDetail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SurveyDetailsExport implements FromCollection, WithHeadings
{
    protected $surveyId;

    public function __construct($surveyId)
    {
        $this->surveyId = $surveyId;
    }

    public function collection()
    {
        return SurveyDetail::where('survey_id', $this->surveyId)
            ->select([
                'id', 'question', 'type', 'option', 'title', 'evaluate',
                'requerid', 'category', 'enumeration', 'created_at'
            ])
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID', 'Pregunta', 'Tipo', 'Opciones', 'Título',
            'Evaluación', 'Requerido', 'Categoría', 'Enumeración', 'Fecha de creación'
        ];
    }
}
