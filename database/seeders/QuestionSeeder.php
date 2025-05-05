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
        DB::table('survey_details')->insert([
            [
                'question' => 'Nombre completo del locador',
                'type' => 'short_answer',
                'option' => null,
                'state' => '1',
                'visible' => '1',
                'requerid' => 'yes',
                'title' => 'Datos personales',
                'evaluate' => null,
                'enumeration' => null,
                'category' => null,
                'survey_id' => '1',
            ],
            [
                'question' => 'DNI del locador',
                'type' => 'short_answer',
                'option' => null,
                'state' => '1',
                'visible' => '1',
                'requerid' => 'yes',
                'title' => 'Datos personales',
                'evaluate' => null,
                'enumeration' => null,
                'category' => null,
                'survey_id' => '1',
            ],
            [
                'question' => 'Dirección del locador',
                'type' => 'short_answer',
                'option' => null,
                'state' => '1',
                'visible' => '1',
                'requerid' => 'yes',
                'title' => 'Datos personales',
                'evaluate' => null,
                'enumeration' => null,
                'category' => null,
                'survey_id' => '1',
            ],
            [
                'question' => 'Distrito del locador',
                'type' => 'short_answer',
                'option' => null,
                'state' => '1',
                'visible' => '1',
                'requerid' => 'yes',
                'title' => 'Datos personales',
                'evaluate' => null,
                'enumeration' => null,
                'category' => null,
                'survey_id' => '1',
            ],
            [
                'question' => 'Correo electrónico del locador',
                'type' => 'short_answer',
                'option' => null,
                'state' => '1',
                'visible' => '1',
                'requerid' => 'yes',
                'title' => 'Datos de contacto',
                'evaluate' => null,
                'enumeration' => null,
                'category' => null,
                'survey_id' => '1',
            ],
        ]);




        $surveyId = 2; // 🔁 Cambiar según el ID real de la encuesta

        $preguntas = [
            ['title' => 'Nombre del socio comercial', 'campo' => 'campo1'],
            ['title' => 'DNI del socio comercial', 'campo' => 'campo2'],
            ['title' => 'Dirección del socio comercial', 'campo' => 'campo3'],
            ['title' => 'Distrito del socio comercial', 'campo' => 'campo4'],
        ];

        foreach ($preguntas as $p) {
            SurveyDetail::create([
                'survey_id'   => $surveyId,
                'question'    => 'Complete: ' . $p['title'],
                'title'       => $p['campo'],
                'type'        => 'short_answer',
                'option'      => json_encode([]),
                'requerid'    => 'Sí',
                'visible'     => '1',
                'initialize'  => 'not',
                'enumeration' => '0',
                'category'    => 'all',
            ]);
        }
    }
}
