<?php
    use App\Http\Controllers\TransferController;
    use App\Http\Controllers\UserController;
    use App\Http\Controllers\ProductController;
    use App\Http\Controllers\SurveyController;
    use App\Http\Controllers\SurveyDetailController;
    use App\Http\Controllers\SelectionController;
use App\Http\Controllers\SelectionDetailController;
use App\Http\Controllers\SurveyClientController;
use App\Http\Controllers\AllowedEmailController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ArticleController;
Route::get('/', function () {
    return redirect("dashboard");
    //return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');



    Route::get('/users/fetch', [UserController::class, 'fetchPaginated'])->name('users.fetch');
    Route::post('/users', [UserController::class, 'store'])->middleware(['auth', 'verified']);
    Route::get('/users', [UserController::class, 'index'])->middleware(['auth', 'verified'])->name('users.index');
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}/sync-roles', [UserController::class, 'syncRoles']);




    Route::get('/articles/fetch', [ArticleController::class, 'fetchPaginated'])->name('articles.fetch');
    Route::post('/articles', [ArticleController::class, 'store'])->middleware(['auth', 'verified']);
    Route::get('/articles', [ArticleController::class, 'index'])->middleware(['auth', 'verified'])->name('articles.index');
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::get('/articles/{id}', [ArticleController::class, 'show']);
    Route::post('/articles/bulk-delete', [ArticleController::class, 'bulkDelete']);
    Route::get('/articles/{id}/export-excel', [ArticleController::class, 'exportExcel']);




    Route::get('/products/search', [ProductController::class, 'searchByDescription']);

    Route::get('/products/fetch', [ProductController::class, 'fetchPaginated'])->name('products.fetch');
    Route::post('/products', [ProductController::class, 'store'])->middleware(['auth', 'verified']);
    Route::get('/products', [ProductController::class, 'index'])->middleware(['auth', 'verified'])->name('products.index');
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete']);
    Route::get('/products/{id}/export-excel', [ProductController::class, 'exportExcel']);

    Route::post('/articles/bulk-store', [ArticleController::class, 'bulkStore']);











    Route::get('/transfers/{id}/articles', [TransferController::class, 'articles'])->name('transfers.articles');



    Route::get('/transfers/fetch', [TransferController::class, 'fetchPaginated'])->name('transfers.fetch');
    Route::post('/transfers', [TransferController::class, 'store'])->middleware(['auth', 'verified']);
    Route::get('/transfers', [TransferController::class, 'index'])->middleware(['auth', 'verified'])->name('transfers.index');
    Route::delete('/transfers/{id}', [TransferController::class, 'destroy']);
    Route::put('/transfers/{id}', [TransferController::class, 'update']);
    Route::get('/transfers/{id}', [TransferController::class, 'show']);
    Route::post('/transfers/bulk-delete', [TransferController::class, 'bulkDelete']);
    Route::get('/transfer-confirmation/{token}', [TransferController::class, 'confirm'])->name('transfer.confirm');


 //   Route::get('/transfers/export/excel', [TransferController::class, 'exportExcel']);
    Route::post('/transfers/{id}/notify', [TransferController::class, 'notify']);







Route::get('/surveys/fetch', [SurveyController::class, 'fetchPaginated'])->name('surveys.fetch');
Route::post('/surveys', [SurveyController::class, 'store'])->middleware(['auth', 'verified']);
Route::get('/surveys', [SurveyController::class, 'index'])->middleware(['auth', 'verified'])->name('surveys.index');
Route::delete('/surveys/{id}', [SurveyController::class, 'destroy']);
Route::post('/surveys/{id}', [SurveyController::class, 'update']); // Puedes usar PUT si tu controlador lo soporta
Route::get('/surveys/{id}', [SurveyController::class, 'show']);
Route::post('/surveys/bulk-delete', [SurveyController::class, 'bulkDelete']);


// Ruta para ver detalles de un survey específico
// Mostrar preguntas de una encuesta específica
Route::get('/survey-details/fetch', [SurveyDetailController::class, 'fetchPaginated']);
Route::get('/survey-details/{survey_id}', [SurveyDetailController::class, 'index'])->name('survey-details.index');

// CRUD por ID del detalle de pregunta
Route::get('/survey-details/{id}/edit', [SurveyDetailController::class, 'edit']);
Route::put('/survey-details/{id}', [SurveyDetailController::class, 'update']);

Route::delete('/survey-details/{id}', [SurveyDetailController::class, 'destroy']);
Route::post('/survey-details', [SurveyDetailController::class, 'store']);
Route::post('/survey-details/bulk-delete', [SurveyDetailController::class, 'bulkDelete']);
Route::get('/survey-details/export/{survey_id}', [SurveyDetailController::class, 'exportExcel']);




  // Página principal con listado
  Route::get('/selections', [SelectionController::class, 'index'])->name('selections.index');
  Route::get('/selections/fetch', [SelectionController::class, 'fetchPaginated'])->name('selections.fetch');
  Route::post('/selections', [SelectionController::class, 'store'])->name('selections.store');
  Route::put('/selections/{id}', [SelectionController::class, 'update'])->name('selections.update');
  Route::get('/selections/{id}', [SelectionController::class, 'show'])->name('selections.show');
  Route::delete('/selections/{id}', [SelectionController::class, 'destroy'])->name('selections.destroy');
  Route::post('/selections/bulk-delete', [SelectionController::class, 'bulkDelete'])->name('selections.bulk-delete');
  Route::get('/selections/export/excel', [SelectionController::class, 'exportExcel'])->name('selections.export');

 // Route::get('/selection-details/by-selection/{selectionId}', [SelectionDetailController::class, 'getBySelection']);
  Route::get('/selection-details/by-selection/{id}', [SelectionDetailController::class, 'bySelection']);
  Route::post('/selection-details', [SelectionDetailController::class, 'store']);
  Route::delete('/selection-details/{id}', [SelectionDetailController::class, 'destroy']);


  Route::get('/allowed-emails/fetch', [AllowedEmailController::class, 'fetchPaginated']);


  Route::get('/allowed-emails/{survey_id}', [AllowedEmailController::class, 'index'])->name('allowed-emails.index');

    Route::post('/allowed-emails', [AllowedEmailController::class, 'store']);
    Route::get('/allowed-emails/email/{id}', [AllowedEmailController::class, 'show']); // usa /email/{id} para evitar conflicto con survey_id
    Route::put('/allowed-emails/{id}', [AllowedEmailController::class, 'update']);
    Route::delete('/allowed-emails/{id}', [AllowedEmailController::class, 'destroy']);
    Route::post('/allowed-emails/bulk-delete', [AllowedEmailController::class, 'bulkDelete']);
    Route::post('/allowed-emails/import', [AllowedEmailController::class, 'import']);

});

