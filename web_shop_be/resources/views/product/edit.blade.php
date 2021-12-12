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
                <h2 class="lead text-center">Edit Product</h2>
            </div>
            <div class="card-body">
                <form action="{{ route('products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PATCH')

                    {{--  --}}
                    <div class="form-group row">
                        {{ Form::label('name', 'Name', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::text('name', $product->name, ['class' => 'form-control']) }}
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('sizes', 'Sizes', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            <select id="sizes" name="sizes[]" class="form-control" multiple="multiple" autocomplete="off">
                                @php
                                    $modelValues = explode(',', $product->sizes);
                                    $sizes = $product->getSizes();
                                @endphp

                                @foreach ($sizes as $size)
                                    <option value="{{ $size }}"
                                        {{ in_array($size, $modelValues) ? 'selected' : '' }}>
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
                                    $modelValues = explode(',', $product->body);
                                    $types = $product->getBodyTypes();
                                @endphp

                                @foreach ($types as $type)
                                    <option value="{{ $type }}"
                                        {{ in_array($type, $modelValues) ? 'selected' : '' }}>
                                        {{ $type }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        {{ Form::label('categories', 'Categories', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            <select id="categories" name="categories[]" class="form-control" multiple="multiple"
                                autocomplete="off">
                                @php
                                    $modelValues = explode(',', $product->body);
                                @endphp

                                @foreach ($categories as $category)
                                    <option value="{{ $category->id }}"
                                        {{ in_array($category->id, $product->categories->pluck('id')->toArray()) ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        {{ Form::label('price', 'Price', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::text('price', $product->price, ['class' => 'form-control']) }}
                        </div>
                    </div>
                    <div class="form-group row">
                        {{ Form::label('state', 'State', ['class' => 'col-4 col-form-label']) }}
                        <div class="col-8">
                            {{ Form::select('state', $product->getStates(), $product->state, ['class' => 'form-control', 'autocomplete' => 'off']) }}
                        </div>
                    </div>
                    {{--  --}}
                    <div class="form-group row">
                        <label for="imageFile" class="col-4 col-form-label">Images</label>
                        <div class="col-8">
                            <input type="file" multiple name="file" class="form-control-file" id="imageFile">

                            <div class="row mt-3">
                                @foreach ($product->images as $img)
                                <div class="col-3" data-card-image="{{ $img->id }}">
                                    <div class="card text-center">
                                        <img class="card-img-top" src="{{ $img->file_path }}" alt="Card image cap">
                                        <div class="card-body">
                                            <h5 class="card-title">{{ $img->name }}</h5>
                                                <a href="{{ route('images.destroy', $img->id) }}" 
                                                    class="btn btn-sm btn-danger delete-image" 
                                                    data-image-id="{{ $img->id }}" 
                                                    data-csrf-token="{{ csrf_token() }}"
                                                    title="Delete">
                                                    <i class="bi bi-trash"></i> Delete
                                                </a>
                                        </div>
                                    </div>
                                </div>
                                @endforeach                            
                            </div>                           
                        </div>
                    </div>



                    <input type="submit" name="submit" value="Update" class="btn btn-primary">
                </form>
            </div>
        </div>
    </div>

<script type="text/javascript">
//$ = jQuery;

$(document).ready(function () {

$(".delete-image").click(function(e) {

   if(!confirm("Are you sure you want to delete this item?")) {
      return false;
    }

   e.preventDefault();
   const id = $(this).data("imageId");
   const token = $(this).data("csrfToken");
   const url = e.target.href;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': token,
        },
    }).then(() => {
        $(`[data-card-image="${id}"`).remove();
    }).catch(err => {
        console.error(err);
        alert('Could not delete image.')
    });

     return false;
  });
   

});
</script>

@endsection
