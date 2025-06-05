<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationSurveyComplete;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SurveyController extends Controller
{
    public function index()
    {
        $surveys = Survey::orderBy("id","asc")->paginate(10);

        return Inertia::render('surveys/index', [
            'surveys' => $surveys,
        ]);
    }

    public function fetchPaginated()
    {
        $surveys = Survey::orderBy("id","asc")->paginate(10);
        return response()->json(['surveys' => $surveys]);
    }

public function store(Request $request)
{
    // $request->validate([
    //     'title' => 'required|string|max:255',
    //     'front_page' => 'nullable|file|max:2048',
    //     'file_1' => 'nullable|file|mimes:doc,docx|max:5120',
    //     'visible' => 'nullable|boolean',
    //     'email_confirmation' => 'nullable|boolean',
    //     'password' => 'nullable|string',
    //     'description' => 'nullable|string',
    //     'detail' => 'nullable|string',
    //     'date_start' => 'nullable|date',
    //     'date_end' => 'nullable|date',
    //     'type' => 'nullable|string',
    //     'state' => 'nullable|string',
    //     'quanty' => 'nullable|integer',

    //     // ✅ Nuevos campos para vencimiento de contrato
    //     'contract_end_type' => 'nullable|string|in:by_day_and_months,by_days,fixed',
    //     'contract_duration_months' => 'nullable|integer|min:0',
    //     'contract_end_day' => 'nullable|integer|min:1|max:31',
    //     'contract_duration_days' => 'nullable|integer|min:0',
    //     'contract_end_date' => 'nullable|date',
    // ]);

    $survey = new Survey();
    $survey->fill($request->except(['front_page', 'file_1']));

    // Generar slug único
    $baseSlug = Str::slug($request->title);
    $slug = $baseSlug;
    $i = 1;
    while (Survey::where('url', $slug)->exists()) {
        $slug = $baseSlug . '-' . $i++;
    }
    $survey->url = $slug;
    $survey->created_by = Auth::id();

    // Guardar portada si se envió
    if ($request->hasFile('front_page')) {
        $survey->front_page = fileStore($request->file('front_page'), 'imageusers');
    }

    // Guardar plantilla .docx si se envió
    if ($request->hasFile('file_1')) {
        $survey->file_1 = fileStore($request->file('file_1'), 'plantillas_encuestas');
    }

    $survey->save();

    return response()->json([
        'message' => '✅ Encuesta creada correctamente',
        'survey' => $survey,
        'code' => 'encuesta-' . $survey->id,
    ]);
}


public function update(Request $request, $id)
{
    $survey = Survey::findOrFail($id);

    // 🐛 LOG de valores recibidos
    Log::debug('🛠 Datos recibidos para actualizar encuesta:', [
        'id' => $id,
        'contract_end_type' => $request->contract_end_type,
        'contract_duration_months' => $request->contract_duration_months,
        'contract_end_day' => $request->contract_end_day,
        'contract_duration_days' => $request->contract_duration_days,
        'contract_end_date' => $request->contract_end_date,
    ]);

    $request->validate([
        'title' => 'required|string|max:255',
        'front_page' => 'nullable|file|max:2048',
        'file_1' => 'nullable|file|mimes:doc,docx|max:5120',
        'visible' => 'nullable|boolean',
        'email_confirmation' => 'nullable|boolean',
        'password' => 'nullable|string',
        'description' => 'nullable|string',
        'detail' => 'nullable|string',
        'date_start' => 'nullable|date',
        'date_end' => 'nullable|date',
        'url' => 'nullable|string',
        'type' => 'nullable|string',
        'state' => 'nullable|string',
        'quanty' => 'nullable|integer',

        // ✅ Vencimiento contrato
        'contract_end_type' => 'nullable|string|in:by_day_and_months,by_days,fixed',
        'contract_duration_months' => 'nullable',
        'contract_end_day' => 'nullable',
        'contract_duration_days' => 'nullable',
        'contract_end_date' => 'nullable|date',
    ]);

    // Convertir campos a int seguros antes de guardar
    $request->merge([
        'contract_duration_months' => (int) $request->contract_duration_months,
        'contract_end_day' => (int) $request->contract_end_day,
        'contract_duration_days' => (int) $request->contract_duration_days,
    ]);

    $survey->fill($request->except(['front_page', 'file_1']));
    $survey->created_by = Auth::id();

    if ($request->hasFile('front_page')) {
        $survey->front_page = fileUpdate($request->file('front_page'), 'imageusers', $survey->front_page);
    }

    if ($request->hasFile('file_1')) {
        $survey->file_1 = fileUpdate($request->file('file_1'), 'plantillas_encuestas', $survey->file_1);
    }

    $survey->save();

    return response()->json([
        'message' => '✅ Encuesta actualizada correctamente',
        'survey' => $survey,
    ]);
}



    public function show($id)
    {
        $survey = Survey::findOrFail($id);
        return response()->json(['survey' => $survey]);
    }

    public function destroy($id)
    {
        Survey::findOrFail($id)->delete();
        return response()->json(['message' => '✅ Encuesta eliminada']);
    }

    public function notify(Request $request)
    {
        $survey = Survey::findOrFail($request->id);

        if ($survey->email_confirmation == 1 && $survey->created_bys && $survey->created_bys->email) {
            Mail::to($survey->created_bys->email)->send(new NotificationSurveyComplete($survey));
            return response()->json(['message' => '📧 Notificación enviada']);
        }

        return response()->json(['message' => '⚠️ No se pudo enviar notificación']);
    }

    public function surveyDetailSession(Request $request)
    {
        session(['survey_id' => $request->id]);
        return response()->json(['message' => '🧠 ID de encuesta almacenado']);
    }
}
