<?php

use Illuminate\Database\Seeder;
use App\Models\SurveyDetail;

class SurveyDetailSeeder extends Seeder
{
    public function run(): void
    {
        $surveyId = 1;

        $questions = [
            [
                'title' => 'Datos del Locador',
                'detail' => 'Identificación del locador',
                'question' => '¿Cuál es el nombre completo del locador?',
            ],
            [
                'title' => 'Datos del Locador',
                'detail' => 'Identificación del locador',
                'question' => '¿Cuál es el número de DNI del locador?',
            ],
            [
                'title' => 'Datos del Locador',
                'detail' => 'Identificación del locador',
                'question' => '¿Cuál es el domicilio completo del locador?',
            ],
            [
                'title' => 'Objeto del contrato',
                'detail' => 'Servicios de corretaje',
                'question' => '¿Qué tipo de servicios se obliga a prestar el locador según el contrato?',
            ],
            [
                'title' => 'Honorarios',
                'detail' => 'Forma y condiciones de pago',
                'question' => '¿En qué documento se indica la forma y oportunidad de pago de los honorarios?',
            ],
            [
                'title' => 'Honorarios',
                'detail' => 'Condiciones del pago',
                'question' => '¿Cuál es la condición para que el locador reciba el pago de sus honorarios?',
            ],
            [
                'title' => 'Forma de prestación',
                'detail' => 'Modalidad del servicio',
                'question' => '¿Qué tipo de modalidad se establece para la prestación del servicio?',
            ],
            [
                'title' => 'Forma de prestación',
                'detail' => 'Reuniones con el comitente',
                'question' => '¿Qué medios pueden utilizarse para realizar reuniones según el contrato?',
            ],
            [
                'title' => 'Obligaciones del Comitente',
                'detail' => 'Compromisos establecidos',
                'question' => '¿Qué debe entregar el comitente al locador para facilitar la prestación del servicio?',
            ],
            [
                'title' => 'Obligaciones del Locador',
                'detail' => 'Compromisos del servicio',
                'question' => '¿Cuál es el compromiso del locador respecto a la confidencialidad de la información?',
            ],
            [
                'title' => 'Obligaciones del Locador',
                'detail' => 'Seguimiento postventa',
                'question' => '¿Por cuánto tiempo debe realizar el locador el seguimiento de la venta y postventa?',
            ],
            [
                'title' => 'Obligaciones del Locador',
                'detail' => 'Proceso comercial',
                'question' => '¿Qué etapas incluye el proceso de venta y postventa que debe realizar el locador?',
            ],
            [
                'title' => 'Penalidades',
                'detail' => 'Incumplimiento',
                'question' => '¿Qué sucede si el locador incumple las obligaciones contractuales?',
            ],
            [
                'title' => 'Resolución',
                'detail' => 'Causales de resolución',
                'question' => '¿Cuáles son las causales para la resolución del contrato?',
            ],
            [
                'title' => 'Competencia Territorial',
                'detail' => 'Solución de controversias',
                'question' => '¿Qué entidad resuelve los conflictos en caso de controversias contractuales?',
            ]
        ];

        foreach ($questions as $q) {
            SurveyDetail::create([
                'survey_id' => $surveyId,
                'title' => $q['title'],
                'detail' => $q['detail'],
                'question' => $q['question'],
                'type' => 'short_answer',
                'requerid' => 'yes',
                'state' => 'activo',
            ]);
        }
    }
}
