<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyParticipation extends Model
{
    use HasFactory;

    protected $fillable = [
        'survey_id',
        'client_id',
        'completed_at',
    ];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
