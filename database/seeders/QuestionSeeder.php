<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SurveyDetail;
class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $surveyId = 1;

        $questions = [
            'Nombre completo del contratante',
            'Número de documento de identidad del contratante',
            'Domicilio del contratante',
            'Correo electrónico del contratante',
            'Número de celular del contratante',
            'Nombre completo del contratado',
            'Número de documento de identidad del contratado',
            'Domicilio del contratado',
            'Correo electrónico del contratado',
            'Número de celular del contratado',
            'Fecha de inicio del contrato',
            'Fecha de culminación del contrato',
            'Descripción del servicio a brindar',
            'Monto total del pago pactado',
            'Frecuencia de pago',
            'Forma de pago',
            'Dirección del lugar donde se prestará el servicio',
            'Horario de trabajo',
            'Nombre del supervisor asignado',
            'Duración del contrato (en meses)',
            'Condiciones para resolución del contrato',
            'Nombre del representante legal (si aplica)',
            'Cargo del representante legal (si aplica)',
        ];

        foreach ($questions as $question) {
            DB::table('survey_details')->insert([
                'survey_id' => $surveyId,
                'question' => $question,
                'type' => 'short_answer',
                'title' => 'Contrato de Locación de Servicios',
                'detail' => 'Complete la siguiente información requerida para formalizar el contrato de locación de servicios.',
                'state' => 'activo',
                'requerid' => 'yes',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
