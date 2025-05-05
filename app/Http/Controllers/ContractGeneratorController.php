<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ContractGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        try {
            $clientId = $request->input('client_id');
            $answers = $request->input('answers', []);

            Log::debug('Generando contrato para cliente', ['client_id' => $clientId]);
            Log::debug('Respuestas recibidas', $answers);

            if (!$clientId || empty($answers)) {
                Log::warning('Faltan datos en la solicitud');
                return response()->json(['error' => 'Faltan datos'], 422);
            }

            // Plantilla en public
            $templatePath = public_path('contratos_plantilla_aybar/CONTRATO_PLANTILLA_RELLENABLE.docx');
            if (!file_exists($templatePath)) {
                Log::error('No se encontró la plantilla en: ' . $templatePath);
                return response()->json(['error' => 'Plantilla no encontrada'], 500);
            }

            Log::debug('Plantilla encontrada en: ' . $templatePath);

            $template = new TemplateProcessor($templatePath);

            $variables = $template->getVariables();
            Log::debug('Campos detectados en plantilla', $variables);

            if (empty($variables)) {
                Log::error('No se encontraron campos {{campoX}} en la plantilla');
                return response()->json(['error' => 'No se encontraron campos en plantilla'], 500);
            }

            $values = array_values($answers);
            Log::debug('Respuestas ordenadas', $values);

            if (count($values) < count($variables)) {
                Log::warning('Respuestas insuficientes para la cantidad de campos');
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
                Log::debug("Carpeta contratos_aybar creada");
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
