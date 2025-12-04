<?php

use App\Http\Controllers\MediatypeController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::resource('/subscriptions', SubscriptionController::class);

Route::resource('/mediatypes', MediatypeController::class);
