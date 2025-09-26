<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('throttle:60,1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::middleware('jwt.auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware('jwt.refresh');
    });

    Route::prefix('public')->group(function () {
        Route::get('authors', [App\Http\Controllers\AuthorController::class, 'index']);
        Route::get('authors/{slug}', [App\Http\Controllers\AuthorController::class, 'show']);
        Route::get('books', [App\Http\Controllers\BookController::class, 'index']);
        Route::get('books/{slug}', [App\Http\Controllers\BookController::class, 'show']);
        Route::get('partners', [App\Http\Controllers\PartnerController::class, 'index']);
        Route::get('partners/{partner}', [App\Http\Controllers\PartnerController::class, 'show']);
    });

    Route::middleware(['jwt.auth', 'throttle:120,1'])->prefix('admin')->group(function () {
        Route::get('/stats', [App\Http\Controllers\StatsController::class, 'index']);

        Route::prefix('authors')->group(function () {
            Route::get('/', [App\Http\Controllers\AuthorController::class, 'index']);
            Route::get('{author}', [App\Http\Controllers\AuthorController::class, 'showAdmin']);
            Route::post('/', [App\Http\Controllers\AuthorController::class, 'store']);
            Route::match(['put', 'patch'], '{author}', [App\Http\Controllers\AuthorController::class, 'update']);
            Route::delete('{author}', [App\Http\Controllers\AuthorController::class, 'destroy']);
            Route::post('{author}/photo', [App\Http\Controllers\AuthorController::class, 'storePhoto']);
            Route::delete('{author}/photo', [App\Http\Controllers\AuthorController::class, 'deletePhoto']);
        });

        Route::prefix('books')->group(function () {
            Route::get('/', [App\Http\Controllers\BookController::class, 'index']);
            Route::get('{book}', [App\Http\Controllers\BookController::class, 'showAdmin']);
            Route::post('/', [App\Http\Controllers\BookController::class, 'store']);
            Route::put('{book}', [App\Http\Controllers\BookController::class, 'update']);
            Route::delete('{book}', [App\Http\Controllers\BookController::class, 'destroy']);
            Route::post('{book}/cover', [App\Http\Controllers\BookController::class, 'storeCover']);
            Route::delete('{book}/cover', [App\Http\Controllers\BookController::class, 'deleteCover']);

            Route::post('{book}/authors/attach', [App\Http\Controllers\BookController::class, 'attachAuthors']);
            Route::post('{book}/authors/sync', [App\Http\Controllers\BookController::class, 'syncAuthors']);
            Route::delete('{book}/authors/{author}', [App\Http\Controllers\BookController::class, 'detachAuthor']);
        });

        Route::prefix('partners')->group(function () {
            Route::get('/', [App\Http\Controllers\PartnerController::class, 'index']);
            Route::get('{partner}', [App\Http\Controllers\PartnerController::class, 'show']);
            Route::post('/', [App\Http\Controllers\PartnerController::class, 'store']);
            Route::put('{partner}', [App\Http\Controllers\PartnerController::class, 'update']);
            Route::patch('{partner}', [App\Http\Controllers\PartnerController::class, 'update']);
            Route::delete('{partner}', [App\Http\Controllers\PartnerController::class, 'destroy']);
            Route::patch('{partner}/toggle-active', [App\Http\Controllers\PartnerController::class, 'toggleActive']);
            Route::post('update-order', [App\Http\Controllers\PartnerController::class, 'updateOrder']);
        });
    });
});
