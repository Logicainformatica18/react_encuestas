<?php

namespace App\Http\Controllers;

use App\Models\Selection;
use App\Models\SelectionDetail;
use App\Exports\SelectionsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use Maatwebsite\Excel\Facades\Excel;

class SelectionController extends Controller
{
    public function index()
    {
        $selections = Selection::latest()->orderBy('id', 'desc')->paginate(10);

        return Inertia::render('Selections/index', [
            'selections' => $selections,
            'associates' => Selection::select('id', 'description')->get(), // para usar en el select
        ]);
        
    }

    public function fetchPaginated()
    {
        $selections = Selection::with('associate')
            ->orderBy('id', 'desc')
            ->paginate(10);
    
        return response()->json([
            'selections' => $selections,
        ]);
    }
    


   
public function store(Request $request)
{
    $request->validate([
        'description' => 'required|string|max:255',
        'detail' => 'nullable|string',
        'associate_id' => 'nullable|integer',
        'state' => 'nullable|string|max:50',
    ]);

    $selection = Selection::create($request->only('description', 'detail', 'associate_id', 'state'));

    Log::info('✅ Nueva selección creada', [
        'selection_id' => $selection->id,
        'description' => $selection->description,
        'associate_id' => $selection->associate_id,
        'state' => $selection->state,
    ]);

    return response()->json([
        'message' => '✅ Selección creada correctamente',
        'selection' => $selection,
    ]);
}
    

    public function update(Request $request, $id)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'associate_id' => 'nullable|integer',
            'state' => 'nullable|string|max:50',
        ]);

        $selection = Selection::findOrFail($id);
        $selection->update($request->only('description', 'detail', 'associate_id', 'state'));

        return response()->json([
            'message' => '✅ Selección actualizada correctamente',
            'selection' => $selection,
        ]);
    }

    public function show($id)
    {
        $selection = Selection::with('associate')->findOrFail($id);
        return response()->json(['selection' => $selection]);
    }

    public function destroy($id)
    {
        Selection::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Selection::whereIn('id', $ids)->delete();

        return response()->json(['message' => '✅ Selecciones eliminadas correctamente']);
    }

    public function exportExcel()
    {
        return Excel::download(new SelectionsExport, 'selecciones.xlsx');
    }
}
