<?php

namespace App\Http\Controllers;

use App\Models\SelectionDetail;
use App\Models\Selection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SelectionDetailsExport;

class SelectionDetailController extends Controller
{
    public function index($selection_id)
    {
        $selection = Selection::findOrFail($selection_id);

        $selectionDetails = SelectionDetail::where('selection_id', $selection_id)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('selection-details/index', [
            'selectionDetails' => $selectionDetails,
            'selection' => $selection,
        ]);
    }

    public function fetchPaginated(Request $request)
    {
        $selection_id = $request->query('selection_id');

        $selectionDetails = SelectionDetail::where('selection_id', $selection_id)
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json(['selectionDetails' => $selectionDetails]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'selection_id' => 'required|exists:selections,id',
            'associate_detail_id' => 'nullable|integer',
        ]);

        $selectionDetail = SelectionDetail::create($request->only(
            'description', 'detail', 'selection_id', 'associate_detail_id'
        ));

        return response()->json([
            'message' => '✅ Detalle creado correctamente',
            'selectionDetail' => $selectionDetail,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'description' => 'required|string|max:255',
            'detail' => 'nullable|string',
            'associate_detail_id' => 'nullable|integer',
        ]);

        $selectionDetail = SelectionDetail::findOrFail($id);
        $selectionDetail->update($request->only('description', 'detail', 'associate_detail_id'));

        return response()->json([
            'message' => '✅ Detalle actualizado correctamente',
            'selectionDetail' => $selectionDetail,
        ]);
    }

    public function show($id)
    {
        $selectionDetail = SelectionDetail::findOrFail($id);
        return response()->json(['selectionDetail' => $selectionDetail]);
    }

    public function destroy($id)
    {
        SelectionDetail::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        SelectionDetail::whereIn('id', $ids)->delete();

        return response()->json(['message' => '✅ Detalles eliminados correctamente']);
    }

    public function exportExcel($selection_id)
    {
        return Excel::download(new SelectionDetailsExport($selection_id), "selection_{$selection_id}_detalles.xlsx");
    }
}
