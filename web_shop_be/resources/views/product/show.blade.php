@extends('layouts.master')

@section('content')

<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 py-5 px-3 col-lg-2 sidebar-filter bg-light border-right">
            <div class="mb-8">
                <a href="{{ url('/') }}"><img src="/logo.png" class="mx-auto d-block img-responsive"></a>
            </div>
        </div>
        <div class="col-md-9 col-lg-10 border p-3 d-flex align-items-center">
            <div class="row">
                <div class="col-lg-4">
                    <div id="productCarousel" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            @foreach($product->images as $image)
                            <div class="carousel-item {{$loop->first ? 'active' : ''}}"> <img src="{{ $image->file_path }}"
                                    class="rounded"> </div>
                            @endforeach
                        </div>
                        <ol class="carousel-indicators list-inline">
                            @foreach($product->images as $image)
                            <li class="list-inline-item {{$loop->first ? 'active' : ''}}"> <a id="carousel-selector-{{ $loop->index }}" class="{{$loop->first ? 'selected' : ''}}"
                                    data-slide-to="{{ $loop->index }}" data-target="#productCarousel"> <img src="{{ $image->file_path }}"
                                        class="img-fluid rounded"> </a> </li>
                            @endforeach
                        </ol>                 
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="border p-3 m-0">
                        <div class="row">
                            <div class="col-lg-12">
                                <h1 class="h3">
                                @foreach ($product->categories as $category)
                                    {{$category->name}}{{ !$loop->last ? ', ' : '' }}
                                @endforeach
                                </h1>
                                <h2 class="m-0 p-0 h1">{{ $product->name }}</h2>
                            </div>
                            <div class="col-lg-12">
                                <p class="font-weight-bold">{{ $product->price }} kr.</p>
                                <hr class="p-0 m-0">
                            </div>
                            <div class="col-lg-12 pt-2">
                                <h3 class="h4">Product Detail</h3>
                                <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris.</span>
                                <hr class="m-0 pt-2 mt-2">
                            </div>
                            <div class="col-lg-12">
                                <p class="options-section">
                                    <strong>Body : </strong>
                                    @php
                                        $bodyTypes = explode(',', $product->body);
                                    @endphp
                                    @foreach ($bodyTypes as $type)
                                        <a href="/products?body_has[]={{ $type }}">{{ $type }}</a> {{ !$loop->last ? ', ' : '' }}
                                    @endforeach
                                </p>
                                <p class="options-section">
                                    <strong>Sizes : </strong>
                                    @php
                                        $sizes = explode(',', $product->sizes);
                                    @endphp
                                    @foreach ($sizes as $size)
                                        <a href="/products?sizes_has[]={{ $size }}">{{ $size }}</a> {{ !$loop->last ? ', ' : '' }}
                                    @endforeach                                
                                </p>
                                <hr class="m-0 pt-2 mt-2">
                            </div>
                            <div class="col-lg-12">
                                <p>Quantity :</p>
                                <input type="number" class="form-control text-center w-100" value="1">
                            </div>
                            <div class="col-lg-12 mt-3">
                                <div class="row">
                                    <div class="col-lg-6 pb-2">
                                        <a href="#" class="btn btn-secondary w-100 btn-lg"><i class="bi bi-bag-plus-fill"></i> Add To Cart</a>
                                    </div>
                                    <div class="col-lg-6">
                                        <a href="#" class="btn btn-success w-100 btn-lg"><i class="bi bi-bag-check-fill"></i> Buy Now!</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
