<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyDetail;
use App\Models\SurveyClient;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AgradecimientoEmail;
use App\Models\AllowedEmail;
use App\Models\SurveyParticipation;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
        $email = $request->input('email');

        $survey = Survey::findOrFail($survey_id);

        if ($survey->type === 'privado') {
            if (!$email) {
                return response()->json([
                    'error' => '⚠️ El correo es obligatorio para encuestas privadas.'
                ], 422);
            }

            $isAllowed = AllowedEmail::where('survey_id', $survey_id)
                ->where('email', $email)
                ->exists();

            if (!$isAllowed) {
                return response()->json([
                    'error' => '🚫 Este correo no está autorizado para acceder a esta encuesta.'
                ], 403);
            }
        }

        $client = new \App\Models\Client();

        $client->save();

        session([
            'client_id' => $client->id,
            'client_email' => $email,
        ]);

        return response()->json([
            'client_id' => $client->id
        ]);
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

        if ($response = $this->checkSurveyLimitReached($request->survey_id, $request->client_id)) {
            return $response;
        }

        SurveyParticipation::create([
            'survey_id' => $request->survey_id,
            'client_id' => $request->client_id,
            'completed_at' => now(),
        ]);

        return response()->json(['message' => '✅ Participación registrada']);
    }

    protected function checkSurveyLimitReached(int $surveyId, int $clientId)
    {
        $survey = Survey::findOrFail($surveyId);
        $maxAllowed = $survey->quanty ?? 1;

        $currentCount = SurveyParticipation::where('survey_id', $survey->id)
            ->where('client_id', $clientId)
            ->count();

        if ($currentCount >= $maxAllowed) {
            return response()->json(['message' => '🚫 Ya completaste esta encuesta.'], 422);
        }

        return null;
    }

   public function store(Request $request)
{
    Log::info('🚀 Entrando al método store() de SurveyClientController');

    $request->validate([
        'client_id' => 'required|exists:clients,id',
        'answers' => 'required|array',
        'answers.*.survey_detail_id' => 'required|exists:survey_details,id',
        'answers.*.answer' => 'nullable',
        'email' => 'nullable|email',
    ]);

    $clientId = $request->client_id;

    try {
        // ✅ Obtener dinámicamente el primer survey_detail_id válido
        $firstAnswer = collect($request->input('answers'))->first();
        $firstSurveyDetailId = $firstAnswer['survey_detail_id'] ?? null;

        if (!$firstSurveyDetailId) {
            Log::error('⚠️ No se encontró ningún survey_detail_id en las respuestas');
            return response()->json(['message' => '❌ Respuestas mal estructuradas'], 422);
        }

        $firstSurveyDetail = SurveyDetail::with('survey')->findOrFail($firstSurveyDetailId);
        $surveyId = $firstSurveyDetail->survey_id;

        Log::info("🎯 Survey ID detectado: $surveyId");

        // ✅ Verificar límite de respuestas
        if ($response = $this->checkSurveyLimitReached($surveyId, $clientId)) {
            Log::warning("❌ Límite alcanzado para client_id $clientId");
            return $response;
        }

        // ✅ Eliminar respuestas anteriores
        SurveyClient::where('client_id', $clientId)
            ->whereHas('survey_detail', fn($q) => $q->where('survey_id', $surveyId))
            ->delete();

        Log::info("🗑️ Respuestas anteriores eliminadas para client_id $clientId en survey_id $surveyId");

        // ✅ Recorrer respuestas
        foreach ($request->answers as $index => $answerData) {
            Log::info("🌀 Procesando respuesta $index", $answerData);

            $survey_detail = SurveyDetail::with('survey')->findOrFail($answerData['survey_detail_id']);

            $survey_client = new SurveyClient();
            $survey_client->survey_detail_id = $survey_detail->id;
            $survey_client->client_id = $clientId;

            if ($survey_detail->type === 'multiple_option') {
                $option_rpta = explode('-', $answerData['answer']);
                $option_1 = $option_rpta[0] ?? null;

                if ($survey_detail->evaluate === 'yes') {
                    $survey_client->option = json_encode($answerData['answer']);
                    $survey_client->answer = ($option_1 == $survey_detail->correct) ? 2 : 0;
                } else {
                    $survey_client->answer = $answerData['answer'];
                }

            } elseif ($survey_detail->type === 'selection') {
                $selection_detail_id = explode('-', $answerData['answer'])[0] ?? null;
                $survey_client->selection_detail_id = $selection_detail_id;
                $survey_client->answer = $answerData['answer'];

            } elseif ($survey_detail->type === 'email') {
                $survey_client->answer = $answerData['answer'];

            } elseif ($survey_detail->type === 'file') {
                $file = $request->file("answers.{$survey_detail->id}.answer");

                if ($file && $file->isValid()) {
                    $survey_client->answer = fileStore($file, 'contratos_aybar');
                    Log::info("📎 Archivo almacenado para pregunta {$survey_detail->id}: {$file->getClientOriginalName()}");
                } else {
                    Log::warning("⚠️ No se recibió archivo válido para pregunta {$survey_detail->id}");
                }

            } else {
                $survey_client->answer = is_string($answerData['answer'])
                    ? strtoupper($answerData['answer'])
                    : $answerData['answer'];
            }

            try {
                $survey_client->save();
                Log::info('✅ Respuesta guardada', [
                    'client_id' => $clientId,
                    'survey_detail_id' => $survey_detail->id,
                    'answer' => $survey_client->answer,
                ]);
            } catch (\Exception $e) {
                Log::error('❌ Error al guardar respuesta', [
                    'message' => $e->getMessage(),
                    'data' => $answerData,
                ]);
            }
        }

        return response()->json(['message' => '✅ Respuestas guardadas']);
    } catch (\Exception $e) {
        Log::error('🔥 Error general en store', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json(['message' => '❌ Error al guardar las respuestas'], 500);
    }
}




}
