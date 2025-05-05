<?php

namespace Database\Seeders;
use App\Models\Survey;
use App\Models\Client;
use App\Models\SurveyDetail;
use App\Models\SurveyClient;
use App\Models\Answer;
use App\Models\Selection;
use App\Models\SelectionDetail;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(PermissionsSeeder::class);
        $this->call([
            TransferSeeder::class,
        ]);
        $this->call(ProductSeeder::class);
   // $this->call(ArticleSeeder::class);
// SurveysTableSeeder
  $this->call(SurveySeeder::class);

                  $this->call(SelectionSeeder::class);
                        $this->call(SelectionDetailSeeder::class);
                          $this->call(QuestionSeeder::class);

    }
}
