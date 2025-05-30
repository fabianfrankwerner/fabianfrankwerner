@extends('layouts.app')
@section('content')
<h1>Edit {{$subscription->name }}</h1>

@if(session()->has('success'))
	<div class="alert alert-success">
		{{ session()->get('success') }}
	</div>
@endif

<form action="{{ route('subscriptions.update', $subscription) }}" method="POST">
<table class="table">
	@method("PUT")
	@csrf

	<tr>
			<td>Id</td>
			<td>{{ $subscription->id }}</td>
		<tr></tr>
			<td>Name</td>
			<td><input type="text" name="name" value="{{ $subscription->name }}"/>
			@if($errors->has('name'))
				<span class="text-danger">{{ $errors->first('name') }}
			@endif
			</td>
		<tr></tr>
			<td>Kontakt</td>
			<td><input type="text" name="contact" value="{{ $subscription->contact }}"/>
			@if($errors->has('contact'))
				<span class="text-danger">{{ $errors->first('contact') }}
			@endif
			</td>
		<tr></tr>
			<td>Price</td>
			<td><input type="text" name="price" value="{{ $subscription->price }}"/>
			@if($errors->has('price'))
				<span class="text-danger">{{ $errors->first('price') }}
			@endif
			</td>
		<tr></tr>
			<td>Subscribed on</td>
			<td>{{ $subscription->subscribed_on }}</td>
		<tr></tr>
			<td>Subscription end</td>
			<td><input type="text" name="subscription_end" value="{{ $subscription->subscription_end }}"/></td>
		<tr></tr>
			<td>Created at</td>
			<td>{{ $subscription->created_at }}</td>
		<tr></tr>
			<td>Updated at</td>
			<td>{{ $subscription->updated_at }}</td>
		<tr></tr>
	</tr>
	
</table>
<input type="submit" name="submit" value="Submit"/>
</form>
@endsection('content')