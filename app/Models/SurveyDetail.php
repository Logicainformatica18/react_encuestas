<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyDetail extends Model
{

    protected $fillable = [
        'survey_id',
        'question',
        'detail',
        'detail_2',
        'detail_3',
        'correct',
        'evaluate',
        'requerid',
        'point',
        'title',
        'category',
        'enumeration',
        'visible',
        'initialize',
        'type',
        'option',
        'selection_id',
        'file_1',
    ];

    use HasFactory;
        public function survey()
    {
        return $this->hasOne('App\Models\Survey', 'id','survey_id');

    }
                    public function selection()
    {
        return $this->hasOne('App\Models\Selection', 'id','selection_id');

    }
}
