@extends('layouts.master')

@section('content')

@endsection

<div class="container">
    <div class="col-lg-12 border p-3 main-section bg-white">
        <div class="row m-0">
            <div class="col-lg-4 pb-3">
                <div id="myCarousel" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active"> <img src="http://nicesnippets.com/demo/pd-image2.jpg"
                                class="rounded"> </div>
                        <div class="carousel-item"> <img src="http://nicesnippets.com/demo/pd-image3.jpg"
                                class="rounded"> </div>
                        <div class="carousel-item"> <img src="http://nicesnippets.com/demo/pd-image4.jpg"
                                class="rounded"> </div>
                    </div>
                    <ol class="carousel-indicators list-inline">
                        <li class="list-inline-item active"> <a id="carousel-selector-0" class="selected"
                                data-slide-to="0" data-target="#myCarousel"> <img src="http://nicesnippets.com/demo/pd-image2.jpg"
                                    class="img-fluid rounded"> </a> </li>
                        <li class="list-inline-item"> <a id="carousel-selector-1" data-slide-to="1"
                                data-target="#myCarousel"> <img src="http://nicesnippets.com/demo/pd-image3.jpg"
                                    class="img-fluid rounded"> </a> </li>
                        <li class="list-inline-item"> <a id="carousel-selector-2" data-slide-to="2"
                                data-target="#myCarousel"> <img src="http://nicesnippets.com/demo/pd-image4.jpg"
                                    class="img-fluid rounded"> </a> </li>
                    </ol>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="border p-3 m-0">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="h3">--category--</h1>
                            <h2 class="m-0 p-0 h1">{{ $product->name }}</h2>
                        </div>
                        <div class="col-lg-12">
                            <p class="m-0 p-0 price-pro">{{ $product->price }}</p>
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
                                    <a href="/products?body={{ $type }}">{{ $type }}</a> {{ !$loop->last ? ', ' : '' }}
                                @endforeach
                            </p>
                            <p class="options-section">
                                <strong>Sizes : </strong>
                                @php
                                    $sizes = explode(',', $product->sizes);
                                @endphp
                                @foreach ($sizes as $size)
                                    <a href="/products?size={{ $size }}">{{ $size }}</a> {{ !$loop->last ? ', ' : '' }}
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
        <div class="row">
            <div class="col-lg-12 text-center pt-3">
                <h4>More Product</h4>
            </div>
        </div>
        <div class="row mt-3 p-0 text-center pro-box-section">
            <div class="col-lg-3 pb-2">
                <div class="pro-box border p-0 m-0">
                    <img src="http://nicesnippets.com/demo/pd-b-image1.jpg">
                </div>
            </div>
            <div class="col-lg-3 pb-2">
                <div class="pro-box border p-0 m-0">
                    <img src="http://nicesnippets.com/demo/pd-b-images2.jpg">
                </div>
            </div>
            <div class="col-lg-3 pb-2">
                <div class="pro-box border p-0 m-0">
                    <img src="http://nicesnippets.com/demo/pd-b-images3.jpg">
                </div>
            </div>
            <div class="col-lg-3 pb-2">
                <div class="pro-box border p-0 m-0">
                    <img src="http://nicesnippets.com/demo/pd-b-images4.jpg">
                </div>
            </div>
        </div>
    </div>
</div>
