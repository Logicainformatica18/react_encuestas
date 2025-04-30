<?php

namespace App\Http\Controllers;
use App\Models\SelectionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Survey;
use App\Models\Selection;
use App\Http\Requests\StoreSelectionRequest;
use App\Http\Requests\UpdateSelectionRequest;

class SelectionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
       
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $survey_ = Survey::where("type", "=", "postulation")
        ->select("url", "id")
        ->get();
    // Almacenar en la sesión
    Session::put('survey_', $survey_);

    
         $selection = Selection::orderBy('id','asc')->get();
        $selection_detail = SelectionDetail::all();
        return view("selection", compact("selection","selection_detail"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
             $selection = Selection::orderBy('id','asc')->get();
              $selection_detail = SelectionDetail::all();
        return view("selectiontable", compact("selection","selection_detail"));
    }

    /**
     * Store a newly created resource in storage.
     */
       public function store(Request $request)
    {
        $selection = new Selection;
        $selection->description = $request->description;
        $selection->detail = $request->detail;
         $selection->associate_id = $request->associate_id;
            $selection->state = $request->state;
        $selection->save();
        return $this->create();
    }

    /**
     * Display the specified resource.
     */
    public function show(Selection $selection)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
     public function edit(Request $request)
    {
        //
        $selection = Selection::find($request->id);
        return $selection;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $selection = Selection::find($request->id);
        $selection->description = $request->description;
        $selection->detail = $request->detail;
                 $selection->associate_id = $request->associate_id;
        $selection->state = $request->state;
        $selection->save();
        return $this->create();
    }

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Request $request)
    {
        Selection::find($request->id)->delete();
        return $this->create();
    }
}
