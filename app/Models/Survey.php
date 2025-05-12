<?php

namespace App\Models;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $appends = ['contract_end_date_calculated'];

protected $fillable = [
    'title', 'description', 'detail', 'url',
    'date_start', 'date_end', 'front_page',
    'file_1', 'visible', 'email_confirmation',
    'password', 'type', 'state', 'quanty',
    'contract_end_type',
    'contract_duration_months',
    'contract_end_day',
    'contract_duration_days',
    'contract_end_date',
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

    public function getContractEndDateCalculatedAttribute()
{
    $startDate = Carbon::now(); // Fecha actual como inicio del contrato

   switch ($this->contract_end_type) {
    case 'by_day_and_months':
        if ($this->contract_duration_months !== null) {
            $fecha = $startDate->copy()->addMonths((int) $this->contract_duration_months);

            if ((int) $this->contract_end_day > 0) {
                $fecha->day((int) $this->contract_end_day);
            }

            return $fecha;
        }
        break;

    case 'by_days':
        if ((int) $this->contract_duration_days > 0) {
            return $startDate->copy()->addDays((int) $this->contract_duration_days);
        }
        break;

    case 'fixed':
        if (!empty($this->contract_end_date)) {
            return Carbon::parse($this->contract_end_date);
        }
        break;
}


    return null; // Datos incompletos o inválidos
}
}
