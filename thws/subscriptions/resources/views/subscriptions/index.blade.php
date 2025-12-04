@extends('layouts.app')
@section('content')
<h1>Liste der Subscriptions</h1>

<table class="table">
    <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Subscribed on</th>
        <th>Subscription end</th>
        <th>Kontakt</th>
        <th>Action</th>
    </tr>
    
    @foreach ($subs as $sub)
    <tr>
        <td>{{ $sub->name }}</td>
        <td>{{ $sub->price }}</td>
        <td>{{ $sub->subscribed_on }}</td>
        <td>{{ $sub->subscription_end }}</td>
        <td>{{ $sub->contact }}</td>
        <td><a href="{{route('subscriptions.show', ['subscription' => $sub->id] ) }}">Show</a>|<a href="{{route('subscriptions.edit', ['subscription' => $sub->id] ) }}">Edit</a></td>
    </tr>
    @endforeach

@endsection('content')