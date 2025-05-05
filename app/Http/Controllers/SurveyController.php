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
        $surveys = Survey::latest()->paginate(10);

        return Inertia::render('surveys/index', [
            'surveys' => $surveys,
        ]);
    }

    public function fetchPaginated()
    {
        $surveys = Survey::latest()->paginate(10);
        return response()->json(['surveys' => $surveys]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'front_page' => 'nullable|file|max:2048',
            'file_1' => 'nullable|file|mimes:doc,docx|max:5120', // ✅ validación para plantilla .docx
            'visible' => 'nullable|boolean',
            'email_confirmation' => 'nullable|boolean',
            'password' => 'nullable|string',
            'description' => 'nullable|string',
            'detail' => 'nullable|string',
            'date_start' => 'nullable|date',
            'date_end' => 'nullable|date',
            'type' => 'nullable|string',
            'state' => 'nullable|string',
        ]);

        $survey = new Survey();
        $survey->fill($request->except(['front_page', 'file_1']));

        // Generar URL única basada en el título
        $baseSlug = Str::slug($request->title);
        $slug = $baseSlug;
        $i = 1;
        while (Survey::where('url', $slug)->exists()) {
            $slug = $baseSlug . '-' . $i++;
        }
        $survey->url = $slug;
        $survey->created_by = Auth::id();

        if ($request->hasFile('front_page')) {
            $survey->front_page = fileStore($request->file('front_page'), 'imageusers');
        }

        if ($request->hasFile('file_1')) {
            $survey->file_1 = fileStore($request->file('file_1'), 'plantillas_encuestas');
        }

        $survey->save();

        $code = 'encuesta-' . $survey->id;

        return response()->json([
            'message' => '✅ Encuesta creada correctamente',
            'survey' => $survey,
            'code' => $code
        ]);
    }

    public function update(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'front_page' => 'nullable|file|max:2048',
            'file_1' => 'nullable|file|mimes:doc,docx|max:5120', // ✅ validación para plantilla .docx
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
            'survey' => $survey
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
