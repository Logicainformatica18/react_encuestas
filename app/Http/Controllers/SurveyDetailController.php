<?php

namespace App\Http\Controllers;

use App\Models\SurveyDetail;
use App\Models\Survey;
use App\Models\Selection;
use App\Models\SurveyClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Exports\SurveyDetailsExport;
use Maatwebsite\Excel\Facades\Excel;

class SurveyDetailController extends Controller
{
    public function index($survey_id)
    {
        $survey = Survey::findOrFail($survey_id);
        $selections = Selection::orderBy('created_at')->get();
    
        $survey_details = SurveyDetail::where('survey_id', $survey_id)
            ->where('visible', '1')
            ->orderBy('created_at', 'desc')
            ->paginate(10); // 👈 CAMBIO CLAVE
    
        return Inertia::render('SurveyDetails/index', [
            'surveyDetails' => $survey_details,
            'survey' => $survey,
            'selections' => $selections,
        ]);
    }
    

    public function store(Request $request)
    {
        try {
            Log::info('📥 Datos recibidos en SurveyDetailController@store', $request->all());

            $request->validate([
                'survey_id' => 'required|exists:surveys,id',
                'question' => 'required|string|max:255',
                'type' => 'required|string|max:50',
                'requerid' => 'nullable|string|max:10',
                'title' => 'nullable|string|max:255',
                'evaluate' => 'nullable|string|max:255',
                'selection_id' => 'nullable|exists:selections,id',
                'detail' => 'nullable|string',
                'detail_2' => 'nullable|string',
                'detail_3' => 'nullable|string',
                'correct' => 'nullable|string',
                'point' => 'nullable|numeric',
                'category' => 'nullable|string',
                'enumeration' => 'nullable|string',
                'visible' => 'nullable|string|max:5',
            ]);

            $options = array_filter($request->input('options', []), fn($opt) => !empty($opt));

            $survey_detail = new SurveyDetail();
            $survey_detail->survey_id = $request->survey_id;
            $survey_detail->question = Str::upper($request->question);
            $survey_detail->type = $request->type;
            $survey_detail->option = json_encode($options);
            $survey_detail->title = $request->title;
            $survey_detail->state = $request->state;
            $survey_detail->evaluate = $request->evaluate;
            $survey_detail->requerid = $request->requerid ?? 'Sí';
            $survey_detail->selection_id = $request->selection_id;
            $survey_detail->detail = $request->detail;
            $survey_detail->detail_2 = $request->detail_2;
            $survey_detail->detail_3 = $request->detail_3;
            $survey_detail->correct = $request->correct;
            $survey_detail->point = $request->point;
            $survey_detail->category = $request->category ?? 'all';
            $survey_detail->enumeration = $request->enumeration ?? '0';
            $survey_detail->initialize = 'not';
            $survey_detail->visible = $request->visible ?? '1';

            $survey_detail->save();

            return response()->json([
                'message' => '✅ Pregunta registrada correctamente.',
                'survey_detail' => $survey_detail,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error al guardar SurveyDetail', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);
            return response()->json(['error' => 'Error al guardar la pregunta.'], 500);
        }
    }

    public function edit($id)
    {
        $survey_detail = SurveyDetail::findOrFail($id);
        return response()->json(['survey_detail' => $survey_detail]);

    }

    public function update(Request $request, $id)
    {
        $survey_detail = SurveyDetail::findOrFail($id);
    
        $request->validate([
            'question' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'detail_2' => 'nullable|string',
            'detail_3' => 'nullable|string',
            'correct' => 'nullable|string',
            'evaluate' => 'nullable|string',
            'requerid' => 'nullable|string|max:10',
            'point' => 'nullable|numeric',
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'enumeration' => 'nullable|string|max:20',
            'visible' => 'nullable|string|max:5',
            'type' => 'required|string|max:50',
            'option' => 'nullable|array',
            'selection_id' => 'nullable|exists:selections,id',
        ]);
    
        $survey_detail->question = Str::upper($request->question);
        $survey_detail->detail = $request->detail;
        $survey_detail->detail_2 = $request->detail_2;
        $survey_detail->detail_3 = $request->detail_3;
        $survey_detail->correct = $request->correct;
        $survey_detail->evaluate = $request->evaluate;
        $survey_detail->requerid = $request->requerid ?? 'Sí';
        $survey_detail->point = $request->point;
        $survey_detail->title = $request->title;
        $survey_detail->category = $request->category;
        $survey_detail->enumeration = $request->enumeration;
        $survey_detail->visible = $request->visible ?? '1';
        $survey_detail->type = $request->type;
        $survey_detail->selection_id = $request->selection_id;
        $survey_detail->option = $request->type === 'multiple_option'
        ? json_encode($request->option ?? [])
        : json_encode([]);
    
    
        $survey_detail->save();
    
        return response()->json([
            'message' => '✅ Pregunta actualizada correctamente.',
            'survey_detail' => $survey_detail,
        ]);
    }
    
    

    public function destroy($id)
    {
        $detail = SurveyDetail::findOrFail($id);
        SurveyClient::where('survey_detail_id', $id)->delete();
        $detail->delete();

        return response()->json([
            'message' => '✅ Pregunta eliminada correctamente.',
            'success' => true,
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        SurveyClient::whereIn('survey_detail_id', $ids)->delete();
        SurveyDetail::whereIn('id', $ids)->delete();

        return response()->json(['message' => '✅ Preguntas eliminadas correctamente.']);
    }

    public function exportExcel($survey_id)
    {
        return Excel::download(new SurveyDetailsExport($survey_id), "encuesta_{$survey_id}_preguntas.xlsx");
    }
    public function fetchPaginated(Request $request)
{
    $request->validate([
        'survey_id' => 'required|exists:surveys,id',
    ]);

    $survey_id = $request->survey_id;

    $surveyDetails = SurveyDetail::where('survey_id', $survey_id)
        ->where('visible', '1')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return response()->json([
        'surveyDetails' => $surveyDetails
    ]);
}

}
