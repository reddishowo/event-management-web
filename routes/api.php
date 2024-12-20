<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


Route::get('/user', function (Request $request) {
    $user = $request->user();
    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'is_admin' => $user->is_admin
    ]);
})->middleware('auth:sanctum');

Route::apiResource('events', EventController::class);
Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/events', [EventController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/events/{event}/check-registration', [EventRegistrationController::class, 'checkRegistration']);
    Route::post('/events/{event}/register', [EventRegistrationController::class, 'register']);
    Route::post('/events/{event}/cancel', [EventRegistrationController::class, 'cancelRegistration']);
    Route::get('/user/registered-events', [EventRegistrationController::class, 'getRegisteredEvents']);
});
Route::apiResource('/user/profile', UserController::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
});