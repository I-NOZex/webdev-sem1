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
                <h2 class="lead text-center">Create a New Product</h2>
            </div>
            <div class="card-body">

                <form action="{{ route('products.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf

                    <div class="form-group row">
                        {{ Form::label('name', 'Name', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::text('name', '', ['class' => 'form-control']) }}
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('sizes', 'Sizes', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            <select id="sizes" name="sizes[]" class="form-control" multiple="multiple" autocomplete="off">
                                @php
                                    $sizes = $enum['sizes'];
                                @endphp

                                @foreach ($sizes as $size)
                                    <option value="{{ $size }}">
                                        {{ $size }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('body', 'Body', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            <select id="body" name="body[]" class="form-control" multiple="multiple" autocomplete="off">
                                @php
                                    $bodyTypes = $enum['body'];
                                @endphp

                                @foreach ($bodyTypes as $type)
                                    <option value="{{ $type }}">
                                        {{ $type }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('price', 'Price', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::text('price', '', ['class' => 'form-control']) }}
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('state', 'State', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::select('state', $enum['states'], null, ['class' => 'form-control', 'autocomplete' => 'off']) }}
                        </div>
                    </div>

                    <input type="submit" name="submit" value="create" class="btn btn-primary">
                </form>

            </div>
        </div>
    </div>
@endsection
