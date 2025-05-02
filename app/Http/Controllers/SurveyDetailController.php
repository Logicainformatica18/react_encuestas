<?php

namespace App\Http\Controllers;

use App\Models\SurveyDetail;
use App\Models\Survey;
use App\Models\Selection;
use App\Models\SurveyClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SurveyDetailController extends Controller
{
    public function index()
    {
        $survey_id = Session::get('survey_id');
        $survey = Survey::findOrFail($survey_id);
        $selections = Selection::orderBy('created_at', 'asc')->get();
        $survey_details = SurveyDetail::where("survey_id", $survey_id)
            ->where("visible", "yes")
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('SurveyDetails/index', [
            'surveyDetails' => $survey_details,
            'survey' => $survey,
            'selections' => $selections,
        ]);
    }

    public function store(Request $request)
    {
        $survey_id = Session::get('survey_id');
        $options = $request->input('options', []);
        $filteredOptions = array_filter($options, fn($opt) => !empty($opt));

        $survey_detail = new SurveyDetail();
        $survey_detail->survey_id = $survey_id;
        $survey_detail->question = Str::upper($request->question);
        $survey_detail->detail = $request->detail;
        $survey_detail->type = $request->type;
        $survey_detail->option = json_encode($filteredOptions);
        $survey_detail->state = $request->state;
        $survey_detail->requerid = $request->requerid;
        $survey_detail->title = $request->title;
        $survey_detail->evaluate = $request->evaluate;
        $survey_detail->selection_id = $request->selection_id;

        // Default fields
        $survey_detail->enumeration = "0";
        $survey_detail->initialize = "not";
        $survey_detail->category = "all";

        $survey_detail->save();

        return redirect()->route('survey-details.index')->with('success', 'Pregunta creada correctamente.');
    }

    public function edit($id)
    {
        $survey_detail = SurveyDetail::findOrFail($id);
        return response()->json($survey_detail);
    }

    public function update(Request $request, $id)
    {
        $survey_detail = SurveyDetail::findOrFail($id);

        $survey_detail->question = Str::upper($request->question);
        $survey_detail->detail = $request->detail;
        $survey_detail->detail_2 = $request->detail_2;
        $survey_detail->detail_3 = $request->detail_3;
        $survey_detail->correct = $request->correct;
        $survey_detail->evaluate = $request->evaluate;
        $survey_detail->requerid = $request->requerid;
        $survey_detail->point = $request->point;
        $survey_detail->title = $request->title;
        $survey_detail->category = $request->category;
        $survey_detail->enumeration = $request->enumeration;
        $survey_detail->save();

        return redirect()->route('survey-details.index')->with('success', 'Pregunta actualizada correctamente.');
    }

    public function destroy($id)
    {
        SurveyClient::where('survey_detail_id', $id)->delete();
        SurveyDetail::findOrFail($id)->delete();

        return redirect()->route('survey-details.index')->with('success', 'Pregunta eliminada correctamente.');
    }
    public function details(Survey $survey)
{
    $selections = Selection::orderBy('created_at', 'asc')->get();
    $survey_details = SurveyDetail::where("survey_id", $survey->id)
        ->where("visible", "yes")
        ->orderBy('created_at', 'asc')
        ->get();

    return Inertia::render('SurveyDetails/index', [
        'surveyDetails' => $survey_details,
        'survey' => $survey,
        'selections' => $selections,
    ]);
}

}
