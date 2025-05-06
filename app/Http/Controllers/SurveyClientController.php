<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyDetail;
use App\Models\SurveyClient;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AgradecimientoEmail;
use App\Models\SurveyParticipation;
use Inertia\Inertia;

class SurveyClientController extends Controller
{
    public function publicHome($slug)
{
    $survey = Survey::where('url', $slug)->firstOrFail();
    return Inertia::render('SurveyClients/home', [
        'survey' => $survey
    ]);
}
public function start(Request $request)
{
    $survey_id = $request->input('survey_id');
    $code = $request->input('code');

    $survey = Survey::where('id', $survey_id)->firstOrFail();

    // Validar código si es privado
    if ($survey->state === 'private' && $survey->password !== $code) {
        return response()->json(['error' => 'Código incorrecto'], 403);
    }

    // Crear client
    $client = new \App\Models\Client();
    $client->save();

    session(['client_id' => $client->id]);

    return response()->json(['client_id' => $client->id]);
}
public function index(Request $request, $slug)
{
    $survey = Survey::whereRaw('LOWER(REPLACE(title, " ", "-")) = ?', [$slug])->firstOrFail();

    $survey_details = SurveyDetail::where('survey_id', $survey->id)
        ->where('visible', '1')
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($detail) {
            return [
                ...$detail->toArray(),
                'file_1' => $detail->file_1
                    ? asset('survey_files/' . $detail->file_1)
                    : null,
            ];
        });

    return Inertia::render('SurveyClients/index', [
        'survey' => [
            'id' => $survey->id,
            'title' => $survey->title,
            'description' => $survey->description,
            'state' => $survey->state,
            'slug' => $slug,
        ],
        'survey_details' => $survey_details,
        'survey_count' => $survey_details->count(),
        'client_id' => session('client_id'),
    ]);
}

public function completeSurvey(Request $request)
{
    $request->validate([
        'survey_id' => 'required|exists:surveys,id',
        'client_id' => 'required|exists:clients,id',
    ]);

    $already = SurveyParticipation::where('survey_id', $request->survey_id)
        ->where('client_id', $request->client_id)
        ->exists();

    if ($already) {
        return response()->json(['message' => '❌ Ya completaste esta encuesta.'], 403);
    }

    SurveyParticipation::create([
        'survey_id' => $request->survey_id,
        'client_id' => $request->client_id,
        'completed_at' => now(),
    ]);

    return response()->json(['message' => '✅ Participación registrada']);
}

public function store(Request $request)
{

    $request->validate([
        'survey_detail_id' => 'required|exists:survey_details,id',
        'client_id' => 'required|exists:clients,id',
        'answer' => 'nullable',
    ]);

    $survey_detail = SurveyDetail::with('survey')->findOrFail($request->survey_detail_id);
    $survey_id = $survey_detail->survey_id;

    $alreadyCompleted = SurveyParticipation::where('survey_id', $survey_id)
        ->where('client_id', $request->client_id)
        ->exists();

    if ($alreadyCompleted) {
        return response()->json(['message' => '❌ Ya completaste esta encuesta.'], 403);
    }




    $survey_detail = SurveyDetail::with('survey')->findOrFail($request->survey_detail_id);
    $survey_id = $survey_detail->survey_id;

    // 🚫 Verificar si el cliente ya respondió alguna pregunta de esta encuesta
    // $alreadyExists = SurveyClient::where('client_id', $request->client_id)
    //     ->whereHas('surveyDetail', function ($query) use ($survey_id) {
    //         $query->where('survey_id', $survey_id);
    //     })
    //     ->exists();

    // if ($alreadyExists) {
    //     return response()->json(['message' => '❌ Ya has completado esta encuesta.'], 403);
    // }

    $survey_client = new SurveyClient();
    $survey_client->survey_detail_id = $survey_detail->id;
    $survey_client->client_id = $request->client_id;

    if ($survey_detail->type === 'multiple_option') {
        $option_rpta = explode('-', $request->answer);
        $option_1 = $option_rpta[0] ?? null;

        if ($survey_detail->evaluate === 'yes') {
            $survey_client->option = json_encode($request->answer);
            $survey_client->answer = ($option_1 == $survey_detail->correct) ? 2 : 0;
        } else {
            $survey_client->answer = $request->answer;
        }

    } elseif ($survey_detail->type === 'selection') {
        $selection_detail_id = explode('-', $request->answer)[0] ?? null;
        $survey_client->selection_detail_id = $selection_detail_id;
        $survey_client->answer = $request->answer;

    } elseif ($survey_detail->type === 'email') {
        $survey_client->answer = $request->answer;

    } elseif ($survey_detail->type === 'file' && $request->hasFile('answer')) {
        $file = $request->file('answer');
        $filename = 'file_' . time() . '_' . $file->getClientOriginalName();
        $destination = public_path('contratos_aybar');
        if (!file_exists($destination)) {
            mkdir($destination, 0755, true);
        }
        $file->move($destination, $filename);
        $survey_client->answer = $filename;

    } else {
        $survey_client->answer = is_string($request->answer)
            ? strtoupper($request->answer)
            : $request->answer;
    }

    $survey_client->save();

    return response()->json(['message' => '✅ Respuesta guardada']);
}





}
