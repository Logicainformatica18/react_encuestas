<?php
    use App\Http\Controllers\TransferController;
    use App\Http\Controllers\UserController;
    use App\Http\Controllers\ProductController;
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



});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

/*
agregar modulos products
agregar modulo usuarios

en el formulario de articulos que busque el producto y usuario tipo receptor

*/
