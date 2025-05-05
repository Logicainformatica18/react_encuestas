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
    }
}
