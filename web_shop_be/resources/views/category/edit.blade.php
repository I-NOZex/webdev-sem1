@extends('layouts.master')

@section('content')

    <div class="container">

        @if (count($errors) > 0)
            <div class="p-1">
                @foreach ($errors->all() as $error)
                    <div class="alert alert-warning alert-danger fade show" role="alert">{{ $error }}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                @endforeach
            </div>
        @endif

        <div class="card">
            <div class="card-header">
                <h2 class="lead text-center">Edit Category</h2>
            </div>
            <div class="card-body">
                <form action="{{ route('categories.update', $category->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PATCH')

                    {{--  --}}
                    <div class="form-group row">
                        {{ Form::label('name', 'Name', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::text('name', $category->name, ['class' => 'form-control']) }}
                        </div>
                    </div>
                    {{--  --}}




                    <input type="submit" name="submit" value="Update" class="btn btn-primary">
                </form>
            </div>
        </div>
    </div>
@endsection
