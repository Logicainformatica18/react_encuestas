<?php

namespace App\Http\Controllers;

use App\Models\AllowedEmail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class AllowedEmailController extends Controller
{
    public function index($survey_id)
    {
        $emails = AllowedEmail::where('survey_id', $survey_id)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('Emails/Index', [
            'emails' => $emails,
            'survey_id' => $survey_id,
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
        return response()->json(['email' => $email]);
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
