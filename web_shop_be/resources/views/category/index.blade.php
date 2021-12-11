@extends('layouts.master')

@section('content')

    <div class="container">
        <div class="card">

            <div class="card-header bg-primary text-white d-flex justify-content-between">
                <p class="lead m-0">Category List</p>
                <a href="{{ route('categories.create') }}" class="btn btn-sm btn-dark">Create</a>
            </div>

            <div class="card-body">

                <table class="table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th with="100%" style="width: 100%;">Category</th>
                            <th colspan="2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse ($categories as $category)
                            <tr>
                                <td>{{ $loop->iteration }}</td>

                                <td>{{ $category->name }}</td>
                                <td>
                                    <a href="{{ route('categories.edit', $category->id) }}"
                                        class="btn btn-secondary btn-sm">Edit</a>
                                </td>

                                <td>
                                    <form action="{{ route('categories.destroy', $category->id) }}" method="POST">
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
