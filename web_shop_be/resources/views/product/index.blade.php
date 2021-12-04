@extends('layouts.master')

@section('content')

<div class="container">
    <div class="card">

        <div class="card-header bg-info d-flex justify-content-between">
            <p class="lead m-0">Product List</p>
            <a href="{{route('products.create')}}" class="btn btn-sm btn-dark">Create</a>
        </div>

        <div class="card-body">

          <table class="table">

            <thead>
              <tr>
                <th>SN</th>
                <th>Product</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>

                @forelse ($products as $product)
                    <tr>
                      <td>{{$loop->iteration}}</td>

                      <td>{{$product->title}}</td>

                      <td>
                          <a href="{{route('products.edit', $product->id) }}" class="btn btn-secondary btn-sm">Edit</a>
                      </td>

                      <td>
                          <form action="{{route('products.destroy', $product->id ) }}" method="POST">
                             @csrf
                              @method('DELETE')
                              <button class="btn btn-sm btn-danger"
                                    onclick="return confirm('Are you sure you want to delete this item?');"
                                    type="submit" title="Delete">
                                    Delete
                            </button>
                          </form>
                      </td>
                    </tr>
                @empty
                    <td>No record</td>
                 @endforelse

            </tbody>
          </table>

        </div>
    </div>
</div>

@endsection
