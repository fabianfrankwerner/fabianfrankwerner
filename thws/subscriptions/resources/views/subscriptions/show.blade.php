@extends('layouts.app')
@section('content')
<h1>Show {{$subscription->name }}</h1>

<!---<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">{{$subscription->name}}</h5>
    <p class="card-text">{{$subscription->price}}</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>---!>

<table class="table">

	<tr>
		<td>Id</td><td>{{ $subscription->id }}</td><tr></tr>
		<td>Name</td><td>{{ $subscription->name }}</td><tr></tr>
		<td>Kontakt</td><td>{{ $subscription->contact }}</td><tr></tr>
		<td>Price</td><td>{{ $subscription->price }}</td><tr></tr>
		<td>Subscribed on</td><td>{{ $subscription->subscribed_on }}</td><tr></tr>
		<td>Subscription end</td><td>{{ $subscription->subscription_end }}</td><tr></tr>
		<td>Created at</td><td>{{ $subscription->created_at }}</td><tr></tr>
		<td>Updated at</td><td>{{ $subscription->updated_at }}</td><tr></tr>
	</tr>
	
</table>

@endsection('content')