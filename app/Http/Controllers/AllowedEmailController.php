<?php

namespace App\Http\Controllers;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use App\Models\AllowedEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllowedEmailController extends Controller
{
    public function index($survey_id)
    {
        $emails = AllowedEmail::where('survey_id', $survey_id)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('AllowedEmail/index', [
            'emails' => $emails,
            'survey_id' => $survey_id,
        ]);
    }

    public function fetchPaginated(Request $request)
    {
        $survey_id = $request->get('survey_id');

        $emails = AllowedEmail::where('survey_id', $survey_id)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json([
            'emails' => $emails,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'survey_id' => 'required|exists:surveys,id',
            'quanty' => 'nullable|integer|min:1',
        ]);

        $validated['quanty'] = $validated['quanty'] ?? 1;

        $email = AllowedEmail::create($validated);

        return response()->json([
            'message' => '✅ Email agregado correctamente',
            'email' => $email,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'quanty' => 'nullable|integer|min:1',
        ]);

        $email = AllowedEmail::findOrFail($id);
        $email->update($validated);

        return response()->json([
            'message' => '✏️ Email actualizado correctamente',
            'email' => $email,
        ]);
    }

    public function show($id)
    {
        $email = AllowedEmail::findOrFail($id);
        return response()->json(['email' => $email]); // ✅ debe devolver 'email'
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'survey_id' => 'required|exists:surveys,id',
        ]);

        $collection = Excel::toCollection(null, $request->file('file'))[0];

        foreach ($collection as $row) {
            $email = strtolower(trim($row[0] ?? ''));
            $quanty = intval($row[1] ?? 1);

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                continue; // ignora emails inválidos
            }

            // Si ya existe ese correo para esa encuesta, lo ignora
            $exists = AllowedEmail::where('survey_id', $request->survey_id)
                ->where('email', $email)
                ->exists();

            if (!$exists) {
                AllowedEmail::create([
                    'email' => $email,
                    'cantidad' => $quanty ?: 1,
                    'survey_id' => $request->survey_id,
                ]);
            }
        }

        return response()->json(['message' => 'Importación completada']);
    }

    public function destroy($id)
    {
        AllowedEmail::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        AllowedEmail::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Emails eliminados correctamente']);
    }
}
