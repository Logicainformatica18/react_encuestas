<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyClient extends Model
{
    use HasFactory;
    public function survey_detail()
{
    return $this->belongsTo(SurveyDetail::class);
}

}
