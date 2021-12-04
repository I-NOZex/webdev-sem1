<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Shop\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ProductController::class, 'index']);

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';

Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::permanentRedirect('/', '/admin/products');
    Route::resource('products', Admin\ProductController::class);
});