use App\Http\Controllers\ContractGeneratorController;

Route::post('/generate-document', [ContractGeneratorController::class, 'generate']);


// Ruta pública para mostrar la portada de la encuesta
Route::get('/encuesta/{slug}', [SurveyClientController::class, 'publicHome']);
Route::post('/survey-clients/start', [SurveyClientController::class, 'start']);

// Ruta que retorna preguntas y detalles de la encuesta para el frontend
Route::get('/encuesta/{slug}/preguntas', [SurveyClientController::class, 'index'])
    ->name('surveyclient.index');





Route::post('/survey-clients', [SurveyClientController::class, 'store']);

Route::get('/gracias', function () {
    return Inertia::render('SurveyClients/Thanks');
});


// Ruta para crear el client (cuando inicia encuesta)
Route::post('/encuesta/crear-cliente', [SurveyClientController::class, 'createClient'])
    ->name('surveyclient.createClient');

// Ruta para almacenar cada respuesta
// Route::post('/encuesta/guardar-respuesta', [SurveyClientController::class, 'store'])
//     ->name('surveyclient.store');

// Mostrar select asociado dinámicamente (opcional, si usas asociados)
Route::post('/encuesta/asociado', [SurveyClientController::class, 'associateShow'])
    ->name('surveyclient.associateShow');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

use App\Http\Controllers\ReportController;

// Vista del reporte por encuesta
Route::get('/reportes/{survey_id}', [ReportController::class, 'index'])->name('reports.index');


// Ver detalle de un reporte (opcional)
Route::get('/reportes/detalle/{client_id}', [ReportController::class, 'edit'])
    ->name('reports.edit');

// Actualizar reporte (ej. descripción o detalle del cliente)
Route::put('/reportes/{id}', [ReportController::class, 'update'])
    ->name('reports.update');

// Eliminar reporte de un cliente
Route::delete('/reportes/{client_id}', [ReportController::class, 'destroy'])
    ->name('reports.destroy');



    Route::post('/survey-complete', [SurveyClientController::class, 'completeSurvey']);

/*
agregar modulos products
agregar modulo usuarios

en el formulario de articulos que busque el producto y usuario tipo receptor

*/
