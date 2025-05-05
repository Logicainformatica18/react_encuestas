<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Survey;

class ContractGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        try {
            $clientId = $request->input('client_id');
            $surveyId = $request->input('survey_id');
            $answers = $request->input('answers', []);

            Log::debug('Generando contrato para cliente', ['client_id' => $clientId, 'survey_id' => $surveyId]);
            Log::debug('Respuestas recibidas', $answers);

            if (!$clientId || !$surveyId || empty($answers)) {
                return response()->json(['error' => 'Faltan datos'], 422);
            }

            $survey = Survey::findOrFail($surveyId);

            if (!$survey->file_1) {
                return response()->json(['error' => 'La encuesta no tiene plantilla asignada'], 404);
            }

            // Plantilla ubicada en public/plantillas_encuestas/
            $templatePath = public_path("plantillas_encuestas/{$survey->file_1}");

            if (!file_exists($templatePath)) {
                Log::error("Archivo de plantilla no encontrado en: {$templatePath}");
                return response()->json(['error' => 'Archivo de plantilla no encontrado'], 500);
            }

            $template = new TemplateProcessor($templatePath);
            $variables = $template->getVariables();

            if (empty($variables)) {
                Log::error('No se encontraron campos {{campoX}} en la plantilla');
                return response()->json(['error' => 'No se encontraron campos en la plantilla'], 500);
            }

            $values = array_values($answers);
            if (count($values) < count($variables)) {
                return response()->json(['error' => 'No se han proporcionado suficientes respuestas'], 422);
            }

            foreach ($variables as $index => $var) {
                $valor = $values[$index] ?? '';
                $template->setValue($var, $valor);
                Log::debug("Reemplazando $var con $valor");
            }

            $targetDir = public_path('contratos_aybar');
            if (!File::exists($targetDir)) {
                File::makeDirectory($targetDir, 0755, true);
                Log::info("Carpeta creada: contratos_aybar");
            }

            $filename = 'Contrato_' . Str::slug(now()) . '_cliente' . $clientId . '.docx';
            $filePath = $targetDir . '/' . $filename;

            $template->saveAs($filePath);

            Log::info('Contrato generado correctamente', ['archivo' => $filePath]);

            return response()->json([
                'message' => '✅ Documento generado correctamente',
                'download_url' => url('contratos_aybar/' . $filename),
                'campos_reemplazados' => $variables,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error generando contrato: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }
}
