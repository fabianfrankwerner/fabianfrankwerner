<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use App\Models\Mediatype;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $subs = Subscription::all();
        return view('subscriptions.index', ['subs' => $subs]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $subscription = new Subscription();
        return view('subscriptions.create', ['subscription' => $subscription]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscriptionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        //
        return view('subscriptions.show', ['subscription' => $subscription]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        //
        return view('subscriptions.edit', ['subscription' => $subscription, 'mts' => Mediatype::all()]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionRequest $request, Subscription $subscription)
    {
        //
        $validated = $request->validated();
        $subscription->update($validated);
        return redirect()->back()->withSuccess('Subscription was updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        //
    }
}
