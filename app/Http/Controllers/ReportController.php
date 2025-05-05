<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    
    public function index(Request $request)
    {
        $survey = Survey::findOrFail($request->survey_id);
    
        $ids = DB::table('survey_details')
            ->where('survey_id', $survey->id)
            ->pluck('id');
    
        $questions = DB::table('survey_details')
            ->where('survey_id', $survey->id)
            ->pluck('question', 'id');
    
        $selects = ['sc.client_id'];
    
        foreach ($ids as $id) {
            $selects[] = DB::raw("MAX(CASE WHEN sd.id = $id THEN sc.updated_at END) as updated_at_$id");
            $selects[] = DB::raw("MAX(CASE WHEN sd.id = $id THEN sc.answer END) as pregunta_$id");
        }
    
        $results = DB::table('survey_clients as sc')
            ->join('survey_details as sd', 'sc.survey_detail_id', '=', 'sd.id')
            ->join('clients as c', 'c.id', '=', 'sc.client_id')
            ->whereIn('sc.survey_detail_id', $ids)
            ->groupBy('sc.client_id')
            ->select($selects)
            ->get();
    
        return inertia('Reports/index', [
            'survey' => $survey,
            'results' => $results,
            'questions' => $questions,
        ]);
    }
    
    
    
}
