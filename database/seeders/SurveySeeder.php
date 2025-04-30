<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Survey;
class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Survey::create([
            'title' => 'Encuesta1',
            'description' => 'Primera encuesta de prueba',
            'detail' => '',
            'url' => '',
            'date_start' => '2023-05-04',
            'date_end' => '2023-05-04',
            'front_page' => null,
            'visible' => true,
            'email_confirmation' => false,
            'password' => null,
            'type' => 'general',
            'state' => 'activo',
            'created_by' => 1,
        ]);

        Survey::create([
            'title' => 'Encuesta2',
            'description' => 'Segunda encuesta sobre clientes',
            'detail' => '',
            'url' => '',
            'date_start' => '2023-06-01',
            'date_end' => '2023-06-10',
            'front_page' => null,
            'visible' => true,
            'email_confirmation' => true,
            'password' => 'encuesta123',
            'type' => 'postulation',
            'state' => 'activo',
            'created_by' => 1,
        ]);

    }
}
