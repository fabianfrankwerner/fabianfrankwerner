@extends('layouts.app')
@section('content')
<h1>Liste der Medientypen</h1>

<table class="table">
    <tr>
        <th>Name</th>
        <th>Subscriptions</th>
    </tr>
    
    @foreach ($mts as $mt)
    <tr>
        <td>{{ $mt->name }}</td>
        <td>
            <ul>
                @foreach ($mt->subscriptions as $mt)
                <li>{{ $mt->name }}</li>
                @endforeach
            </ul>
        </td>
    </tr>
    @endforeach
</table>

<hr>

<form action="{{ route('mediatypes.store') }}" method="POST">
    @csrf
    <div class="form-group">
        <label for="title">Medientyp Name</label>
        <input type="text" name="name" id="name" class="form-control" value="{{ old('name') }}" required>
    </div>

    <button type="submit" class="btn btn-primary">Medientyp anlegen</button>
</form>

@endsection('content')