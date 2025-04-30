<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = [
        'title',
        'description',
        'detail',
        'url',
        'date_start',
        'date_end',
        'front_page',
        'created_by',
        'email_confirmation',
        'password',
        'type',
        'visible',
        'state',
    ];


    use HasFactory;
        public function survey_detail()
    {

        return $this->hasMany('App\Models\SurveyDetail', 'survey_id','id');
    }
    public function created_bys()
    {

        return $this->belongsTo('App\Models\User', 'created_by','id');
    }
}
