<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mediatype;

class MediatypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $mts = Mediatype::all();
        return view('mediatypes.index', ['mts' => $mts]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // KEINE VALIDIERUNG FÜR: Buch, Musik, Film, Serie
        $mt = new Mediatype();
        $mt->name = $request['name'];
        $mt->save();
        return redirect()->route('mediatypes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
